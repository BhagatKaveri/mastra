# 📖 Mastra RAG Backend

This is a **Retrieval-Augmented Generation (RAG)** backend built with **Node.js, Express, Prisma, PostgreSQL, and OpenAI**.  
The system ingests documents, stores chunks with embeddings in PostgreSQL, and allows intelligent Q&A queries using OpenAI.

---

## 🚀 Features
- 📂 Document upload and ingestion
- 🧠 Vector embeddings via OpenAI
- 🔎 Semantic search with PostgreSQL pgvector
- 💬 Query answering with context
- 📡 REST API endpoints
- 🛠 Prisma ORM integration

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mastra-rag.git
cd mastra-rag/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in `backend/` with:

```env
DATABASE_URL="postgres://postgres:yourpassword@localhost:5432/mastra_rag?schema=public"
OPENAI_API_KEY=sk-REPLACE
PORT=4000
EMBEDDING_DIM=1536
```

### 4. Setup Database
Make sure you have PostgreSQL running and pgvector extension installed.

```bash
npx prisma migrate dev --name init
```

### 5. Run the Server
```bash
npm run dev
```
Server will start on `http://localhost:4000`.

---

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### Upload File
```http
POST /api/upload
```
- Form-data: `file` (PDF file)

### Ingest File into DB
```http
POST /api/ingest
```
Body:
```json
{
  "filename": "d2e295ff5999dafcfc1998be27ca6fdc",
  "title": "Shareholder Letter 2019",
  "year": 2019
}
```

### Query
```http
POST /api/query
```
Body:
```json
{
  "question": "What does Buffett say about crypto?"
}
```

### Stream Query
```http
GET /api/stream?question=What%20does%20Buffett%20say%20about%20crypto
```

---


## ✅ Tech Stack
- Node.js + Express
- PostgreSQL + Prisma + pgvector
- OpenAI API
- Multer (file uploads)
- TypeScript

---

## 📌 Author
Developed by **Kaveri Bhagat** 🚀
