import express from "express";
import { replayDLQ } from "../queue/replayDLQ.js";

const router = express.Router();

router.post("/:id/replay", async (req, res) => {
    try {
        const job = await replayDLQ(Number(req.params.id));

        res.status(200).json({
            message: "Job replayed successfully.",
            job
        });
    } catch (err) {
        res.status(404).json({
            error: err.message
        });
    }
});

export default router;