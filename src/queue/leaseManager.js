import prisma from "../prisma.js";

export function startHeartbeat(jobId) {

    const interval = setInterval(async () => {

        try {

            const newLease = new Date(Date.now() + 30000);

            await prisma.job.updateMany({
                where: {
                    id: jobId,
                    status: "RUNNING",
                },
                data: {
                    leasedUntil: newLease,
                },
            });

            console.log(`Lease renewed for Job ${jobId}`);

        } catch (err) {

            console.error(`Heartbeat failed for Job ${jobId}`, err);

        }

    }, 10000); // every 10 seconds

    return interval;
}