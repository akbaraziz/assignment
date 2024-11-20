export const connectDB = async () => {
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB Connected successfully');
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection error (Attempt ${attempt}):`, error);

      if (attempt >= MAX_RETRIES) {
        throw new Error('Failed to connect to MongoDB after multiple attempts');
      }
      
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Retry after 5 seconds
    }
  }
};
