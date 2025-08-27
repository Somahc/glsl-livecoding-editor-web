import { useAtomValue, useSetAtom } from "jotai";
import { currentElapsedTimeAtom, shaderBPMAtom } from "../atom/currentStatsInfo";

export const useCurrentStatsInfo = () => {
  const currentElapsedTime = useAtomValue(currentElapsedTimeAtom);
  const setCurrentElapsedTime = useSetAtom(currentElapsedTimeAtom);
  const shaderBPM = useAtomValue(shaderBPMAtom);
  const setShaderBPM = useSetAtom(shaderBPMAtom);
  return { currentElapsedTime, setCurrentElapsedTime, shaderBPM, setShaderBPM };
};
