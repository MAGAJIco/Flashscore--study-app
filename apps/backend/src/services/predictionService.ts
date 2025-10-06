// This service has been deprecated
// Prediction logic is now handled by the frontend API route and ML microservice

export async function predictMatch() {
  throw new Error("This service is deprecated. Use frontend /api/predictions endpoint instead.");
}