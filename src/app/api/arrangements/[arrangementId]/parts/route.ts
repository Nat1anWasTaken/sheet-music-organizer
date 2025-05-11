import { auth0 } from "@/lib/auth0";
import { AccessLevel, checkAccess } from "@/lib/checkAccess";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ arrangementId: string }>;
  }
): Promise<NextResponse> {
  const session = await auth0.getSession();
  
  const { arrangementId } = await context.params;

  const { searchParams } = request.nextUrl;

  const searchQueryParseResult = z
    .object({
      label: z.string().optional(),
      is_full_score: z.string().optional()
    })
    .safeParse(searchParams);

  if (!searchQueryParseResult.success) {
    return NextResponse.json({ message: "Invalid search parameters" + searchQueryParseResult.error }, { status: 400 });
  }

  const { data: searchQuery } = searchQueryParseResult;

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

  const parts = await prisma.part.findMany({
    where: {
      arrangement_id: arrangementId,
      label: searchQuery.label ? { contains: searchQuery.label } : undefined,
      is_full_score: searchQuery.label ? searchQuery.label === "true" : undefined
    }
  });

  return NextResponse.json(parts);
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ arrangementId: string }>;
  }
): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { arrangementId } = await context.params;

  const bodyParseResult = z
    .object({
      label: z.string(),
      is_full_score: z.boolean()
    })
    .safeParse(await request.json());

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
    return NextResponse.json({ message: "You don't have access to update this arrangement." }, { status: 403 });
  }

  const part = await prisma.part.create({
    data: {
      arrangement_id: arrangementId,
      label: body.label,
      is_full_score: body.is_full_score
    }
  });

  return NextResponse.json(part, { status: 200 });
}
