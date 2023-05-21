import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle:"Create Account"});
};

export const postJoin = async (req, res) => {
  const {body:{email, username, name, password, password_confirm, location}} = req;
  const exists = await User.exists({ $or: [{username}, {email}] });

  if(exists){
    return res.status(400).render("join", {
      pageTitle:"Create Account", 
      errorMsg:"This email/username is already taken.", 
  
    });
  }

  if(password !== password_confirm){
    return res.status(400).render("join", {
      pageTitle:"Create Account", 
      errorMsg:"Password confirmation does not match.", 
  
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
  
    });
  }

  return res.redirect("/login");
};

export const getLogin = (req, res) => {

  return res.render("login", {pageTitle: "Login"});
};

export const postLogin = async (req, res) => {
  const {
    body:{username, password}
  } = req;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  
  if(!user){
    return res.status(400).render("login", {
      pageTitle, 
      errorMsg: "An account with this username does not exists.",
    });
  }
  
  const ok = await bcrypt.compare(password, user.password);

  if(!ok){
    return res.status(400).render("login", {
      pageTitle, 
      errorMsg: "Wrong Password",
  
    });
  }

  //session initialize
  req.session.loggedIn = true;
  req.session.user = user;
  
  console.log("User Login 😀");
  return res.redirect("/");
};

export const getProfile = (req, res) => {

  return res.render("profile", {pageTitle:"My Profile"});
};

export const postProfile = async (req, res) => {
  const {
    body:{ email, username, name, location }, 
    session:{
      user: { _id, email: sessionEmail, username: sessionUsername, avatarUrl}
    },
    file,
  } = req;

  console.log(file.location)


  const userNameExists = username != sessionUsername ? await User.exists({ username }) : undefined;
  const emailExists = email != sessionEmail ? await User.exists({ email }) : undefined;

  if(userNameExists || emailExists) {
    return res.status(400).render("profile", {
      pageTitle:"My Profile", 
      errorMsg:"This email/username is already taken.", 
  
    });
  }

  try {
  //db update
  const updatedUser = await User.findByIdAndUpdate(_id, {
    avatarUrl: file ? file.location : avatarUrl,
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
  
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  console.log("User Logout 🚪");
  return res.redirect("/login");
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
  const user = await User.findById(id).populate("videos");
  //console.log(user)

  if(!user){
    return res.status(404).render("404", {pageTitle:"User Not Found"});
  }

  return res.render("userInfo", {pageTitle: `${user.name}의 정보`, user})
};

export const remove = (req, res) =>  res.send("Remove Profile");