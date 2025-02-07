import { useState } from "react";

// {items: [], heading: string}
interface Props {
  items: string[];
  heading: string;
  // (item: string) => void
  onSelectItem: (item: string) => void; //onClick
}

function ListGroupEvan({ items, heading, onSelectItem }: Props) {
  //hook: lets us tap into built in features in react
  const [selectedIndex, setSelectedIndex] = useState(-1);

  //event handler, handles the click event, also type specification is important here

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 ? <p>No item Found</p> : null}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroupEvan;
