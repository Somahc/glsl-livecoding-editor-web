import { useCurrentStatsInfo } from "../../../stores/useCurrentStatsInfo";
import bottomCommonStyle from "../index.module.css";
import style from "./index.module.css";
import { useCallback } from "react";

export default function StatsPanel() {
  const { shaderBPM, setShaderBPM, setIsResetShaderTime, currentElapsedTime } =
    useCurrentStatsInfo();

  const handleBPMChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShaderBPM(Number(e.target.value));
    },
    [setShaderBPM]
  );

  const handleResetShaderTime = () => {
    setIsResetShaderTime(true);
  };

  const handleDoubleBPM = () => {
    setShaderBPM(shaderBPM * 2);
  };

  const handleHalfBPM = () => {
    setShaderBPM(shaderBPM / 2);
  };

  const beatMeter = () => {
    const elapsedTime = currentElapsedTime * (shaderBPM / 60);
    const bar = Math.floor(elapsedTime);
    const beat = elapsedTime - bar;
    return 100 - beat * 100;
  };

  return (
    <div className={bottomCommonStyle.BottomPanelcontainer}>
      <div className={bottomCommonStyle.title}>General Shader Status</div>
      <div className={style.statsContainer}>
        <div className={style.paramContainer}>
          <label className={style.paramContainer_label} htmlFor="bpm">
            BPM
          </label>
          <div className={style.paramContainer_input}>
            <input
              id="bpm"
              type="text"
              value={shaderBPM}
              onChange={handleBPMChange}
            />
          </div>
        </div>

        <div className={style.paramContainer}>
          <div className={style.paramContainer_label}>Adj. BPM</div>
          <div className={style.paramContainer_doubleButtons}>
            <button onClick={handleDoubleBPM}>x2.</button>
            <button onClick={handleHalfBPM}>x.5</button>
          </div>
        </div>

        <div className={style.paramContainer}>
          <div className={style.paramContainer_label}>Reset time</div>
          <div>
            <button onClick={handleResetShaderTime}>Reset</button>
          </div>
        </div>

        <div className={style.paramContainer}>
          <div className={style.paramContainer_label}>BEAT</div>
          <div className={style.beatMeter}>
            <div
              className={style.beatMeterBar}
              style={{ transform: `translateX(-${beatMeter()}%)` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
