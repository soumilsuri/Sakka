import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFIle: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,  //cloudinary
            required: true  
        },
        views: {
            type: Number,
            default: 0,
            required: true
        },
        isPublished: {
            type: Boolean,
            default: true
        }

    },{timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)