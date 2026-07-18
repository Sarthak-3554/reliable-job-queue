import express from "express";
import dotenv from "dotenv";
import jobsRouter from "./routes/jobs.js";
import dlqRoutes from "./routes/dlq.js";
dotenv.config();

const app = express();

app.use(express.json());

app.use("/jobs", jobsRouter);
app.use("/dlq", dlqRoutes);

app.get("/", (req, res) => {
    res.send("Reliable Job Queue API is running");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});