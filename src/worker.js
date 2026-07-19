import prisma from "./prisma.js";
import { processJob } from "./queue/processor.js";
import { reserveJob } from "./queue/reserveJob.js";

let isShuttingDown = false;
let isProcessing = false;

const WORKER_ID = process.pid;

process.on("SIGINT", () => {

    console.log("\nShutdown requested...");

     if (isProcessing) {
        console.log("Waiting for current job to finish...");
    } else {
        console.log("No job running.");
    }

    isShuttingDown = true;

});

process.on("SIGTERM", () => {

    console.log("\nShutdown requested...");

     if (isProcessing) {
        console.log("Waiting for current job to finish...");
    } else {
        console.log("No job running.");
    }

    isShuttingDown = true;

});

async function worker() {

   console.log(`[Worker ${WORKER_ID}] Started`);

    while (!isShuttingDown) {

        const job = await reserveJob();

        if (!job) {

            if (!isShuttingDown) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            continue;
        }

        isProcessing = true;
        
        await processJob(job);
        isProcessing = false;
    }

    console.log("Worker shut down gracefully.");

    await prisma.$disconnect();

    process.exit(0);
}

worker();

export {WORKER_ID};