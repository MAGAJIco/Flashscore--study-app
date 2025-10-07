import React from "react";
import { useKidsMode } from "../hooks/useKidsMode";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const ProtectedGambling: React.FC<Props> = ({
  children,
  fallback = null,
}) => {
  const { kidsMode } = useKidsMode();
  if (kidsMode) return <>{fallback}</>;
  return <>{children}</>;
};
