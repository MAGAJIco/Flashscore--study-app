import { Request, Response, NextFunction } from "express";

/**
 * Middleware that attaches req.kidsMode based on:
 *  - authenticated user setting (req.user?.kidsMode)
 *  - query param ?kidsMode=true
 *
 * Downstream handlers can use req.kidsMode to filter gambling content.
 */
export function attachKidsModeFlag(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const qp = req.query.kidsMode;
    if (qp === "true") {
      // override by query param
      (req as any).kidsMode = true;
      return next();
    }

    // If you use Passport/next-auth/etc, adapt accordingly:
    const user = (req as any).user;
    if (user && typeof user.kidsMode === "boolean") {
      (req as any).kidsMode = user.kidsMode;
    } else {
      (req as any).kidsMode = false;
    }
  } catch (err) {
    (req as any).kidsMode = false;
  }
  next();
}

/**
 * Utility to filter gambling fields from an object.
 * Customize the fields/names to match your API responses.
 */
export function filterGamblingContent(payload: any) {
  if (!payload) return payload;

  // If payload is an array
  if (Array.isArray(payload)) {
    return payload.map(filterGamblingContent);
  }

  // Remove keys commonly used for gambling/odds
  const cloned: any = { ...payload };
  const bannedKeys = [
    "odds",
    "bettingTips",
    "bet",
    "bets",
    "oddsData",
    "recommendedWagers",
    "depositButton",
  ];
  for (const k of bannedKeys) {
    if (k in cloned) delete cloned[k];
  }

  // If nested items have isGambling flag, filter them out
  if (cloned.items && Array.isArray(cloned.items)) {
    cloned.items = cloned.items
      .filter((it: any) => !it.isGambling)
      .map(filterGamblingContent);
  }

  return cloned;
}
