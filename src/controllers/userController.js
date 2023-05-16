import User from "../models/User";

export const fakeUser = {
  userName : "yhwa",
  loggedIn : false,
};

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle:"Create Account", fakeUser});
};

export const postJoin = async (req, res) => {
  const {body:{email, username, name, password1, password2, location}} = req;
  const exists = await User.exists({ $or: [{username}, {email}] });

  if(exists){
    return res.render("join", {
      pageTitle:"Create Account", 
      errorMsg:"This email/username is already taken.", 
      fakeUser
    });
  }

  if(password1 !== password2){
    return res.render("join", {
      pageTitle:"Create Account", 
      errorMsg:"Password confirmation does not match.", 
      fakeUser
    });
  }

  await User.create({
    email,
    username,
    name,
    password,
    location,
  });

  return res.redirect("/login");
};

export const getLogin = (req, res) => {

  return res.render("login", {pageTitle: "Login", fakeUser});
};

export const postLogin = (req, res) => {

  return res.redirect("/");
};

export const logout = (req, res) => res.send("Logout"); 
export const profile = (req, res) =>  res.send("My Profile");
export const edit = (req, res) =>  res.send("Edit My Profile");
export const remove = (req, res) =>  res.send("Remove Profile");