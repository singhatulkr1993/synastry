// In-memory session store — replace with DB (Redis / Postgres) for production
export const sessionStore = new Map<string, { paid: boolean; personA: string; personB: string }>();
