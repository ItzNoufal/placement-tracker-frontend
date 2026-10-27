# Deploying Placement Tracker without your computer running

The application has three hosted parts:

1. **Vercel** hosts the Next.js frontend.
2. **Render** (or an equivalent Docker host) runs the Spring Boot API from `Java__placement-tracker/Dockerfile`.
3. A managed **MySQL 8** instance stores the permanent data.

## 1. Publish the backend and database

Create a managed MySQL 8 database, then create a Render Docker web service from the `Java__placement-tracker` directory. Configure these backend environment variables in the host dashboard:

```text
DB_URL=jdbc:mysql://YOUR_DATABASE_HOST:3306/placement_tracker?serverTimezone=UTC
DB_USERNAME=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_INIT_MODE=always
CORS_ALLOWED_ORIGIN_PATTERNS=https://YOUR-VERCEL-PROJECT.vercel.app
```

The host provides `PORT` automatically. Do not add credentials to Git or `.env.example`.

## 2. Publish the frontend on Vercel

Import this repository into Vercel with the repository root as the project root. Add this Vercel production environment variable:

```text
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-HOST
```

Redeploy after setting the variable. Next.js only exposes browser-side values prefixed with `NEXT_PUBLIC_`.

## 3. Final connection

After Vercel gives you the final public URL, update the backend's `CORS_ALLOWED_ORIGIN_PATTERNS` to that exact URL and redeploy the backend.

## Local development

Frontend: `npm run dev` from the repository root.

Backend: set `DB_PASSWORD`, then run `mvn spring-boot:run` from `Java__placement-tracker`.
