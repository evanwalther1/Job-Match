function ListGroupEvan() {
  let items = ["New York", "San Francisco", "Chicago"];
  items = [];

  return (
    <>
      <h1>List</h1>
      {items.length === 0 ? <p>No item Found</p> : null}
      {items.length === 0 && <p>No item Found</p>}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default ListGroupEvan;
