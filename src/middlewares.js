export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  res.locals.siteName = "cloneTube";

  console.log(res.locals)
  next();
};

export const protectorMiddleware = (req, res, next) => {

  if(req.session.loggedIn){
    return next();

  } else {
    return res.redirect("/login");
  }
}

export const publicOnlyMiddlewawre = (req, res, next) => {

  if(!req.session.loggedIn){
    return next();

  } else {
    return res.redirect("/");
  }
}