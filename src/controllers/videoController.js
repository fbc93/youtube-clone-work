import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const fakeUser = {
  userName : "yhwa",
  loggedIn : false,
};

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({
    createdAt: "desc"
  });
  return res.render("home", {pageTitle:"Home", videos, fakeUser});
};

export const watch = async (req, res) => {
  const { params: {id} } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");

  console.log(video)
  
  if(!video){
    return res.status(404).render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  return res.render("watch", {pageTitle:`Watching: ${video.title}`, video, fakeUser});
}; 

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video", fakeUser}); 
};

export const postUpload = async (req, res) => {
  const {path: fileUrl} = req.file;
  const { 
    body:{title, description, hashtags},
    session: { user: { _id } },
   } = req;

  try {
    const newVideo = await Video.create({
      owner: _id,
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");

  } catch(error){
    console.log(error);

    return res.status(400).render("upload", {
      pageTitle:"Upload Video", 
      errorMsg: error._message, 
      fakeUser,
    }); 
  }
};

export const getEdit = async (req, res) => {
  const { 
    params: {id}, 
    session: { user: { _id } } 
  } = req;

  const video = await Video.findById(id).populate("videos");

  if(!video){
    return res.status(404).render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }

  return res.render("edit", {pageTitle:`Editing: ${video.title}`, video, fakeUser});
}; 

export const postEdit = async (req, res) => {
  const { 
    params: {id}, 
    body:{title, description, hashtags},
    session: { user: { _id } } 
  } = req;
  const video = await Video.exists({_id:id});

  if(!video){
    return res.status(404).render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id,{
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
}

export const remove = async (req, res) => {
  const { 
    params: {id},
    session: { user: { _id } },
   } = req;
   
   const video = await Video.findById(id);

  if(!video){
    return res.status(404).render("404", {pageTitle: "Video Not Found.", fakeUser});
  }

  if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id); //findOneAndDelete

  return res.redirect("/");
}; 

export const search = async (req, res) => {
  const { query:{keyword} } = req;

  let videos = [];

  if(keyword){
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i")
      },
    });
  }

  return res.render("search", {pageTitle:"search", videos, fakeUser});
}; 

export const registerView = async (req, res) => {
  const { params: { id }} = req;
  const video = await Video.findById(id);

  if(!video){
    return res.sendStatus(404);
  }

  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.sendStatus(200);
}

export const createComment = async (req, res) => {
  const { 
    params: { id }, 
    body:{ text }, 
    session:{ user }
  } = req;

  const video = await Video.findById(id);

  if(!video){
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  video.save();

  return res.status(201).json({
    newCommentId: comment._id,
  });
}