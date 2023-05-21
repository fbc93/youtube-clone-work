import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  }
});

//개발할때는 AWS에 이미지와 비디오를 보내지 않기
const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: 'youtube-clone-work/images',
  acl: 'public-read',
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: 'youtube-clone-work/videos',
  acl: 'public-read',
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  res.locals.siteName = "cloneTube";
  res.locals.isHeroku = isHeroku;

  //console.log(res.locals)
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

export const avatarUpload = multer({
  dest: "uploads/avatars/", limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/", limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

