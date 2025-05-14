import { auth0 } from "@/lib/auth0";
import { AccessLevel, checkAccess } from "@/lib/check-access";
import { prisma } from "@/lib/db";
import { generatePreviewImage } from "@/lib/pdf/generate-preview-image";
import { bucketName, storageClient, storagePublicDomain } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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

  if (checkAccess(session?.user.sub, arrangement) < AccessLevel.Read) {
    return NextResponse.json({ message: "You don't have access to this arrangement." }, { status: 403 });
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

  const getPreviewResponse = await fetch(`${storagePublicDomain}/part-previews/${partId}`, {
    method: "HEAD"
  });

  if (getPreviewResponse.status === 404) {
    /// Generate the preview image
    const fetchFileResponse = await fetch(`${storagePublicDomain}/parts/${partId}`, {
      method: "GET"
    });

    if (!fetchFileResponse.ok) {
      return NextResponse.json({ message: "Failed to fetch part file" }, { status: 500 });
    }

    const fileBuffer = await fetchFileResponse.arrayBuffer();
    const previewImageBuffer = await generatePreviewImage(Buffer.from(fileBuffer));

    const uploadPreviewImageCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `part-previews/${partId}`,
      Body: previewImageBuffer,
      ContentType: "image/jpeg"
    });

    const uploadPreviewImageResponse = await storageClient.send(uploadPreviewImageCommand);

    if (uploadPreviewImageResponse.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ message: "Failed to upload preview image" }, { status: 500 });
    }
  }

  return NextResponse.redirect(`${storagePublicDomain}/part-previews/${partId}`, 302);
}
