import ErrorPanel from "./ErrorPanel/ErrorPanel";
import StatsPanel from "./StatsPanel/StatsPanel";
import style from "./index.module.css";

export default function BottomStatsSection() {
  return (
    <div className={style.bottomStats}>
      <ErrorPanel />
      <StatsPanel />
    </div>
  );
}
