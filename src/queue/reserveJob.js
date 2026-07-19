import prisma from "../prisma.js";

export async function reserveJob() {

    return await prisma.$transaction(async (tx) => {

        const jobs = await tx.$queryRaw`

            SELECT *
            FROM "Job"

            WHERE
            (status = 'PENDING' AND "runAt" <= NOW()) OR (status='FAILED' AND "nextRetryAt" <= NOW()) OR (status='RUNNING'AND "leasedUntil" < NOW())

            ORDER BY
            CASE priority
                WHEN 'HIGH' THEN 1
                WHEN 'NORMAL' THEN 2
                WHEN 'LOW' THEN 3
            END,
            "createdAt"

            LIMIT 1

            FOR UPDATE SKIP LOCKED

        `;

        if (jobs.length === 0)
            return null;

        const job = jobs[0];

        const lease = new Date(Date.now() + 30000);

        await tx.job.update({

            where: {
                id: job.id,
            },

            data: {
                status : "RUNNING",
                leasedUntil : lease,
                nextRetryAt : null
            }

        });

        return {
            ...job,
            leasedUntil: lease,
        };

    });

}