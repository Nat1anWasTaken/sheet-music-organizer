import { auth0 } from "@/lib/auth0";
import { AccessLevel, checkAccess } from "@/lib/checkAccess";
import { prisma } from "@/lib/db";
import { bucketName, storageClient } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ arrangementId: string; partId: string }>;
  }
): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId, partId } = await context.params;

  const arrangement = await prisma.arrangement.findUnique({
    where: {
      arrangement_id: arrangementId
    }
  });

  if (!arrangement) {
    return NextResponse.json({ message: "Arrangement not found" }, { status: 404 });
  }

  const part = await prisma.part.findUnique({
    where: {
      part_id: partId,
      arrangement_id: arrangementId
    }
  });

  if (!part) {
    return NextResponse.json({ message: "Part not found" }, { status: 404 });
  }

  if (checkAccess(session?.user.sub, arrangement) < AccessLevel.Read) {
    return NextResponse.json({ message: "You don't have access to this part." }, { status: 403 });
  }

  const url = await getSignedUrl(
    storageClient,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: `parts/${partId}`,
      ContentType: "application/pdf"
    }),
    {
      expiresIn: 3600
    }
  );

  if (!url) {
    return NextResponse.json({ message: "Failed to generate signed URL" }, { status: 500 });
  }

  return NextResponse.json({ url }, { status: 200 });
}
