export function json(data: unknown, init?: ResponseInit) {
     return Response.json(data, init);
}

export function err(error: unknown) {
     const status = typeof error === "object" && error && "status" in error ? (error as any).status : 500;
     const message = error instanceof Error ? error.message : "Unknown error";
     return Response.json({ success: false, message }, { status });
}
