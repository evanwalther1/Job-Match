import React from "react";
import JobSearchResult from "./assets/components/JobSearchResult";

const App = () => {
  return (
    <div>
      App
      <JobSearchResult more_information={<p>hi</p>} />
      <JobSearchResult />
    </div>
  );
};

export default App;
