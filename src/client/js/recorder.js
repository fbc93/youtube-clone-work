import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const videoSource = document.querySelector("#preview > source");

let stream;
let recorder;
let videoFile;

//녹화본 다운로드 링크 생성
const handleDownload = async () => {

  const ffmpeg = createFFmpeg({ log:true });
  await ffmpeg.load();

  //녹화 영상 파일 webm을 mp4로 트랜스코딩
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  //녹화 영상 썸네일 jpg 추출
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
  const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"});

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  //녹화 썸네일 다운로드 링크
  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = String(Date.now() + "_thumbnail.jpg");
  document.body.appendChild(thumbA);

  //녹화 영상 다운로드 링크
  const videoA = document.createElement("a");
  videoA.href = mp4Url;
  videoA.download = String(Date.now() + "_recording.mp4");
  document.body.appendChild(videoA);

  //사파리 click메서드 연속 적용 불가
  //영상 다운로드 후, 1초 뒤 썸네일 다운로드
  videoA.click();
  setTimeout(()=>{
    thumbA.click();
  },1000);
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
    videoFile = URL.createObjectURL(event.data);
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