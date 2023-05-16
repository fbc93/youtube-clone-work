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

//middleware
videoSchema.pre('save', async function(){
  this.hashtags = this.hashtags[0].split(",").map((item) => (item.startsWith("#") ? item.trim() : `#${item.trim()}`));
});

const movieModel = mongoose.model("Video", videoSchema);

export default movieModel;