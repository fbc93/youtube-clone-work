const fakeUser = {
  userName : "yhwa",
  loggedIn : false,
}

export const trending = (req, res) => {

  const videos = [
    {
      title:"First Video",
      rating:5,
      comments:2,
      createdAt: "12분 전",
      views:10,
      id:1,
    },
    {
      title:"Second Video",
      rating:5,
      comments:2,
      createdAt: "12분 전",
      views:10,
      id:1,
    },
    {
      title:"Third Video",
      rating:5,
      comments:2,
      createdAt: "12분 전",
      views:10,
      id:1,
    },
  ];

  return res.render("home", {pageTitle:"home", fakeUser, videos});
};

export const search = (req, res) => {
  return res.render("search", {pageTitle:"search"});
}; 

export const watch = (req, res) => {
  const { params: {id} } = req;
  
  return res.render("watch", {pageTitle:"watch"});
}; 

export const edit = (req, res) => {
  const { params: {id} } = req;

  return res.render("edit", {pageTitle:"edit"});
}; 

export const remove = (req, res) => {
  const {params: {id}} = req;

  return res.render("remove", {pageTitle:"remove"});
}; 

export const upload = (req, res) => {
  return res.render("Upload Video", {pageTitle:"upload"}); 
};