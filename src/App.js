import './App.css';
import { useState } from "react"
import Modal from './components/Modal.jsx'

function App() {
  // Initializes to false, then both showModal and setShowModal must be true for popup to open
  // To close, one needs to be reassigned to false
  const [showModal, setShowModal] = useState(false) 
  return (
    <div className="App">
      <button onClick={() => setShowModal(true)}>
        Click here to register
        {showModal && <Modal onClose={() => setShowModal(false)}/>}
      </button>
    </div>
  );
}

export default App;
