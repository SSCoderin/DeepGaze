import mongoose from "mongoose";


const paragraphSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});


const Paragraph = mongoose.models.paragraphs || mongoose.model("paragraphs", paragraphSchema);
export default Paragraph;


