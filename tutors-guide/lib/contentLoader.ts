// lib/contentLoader.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  TestMetadata,
  SectionFrontmatter,
  ParsedSection,
} from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content", "tests");

/**
 * Loads test metadata JSON
 */
export async function getTestMetadata(
  category: string,
  testId: string
): Promise<TestMetadata | null> {
  "use cache";
  try {
    const metaPath = path.join(CONTENT_DIR, category.toLowerCase(), testId, "metadata.json");
    const fileContents = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(fileContents) as TestMetadata;
  } catch (error) {
    console.error(`Failed to load metadata for ${category}/${testId}:`, error);
    return null;
  }
}

/**
 * Loads and parses a section Markdown file with YAML frontmatter
 */
export async function getSectionContent(
  category: string,
  testId: string,
  fileName: string
): Promise<ParsedSection | null> {
  "use cache";
  try {
    const filePath = path.join(CONTENT_DIR, category.toLowerCase(), testId, fileName);
    const rawFile = await fs.readFile(filePath, "utf-8");

    const { data, content } = matter(rawFile);
    const frontmatter = data as SectionFrontmatter;

    return {
      frontmatter,
      content,
    };
  } catch (error) {
    console.error(`Failed to load section ${fileName} for ${category}/${testId}:`, error);
    return null;
  }
}

/**
 * Resolves section by unique database/manifest sectionId
 */
export async function getSectionById(
  category: string,
  testId: string,
  sectionId: string
): Promise<ParsedSection | null> {
  "use cache";
  const metadata = await getTestMetadata(category, testId);
  if (!metadata) return null;

  const sectionEntry = metadata.sections.find((s) => s.id === sectionId);
  if (!sectionEntry) return null;

  return getSectionContent(category, testId, sectionEntry.file);
}