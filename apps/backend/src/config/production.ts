// apps/backend/config/production.ts
export const productionConfig = {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'https://your-app-name.replit.app',
      'https://flashscore-study-app.vercel.app',
      /\.replit\.app$/,
      /\.replit\.dev$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  database: {
    uri: process.env.MONGODB_URI || process.env.DATABASE_URL,
    options: {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    }
  },
  server: {
    port: process.env.PORT || 8000,
    host: '0.0.0.0'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    piCoinKey: process.env.PICOIN_ENCRYPTION_KEY
  },
  apis: {
    sportsApi: process.env.SPORTS_API_KEY,
    oddsApi: process.env.ODDS_API_KEY,
    openAi: process.env.OPENAI_API_KEY,
    claude: process.env.CLAUDE_API_KEY
  }
};