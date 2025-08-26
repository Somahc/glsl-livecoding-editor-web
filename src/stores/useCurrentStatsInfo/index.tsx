import { useAtomValue, useSetAtom } from "jotai";
import { currentElapsedTimeAtom } from "../atom/currentStatsInfo";

export const useCurrentStatsInfo = () => {
  const currentElapsedTime = useAtomValue(currentElapsedTimeAtom);
  const setCurrentElapsedTime = useSetAtom(currentElapsedTimeAtom);
  return { currentElapsedTime, setCurrentElapsedTime };
};
