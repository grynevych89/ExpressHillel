import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
