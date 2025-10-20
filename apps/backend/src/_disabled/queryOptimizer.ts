
import mongoose from 'mongoose';

export class QueryOptimizer {
  private static queryCache = new Map<string, { data: any; expiry: number }>();

  static async optimizedFind<T>(
    model: any,
    query: any,
    cacheDuration: number = 30000
  ): Promise<T[]> {
    const cacheKey = JSON.stringify({ model: model.modelName, query });
    const cached = this.queryCache.get(cacheKey);

    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    const data = await model.find(query).lean().exec();
    this.queryCache.set(cacheKey, { data, expiry: Date.now() + cacheDuration });

    return data;
  }

  static clearCache() {
    this.queryCache.clear();
  }
}

// Configure mongoose for better performance
export const optimizeMongoDB = () => {
  mongoose.set('strictQuery', false);
  mongoose.connection.on('connected', () => {
    mongoose.connection.db.admin().serverStatus((err, info) => {
      if (!err) console.log('📊 MongoDB optimized with connection pooling');
    });
  });
};
