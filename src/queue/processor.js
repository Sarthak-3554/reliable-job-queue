import prisma from "../prisma.js";
import { startHeartbeat } from "./leaseManager.js";

export async function processJob(job) {

    const heartbeat = startHeartbeat(job.id);

    try {

        console.log(`Processing Job ${job.id}`);

        // Simulate long work
        await new Promise(resolve =>
            setTimeout(resolve, 60000)
        );

        clearInterval(heartbeat);

        await prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: "COMPLETED",
                leasedUntil: null,
            },
        });

        console.log(`Job ${job.id} completed`);

    } catch (err) {

        clearInterval(heartbeat);

        console.error(err);

        await prisma.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: "FAILED",
                leasedUntil: null,
            },
        });

    }

}