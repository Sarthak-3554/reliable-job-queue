import prisma from "../prisma.js";
import { startHeartbeat } from "./leaseManager.js";
import { getRetryDelay } from "./retry.js";
import { moveToDLQ } from "./dlq.js";

export async function processJob(job) {

    const heartbeat = startHeartbeat(job.id);

    try {

        console.log(`Processing Job ${job.id}`);

        // Simulate long work
        await new Promise(resolve =>
            setTimeout(resolve, 30000)
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
        //throw new Error("Simulated job failure"); 

        console.log(`Job ${job.id} completed`);

    } catch (err) {
        console.log("Actual error:", err);
        const dbJob = await prisma.job.findUnique({
            where: { id: job.id }
        });

        const attempts = dbJob.attempts + 1;

        if (attempts < dbJob.maxAttempts) {

            const retryAt = new Date(
                Date.now() + getRetryDelay(attempts)
            );

            await prisma.job.update({
                where: { id: job.id },
                data: {
                    status: "FAILED",
                    attempts,
                    nextRetryAt: retryAt
                }
            }); 

            console.log(`Retry ${attempts}/${dbJob.maxAttempts} scheduled.`);


        } else {

           await moveToDLQ({...job,attempts},err);

            console.log(`Job ${job.id} moved to Dead Letter Queue.`);
        }
    }
    finally {
        clearInterval(heartbeat);
    }

}