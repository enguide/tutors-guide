// lib/storage/s3.ts
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost, PresignedPost } from "@aws-sdk/s3-presigned-post";

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET || process.env.R2_BUCKET_NAME || "";
const S3_REGION = process.env.AWS_REGION || "auto";

export const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT || undefined, // Set for Cloudflare R2 or MinIO
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: Boolean(process.env.AWS_S3_FORCE_PATH_STYLE),
});

export interface PresignedUploadConfig {
  key: string;
  url: string;
  fields: Record<string, string>;
  publicUrl: string;
}

/**
 * Creates a pre-signed POST request URL with strict size thresholds
 * allowing the browser to upload directly to S3 / R2 without proxying through Next.js.
 */
export async function createPresignedUploadPost({
  storageKey,
  contentType,
  maxSizeBytes = 15 * 1024 * 1024, // 15MB limit
  expiresInSeconds = 600, // 10 minutes
}: {
  storageKey: string;
  contentType: string;
  maxSizeBytes?: number;
  expiresInSeconds?: number;
}): Promise<PresignedUploadConfig> {
  if (!S3_BUCKET_NAME) {
    throw new Error("Storage bucket name is not configured in environment variables.");
  }

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
    Conditions: [
      ["content-length-range", 1024, maxSizeBytes], // Min 1KB, Max 15MB
      ["starts-with", "$Content-Type", contentType],
    ],
    Fields: {
      "Content-Type": contentType,
    },
    Expires: expiresInSeconds,
  });

  const cdnBaseUrl = process.env.NEXT_PUBLIC_STORAGE_CDN_URL || `${url}/${S3_BUCKET_NAME}`;
  const publicUrl = `${cdnBaseUrl.replace(/\/$/, "")}/${storageKey}`;

  return {
    key: storageKey,
    url,
    fields,
    publicUrl,
  };
}