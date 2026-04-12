import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

const isDbConnected = () => mongoose.connection.readyState === 1;

export { isDbConnected };
export default connectDB;
