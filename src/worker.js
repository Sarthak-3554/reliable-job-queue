import prisma from "./prisma.js";
import { processJob } from "./queue/processor.js";
import { reserveJob } from "./queue/reserveJob.js";

async function worker() {

    console.log("Worker Started...");

    while (true) {

        const job = await reserveJob();

        if (!job) {

            await new Promise(resolve =>
                setTimeout(resolve, 5000)
            );

            continue;
        }

        await processJob(job);

    }
}

worker();