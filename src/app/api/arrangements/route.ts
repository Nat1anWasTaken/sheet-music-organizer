import { Visibility } from "@/generated/prisma";
import { createArrangementBody, getArrangementsSearchParams } from "@/lib/api/types/arrangements";
import { auth0 } from "@/lib/auth0";
import { AccessLevel, checkAccess } from "@/lib/check-access";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await auth0.getSession();

  const { searchParams } = request.nextUrl;

  const searchParamsParseResult = getArrangementsSearchParams.safeParse(Object.fromEntries(searchParams));

  if (!searchParamsParseResult.success) {
    return NextResponse.json({ message: "Invalid search parameters" + searchParamsParseResult.error }, { status: 400 });
  }

  const { data: searchQuery } = searchParamsParseResult;

  const arrangements = await prisma.arrangement.findMany({
    where: {
      visibility: searchQuery.visibility ? (searchQuery.visibility as Visibility) : undefined,
      title: searchQuery.title ? { contains: searchQuery.title } : undefined,
      composers: searchQuery.composers ? { hasEvery: searchQuery.composers.split(",").map((c) => c.trim()) } : undefined,
      arrangement_type: searchQuery.arrangement_type ? { contains: searchQuery.arrangement_type } : undefined,
      uploaded_by: searchQuery.uploaded_by ? { contains: searchQuery.uploaded_by } : undefined
    }
  });

  return NextResponse.json(arrangements.filter((arrangement) => checkAccess(session?.user.sub, arrangement) > AccessLevel.None));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const bodyParseResult = createArrangementBody.safeParse(await request.json());

  if (!bodyParseResult.success) {
    return NextResponse.json({ message: "Invalid request body" + bodyParseResult.error }, { status: 400 });
  }

  const { data: body } = bodyParseResult;

  const arrangement = await prisma.arrangement.create({
    data: {
      visibility: body.visibility,
      title: body.title,
      composers: body.composers.map((c) => c.trim()),
      arrangement_type: body.arrangementType,
      uploaded_by: session.user.sub
    }
  });

  return NextResponse.json(arrangement, { status: 200 });
}
