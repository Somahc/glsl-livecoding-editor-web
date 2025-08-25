import { compileErrorMessageAtom } from "../atom/compileErrorMessage";
import { useAtomValue, useSetAtom } from "jotai";

export const useCompileErrorMessage = () => {
  const errorMessage = useAtomValue(compileErrorMessageAtom);
  const setErrorMessage = useSetAtom(compileErrorMessageAtom);
  return { errorMessage, setErrorMessage };
};
