import React from "react";

interface KbdProps {
  smartControl?: boolean;
  keys: string[];
}

const Kbd: React.FC<KbdProps> = ({ smartControl = true, keys }) => {
  let prefix = "";

  if (smartControl) {
    if (
      typeof window !== "undefined" &&
      navigator?.userAgent !== undefined &&
      /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
    ) {
      prefix = "CMD + ";
    } else {
      prefix = "CTRL + ";
    }
  }

  const keyCombination = keys.join(" + ");

  return (
    <span>
      {prefix}
      {keyCombination}
    </span>
  );
};

export default Kbd;
