// Database and Document Operations in Mongo Shell

// Switch to studentDB database
use('studentDB');

// Drop existing collection and insert 10 documents
print('\n---> insertMany: add 10 students');
db.assignments.drop();
const insertResult = db.assignments.insertMany([
  { name: 'Alice Johnson',  subject: 'Mathematics', score: 92 },
  { name: 'Bob Smith',      subject: 'Physics',     score: 78 },
  { name: 'Carol White',    subject: 'Chemistry',   score: 84 },
  { name: 'David Brown',    subject: 'Mathematics', score: 67 },
  { name: 'Eva Martinez',   subject: 'Physics',     score: 81 },
  { name: 'Frank Lee',      subject: 'Chemistry',   score: 55 },
  { name: 'Grace Kim',      subject: 'Mathematics', score: 88 },
  { name: 'Henry Adams',    subject: 'Physics',     score: 73 },
  { name: 'Irene Novak',    subject: 'Chemistry',   score: 96 },
  { name: 'James Carter',   subject: 'Mathematics', score: 61 },
]);
print(`Inserted: ${insertResult.insertedIds}`);

// Find all documents where score > 80
print('\n---> find: score > 80');
db.assignments.find({ score: { $gt: 80 } }).forEach(printjson);

// Update one student with score < 85 — increase score by 5
print('\n---> updateOne: score < 85 → +5');
const updateResult = db.assignments.updateOne(
  { score: { $lt: 85 } },
  { $inc: { score: 5 } }
);
print(`Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

// Delete the student with the lowest score
print('\n---> deleteOne: lowest score');
const lowest = db.assignments.find().sort({ score: 1 }).limit(1).toArray()[0];
print(`Deleting: ${lowest.name} (score: ${lowest.score})`);
const deleteResult = db.assignments.deleteOne({ _id: lowest._id });
print(`Deleted: ${deleteResult.deletedCount}`);

// find() with projection — name and score only
print('\n---> find with projection: name + score');
db.assignments.find({}, { _id: 0, name: 1, score: 1 }).forEach(printjson);

// Aggregation: average score per subject, filter avgScore > 75
print('\n---> aggregate: average score per subject (avgScore > 75)');
db.assignments.aggregate([
  {
    $group: {
      _id: '$subject',
      avgScore: { $avg: '$score' },
      count: { $sum: 1 },
    },
  },
  {
    $match: { avgScore: { $gt: 75 } },
  },
  {
    $sort: { avgScore: -1 },
  },
  {
    $project: {
      _id: 0,
      subject: '$_id',
      avgScore: { $round: ['$avgScore', 1] },
      count: 1,
    },
  },
]).forEach(printjson);

// Analyze query BEFORE creating index
print('\n---> explain() BEFORE index: name starts with "A"');
const planBefore = db.assignments
  .find({ name: { $regex: '^A' } })
  .explain('executionStats');
print(`winningPlan stage: ${planBefore.queryPlanner.winningPlan.stage}`);
print(`totalDocsExamined: ${planBefore.executionStats.totalDocsExamined}`);
print(`executionTimeMillis: ${planBefore.executionStats.executionTimeMillis}ms`);

// Create unique index on name field
print('\n---> createIndex: unique index on name');
const indexResult = db.assignments.createIndex({ name: 1 }, { unique: true });
print(`Index created: ${indexResult}`);

// Analyze query AFTER creating index
print('\n---> explain() AFTER index: name starts with "A"');
const planAfter = db.assignments
  .find({ name: { $regex: '^A' } })
  .explain('executionStats');
print(`winningPlan stage: ${planAfter.queryPlanner.winningPlan.stage}`);
print(`totalDocsExamined: ${planAfter.executionStats.totalDocsExamined}`);
print(`executionTimeMillis: ${planAfter.executionStats.executionTimeMillis}ms`);

// Search result using the index
print('\n---> find: students where name starts with "A"');
db.assignments.find({ name: { $regex: '^A' } }, { _id: 0, name: 1, score: 1 }).forEach(printjson);
