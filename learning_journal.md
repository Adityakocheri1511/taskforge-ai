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

## Day 6 — June 17, 2026

### Top concepts I learned today
- Microservices = organizational/operational trade-off, NOT a technical upgrade
- Draw boundaries by business capability + failure domain, never by technical layer
- Anti-patterns: distributed monolith, premature microservices, shared database
- Database-per-service: each service owns its data; no FK across service boundaries
- Conway's Law: architecture mirrors org communication structure
- Built the Task service with its OWN database (taskforge_tasks)
- user-referencing columns (owner_id, assignee_id, created_by) are plain UUIDs — no FK across services
- DSA: binary search + search in rotated array (one half is always sorted)

### Hardest part of today
Today the hardest part was to learn the Search in Rotated Array, I have solved this question before but couldn't able to get the intuition. So I will be practising DSA more.

### One thing I'm proud of
Today I felt somewhere I was able to fill the gap(not fully) which I was lacking in the Deloitte's interview. Another thing got the intuition for Binary Search problem and was able to solve the question.

### What I'd do differently
Today I was able to understand how Monolith and Microservices architecture works in various systems and their Trade-offs.

### Tomorrow's preview (Day 7)
- System Design: API design (REST vs GraphQL vs gRPC) + status codes / versioning
- TaskForge: Task service CRUD endpoints (create workspace, project, task) + schemas/repositories
- DSA: two more (TBD)

## Day 7 — June 24, 2026

### Top concepts I learned today
- REST (resources + verbs) vs GraphQL (client-picked fields) vs gRPC (binary, internal)
- Status codes: 201 created, 401/403 auth, 404, 409 conflict, 422 validation
- Idempotency: GET/PUT/DELETE idempotent, POST is not
- API versioning (/api/v1) lets you ship breaking changes without breaking clients
- Built Task service CRUD: workspaces -> projects -> tasks (+ status filter, PATCH update)
- Stateless cross-service auth: Task validates Auth's JWT with the shared key, NO users table
- The (project_id, status) composite index powers the task list filter
- DSA: sliding window (longest substring) + Kadane's (max subarray)

### Hardest part of today
Today I was trying to learn how two independent services(Auth and Task) work with each other with independent database. And also to understand how REST, GraphQL and gRPC are different from each other and their use cases as well.

### One thing I'm proud of
A token from Auth (8001) creating a workspace in Task (8002) — two services, one identity

### What I'd do differently
Nothing

### Tomorrow's preview (Day 8)
- System Design: Caching strategies (cache-aside, write-through) + Redis in practice
- TaskForge: add Redis caching to the Task service's read endpoints
- DSA: two more (trees incoming)

## Day 8 — June 25, 2026

### Top concepts I learned today
- Four caching patterns: cache-aside, read-through, write-through, write-behind
- Cache-aside is the default: app checks cache, miss -> DB -> populate
- Invalidation = the hard part: TTL expiry + delete-on-write, usually combined
- Cache stampede / thundering herd and how to mitigate it
- What to cache (read-often, change-rarely) vs not (per-request, sensitive)
- Wired Redis cache-aside into Task service GET /tasks; delete-on-write on create/update
- Proof: a cache HIT shows NO SQL query in the logs — the read never touches Postgres
- DSA: binary trees — max depth + invert (recursion: solve children, then combine)

### Hardest part of today
Today I felt hard to understand how caching works actually and how there are different forms of caching based on the different applications.

### One thing I'm proud of
Today the DSA problems were easy, Yes I had lost some grip on trees but will work on the topics of trees.

### What I'd do differently
Nothing

### Tomorrow's preview (Day 9)
- System Design: Message queues + async processing (RabbitMQ, work queues, ack/retry)
- TaskForge: stand up the Notification service consuming from RabbitMQ
- DSA: more trees — BFS level-order + a BST check

## Day 9 — June 27, 2026

### Top concepts I learned today
- Sync vs async: a queue decouples producer and consumer so neither blocks the other
- Producer / queue / consumer / broker; RabbitMQ routes via exchanges + bindings
- Exchange types: direct, topic (wildcards), fanout (broadcast), headers
- Acks drive reliability -> at-least-once delivery -> consumers must be idempotent
- Durable queue + persistent messages survive consumer downtime (saw the backlog drain)
- Poison messages -> dead-letter queue after N retries; prefetch = backpressure
- Built the Notification service as a RabbitMQ consumer; Task service publishes task.created
- Publish is best-effort today (try/except) -> the outbox pattern (Day 10) makes it reliable
- DSA: trees — level-order BFS (queue per level) + validate BST (carry low/high bounds)

### Hardest part of today
I didn't felt anything hard to understand today.

### One thing I'm proud of
Today I got a chance to see how services work by their own without any external intervention just like stopping the consumer, creating tasks, and watching the backlog drain on restart.

### What I'd do differently
Nothing.

### Tomorrow's preview (Day 10)
- System Design: Kafka vs RabbitMQ + the Outbox pattern (reliable event publishing)
- TaskForge: Analytics service consuming Kafka events; outbox in the Task service
- DSA: two more — likely heaps / a graph intro
- THEN: first mock interview on Sunday (Product/PBC flavor)

## Day 10 — June 28, 2026

### Top concepts I learned today
- Kafka vs RabbitMQ: log (retained, replayable, consumer groups) vs queue (consumed once)
- Kafka consumer groups: many services each read the FULL stream independently
- Retention enables replay — a new consumer can re-read history from offset 0
- The dual-write problem: DB commit + broker publish aren't atomic -> events can be lost
- The OUTBOX pattern: write the event to an outbox table in the SAME transaction as
  the data; a relay publishes unpublished rows to Kafka and marks them sent
- At-least-once -> idempotent consumers; CDC/Debezium as the log-tailing alternative
- Built: outbox table + atomic write, an outbox relay, and the Analytics service (4th!)
- Saw reliability: relay down -> events wait safely in the outbox -> drain on restart
- DSA: heaps (Kth Largest, min-heap of size k) + graphs (Number of Islands, flood-fill)

### Hardest part of today
Running the full pipeline across 4 terminals at once (auth, task service, relay,
analytics) and keeping track of what each one was doing. The idea that the outbox
row and the task INSERT commit together in one transaction took a moment to really
click — that atomicity is the whole point of the pattern.

### One thing I'm proud of
I built the outbox pattern end to end — a genuinely senior-level reliability technique.
Watching an event survive the relay being down (waiting safely in the outbox, then
draining to Kafka on restart) made "no lost events" feel real instead of theoretical.

### What I'd do differently
Spend a bit more time on Kafka offsets and consumer groups — I want to be able to
explain the replay demo (new group_id re-reading from the start) cleanly in an interview,
not just run it.

### The foundation arc is COMPLETE 🎉
- 4 microservices, sync (JWT) + async (RabbitMQ) + streaming (Kafka outbox) comms
- 10 system-design topics, ~20 DSA problems across all the core patterns
- Next: first mock interview, then AI service -> frontend -> deploy

## Day 11 — June 29, 2026

### Top concepts I learned today
- Embeddings: text -> vectors where similar MEANING = nearby vectors
- Semantic search matches meaning, not keywords ("auth problem" -> "fix login bug", score 0.71)
- Cosine similarity = angle between vectors; the standard text similarity metric
- Vector databases (Qdrant) store embeddings + do fast nearest-neighbor search
- Brute force is O(n); ANN indexes like HNSW make it ~log time at scale
- RAG = retrieve relevant context via vector search -> feed to LLM -> grounded answer
- Built the AI service: fastembed (local ONNX, no API key) + Qdrant + /index and /search
- Wired the Kafka auto-indexer (group=ai-indexer): task -> outbox -> relay -> Kafka ->
  Analytics AND AI indexer, two consumer groups on one stream, both firing on one task
- Debugging: qdrant-client renamed .search() -> .query_points() between versions;
  read the traceback and adapted. Library APIs drift — tutorials go stale.

### Hardest part of today
The Qdrant container missing from docker-compose.yml, later I fixed it and I could able to run the ai-service.

### One thing I'm proud of
Searching "authentication problem" and getting "fix login bug" back at 0.71 with zero shared words — and watching one task auto-index across the whole pipeline

### What I'd do differently
Nothing.

### ALL FIVE SERVICES ARE BUILT 🎉
- Auth, Task, Notification, Analytics, AI — full microservices system, verified live
- sync (JWT) + async (RabbitMQ) + streaming (Kafka outbox) + vector search (Qdrant)
- Next: first mock (Sun Jul 5), then frontend -> deployment

## Day 12 — July 18, 2026

### Top concepts I learned today
- SPA vs SSR vs SSG; SPA fits TaskForge (behind login -> SEO irrelevant, static hosting)
- JWT storage trade-offs: localStorage (XSS-readable) vs httpOnly cookie (JS-invisible,
  needs CSRF care) vs in-memory (safest, lost on reload)
- Chose the production hybrid: refresh token in an httpOnly SameSite=Lax cookie scoped
  to /api/v1/auth; short-lived access token in memory, sent as a Bearer header
- Why NOT the access token in a cookie too: Bearer headers work across all five services
  regardless of domain; cookies are domain-scoped and need CSRF tokens everywhere.
  Full-cookie auth becomes natural once everything sits behind one gateway origin.
- Logout must revoke server-side, not just clear the cookie — otherwise the token row
  stays valid in the DB and a captured token keeps working
- The 401 -> refresh -> retry interceptor is what makes 15-minute tokens usable
- CORS with credentials requires an explicit origin — "*" is rejected by the browser
- Built: React+TS via Vite, axios client with cookie auth + refresh interceptor,
  AuthContext, login/register page, protected routes — real end-to-end auth
- Verified with curl: set-cookie carries HttpOnly + Path + Max-Age, the response body
  contains NO refresh token, and refresh rotates to a brand-new cookie value

### Hardest part of today
The schema export ImportError and merging the cookie logic into auth.py.

### One thing I'm proud of
Building auth the way a real company would instead of the tutorial shortcut — and seeing the HttpOnly flag prove it in the response headers

### One question I'd want an interviewer to ask me right now
"Where do you store the JWT on the client, and what are the trade-offs?"

### Tomorrow's preview (Day 13)
- Frontend session 2: workspaces + projects + tasks UI wired to the Task service
- Semantic search box calling the AI service
- DSA: backtracking (Subsets + Permutations) — deferred twice now, let's clear it

## Day 13 — July 19, 2026

### Top concepts I learned today
- Design tokens: named values replacing hardcoded literals; change once, changes everywhere
- Semantic naming (color-danger) survives redesigns; literal naming (color-red) becomes a lie
- Constrained type scale (5-6 sizes) + spacing rhythm (4/8px base) = deliberate, calm UI
- The Apple direction is subtraction: type carries hierarchy, near-monochrome, one accent
  reserved for ACTIONS, generous whitespace, soft radii, quiet motion
- Accessibility as baseline: 4.5:1 contrast, visible :focus-visible, prefers-reduced-motion
- Empty/loading/error states are what separate a product from a demo
- Built: Tailwind v4 @theme tokens, a primitive component library, workspace/project/task
  UI, and a semantic search panel with a confidence bar making cosine similarity visible

### Hardest part of today
Today I felt hard that I was little bit lacking in Frontend end part which I need to work on more.

### One thing I'm proud of
Today I felt like I could see all the 5 microservices working simultaneously.

### Tomorrow's preview (Day 14)
- Deployment arc begins: production Dockerfiles + docker-compose for the full stack

## Day 14 — July 21, 2026

### Top concepts I learned today
- Image = layered blueprint; container = running instance with a writable layer
- Layer caching dictates instruction ORDER: deps before code, or every edit reinstalls
- Multi-stage builds: compile in a throwaway stage, ship only artifacts
  -> frontend went from ~1.1GB (with Node) to 76MB (nginx + static files)
- python:3.11-slim over full (~1GB) or Alpine (musl breaks Python wheels)
- Non-root user, .dockerignore, never bake secrets into layers (they're inspectable forever)
- Service discovery: containers reach each other by SERVICE NAME, not localhost
- depends_on only waits for START; pair with healthcheck + condition: service_healthy

### The containers caught three defects my local setup was hiding
1. alembic.ini had a hardcoded localhost URL — worked locally, unreachable in a container.
   Fixed by reading DATABASE_URL from env with the ini as fallback (twelve-factor).
2. email-validator was never declared in pyproject.toml — my venv had it transitively,
   the clean container image did not.
3. TypeScript errors that `vite dev` skips entirely — `npm run build` runs tsc and failed.

That's the real argument for containerizing early: none of these would have surfaced
until deployment day.

### Also debugged
- Docker Desktop's file-sharing cache served empty (2B) Dockerfiles despite real content
  on disk; new inodes fixed it
- `pip install .` failed because packages=["app"] but app/ isn't copied yet at that layer
  — install dependencies only, from a generated requirements.txt
- pydantic-settings couldn't parse a JSON list env var; dropped the override and used
  the code default instead

### Hardest part of today
The hardest part of the day was to understand how Dockers works when it captures large files of all the services and installing packages into smaller size into one image. Due to this I got to know how containers are created and operated.

### One thing I'm proud of
Today I got an error while performing to push the code into prod in Docker where all the 8 terminals collapsed into one command — the whole system up with docker compose up.

### Tomorrow's preview (Day 15)
- Kubernetes: Deployments, Services, ConfigMaps/Secrets, and running the stack on k8s