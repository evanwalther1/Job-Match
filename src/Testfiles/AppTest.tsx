import { useState } from "react";
import MessageEvan from "./MessageEvan";
import Alert from "./Alert";
import Button from "./Button";
import ListGroupEvan from "./ListGroupEvan";

function AppTest() {
  let items = ["New York", "San Francisco", "Chicago"];
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const [cannotSee, canSee] = useState(false);

  return (
    <div>
      {cannotSee && (
        <Alert onClose={() => canSee(false)}>
          Wow Look at you go you pressed a button!
        </Alert>
      )}
      <Button color="secondary" onClick={() => canSee(true)}>
        My Button
      </Button>

      <ListGroupEvan
        items={items}
        heading="cities"
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}

export default AppTest;
