import { PartSchema } from "@/generated/zod";
import { z } from "zod";

// /api/arrangements/[arrangementId]/parts/
const part = PartSchema;

export type Part = z.infer<typeof part>;

// GET /api/arrangements/[arrangementId]/parts/
export const getPartsSearchParams = z.object({
  label: z.string().optional(),
  is_full_score: z.boolean().optional()
});

export type GetPartsSearchParams = z.infer<typeof getPartsSearchParams>;

// POST /api/arrangements/[arrangementId]/parts/
export const createPartBody = z.object({
  label: z.string(),
  is_full_score: z.boolean()
});

export type CreatePartBody = z.infer<typeof createPartBody>;

// PATCH /api/arrangements/[arrangementId]/parts/[partId]
export const updatePartBody = z.object({
  label: z.string().optional(),
  is_full_score: z.boolean().optional()
});

export type UpdatePartBody = z.infer<typeof updatePartBody>;
