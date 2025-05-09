import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

interface CreateArrangementBody {}

export async function POST(request: NextRequest) {
  prisma.arrangement.create({
    data: {
      visibility: "private"
    }
  });
}
