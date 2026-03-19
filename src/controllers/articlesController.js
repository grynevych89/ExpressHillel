const getArticles = (req, res) => {
  res.send('Get articles route');
};

const createArticle = (req, res) => {
  res.send('Post articles route');
};

const getArticleById = (req, res) => {
  res.send(`Get article by Id route: ${req.params.articleId}`);
};

const updateArticle = (req, res) => {
  res.send(`Put article by Id route: ${req.params.articleId}`);
};

const deleteArticle = (req, res) => {
  res.send(`Delete article by Id route: ${req.params.articleId}`);
};

export { getArticles, createArticle, getArticleById, updateArticle, deleteArticle };
