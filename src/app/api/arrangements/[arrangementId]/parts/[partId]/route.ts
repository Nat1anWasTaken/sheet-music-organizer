import { updatePartBody } from "@/lib/api/types/parts";
import { auth0 } from "@/lib/auth0";
import { AccessLevel, checkAccess } from "@/lib/check-access";
import { prisma } from "@/lib/db";
import { bucketName, storageClient } from "@/lib/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ arrangementId: string; partId: string }> }): Promise<NextResponse> {
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

  return NextResponse.json(part, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ arrangementId: string; partId: string }>;
  }
): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId, partId } = await context.params;

  const bodyParseResult = updatePartBody.safeParse(await request.json());

  if (!bodyParseResult.success) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { data: body } = bodyParseResult;

  const arrangement = await prisma.arrangement.findUnique({
    where: {
      arrangement_id: arrangementId
    }
  });

  if (!arrangement) {
    return NextResponse.json({ message: "Arrangement not found" }, { status: 404 });
  }

  if (checkAccess(session?.user.sub, arrangement) < AccessLevel.Write) {
    return NextResponse.json({ message: "You don't have access to update this part." }, { status: 403 });
  }

  const part = await prisma.part.update({
    where: {
      part_id: partId,
      arrangement_id: arrangementId
    },
    data: body
  });

  if (!part) {
    return NextResponse.json({ message: "Part not found" }, { status: 404 });
  }

  return NextResponse.json(part, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ arrangementId: string; partId: string }>;
  }
): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId, partId } = await context.params;

  const bodyParseResult = updatePartBody.safeParse(await request.json());

  if (!bodyParseResult.success) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { data } = bodyParseResult;

  const arrangement = await prisma.arrangement.findUnique({
    where: {
      arrangement_id: arrangementId
    }
  });

  if (!arrangement) {
    return NextResponse.json({ message: "Arrangement not found" }, { status: 404 });
  }

  if (checkAccess(session?.user.sub, arrangement) < AccessLevel.Write) {
    return NextResponse.json({ message: "You don't have access to update this part." }, { status: 403 });
  }

  const part = await prisma.part.update({
    where: {
      part_id: partId,
      arrangement_id: arrangementId
    },
    data: data
  });

  return NextResponse.json(part, { status: 200 });
}

export async function DELETE(
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

  if (checkAccess(session?.user.sub, arrangement) < AccessLevel.Write) {
    return NextResponse.json({ message: "You don't have access to delete this part." }, { status: 403 });
  }

  const part = await prisma.part.delete({
    where: {
      part_id: partId,
      arrangement_id: arrangementId
    }
  });

  if (!part) {
    return NextResponse.json({ message: "Part not found" }, { status: 404 });
  }

  const deleteFileCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: {
      Objects: [
        {
          Key: `parts/${partId}`
        },
        {
          Key: `part-previews/${partId}`
        }
      ]
    }
  });

  const deleteFileResult = await storageClient.send(deleteFileCommand);

  if (deleteFileResult.$metadata.httpStatusCode !== 204) {
    return NextResponse.json({ message: "Failed to delete part" }, { status: 500 });
  }

  return NextResponse.json(part, { status: 200 });
}
