import mongoose from "mongoose";
import { VALIDATION_RULES } from "../config.js";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [
        VALIDATION_RULES.article.title.minlength,
        VALIDATION_RULES.article.title.message,
      ],
      maxlength: [
        VALIDATION_RULES.article.title.maxlength,
        VALIDATION_RULES.article.title.message,
      ],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [
        VALIDATION_RULES.article.author.minlength,
        VALIDATION_RULES.article.author.message,
      ],
      maxlength: [
        VALIDATION_RULES.article.author.maxlength,
        VALIDATION_RULES.article.author.message,
      ],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [
        VALIDATION_RULES.article.content.minlength,
        VALIDATION_RULES.article.content.message,
      ],
    },
  },
  { timestamps: true },
);

articleSchema.index({ title: "text" });
articleSchema.index({ author: 1 });
articleSchema.index({ date: -1 });

articleSchema.statics.findByFieldCaseInsensitive = function (field, value) {
  return this.find({
    [field]: { $regex: value, $options: "i" },
  });
};

articleSchema.statics.findByTitle = function (searchTerm) {
  return this.findByFieldCaseInsensitive("title", searchTerm);
};

articleSchema.statics.findByAuthor = function (author) {
  return this.findByFieldCaseInsensitive("author", author);
};

articleSchema.methods.getSummary = function () {
  return {
    _id: this._id,
    title: this.title,
    author: this.author,
    date: this.date,
    contentPreview: this.content.substring(0, 100) + "...",
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Article = mongoose.model("Article", articleSchema);

export default Article;
