import Article from '../models/Article.js';

const buildRegexFilter = (field, value) =>
  value ? { [field]: { $regex: value, $options: 'i' } } : {};

const buildSearchFilter = (search) => buildRegexFilter('title', search);

const getStats = async () => {
  const agg = await Article.aggregate([
    {
      $group: {
        _id: '$author',
        articleCount: { $sum: 1 },
        avgContentLength: { $avg: { $strLenCP: '$content' } },
        latestDate: { $max: '$date' },
      },
    },
    { $sort: { articleCount: -1 } },
    {
      $group: {
        _id: null,
        totalArticles: { $sum: '$articleCount' },
        uniqueAuthors: { $sum: 1 },
        avgContentLength: { $avg: '$avgContentLength' },
        perAuthor: {
          $push: {
            author: '$_id',
            articleCount: '$articleCount',
            avgContentLength: { $round: ['$avgContentLength', 0] },
            latestDate: '$latestDate',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalArticles: 1,
        uniqueAuthors: 1,
        avgContentLength: { $round: ['$avgContentLength', 0] },
        perAuthor: 1,
      },
    },
  ]);

  return agg[0] || { totalArticles: 0, uniqueAuthors: 0, avgContentLength: 0, perAuthor: [] };
};

export { buildRegexFilter, buildSearchFilter, getStats };
