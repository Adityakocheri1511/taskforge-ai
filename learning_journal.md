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

## Day 3 — June 11, 2026

### Top concepts I learned today
- The scaling ladder: diagnose/index → pooling → cache → vertical → read replicas → shard (LAST)
- Replication lag and the read-your-writes problem
- Shard by the boundary your queries respect (workspace_id for TaskForge)
- Built /auth/register: bcrypt hashing, Pydantic schemas, repository pattern
- Why bcrypt directly instead of passlib (unmaintained, breaks with bcrypt 4+)
- Linked list patterns: three-pointer reversal + Floyd's tortoise & hare

### Hardest part of today
To understand the how database scaling works, how and when sharding is been used for reads and writes, what is mean by replicas.

### One thing I'm proud of
Seeing the $2b$12$ bcrypt hash in Postgres for a user I registered through my own API

### What I'd do differently
Focus more on DSA Topics and make my foundation strong.

### Tomorrow's preview (Day 4)
- System Design: Indexes deep-dive — B-trees, composite, covering, EXPLAIN ANALYZE hands-on
- TaskForge: /auth/login + JWT issuance (access + refresh tokens)
- DSA: Merge Two Sorted Lists + LRU Cache

## Day 4 — June 15, 2026

### Top concepts I learned today
- Indexes: B-tree O(log n), composite leftmost-prefix rule, covering indexes, write-cost trade-off
- Saw EXPLAIN ANALYZE flip Seq Scan → Index Scan on my own users table
- Built /auth/login with bcrypt verification + JWT access/refresh tokens
- Refresh token rotation: old token revoked, new issued, all in one transaction
- Refresh tokens stored as SHA-256 (deterministic → lookupable), not bcrypt
- DSA: dummy-head merge + LRU cache (hash map + ordering = O(1))

### Hardest part of today
- Debugging the auth chain: a file got overwritten instead of appended, then a missing migration, then a duplicate migration. Learned to read the traceback's last line and trust `python -c` over VS Code highlighting.

### One thing I'm proud of
- Watched token rotation work end-to-end in my own logs (401 then 200, revoke + issue)

### What I'd do differently
- Generate a migration and apply it immediately (generate → upgrade head → verify), so duplicates can't pile up

### Tomorrow's preview (Day 5)
- System Design: Transactions, isolation levels, MVCC, deadlocks
- TaskForge: protect routes with a get_current_user JWT dependency + GET /auth/me
- DSA: Valid Parentheses + Min Stack

## Day 5 — June 16, 2026

### Top concepts I learned today
- ACID isolation; the 3 read anomalies: dirty / non-repeatable / phantom
- The 4 isolation levels and which anomaly each prevents (SERIALIZABLE = all)
- Postgres default is READ COMMITTED; MVCC = readers don't block writers
- Optimistic vs pessimistic locking; deadlocks avoided by consistent lock ordering
- Built get_current_user JWT dependency + protected GET /auth/me
- Checking token "type" == access stops a refresh token being used as an access token
- DSA: stacks — Valid Parentheses (LIFO matching) + Min Stack (parallel mins stack for O(1) getMin)

### Hardest part of today
There was nothing as such hardest thing which I have done today, Apart from DSA I need to practice more regarding the questions.

### One thing I'm proud of
The full loop working: register → login → Authorize in Swagger → /me returns my profile, while unauthenticated requests get 401

### What I'd do differently
Today was actually easy day, where I got to learn the things in one go.

### Tomorrow's preview (Day 6)
- System Design: Monolith vs Microservices — service boundaries, when to split
- TaskForge: start the Task service (workspaces, projects, tasks models)
- DSA: Binary Search + Search in Rotated Sorted Array