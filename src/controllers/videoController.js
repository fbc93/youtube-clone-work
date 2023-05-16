import Video from "../models/Video";

const fakeUser = {
  userName : "yhwa",
  loggedIn : true,
};

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", {pageTitle:"Home", videos, fakeUser});
};

export const watch = async (req, res) => {
  const { params: {id} } = req;
  const video = await Video.findById(id);

  if(video){
    return res.render("watch", {pageTitle:`Watching: ${video.title}`, video, fakeUser});
  }
  
  return res.render("404", {pageTitle: "Video Not Found.", fakeUser});
}; 

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video", fakeUser}); 
};

export const postUpload = async (req, res) => {
  const { body:{title, description, hashtags} } = req;

  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((hashtag) => `#${hashtag.trim()}`),
    });

    return res.redirect("/");

  } catch(error){
    console.log(error);

    return res.render("upload", {
      pageTitle:"Upload Video", 
      errorMsg: error._message, 
      fakeUser,
    }); 
  }
};

export const getEdit = async (req, res) => {
  const { params: {id} } = req;
  const video = await Video.findById(id);

  return res.render("edit", {pageTitle:`Editing: ${video.title}`, video, fakeUser});
}; 

export const postEdit = (req, res) => {
  const { params: {id}, body:{title} } = req;

  return res.redirect(`/videos/${id}`);
}

export const search = (req, res) => {
  return res.render("search", {pageTitle:"search"});
}; 

export const remove = (req, res) => {
  const {params: {id}} = req;

  return res.render("remove", {pageTitle:"remove"});
}; 