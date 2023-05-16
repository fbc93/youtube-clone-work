import Video from "../models/Video";

const fakeUser = {
  userName : "yhwa",
  loggedIn : true,
};

export const home = async (req, res) => {
 try {
  const videos = await Video.find({});
  return res.render("home", {pageTitle:"Home", videos, fakeUser});

 } catch(error) {
  return res.render("server-error");
 } 
};

export const watch = (req, res) => {
  const { params: {id} } = req;
  
  return res.render("watch", {pageTitle:`Watching:`, fakeUser});
}; 

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video", fakeUser}); 
};

export const postUpload = (req, res) => {
  const { body:{title} } = req;

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