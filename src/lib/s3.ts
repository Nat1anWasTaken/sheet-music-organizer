import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

export type StorageProvider = "r2" | "s3";
export const bucketName = process.env.STORAGE_BUCKET_NAME || "sheet-music";
export const storagePublicDomain = process.env.STORAGE_PUBLIC_DOMAIN;

if (!storagePublicDomain) {
  throw new Error("STORAGE_PUBLIC_DOMAIN is not set");
}

let _storageClient: S3Client | null = null;

async function setupCORS(client: S3Client) {
  const corsCommand = new PutBucketCorsCommand({
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["Content-Type"],
          AllowedMethods: ["PUT", "GET", "HEAD"],
          AllowedOrigins: ["*"],
          ExposeHeaders: [],
          MaxAgeSeconds: 3000
        }
      ]
    }
  });

  await client.send(corsCommand);
  console.log("CORS configuration successfully applied to bucket:", bucketName);
}

export function setupStorage(provider: StorageProvider): S3Client {
  if (_storageClient) {
    return _storageClient;
  }

  switch (provider) {
    case "r2":
      _storageClient = new S3Client({
        region: "auto",
        endpoint: process.env.R2_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
        },
        forcePathStyle: false // R2 doesn't requires path-style
      });

      setupCORS(_storageClient).catch(error => {
        console.error("Failed to setup CORS:", error);
      });

      return _storageClient;
    case "s3":
      _storageClient = new S3Client({
        region: process.env.S3_REGION!,
        endpoint: process.env.S3_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
        },
        forcePathStyle: true
      });

      return _storageClient;
    default:
      throw new Error("Unsupported storage provider");
  }
}

const getStorageClient = () => {
  if (!_storageClient) {
    _storageClient = setupStorage((process.env.STORAGE_PROVIDER as StorageProvider) || "r2");
  }
  return _storageClient;
};

export const storageClient = getStorageClient();
