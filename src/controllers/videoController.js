import Video from "../models/Video";

const fakeUser = {
  userName : "yhwa",
  loggedIn : true,
};

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", {pageTitle:"Home", videos, fakeUser});
};

export const watch = (req, res) => {
  const { params: {id} } = req;
  
  return res.render("watch", {pageTitle:`Watching:`, fakeUser});
}; 

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video", fakeUser}); 
};

export const postUpload = async (req, res) => {
  const { body:{title, description, hashtags} } = req;

  await Video.create({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((hashtag) => `#${hashtag}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  const { params: {id} } = req;

  return res.render("edit", {pageTitle:`Editing:`, fakeUser});
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