const fakeUser = {
  userName : "yhwa",
  loggedIn : true,
}

let videos = [
  {
    title:"First Video",
    rating:4.5,
    comments:2,
    createdAt: "12분 전",
    views:10,
    id:1,
  },
  {
    title:"Second Video",
    rating:4.5,
    comments:2,
    createdAt: "12분 전",
    views:10,
    id:2,
  },
  {
    title:"Third Video",
    rating:4.5,
    comments:1,
    createdAt: "12분 전",
    views:1,
    id:3,
  },
];

export const trending = (req, res) => {
  return res.render("home", {pageTitle:"home", fakeUser, videos});
};

export const watch = (req, res) => {
  const { params: {id} } = req;
  const video = videos[id-1];
  
  return res.render("watch", {pageTitle:`Watching: ${video.title}`, fakeUser, video});
}; 

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video", fakeUser}); 
};

export const postUpload = (req, res) => {
  const { body:{title} } = req;
  videos.push({
    title,
    rating:0,
    comments:0,
    createdAt: new Date(),
    views:0,
    id: videos.length + 1,
  });

  return res.redirect("/");
};

export const getEdit = (req, res) => {
  const { params: {id} } = req;
  const video = videos[id-1];

  return res.render("edit", {pageTitle:`Editing: ${video.title}`, fakeUser, video});
}; 

export const postEdit = (req, res) => {
  const { params: {id}, body:{title} } = req;
  videos[id - 1].title = title;

  return res.redirect(`/videos/${id}`);
}

export const search = (req, res) => {
  return res.render("search", {pageTitle:"search"});
}; 

export const remove = (req, res) => {
  const {params: {id}} = req;

  return res.render("remove", {pageTitle:"remove"});
}; 