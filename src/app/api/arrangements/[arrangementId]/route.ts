import { updateArrangementBody } from "@/lib/api/types/arrangements";
import { auth0 } from "@/lib/auth0";
import { AccessLevel, checkAccess } from "@/lib/checkAccess";
import { prisma } from "@/lib/db";
import { bucketName, storageClient } from "@/lib/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ arrangementId: string }> }): Promise<NextResponse> {
  const session = await auth0.getSession();

  console.log(await context);

  const { arrangementId } = await context.params;

  const arrangement = await prisma.arrangement.findUnique({
    where: {
      arrangement_id: arrangementId
    }
  });

  if (!arrangement) {
    return NextResponse.json({ message: "Arrangement not found" }, { status: 404 });
  }

  if (checkAccess(session?.user.sub, arrangement) === AccessLevel.None) {
    return NextResponse.json({ message: "You don't have access to this arrangement." }, { status: 403 });
  }

  return NextResponse.json(arrangement, { status: 200 });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ arrangementId: string }>; request: Request }): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId } = await context.params;

  const bodyParseResult = updateArrangementBody.safeParse(await context.request.json());

  if (!bodyParseResult.success) {
    return NextResponse.json({ message: "Invalid request body" + bodyParseResult.error }, { status: 400 });
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
    return NextResponse.json({ message: "You don't have access to update this arrangement." }, { status: 403 });
  }

  const updatedArrangement = await prisma.arrangement.update({
    where: {
      arrangement_id: arrangementId
    },
    data: data
  });

  return NextResponse.json(arrangement, { status: 200 });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ arrangementId: string }>; request: Request }): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId } = await context.params;

  const bodyParseResult = updateArrangementBody.safeParse(await context.request.json());

  if (!bodyParseResult.success) {
    return NextResponse.json({ message: "Invalid request body" + bodyParseResult.error }, { status: 400 });
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
    return NextResponse.json({ message: "You don't have access to update this arrangement." }, { status: 403 });
  }

  const updatedArrangement = await prisma.arrangement.update({
    where: {
      arrangement_id: arrangementId
    },
    data: data
  });

  return NextResponse.json(updatedArrangement, { status: 200 });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ arrangementId: string }> }): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId } = await context.params;

  const arrangement = await prisma.arrangement.findUnique({
    where: {
      arrangement_id: arrangementId
    }
  });

  if (!arrangement) {
    return NextResponse.json({ message: "Arrangement not found" }, { status: 404 });
  }

  if (checkAccess(session?.user.sub, arrangement) < AccessLevel.Write) {
    return NextResponse.json({ message: "You don't have access to delete this arrangement." }, { status: 403 });
  }

  const [partsToRemove, _deletePartsResult, _deleteArrangementResult] = await prisma.$transaction([
    prisma.part.findMany({
      where: { arrangement_id: arrangementId }
    }),
    prisma.part.deleteMany({
      where: { arrangement_id: arrangementId }
    }),
    prisma.arrangement.delete({
      where: { arrangement_id: arrangementId }
    })
  ]);

  const partsToRemoveIds = partsToRemove.map((part) => part.part_id);

  const objectsToRemove = partsToRemoveIds
    .map((partId) => ({
      Key: `parts/${partId}`
    }))
    .concat(
      ...partsToRemoveIds.map((partId) => ({
        Key: `part-previews/${partId}`
      }))
    );

  const deletePartsCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: {
      Objects: objectsToRemove
    }
  });

  const deleteFilesResult = await storageClient.send(deletePartsCommand);

  if (deleteFilesResult.$metadata.httpStatusCode !== 204) {
    return NextResponse.json({ message: "Failed to delete parts" }, { status: 500 });
  }

  return NextResponse.json(arrangement, { status: 200 });
}
