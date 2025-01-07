import React from "react";

const SubNav = ({ theme }) => {
  const generateMonthSubNav = () => {
    
  };
  return (
    <div
      className="flex flex-col items-center"
      style={{
        position: "absolute",
        color: theme.page_dynamic_elements,
        top: "45px",
        left: `${162 + 108 * i}px`,
        width: "108px",
        height: "18px",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "10px" }}>{elements[i + count]}</span>
    </div>
  );
};

export default React.memo(SubNav);
