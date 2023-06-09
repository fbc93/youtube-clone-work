import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
const isHeroku = process.env.NODE_ENV === "production";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({
    createdAt: "desc"
  }).populate("owner");
  //console.log(videos)

  return res.render("home", {pageTitle:"Home", videos});
};

export const watch = async (req, res) => {
  const { params: {id} } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");
  //console.log(video)
  
  if(!video){
    return res.status(404).render("404", {pageTitle: "Video Not Found."});
  }

  return res.render("watch", {pageTitle:`Watching: ${video.title}`, video});
}; 

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video"}); 
};

export const postUpload = async (req, res) => {
  const { video, thumb } = req.files;
  const { 
    body:{title, description, hashtags},
    session: { user: { _id } },
   } = req;

  try {
    const newVideo = await Video.create({
      owner: _id,
      fileUrl: isHeroku ? video[0].location : video[0].path ,
      thumbUrl: isHeroku ? thumb[0].location : video[0].path,
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
    return res.status(404).render("404", {pageTitle: "Video Not Found."});
  }

  if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }

  return res.render("edit", {pageTitle:`Editing: ${video.title}`, video});
}; 

export const postEdit = async (req, res) => {
  const { 
    session: { user: { _id } }, 
    params: { id }, 
    body:{ title, description, hashtags },
  } = req;

  const isVideoExist = await Video.exists({ _id: id });
  const video = await Video.findById(id);

  if(!isVideoExist){
    return res.status(404).render("404", {pageTitle: "Video Not Found."});
  }

  //세션유저와 비디오 업로더가 같은 사람인지 확인
  if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
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
    return res.status(404).render("404", {pageTitle: "Video Not Found."});
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
    }).populate("owner");
  }

  return res.render("search", {pageTitle:"search", videos});
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

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user: { _id } },
    body: { commentid },
  } = req;
  
  const video = await Video.findById(id);
  const comment = await Comment.findById(commentid);

  //존재하는 비디오인지 확인
  if(!video){
    return res.sendStatus(404);
  }

  //존재하는 코멘트인지 확인
  if(!comment){
    return res.sendStatus(404);
  }

  //로그인한 사용자와 코멘트의 오너가 다를경우
  if (comment.owner != _id){
    return res.sendStatus(404);
  }

  comment.remove();
  return res.sendStatus(200);
};