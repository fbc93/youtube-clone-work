const form = document.getElementById("commentForm");
const videoContainer = document.getElementById("videoContainer");
const videoComments = document.querySelector(".video__comments ul");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const addComment = (text, newCommentId) => {

  const newComment = document.createElement("li");
  const deleteBtn = document.createElement("span");
  const updateBtn = document.createElement("span");
  const comment__text = document.createElement("div");
  const comment__edit = document.createElement("div");

  newComment.className = "video__comment";
  deleteBtn.className = "deleteBtn";
  deleteBtn.onclick = deleteComment;
  updateBtn.className = "updateBtn";
  comment__text.className = "comment__text";
  comment__edit.className = "comment__edit";

  newComment.dataset.commentid = newCommentId;
  
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

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text }),
  });

  if(response.status === 201){
    textarea.value = "";
    const {newCommentId} = await response.json();
    addComment(text, newCommentId);
  }
}

//리팩토링 필요
const deleteComment = async (event) => {
  const targetComment = event.target.parentNode.parentNode;
  const videoId = videoContainer.dataset.videoid;

  const { 
    dataset: { commentid }
  } = targetComment;

  const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method:"DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentid }),
  });

  if (response.status === 200){
    targetComment.remove();
  }
}

//버튼 클릭
const handleDeleteComment = async (event) => {
  const targetComment = event.target.parentElement.parentElement;
  const videoId = videoContainer.dataset.videoid;

  const { 
    dataset: { commentid }
  } = targetComment;

  const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method:"DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentid }),
  });

  if (response.status === 200){
    targetComment.remove();
  }
};


if(form){
  form.addEventListener("submit", handleSubmit);
}

if(deleteBtn){
  deleteBtn.forEach((btn) => btn.addEventListener("click", handleDeleteComment));
}