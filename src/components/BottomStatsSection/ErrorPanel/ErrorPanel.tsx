import { useCompileErrorMessage } from "../../../stores/useCompileErrorMessage";
import bottomCommonStyle from "../index.module.css";
import style from "./index.module.css";

export default function ErrorPanel() {
  const { errorMessage } = useCompileErrorMessage();
  const parts = errorMessage
    .split(/ERROR:/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className={bottomCommonStyle.BottomPanelcontainer}>
      <div className={bottomCommonStyle.title}>Shader Compile Status</div>
      {parts.length > 0 ? (
        parts.map((p, i) => (
          <div className={style.errorMessage} key={i}>{`ERROR: ${p}`}</div>
        ))
      ) : (
        <div className={style.noErrorMessage}>Compilation successful</div>
      )}
    </div>
  );
}
