import prisma from "../prisma.js";

export async function reserveJob() {

    return await prisma.$transaction(async (tx) => {

        const jobs = await tx.$queryRaw`
            SELECT *
            FROM "Job"
            WHERE status = 'PENDING'
            ORDER BY "createdAt"
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        `;

        if (jobs.length === 0) {
            return null;
        }

        const job = jobs[0];

        await tx.job.update({
            where: {
                id: job.id,
            },
            data: {
                status: "RUNNING",
            },
        });

        return job;

    });

}