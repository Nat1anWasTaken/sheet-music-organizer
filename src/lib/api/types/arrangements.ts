import { Visibility } from "@/generated/prisma";
import { ArrangementSchema } from "@/generated/zod";
import { z } from "zod";

export const arrangement = ArrangementSchema;

export type Arrangement = z.infer<typeof arrangement>;

// GET /api/arrangements/
export const getArrangementsSearchParams = z.object({
  visibility: z.enum([Visibility.public, Visibility.private, Visibility.unlisted]).optional(),
  uploaded_by: z.string().optional(),
  title: z.string().optional(),
  composers: z.string().optional(),
  arrangement_type: z.string().optional()
});

export type GetArrangementsSearchParams = z.infer<typeof getArrangementsSearchParams>;

// POST /api/arrangements/
export const createArrangementBody = z.object({
  visibility: z.enum([Visibility.public, Visibility.private, Visibility.unlisted]),
  title: z.string(),
  composers: z.array(z.string()),
  arrangementType: z.string()
});

export type CreateArrangementBody = z.infer<typeof createArrangementBody>;

// PATCH /api/arrangements/[arrangementId]
export const updateArrangementBody = z.object({
  title: z.string().optional(),
  visibility: z.enum([Visibility.public, Visibility.private, Visibility.unlisted]).optional(),
  composers: z.array(z.string()).optional(),
  arrangementType: z.string().optional()
});
export type UpdateArrangementBody = z.infer<typeof updateArrangementBody>;
