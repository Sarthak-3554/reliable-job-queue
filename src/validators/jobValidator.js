import { z } from "zod";

export const createJobSchema = z.object({
    type: z.string().min(1),
    payload: z.record(z.any()),
    priority: z.enum(["HIGH", "NORMAL", "LOW"]).optional(),
    runAt: z.string().datetime().optional(),
});