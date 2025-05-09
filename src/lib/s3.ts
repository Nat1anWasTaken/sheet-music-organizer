import { S3Client } from "@aws-sdk/client-s3";

export type StorageProvider = "r2" | "s3";

export function setupStorage(provider: StorageProvider) {
  switch (provider) {
    case "r2":
      return new S3Client([
        {
          region: "auto",
          endpoint: process.env.R2_ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
          },
          forcePathStyle: false // R2 doesn't requires path-style
        }
      ]);
    case "s3":
      return new S3Client([
        {
          region: process.env.S3_REGION,
          endpoint: process.env.S3_ENDPOINT,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
          },
          forcePathStyle: true
        }
      ]);
    default:
      throw new Error("Unsupported storage provider");
  }
}

export const storageClient = setupStorage((process.env.STORAGE_PROVIDER as StorageProvider) || "r2");
