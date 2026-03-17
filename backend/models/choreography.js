// What each choreography should store
const mongoose = require("mongoose")
const {Schema, model } = mongoose;

const choreographySchema = new Schema (
    {
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true
    },
    style: {
        type: String,
        enum: [
            "Hip-Hop",
            "Contemporary",
            "Ballet",
            "Jazz",
            "Urban",
            "K-Pop",
            "House",
            "Popping",
            "Locking",
            "Breaking",
            "Other"
        ]
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },
    status: {
        type: String,
        enum: ["Want to Learn", "Learning", "Finished"],
        default: "Want to Learn"
    },
    notes: String,
    },
    { timestamps: true }
);

module.exports = model('Choreography', choreographySchema);