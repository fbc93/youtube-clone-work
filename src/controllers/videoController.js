const fakeUser = {
  userName : "yhwa",
  loggedIn : false,
}

export const trending = (req, res) => {
  return res.render("home", {pageTitle:"home", fakeUser});
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