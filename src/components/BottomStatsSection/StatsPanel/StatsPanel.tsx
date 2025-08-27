import bottomCommonStyle from "../index.module.css";
import { useCurrentStatsInfo } from "../../../stores/useCurrentStatsInfo";
import style from "./index.module.css";

export default function StatsPanel() {
  const { shaderBPM, setShaderBPM, setIsResetShaderTime, currentElapsedTime } = useCurrentStatsInfo();

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
  }

  return (
    <div className={bottomCommonStyle.BottomPanelcontainer}>
      <div>
        <input type="number" min={0} max={240} value={shaderBPM} onChange={handleBPMChange} />
      </div>
      <div>
        <button onClick={handleResetShaderTime}>Reset shader time</button>
      </div>
      <div>
        <div>BEAT</div>
        <div className={style.beatMeter}>
          <div className={style.beatMeterBar} style={{ transform: `translateX(-${beatMeter()}%)` }}></div>
        </div>
      </div>
    </div>
  );
}
