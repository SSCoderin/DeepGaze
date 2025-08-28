import mongoose from "mongoose";


const codeSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    code_content: {
        type: String,
        required: true
    },
    codelines: {
        type: Object,
        required: true
    }
});

const Code = mongoose.models.codes || mongoose.model("codes", codeSchema);
export default Code;