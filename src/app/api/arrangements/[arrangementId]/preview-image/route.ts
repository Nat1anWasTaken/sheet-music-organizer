import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ arrangementId: string }>;
  }
) {
  const { arrangementId } = await context.params;

  const parts = await prisma.part.findFirst({
    where: {
      arrangement_id: arrangementId
    }
  });

  if (!parts) {
    return new Response("Arrangement not found or has no uploaded files.", { status: 404 });
  }

  return NextResponse.redirect(`/api/arrangements/${arrangementId}/parts/${parts.part_id}/preview-image`);
}
