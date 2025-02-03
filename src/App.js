import React, { useState, useRef } from 'react';

const App = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream, { mimeType: 'video/mp4' }); 
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setRecording(true);

      setTimeout(() => {
        stopRecording();
      }, 120000); // 120000 milliseconds = 2 minutes
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const saveVideo = () => {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen-recording.mp4'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setRecordedChunks([]); // Clear recorded chunks
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Screen Recorder</h1>
      <button onClick={startRecording} disabled={recording}>
        Record
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop
      </button>
      <button onClick={saveVideo} disabled={recordedChunks.length === 0}>
        Save Video
      </button>
      {recording && <p>Recording...</p>}
      
    </div>
  );
};

export default App;