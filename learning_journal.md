# TaskForge.AI Learning Journal

## Day 1 — April 29, 2026

### Top concept I learned today
#1 I learned how to do back-of-envelope math to estimate QPS, storage,
and bandwidth before designing any system.
#2 I learned how to define new microservices and initialize the Docker compose in local dev.
#3 I learned how to setup SSH Key in Githup and in my Macbook.

### Hardest part of today
#1 I found it hard when we need to create a new directory for our project out of Trash Folder.
#2 I found it hard when we were not able to install dependencies and create Docker compose.yml file due to invalid Python version.

### One thing I'm proud of
#1 I am proud of that I can create a Github repository by my own and commit all the changes.
#2 I am proud of that I was able to understand how to calculate the scale before designing a system.

### One question I'd want an interviewer to ask me right now
**Q1: Why did you choose to put Kafka in your project even at 100K user scale?**
A: I built it as microservices to demonstrate the patterns and to be ready for 100x growth, not because 100K needs it

**Q2: What microservices have you defined in your project?**

A: TaskForge.AI has 5 microservices, each with a clear single responsibility:
1. **Auth Service** — handles identity, JWT issuance, refresh tokens, OAuth, 2FA
2. **Task Service** — core domain: workspaces, projects, tasks, comments, RBAC
3. **Notification Service** — async email/in-app dispatch, consumes from RabbitMQ
4. **Analytics Service** — read-heavy aggregations, consumes Kafka events
5. **AI Service** — RAG search, embedding generation, LLM-powered features

I separated them along bounded contexts and failure domains. For instance,
Notification is async because email failures shouldn't block task creation.

### Tomorrow's preview
- System Design Lesson 2: CAP theorem + PACELC + consistency models
- TaskForge: User SQLAlchemy model + first Alembic migration
- DSA: Container With Most Water + 3Sum (with full walkthroughs)
- Recall question: "When would I choose AP over CP, and vice versa?"

## Day 2 — May 2, 2026

### Top concepts I learned today
- CAP theorem: during a network partition you must choose Consistency or Availability (scored 7-8/8 on the quiz)
- PACELC: even without partitions, you trade Latency vs Consistency
- TaskForge.AI mixes models on purpose — Postgres (CP) + Redis (AP) + Kafka (eventual)
- SQLAlchemy 2.0 with Mapped[] syntax + async sessions
- Alembic migrations turn Python models into real Postgres tables
- Alembic async template needs the +asyncpg driver in the URL (not psycopg2)
- Two-pointer pattern: Container With Most Water + 3Sum (sort, fix one, two-pointer the rest)

### Hardest part of today
- 3Sum was tough — the duplicate-skipping logic took a while to click. Also it is not same as 2Sum problem, little bit trickier and difficult to understand the problem and its conditions.
- Container with Most Water - The logic to find the best container with most water was difficult.

### One thing I'm proud of
- Near-perfect CAP score
- Got the async Alembic migration working after the psycopg2 error
- Was able to think about the logic behind for Container with Most Water problem.

### One question I'd want an interviewer to ask me right now
- "Why did you mix Postgres and Redis in your project?" (CAP answer ready)
- "Could you please explain me each and every CAP models you have used for your projects?"

### What I'd do differently
- "I need to spend some more time dry-running 3Sum on paper before coding"

### Tomorrow's preview
- System Design Lesson 3: Database scaling — vertical, read replicas, sharding
- TaskForge: Implement the /auth/register endpoint with real password hashing
- DSA: Reverse Linked List + Linked List Cycle Detection