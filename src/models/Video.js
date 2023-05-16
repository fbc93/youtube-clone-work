import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
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
    minLength: 20,
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