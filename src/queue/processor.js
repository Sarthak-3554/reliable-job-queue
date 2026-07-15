import prisma from "../prisma.js";

export async function processJob(job) {

    console.log(`Processing Job ${job.id}`);

    /**
     * Simulate actual work
     *
     * Later this becomes:
     *
     * switch(job.type){
     *    case "email":
     *    case "pdf":
     * }
     */

    await new Promise(resolve => setTimeout(resolve, 2000));

    await prisma.job.update({
        where: {
            id: job.id,
        },
        data: {
            status: "COMPLETED",
        },
    });

    console.log(`Job ${job.id} completed`);
}