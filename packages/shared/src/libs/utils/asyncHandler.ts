// Express types - using any for shared package compatibility
type Request = any;
type Response = any;
type NextFunction = any;

export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };