import React from "react";
import "./App.css";

async function authorize(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
  } catch (e) {
    console.log(e);
  }
}

async function loadDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log(devices);
  const mic = devices.find((d) => d.kind === "audioinput");
  const cam = devices.find((d) => d.kind === "videoinput");

  return {
    video: {
      deviceId: { exact: cam.deviceId },
    },
    audio: {
      echoCancellation: { ideal: true },
      deviceId: { exact: mic.deviceId },
      autoGainControl: { ideal: true },
      noiseSuppression: { ideal: true },
    },
  };
}

async function authorizeAndPublish() {
  console.log("authorize and publish");

  console.log("call 2"); // should fail after having refused the first prompt but success
  const constraints = { video: true, audio: true };
  await authorize(constraints);

  console.log("call 3"); // fail anyway after having refused the first prompt
  const constraints2 = await loadDevices();
  await authorize(constraints2);
}

const App = () => {
  React.useEffect(() => {
    setTimeout(async () => {
      console.log("call 1");
      const constraints = { video: true, audio: true };
      await authorize(constraints);
    }, 1000);
  }, []);

  return (
    <div>
      <div id="myPublisherDiv" />
      <button
        onClick={(e) => {
          e.preventDefault();
          authorizeAndPublish();
        }}
      >
        publish
      </button>
    </div>
  );
};

export default App;
