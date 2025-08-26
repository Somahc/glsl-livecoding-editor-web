import { useEffect, useState } from "react";
import style from "./index.module.css";
import { useCurrentStatsInfo } from "../../stores/useCurrentStatsInfo";

const UpperTimeStatsPanel = () => {
  const [time, setTime] = useState<string>(getCurrentTimeFormatted());
  const { currentElapsedTime } = useCurrentStatsInfo();

  const formatElapsedTime = (elapsed?: number) => {
    if (typeof elapsed !== "number" || !isFinite(elapsed) || elapsed < 0) {
      return "00:00:00.0";
    }
    const totalSeconds = Math.floor(elapsed);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    const tenths = Math.floor((elapsed - Math.floor(elapsed)) * 10).toString();
    return `${hours}:${minutes}:${seconds}.${tenths}`;
  };

  function getCurrentTimeFormatted() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.getMonth().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeFormatted());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={style.container}>
      <div className={style.date}>
        {time} / {formatElapsedTime(currentElapsedTime)}
      </div>
    </div>
  );
};

export default UpperTimeStatsPanel;
