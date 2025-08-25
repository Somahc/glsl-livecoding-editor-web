import { useCompileErrorMessage } from "../../stores/useCompileErrorMessage";

export const ErrorPanel = () => {
  const { errorMessage } = useCompileErrorMessage();
  const parts = errorMessage
    .split(/ERROR:/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (parts.length === 0) return <div>{errorMessage}</div>;

  return (
    <div>
      {parts.map((p, i) => (
        <div key={i}>{`ERROR: ${p}`}</div>
      ))}
    </div>
  );
};
