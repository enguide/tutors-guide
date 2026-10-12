// lib/contentLoader.ts
import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import {
  TestMetadata,
  SectionFrontmatter,
  ParsedSection,
} from "@/types/content";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

const CONTENT_DIR = path.join(process.cwd(), "content", "tests");

export interface DiscoveredTestItem {
  testId: string;
  category: string;
  title: string;
  description: string;
  isAdaptive: boolean;
  sectionCount: number;
  totalTimeMinutes: number;
  firstSectionId: string;
}

/**
 * Loads and caches test metadata JSON
 */
export const getTestMetadata = cache(async function getTestMetadata(
  category: string,
  testId: string
): Promise<TestMetadata | null> {
  try {
    const metaPath = path.join(
      CONTENT_DIR,
      category.toLowerCase(),
      testId,
      "metadata.json"
    );
    const fileContents = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(fileContents) as TestMetadata;
  } catch (error) {
    console.error(`Failed to load metadata for ${category}/${testId}:`, error);
    return null;
  }
});

/**
 * Loads, parses, and caches a section Markdown file with YAML frontmatter
 */
export const getSectionContent = cache(async function getSectionContent(
  category: string,
  testId: string,
  fileName: string
): Promise<ParsedSection | null> {
  try {
    const filePath = path.join(
      CONTENT_DIR,
      category.toLowerCase(),
      testId,
      fileName
    );
    const rawFile = await fs.readFile(filePath, "utf-8");

    const { data, content } = matter(rawFile);
    const frontmatter = data as SectionFrontmatter;

    return {
      frontmatter,
      content,
      category: category.toLowerCase(),
      testId,
    };
  } catch (error) {
    console.error(
      `Failed to load section ${fileName} for ${category}/${testId}:`,
      error
    );
    return null;
  }
});

/**
 * Resolves section by unique sectionId using the test metadata manifest
 */
export const getSectionById = cache(async function getSectionById(
  category: string,
  testId: string,
  sectionId: string
): Promise<ParsedSection | null> {
  const metadata = await getTestMetadata(category, testId);
  if (!metadata) return null;

  const sectionEntry = metadata.sections.find((s) => s.id === sectionId);
  if (!sectionEntry) return null;

  return getSectionContent(category, testId, sectionEntry.file);
});

/**
 * Ensures that the Markdown-defined Test and all its Sections exist in PostgreSQL.
 * Synchronizes metadata changes (titles, order, timeLimit) into the DB on demand.
 */
export async function ensureTestInDatabase(metadata: TestMetadata) {
  try {
    const dbCategory = (metadata.category.toUpperCase() as Category) || Category.NONE;

    await prisma.$transaction(async (tx) => {
      // 1. Upsert the master Test record
      await tx.test.upsert({
        where: { id: metadata.id },
        create: {
          id: metadata.id,
          title: metadata.title,
          category: dbCategory,
        },
        update: {
          title: metadata.title,
          category: dbCategory,
        },
      });

      // 2. Upsert each Section listed in the manifest
      for (const s of metadata.sections) {
        await tx.section.upsert({
          where: { id: s.id },
          create: {
            id: s.id,
            testId: metadata.id,
            title: s.title,
            sectionOrder: s.order,
            timeLimit: s.timeLimit,
          },
          update: {
            title: s.title,
            sectionOrder: s.order,
            timeLimit: s.timeLimit,
          },
        });
      }
    });
  } catch (error) {
    console.error(`Failed to ensure test ${metadata.id} in database:`, error);
  }
}

/**
 * Scans the filesystem content directory and discovers all valid tests
 * across all categories, parsing their metadata manifests.
 */
export const getAllAvailableTests = cache(async function getAllAvailableTests(): Promise<
  Record<string, DiscoveredTestItem[]>
> {
  const result: Record<string, DiscoveredTestItem[]> = {};

  try {
    const categories = await fs.readdir(CONTENT_DIR, { withFileTypes: true });

    for (const catDirent of categories) {
      if (!catDirent.isDirectory()) continue;
      const categoryKey = catDirent.name.toUpperCase();
      const catPath = path.join(CONTENT_DIR, catDirent.name);

      const testDirs = await fs.readdir(catPath, { withFileTypes: true });

      for (const testDirent of testDirs) {
        if (!testDirent.isDirectory()) continue;
        const testId = testDirent.name;

        const metadata = await getTestMetadata(catDirent.name, testId);
        if (metadata && metadata.sections && metadata.sections.length > 0) {
          const totalSecs = metadata.sections.reduce(
            (acc, s) => acc + (s.timeLimit || 0),
            0
          );
          const firstSection = metadata.sections[0]?.id || "";

          const item: DiscoveredTestItem = {
            testId: metadata.id,
            category: categoryKey,
            title: metadata.title,
            description: metadata.description || "",
            isAdaptive: Boolean(metadata.isAdaptive),
            sectionCount: metadata.sections.length,
            totalTimeMinutes: Math.round(totalSecs / 60),
            firstSectionId: firstSection,
          };

          if (!result[categoryKey]) {
            result[categoryKey] = [];
          }
          result[categoryKey].push(item);
        }
      }
    }
  } catch (error) {
    console.error("Failed to discover available tests:", error);
  }

  return result;
});