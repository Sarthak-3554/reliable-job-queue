import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const [
            pending,
            running,
            completed,
            failed,
            deadLetter
        ] = await Promise.all([

            prisma.job.count({
                where: {
                    status: "PENDING"
                }
            }),

            prisma.job.count({
                where: {
                    status: "RUNNING"
                }
            }),

            prisma.job.count({
                where: {
                    status: "COMPLETED"
                }
            }),

            prisma.job.count({
                where: {
                    status: "FAILED"
                }
            }),

            prisma.deadLetterJob.count()

        ]);

        res.json({
            pending,
            running,
            completed,
            failed,
            deadLetter,
            totalJobs:
                pending +
                running +
                completed +
                failed
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch metrics"
        });

    }
});

export default router;