import mongoose from "mongoose";



const studentAiFeedbackSchema = new mongoose.Schema({
    object_id:{
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    student_feedback: {
        type: Object,
        required: true
    },
    ai_feedback: {
        type: Array,
        required: true
    },
    student_conclusion:{
        type: Object,
        required: true
    }

});



const StudentAiFeedback = mongoose.models.studentAiFeedbacks || mongoose.model("studentAiFeedbacks", studentAiFeedbackSchema);
export default StudentAiFeedback;