import prisma from "../prisma.js";

export async function replayDLQ(dlqId) {

    return await prisma.$transaction(async (tx) => {

        const deadJob = await tx.deadLetterJob.findUnique({
            where: {
                id: dlqId
            }
        });

        if (!deadJob) {
            throw new Error("Dead letter job not found.");
        }

        const newJob = await tx.job.create({

            data: {
                type: deadJob.type,
                payload: deadJob.payload,
                status: "PENDING",
                attempts: 0,
                maxAttempts: deadJob.maxAttempts
            }

        });

        await tx.deadLetterJob.delete({

            where: {
                id: dlqId
            }

        });

        return newJob;

    });

}