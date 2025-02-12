import { ReactNode } from "react";

interface Test_Properties {
  title?: string;
  more_information?: ReactNode;
}

/*
interface Properties {
  title: string;
}
*/

function JobSearchResultSimple({
  title = "Job Name",
  more_information = null,
}: Test_Properties) {
  const hi: React.CSSProperties = { /*width: "75rem",*/ margin: "1rem" };

  const more_info_button = (
    <button type="button" className="btn btn-link" onClick={() => {}}>
      See more
    </button>
  );

  return (
    <div className="card" style={hi}>
      <img src="..." className="card-img-top" alt="image alt text" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">An item</li>
        <li className="list-group-item">A second item</li>
        <li className="list-group-item">A third item</li>
      </ul>
      <div className="card-body">
        <a href="#" className="card-link">
          Link
        </a>
      </div>
      {more_information != null ? more_info_button : null}
    </div>
  );
}

export default JobSearchResultSimple;
