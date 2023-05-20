const video = document.getElementById("video");
const play = document.getElementById("play");
const mute = document.getElementById("mute");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const fullscreenElement = document.fullscreenElement;

//initialize volume
let volumeValue = 0.5;
video.volume = volumeValue;

//view api호출
const handleEnded = async () => {
  const {videoid} = videoContainer.dataset;
  fetch(`/api/videos/${videoid}/view`, {
    method: "POST",
  });
}

//video end event
video.addEventListener("ended", (event) => {
  handleEnded();
  play.innerText = "play";
});

//button click event
const handlePlay = (event) => {
  if(video.paused){
    play.innerText = "pause";
    video.play();

  } else {
    play.innerText = "play";
    video.pause();
  }
};

const handleMute = (event) => {

  if(video.muted){
    //now muted, make unmute
    mute.innerText = "mute";
    volume.value = volumeValue;
    video.muted = false;

  } else {
    //now unmuted, make mute
    mute.innerText = "unmute";
    volume.value = 0;
    video.muted = true;
  }
}

const handleFullScreen = () => {
  const fullscreenElement = document.fullscreenElement;

  if(fullscreenElement){
    document.exitFullscreen();
    fullScreen.innerText = "Full Screen";

  } else {
    videoContainer.requestFullscreen();
    fullScreen.innerText = "Exit Screen";
  }
}

//change value event
const handleVolumeChange = (event) => {
  const {
    target: { value }
  } = event;

  if(value == 0){
    mute.innerText = "unmute";
    video.muted = true;

  } else if (value > 0){
    volumeValue = value;
    mute.innerText = "mute";
    video.muted = false;
  }
};

//Time Format Util
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14,19);

const handleLoadedMetadata = (event) => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
  const { target: { value } } = event;
  
  video.currentTime = value;
}

//keycode event
const handleKeyCodeEvent = (event) => {
  if(event.keyCode === 70){
    videoContainer.requestFullscreen();
  }

  if(event.keyCode === 32){
    event.preventDefault();
    
    if(play.innerText === "play"){
      play.innerText = "pause";
      video.play();

    } else {
      play.innerText = "play";
      video.pause();
    }
  }
}

//load
video.readyState 
? handleLoadedMetadata() 
: video.addEventListener("loadedmetadata", handleLoadedMetadata);

//play event
play.addEventListener("click", handlePlay);

//volume event
mute.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolumeChange);

//timeline event
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);

//keyboard event
videoContainer.addEventListener("keydown", handleKeyCodeEvent, false);

//fullscreen event
fullScreen.addEventListener("click", handleFullScreen);

document.onfullscreenchange = () => {
  const fullscreenElement = document.fullscreenElement;

  fullscreenElement 
  ? fullScreen.innerText = "Exit Screen" 
  : fullScreen.innerText = "Full Screen"
}
