import React, { useState } from 'react';
import './App.css';

function App() {
  const [modelSelections, setModelSelections] = useState([{ modelName: "" }]);
  const allModels = ["yolox_m_37.onnx", "yolox_m_49.onnx", "yolox_m_95.onnx", "yolox_m_99.onnx"];
  const loadModel = async (modelName, index) => {
    if (!modelName) return;

    const response = await fetch('http://localhost:8000/load-model/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelName}),
    });
    const data = await response.json();
    console.log(`Model Loading Time for model ${index + 1}: ${data.loadingTime}`);
    console.log(`Result: ${data.result}`);
    console.log(`Model Information:`,data.additionalInfo)
  };

  const handleModelChange = (index, value) => {
    const newSelections = [...modelSelections];
    newSelections[index].modelName = value;
    setModelSelections(newSelections);
  };

  const addModelSelection = () => {
    setModelSelections([...modelSelections, { modelName: "" }]);
  };

  return (
    <div className="App">
      {modelSelections.map((selection, index) => (
        <div key={index}>
          <select
            value={selection.modelName}
            onChange={(e) => handleModelChange(index, e.target.value)}
          >
            <option value="">Select a model</option>
            {allModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button onClick={() => loadModel(selection.modelName, index)}>Load Model</button>
        </div>
      ))}
      <button onClick={addModelSelection}>+</button>
    </div>
  );
}

export default App;
