const form = document.getElementById("commentForm");
const videoContainer = document.getElementById("videoContainer");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;

  if(text === ""){
    return;
  }

  await fetch(`/api/videos/${videoId}/comment`, {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
}

if(form){
  form.addEventListener("submit", handleSubmit)
}