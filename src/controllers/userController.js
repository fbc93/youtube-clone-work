import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";

export const fakeUser = {
  userName : "yhwa",
  loggedIn : false,
};

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle:"Create Account", fakeUser});
};

export const postJoin = async (req, res) => {
  const {body:{email, username, name, password, password_confirm, location}} = req;
  const exists = await User.exists({ $or: [{username}, {email}] });

  if(exists){
    return res.status(400).render("join", {
      pageTitle:"Create Account", 
      errorMsg:"This email/username is already taken.", 
      fakeUser
    });
  }

  if(password !== password_confirm){
    return res.status(400).render("join", {
      pageTitle:"Create Account", 
      errorMsg:"Password confirmation does not match.", 
      fakeUser
    });
  }

  try {
    await User.create({
      email,
      username,
      name,
      password,
      location,
    });

  } catch(error){
    console.log(error);

    return res.status(400).render("join", {
      pageTitle:"Create Account", 
      errorMsg: error._message,
      fakeUser
    });
  }

  return res.redirect("/login");
};

export const getLogin = (req, res) => {

  return res.render("login", {pageTitle: "Login", fakeUser});
};

export const postLogin = async (req, res) => {
  const {body:{username, password}} = req;
  const user = await User.findOne({username});
  const ok = await bcrypt.compare(password, user.password);
  const pageTitle = "Login";

  if(!user){
    return res.status(400).render("login", {
      pageTitle, 
      errorMsg: "An account with this username does not exists.",
      fakeUser
    });
  }

  if(!ok){
    return res.status(400).render("login", {
      pageTitle, 
      errorMsg: "Wrong Password",
      fakeUser
    });
  }

  //session initialize
  req.session.loggedIn = true;
  req.session.user = user;
  
  console.log("User Login");
  return res.redirect("/");
};

export const getProfile = (req, res) => {

  return res.render("profile", {pageTitle:"My Profile", fakeUser});
};

export const postProfile = async (req, res) => {
  const {
    body:{ email, username, name, location }, 
    session:{
      user: { _id, email: sessionEmail, username: sessionUsername, avatarUrl}
    },
    file,
  } = req;


  const userNameExists = username != sessionUsername ? await User.exists({ username }) : undefined;
  const emailExists = email != sessionEmail ? await User.exists({ email }) : undefined;

  if(userNameExists || emailExists) {
    return res.status(400).render("profile", {
      pageTitle:"My Profile", 
      errorMsg:"This email/username is already taken.", 
      fakeUser
    });
  }

  try {
  //db update
  const updatedUser = await User.findByIdAndUpdate(_id, {
    avatarUrl: file ? file.path : avatarUrl,
    username,
    email,
    name,
    location,
  }, {
    new:true,
  });

  //session update
  req.session.user = updatedUser;
  return res.redirect("/users/profile");

  } catch(error){
    console.log(error);

    return res.status(400).render("profile", {
      pageTitle:"My Profile", 
      errorMsg: error._message,
      fakeUser
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {

  return res.render("changePassword", {pageTitle:"Change Password"});
}

export const postChangePassword = async (req, res) => {
  const { 
    body: { oldPassword, newPassword, newPasswordConfirm },
    session: { user: { _id, password } } 
  } = req;

  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);

  if(!ok){
    return res.status(400).render("changePassword", {
      pageTitle:"Change Password", 
      errorMsg: "The current password is incorrect."
    });
  }

  if(newPassword !== newPasswordConfirm){
    return res.status(400).render("changePassword", {
      pageTitle:"Change Password", 
      errorMsg: "The password does not match."
    });
  }

  user.password = newPassword;

  //db update
  await user.save();

  //send notification
  return res.redirect("/users/logout");
}

export const userInfo = async (req, res) =>  {
  const { params:{ id } } = req;
  const user = await User.findById(id);

  if(!user){
    return res.status(404).render("404", {pageTitle:"User Not Found"});
  }

  const videos = await Video.find({ owner: id });

  return res.render("userInfo", {pageTitle: `${user.name}의 정보`, user, videos})
};

export const remove = (req, res) =>  res.send("Remove Profile");