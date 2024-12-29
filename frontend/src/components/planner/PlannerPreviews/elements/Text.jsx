import React from "react";

const Text = ({ config }) => {
  const { position, style, content } = config;

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        color: style.color || "inherit",
        ...style,
      }}
    >
      {content}
    </div>
  );
};

export default React.memo(Text);
