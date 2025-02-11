import React from "react";
import { useState } from "react";
interface Props {
  children: string;
}

const JobMarker = ({ children }: Props) => {
  const [highlighted, highlight] = useState(false);
  return (
    <>
      <button
        className={"btn btn-" + (highlighted ? "secondary" : "primary")}
        onClick={() => {
          highlight(!highlighted);
        }}
      >
        {children}
      </button>
    </>
  );
};

export default JobMarker;
