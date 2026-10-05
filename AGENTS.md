# Workspace Security Rules

## 1. Secrets and Environment Variables
- Never expose secrets in frontend code.
- Every API key, token, database URL, and private config lives in `.env` files only.
- `.env` files must always be listed in `.gitignore`. Exclude `.env`, `.env.local`, and `.env.*.local`.
- Frontend code must never contain raw secret values. No `const API_KEY = "sk-..."` in client-side files.
- For Next.js or Vite: only variables prefixed with `NEXT_PUBLIC_` or `VITE_` belong in the frontend, and those must never be secret keys.
- Backend secrets are accessed via `process.env.VAR_NAME` only and are never returned to the client in API responses.
- Generate a `.env.example` file with all required variable names but empty values.
- If a secret must be used client-side (for example a Stripe publishable key), add a comment explaining it is a public key intentionally exposed.

## 2. Rate Limiting
- Apply rate limiting on all API routes.
- Auth endpoints (login, register, password reset): 5 requests per 15 minutes per IP.
- General API: 60 requests per minute per IP.
- AI and LLM proxy endpoints: 10 requests per minute per user.
- File uploads: 5 requests per minute per IP.
- Always return `429 Too Many Requests` with a `Retry-After` header when limits are hit.
- Never silently swallow rate limit errors on the frontend. Show the user a clear message.

## 3. Input Validation and Sanitization
- Validate and sanitize everything on the server.
- Use schema validation libraries: Zod or Joi for JS/TS, Pydantic for Python.
- Sanitize all string inputs before storing or displaying them to prevent XSS.
- Use parameterized queries or ORM methods. Never interpolate user input into raw SQL or NoSQL queries.
- Validate data type, length limits, allowed characters, required fields, and enum values.
- For file uploads: validate MIME type, file extension, and file size on the server.
- Reject invalid input with a clear `400 Bad Request` response and log the attempt.

## 4. Authentication and Authorization
- Use established auth libraries and follow password rules.
- Recommended options: NextAuth.js, Clerk, Supabase Auth, Auth0, Passport.js, lucia-auth.
- Passwords must never be stored in plain text. Use bcrypt (minimum cost 12) or argon2.
- JWTs must be signed with a strong secret stored in env (minimum 32 characters). Set short expiry of 15 to 60 minutes.
- Refresh tokens must be stored in httpOnly cookies, not localStorage.
- Verify the user identity and their permission to access the resource on every request.
- Implement account lockout after repeated failed login attempts.
- Add explicit role and permission checks on admin routes and sensitive operations.

## 5. SQL and Database Security
- Always use an ORM or parameterized queries.
- Use Prisma, Drizzle, SQLAlchemy, or Mongoose. Never construct queries via string concatenation with user data.
- Apply the principle of least privilege: the database user should only have the permissions it actually needs.
- Sanitize and validate all fields before any database write.
- Never return raw database errors to the client. They leak schema information.

## 6. CORS Configuration
- Never use wildcard CORS in production.
- Explicitly whitelist only the origins that should access your API.
- Restrict allowed HTTP methods to only what each endpoint needs.
- Use the credentials flag only when your app requires it.

## 7. HTTP Security Headers
- Always set security headers using helmet or equivalent.
- `Content-Security-Policy`: restrict script and style sources.
- `X-Frame-Options`: DENY to prevent clickjacking.
- `X-Content-Type-Options`: nosniff.
- `Strict-Transport-Security` to force HTTPS.
- `Referrer-Policy`: strict-origin-when-cross-origin.
- Remove the `X-Powered-By` header to avoid leaking framework information.

## 8. File Upload Security
- Validate, rename, and store uploads safely.
- Validate file type by MIME type and extension on the server. Never trust the client.
- Set strict file size limits: 5MB for images, 25MB for documents as a reasonable default.
- Store uploaded files outside the web root or in a cloud bucket like S3, GCS, or Cloudinary.
- Never serve user-uploaded files with executable permissions.
- Rename uploaded files to a UUID. Never use the original filename directly.
- Scan for malware if handling sensitive or public uploads.

## 9. Error Handling and Logging
- Never return internal errors to the client.
- Return generic error messages to users: "Something went wrong" is enough.
- Log errors server-side with full context: timestamp, user ID if available, route, sanitized input.
- Use a logging service in production: Sentry, Datadog, or Logtail all work well.
- Use correct status codes: 4xx for client errors, 5xx for server errors. Do not use 500 for validation failures.

## 10. Dependency Security
- Audit dependencies and pin versions in production.
- Run `npm audit` or `pip-audit` after installing packages. Fix high and critical issues.
- Avoid packages that are unmaintained (no updates in two or more years for security-relevant libs).
- Pin dependency versions in production using `package-lock.json` or `requirements.txt`.
- Do not install packages with excessive permissions or suspicious install scripts without reviewing them.

## 11. XSS Prevention
- Never render dynamic user content as raw HTML.
- Do not use `dangerouslySetInnerHTML` in React unless the content is fully sanitized with DOMPurify.
- Never use `eval()`, `new Function()`, or `innerHTML` with dynamic user content.
- Avoid inline script tags. Move JS to external files to enable CSP enforcement.

## 12. Deployment Checklist
Before every deploy, run through this list:
- `.env` is not committed to git.
- All secrets are set in the hosting platform environment variable config.
- Debug mode and development logging are off in production.
- Database is not publicly exposed.
- HTTPS is enforced.
- Rate limiting is active on all public endpoints.
- CORS is restricted to known origins.
- Unused API routes are removed or protected.
