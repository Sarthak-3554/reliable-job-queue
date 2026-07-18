# Reliable Job Queue

A production-inspired background job processing system built using **Node.js**, **Express**, **PostgreSQL**, and **Prisma**.

This project demonstrates how modern distributed job queues work internally by implementing features such as row-level locking, leases, heartbeats, retries with exponential backoff, dead letter queues (DLQ), and replaying failed jobs.

Unlike libraries such as BullMQ or RabbitMQ, this project focuses on understanding **how these systems are built** rather than simply using them.

---

## Motivation

Many backend applications need to execute long-running or asynchronous tasks without blocking user requests.

Examples include:

- Sending emails
- Image/video processing
- Payment reconciliation
- Report generation
- Data synchronization
- AI inference jobs

Executing these tasks directly inside an HTTP request increases response time and reduces reliability.

A job queue solves this problem by moving work into the background where dedicated workers process jobs independently.

This project was built to understand the core building blocks behind production-grade queueing systems.

---

## Features

- Producer API for creating jobs
- Worker process for asynchronous execution
- PostgreSQL-backed persistent queue
- Row-level locking using `FOR UPDATE SKIP LOCKED`
- Lease mechanism to prevent duplicate processing
- Heartbeat-based lease renewal
- Automatic crash recovery
- Exponential backoff retry strategy
- Dead Letter Queue (DLQ)
- Replay failed jobs from the DLQ
- Transaction-based consistency using Prisma

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST API |
| PostgreSQL | Persistent job storage |
| Prisma ORM | Database access |
| Docker | PostgreSQL container |
| JavaScript (ES Modules) | Application code |

---

## Project Structure

```text
reliable-job-queue
│
├── prisma
│   └── schema.prisma
│
├── src
│   ├── queue
│   │   ├── reserveJob.js
│   │   ├── processor.js
│   │   ├── retry.js
│   │   ├── leaseManager.js
│   │   ├── dlq.js
│   │   └── replayDLQ.js
│   │
│   ├── routes
│   │   ├── jobs.js
│   │   └── dlq.js
│   │
│   ├── worker.js
│   ├── index.js
│   └── prisma.js
│
├── docker-compose.yml
├── package.json
└── README.md
```