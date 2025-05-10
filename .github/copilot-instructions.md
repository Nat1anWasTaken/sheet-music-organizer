# Project Naming Conventions for sheet-music-organizer

## HTTP Parameters

- **Query Parameters (GET requests):** Use `snake_case`.
  - Example: `visibility`, `uploaded_by`, `arrangement_type`

- **Request Body Properties (POST/PUT requests, JSON):** Use `camelCase`.
  - Example: `arrangementType`, `uploadedBy`


## TypeScript Code

- **Interface and Type Names:** Use `PascalCase`.
  - Example: `CreateArrangementBody`, `Visibility`

- **Variable and Function Names:** Use `camelCase`.
  - Example: `searchParams`, `visibilityParam`, `auth0.getSession()`

- **Route Handler Functions (Next.js `app` directory):** Use `UPPERCASE` HTTP methods.
  - Example: `GET`, `POST`

- **Prisma Model Fields (in `where` clauses or `data` objects):** Use `snake_case` as defined in your Prisma schema.
  - Example: `arrangement_type`, `uploaded_by`

- **Database Columns:** Use `snake_case`.
  - Example: `arrangement_type`, `uploaded_by`