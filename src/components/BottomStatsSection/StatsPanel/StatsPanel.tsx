import bottomCommonStyle from "../index.module.css";
import { useCurrentStatsInfo } from "../../../stores/useCurrentStatsInfo";

export default function StatsPanel() {
  const { shaderBPM, setShaderBPM, setIsResetShaderTime } = useCurrentStatsInfo();

  const handleBPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShaderBPM(Number(e.target.value));
  };

  const handleChangeBPMTo240 = () => {
    setShaderBPM(240);
  };

  const handleResetShaderTime = () => {
    setIsResetShaderTime(true);
  };

  return (
    <div className={bottomCommonStyle.BottomPanelcontainer}>
      <div>
        <input type="number" min={0} max={240} value={shaderBPM} onChange={handleBPMChange} />
      </div>
      <div>
        <button onClick={handleChangeBPMTo240}>change BPM to 240</button>
      </div>
      <div>
        <button onClick={handleResetShaderTime}>Reset shader time</button>
      </div>
    </div>
  );
}
