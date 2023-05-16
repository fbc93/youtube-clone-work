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

  if(!video){
    return res.render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  return res.render("watch", {pageTitle:`Watching: ${video.title}`, video, fakeUser});
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
      hashtags,
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

  if(!video){
    return res.render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  return res.render("edit", {pageTitle:`Editing: ${video.title}`, video, fakeUser});
}; 

export const postEdit = async (req, res) => {
  const { params: {id}, body:{title, description, hashtags} } = req;
  const video = await Video.exists({_id:id});

  if(!video){
    return res.render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  await Video.findByIdAndUpdate(id,{
    title,
    description,
    hashtags: hashtags.split(",").map((hastag) => hastag.startsWith("#") ? hastag : `#${hastag}`),
  });

  await video.save();
  return res.redirect(`/videos/${id}`);
}

export const search = (req, res) => {
  return res.render("search", {pageTitle:"search"});
}; 

export const remove = (req, res) => {
  const {params: {id}} = req;

  return res.render("remove", {pageTitle:"remove"});
}; 