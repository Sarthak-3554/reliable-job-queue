import prisma from "../prisma.js";

export async function moveToDLQ(job, error) {

    await prisma.$transaction(async (tx) => {

        // Copy job into DLQ
        await tx.deadLetterJob.create({

            data: {
                originalJobId: job.id,
                type: job.type,
                payload: job.payload,
                attempts: job.attempts,
                error: error.message,
                maxAttempts: job.maxAttempts,
            }

        });

        // Remove from active queue
        await tx.job.delete({

            where: {
                id: job.id
            }

        });

    });

}