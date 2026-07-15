import express from "express";
import prisma from "../prisma.js";
import { createJobSchema } from "../validators/jobValidator.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const result = createJobSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                errors: result.error.issues,
            });
        }

        const { type, payload } = result.data;

        const job = await prisma.job.create({
            data: {
                type,
                payload,
            },
        });

        return res.status(201).json(job);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Failed to create job",
        });
    }
});

export default router;