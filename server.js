import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/db.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

connectDB().catch(err => {
  console.error('MongoDB connection failed:', err.message);
});
