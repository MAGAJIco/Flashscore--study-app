"use client";

import { useKidsModeContext } from '@context/KidsModeContext';

export function useKidsMode() {
  return useKidsModeContext();
}
