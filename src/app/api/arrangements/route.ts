import { Visibility } from "@/generated/prisma";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface CreateArrangementBody {
  visibility: Visibility;
  title: string;
  composers: string[];
  arrangementType: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateArrangementBody;

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
