import { useKidsModeContext } from "../context/KidsModeContext";

export const useKidsMode = () => {
  return useKidsModeContext();
};
