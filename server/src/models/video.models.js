import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({

    videoFile: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    
    thumbnail: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
  
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
    },

    duration:{
        type: Number,
    },

    views:{
        type: Number,
        default: 0
    },

    isPublished:{
        type: Boolean,
        default: false
    },

}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema)