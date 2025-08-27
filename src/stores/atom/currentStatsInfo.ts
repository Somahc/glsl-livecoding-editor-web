import { atom } from "jotai";

export const currentElapsedTimeAtom = atom<number>(0);
export const shaderBPMAtom = atom<number>(120);
export const isResetShaderTimeAtom = atom<boolean>(false);
