import { useCurrentStatsInfo } from "../../../stores/useCurrentStatsInfo";
import style from "./index.module.css";

export default function StatsPanel() {
  const { shaderBPM, setShaderBPM, setIsResetShaderTime, currentElapsedTime } =
    useCurrentStatsInfo();

  const handleBPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShaderBPM(Number(e.target.value));
  };

  const handleResetShaderTime = () => {
    setIsResetShaderTime(true);
  };

  const beatMeter = () => {
    const elapsedTime = currentElapsedTime * (shaderBPM / 60);
    const bar = Math.floor(elapsedTime);
    const beat = elapsedTime - bar;
    return 100 - beat * 100;
  };

  return (
    // <div className={bottomCommonStyle.BottomPanelcontainer}>
    <div className={style.statsContainer}>
      <div className={style.paramContainer}>
        <label className={style.paramContainer_label} htmlFor="bpm">
          BPM
        </label>
        <div className={style.paramContainer_input}>
          <input
            id="bpm"
            type="number"
            value={shaderBPM}
            onChange={handleBPMChange}
          />
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

      <div className={style.paramContainer}>
        <div className={style.paramContainer_label}>Reset time</div>
        <div className={style.paramContainer_button}>
          <button onClick={handleResetShaderTime}>Reset</button>
        </div>
      </div>
    </div>
    // </div>
  );
}
