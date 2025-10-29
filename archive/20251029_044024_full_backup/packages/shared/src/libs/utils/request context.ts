// utils/requestContext.ts
import { AsyncLocalStorage } from "async_hooks";

interface RequestContext {
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

// Helper to get current request ID anywhere
export const getRequestId = () => {
  return requestContext.getStore()?.requestId || "no-req";
};