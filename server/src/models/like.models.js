import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({

    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    
    video:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },

    likedBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    tweet:{
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    }
    
}, {timestamps: true});

likeSchema.index(
  { video: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { video: { $exists: true, $ne: null } } }
);

likeSchema.index(
  { tweet: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { tweet: { $exists: true, $ne: null } } }
);

likeSchema.index(
  { comment: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true, $ne: null } } }
);

export const Like = mongoose.model("Like", likeSchema);