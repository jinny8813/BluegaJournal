import React from "react";

const WeeklyTimeline = ({ dateRange, language }) => {
  return (
    <>
      <div className="text-red-500">{dateRange.start.toLocaleDateString()}</div>
    </>
  );
};

export default React.memo(WeeklyTimeline);
