import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    task_id: {
        type: String,
        required: true
    },
    student_name:{
        type: String,
        required: true
    },
    student_email:{
        type: String,
        required: true
    },
    student_feedback:{
        type: Object,
        required: true
    },
    student_answer: {
        type: Object,
        required: true
    },
    analysis_data:{
        type: Object,
        required: true    }

});


const Analysis = mongoose.models.analysis || mongoose.model("analysis", analysisSchema);
export default Analysis;