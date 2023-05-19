const form = document.getElementById("commentForm");
const videoContainer = document.getElementById("videoContainer");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");

  const newComment = document.createElement("li");
  const deleteBtn = document.createElement("span");
  const updateBtn = document.createElement("span");
  const comment__text = document.createElement("div");
  const comment__edit = document.createElement("div");

  newComment.className = "video__comment";
  deleteBtn.className = "deleteBtn";
  updateBtn.className = "updateBtn";
  comment__text.className = "comment__text";
  comment__edit.className = "comment__edit";

  comment__text.innerText = text;
  deleteBtn.innerText = "❌";
  updateBtn.innerText = "✏️";

  comment__edit.appendChild(deleteBtn);
  comment__edit.appendChild(updateBtn);

  newComment.appendChild(comment__text);
  newComment.appendChild(comment__edit);

  videoComments.prepend(newComment);
}

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;

  if(text === ""){
    return;
  }

  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
  if(status === 201){
    addComment(text);
  }
}

if(form){
  form.addEventListener("submit", handleSubmit)
}