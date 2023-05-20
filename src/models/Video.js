import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Comment"
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  fileUrl: {
    type: String,
    required:true,
  },
  thumbUrl: {
    type: String,
  },
  title: {
    type:String,
    required: true,
    uppercase: true,
    trim: true,
    maxLength: 80,
  },
  description: {
    type:String,
    required: true,
    trim: true,
    minLength: 5,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hashtags: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  meta: {
    views: {
      type: Number,
      required:true,
      default: 0,
    },
    rating: {
      type: Number,
      required:true,
      default: 0,
    },
  },
});

videoSchema.static("formatHashtags", function(hashtags){
  return hashtags
  .split(",")
  .map((hashtag) => (hashtag.startsWith("#") ? hashtag.trim() : `#${hashtag.trim()}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;