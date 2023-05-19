const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const videoSource = document.querySelector("#preview > source");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  console.log("download source")
}

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
}

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  console.log(recorder);

  recorder.ondataavailable = (event) => {
    console.log("recording done: ",event.data); 
    const videoFile = URL.createObjectURL(event.data);
    console.log("saved as :", videoFile);

    video.srcObject = null;
    video.loop = true;
    video.muted = true;
    videoSource.src = videoFile;
    video.play();
  }

  recorder.start();
  console.log(recorder);
}

const initCameraPreview = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 600,
      height: 400
    },
    audio: false,
  });

  video.srcObject = stream;
  video.play();
}

//프리뷰 카메라 시작
initCameraPreview();

//클릭하여 레코딩 시작
startBtn.addEventListener("click", handleStart);