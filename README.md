# Smart Notes Backend

The backend for the Smart Notes Application, built with Node.js, Express, and MongoDB. It provides APIs for user authentication, note creation, editing, and search, integrated with a rich text editor and Hugging Face for AI features.

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Docker**: For running MongoDB container
- **MongoDB**: Either via Docker, native installation, or a cloud service (e.g., MongoDB Atlas)

## Setup Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ashusketch382/smartNotesBackend.git
   cd smartNotesBackend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up MongoDB**:

   - **Option 1: Docker (Recommended)**:
     Spin up a MongoDB container:
     ```bash
     docker run -d -p 27017:27017 --name smart-notes-mongo mongo:latest
     ```
     - MongoDB will be available at `mongodb://localhost:27017`.
   - **Option 2: Native MongoDB**:
     Install and run MongoDB locally (see [MongoDB Docs](https://www.mongodb.com/docs/manual/installation/)).
   - **Option 3: Cloud MongoDB**:
     Use a service like MongoDB Atlas and get the connection URL.

4. **Configure Environment Variables**:

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your values:
     ```env
     PORT=5000
     MONGO_URL=<your-mongodb-url> # e.g., mongodb://localhost:27017/smartnotes or Atlas URL
     JWT_SECRET=<your-jwt-secret> # e.g., a random string like "mySecretKey123"
     HUGGINGFACE_API_KEY=<your-huggingface-api-key> # Optional, for AI features
     ```
   - **Notes**:
     - `MONGO_URL`: Use `mongodb://localhost:27017/smartnotes` for Docker/native or your Atlas URL.
     - `JWT_SECRET`: Generate a secure random string.
     - `HUGGINGFACE_API_KEY`: Get from [Hugging Face](https://huggingface.co/settings/tokens) if using AI features.

5. **Run the Backend**:
   ```bash
   npm run dev
   ```
   - The server will run at `http://localhost:5000`.
   - APIs include:
     - `POST /api/auth/login`: User login
     - `POST /api/auth/signup`: User signup
     - `POST /api/notes`: Create note
     - `GET /api/notes/:id`: Get note
     - `PUT /api/notes/:id`: Update note

## Troubleshooting

- **MongoDB Connection**:
  - Ensure MongoDB is running (`docker ps` for Docker).
  - Check `MONGO_URL` in `.env`.
- **Port Conflict**:
  - If `PORT` is in use, change it in `.env`.
- **Hugging Face**:
  - If `HUGGINGFACE_API_KEY` is missing, AI features may fail.

## Notes

- The backend uses `authMiddleware` for protected routes (`/api/notes/*`).
- Ensure the frontend is configured to use the backend URL (see Frontend README).
