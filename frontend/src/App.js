import React, { useState } from 'react';
import './App.css';
import './index.css'

function App() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [modelSelections, setModelSelections] = useState([{ modelName: "", videoIndex: null }]);
  const allModels = ["yolox_m_37.onnx", "yolox_m_49.onnx", "yolox_m_95.onnx", "yolox_m_99.onnx"];
  const MAX_VIDEOS = 4;

  const loadModel = async (modelName, videoIndex) => {
    if (!modelName || videoIndex === null || !videoFiles[videoIndex]) return;

    const formData = new FormData();
    formData.append('modelName', modelName);
    formData.append('videoFile', videoFiles[videoIndex]);

    const response = await fetch('http://localhost:8000/load-model/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(`Model Loading Time for model ${videoIndex + 1}: ${data.loadingTime}`);
    console.log(`Result: ${data.result}`);
    console.log(`Model Information:`, data.additionalInfo);
  };

  const handleModelChange = (index, value) => {
    const newSelections = [...modelSelections];
    newSelections[index].modelName = value;
    setModelSelections(newSelections);
  };

  const addModelSelection = () => {
    if (videoFiles.length >= MAX_VIDEOS) return;
    setModelSelections([...modelSelections, { modelName: "", videoIndex: videoFiles.length }]);
  };

  const handleVideoUpload = (event, index) => {
    if (videoFiles.length >= MAX_VIDEOS) return;
    const newVideoFiles = [...videoFiles];
    newVideoFiles[index] = event.target.files[0];
    setVideoFiles(newVideoFiles);

    const newSelections = [...modelSelections];
    newSelections[index].videoIndex = index;
    setModelSelections(newSelections);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Video Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelSelections.map((selection, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleVideoUpload(e, index)}
              className="mb-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {videoFiles[index] && (
              <video
                src={URL.createObjectURL(videoFiles[index])}
                controls
                className="mb-4 w-full"
              />
            )}
            <select
              value={selection.modelName}
              onChange={(e) => handleModelChange(index, e.target.value)}
              className="mb-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a model</option>
              {allModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <button
              onClick={() => loadModel(selection.modelName, selection.videoIndex)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Load Model
            </button>
          </div>
        ))}
      </div>
      {videoFiles.length < MAX_VIDEOS && (
        <button
          onClick={addModelSelection}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <span className="mr-2">+</span>
          Add Model
        </button>
      )}
    </div>
  );
}

export default App;