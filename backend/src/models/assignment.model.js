import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    pdfPublicId: {
      type: String,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0,
      default: 100,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({
  course: 1,
  createdAt: -1,
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
