import { useAtomValue, useSetAtom } from "jotai";
import { currentElapsedTimeAtom, shaderBPMAtom, isResetShaderTimeAtom } from "../atom/currentStatsInfo";

export const useCurrentStatsInfo = () => {
  // シェーダーでの経過時間
  const currentElapsedTime = useAtomValue(currentElapsedTimeAtom);
  const setCurrentElapsedTime = useSetAtom(currentElapsedTimeAtom);

  // シェーダーの経過時間をリセットリクエスト
  const isResetShaderTime = useAtomValue(isResetShaderTimeAtom);
  const setIsResetShaderTime = useSetAtom(isResetShaderTimeAtom);

  // シェーダーのBPM
  const shaderBPM = useAtomValue(shaderBPMAtom);
  const setShaderBPM = useSetAtom(shaderBPMAtom);

  return { currentElapsedTime, setCurrentElapsedTime, shaderBPM, setShaderBPM, isResetShaderTime, setIsResetShaderTime };
};
