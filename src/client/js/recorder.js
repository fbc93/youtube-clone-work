import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
const videoSource = document.querySelector("#preview > source");

let stream;
let recorder;
let videoFile;

const files = {
  input:"recording.webm",
  output:"output.mp4",
  thumb:"thumbnail.jpg",
};

//녹화본 다운로드 링크 생성
const handleDownload = async () => {

  //완료후 버튼 비활성화
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log:true });
  await ffmpeg.load();

  //녹화 영상 파일 webm을 mp4로 트랜스코딩
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  //녹화 영상 썸네일 jpg 추출
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  //readFile
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  //binary data로 변환
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

  //브라우저 속도 향상을 위해 사전에 만든 파일 링크들 해제
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  // URL.revokeObjectURL(mp4Url);
  // URL.revokeObjectURL(thumbUrl);
  // URL.revokeObjectURL(videoFile);

  actionBtn.innerText = "Record Again";
  actionBtn.disabled = false;
  initCameraPreview();
  actionBtn.addEventListener("click", handleStart);
}

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
}

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  //actionBtn.addEventListener("click", handleStop);

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
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  }

  recorder.start();
  console.log(recorder);

  //5초후 녹화종료
  setTimeout(()=>{
    recorder.stop();
  },5000);
}

const initCameraPreview = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 1024,
      height: 576
    },
    audio: false,
  });

  video.srcObject = stream;
  video.play();
}

//프리뷰 카메라 시작
initCameraPreview();

//클릭하여 레코딩 시작
actionBtn.addEventListener("click", handleStart);