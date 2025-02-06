import Button from "./components/Button";
import Alert from "./components/Alert";
import { useState } from "react";
function App() {
  const [alerted, setAlerted] = useState(false);

  return (
    <div>
      {alerted && (
        <Alert onClose={() => setAlerted(false)}>
          Oh No You Clicked a Button!
        </Alert>
      )}
      <Button onClick={() => setAlerted(true)}>My Button</Button>
    </div>
  );
}

export default App;
