import { useLayoutEffect, useState } from "react";

export function useElement<T extends HTMLElement | null>(
  ref: React.RefObject<T>
): T | null {
  const [element, setElement] = useState(ref.current);

  useLayoutEffect(() => {
    if (ref.current !== element) {
      setElement(ref.current);
    }
  }, [element, ref]);

  return element;
}
