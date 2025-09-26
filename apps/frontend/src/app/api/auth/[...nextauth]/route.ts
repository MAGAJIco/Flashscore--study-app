
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import TwitterProvider from 'next-auth/providers/twitter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

// Conditional MongoDB connection - only if MONGODB_URI is provided
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

if (process.env.MONGODB_URI) {
  client = new MongoClient(process.env.MONGODB_URI)
  clientPromise = client.connect()
}

const authOptions = {
  // Only use MongoDB adapter if we have a connection
  ...(clientPromise && { adapter: MongoDBAdapter(clientPromise) }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0"
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Only attempt database operations if MongoDB is connected
        if (!client) {
          console.log('⚠️ MongoDB not configured, skipping credentials auth')
          return null
        }

        try {
          const db = client.db()
          const user = await db.collection('users').findOne({
            email: credentials.email
          })

          if (!user || !await bcrypt.compare(credentials.password, user.password)) {
            return null
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image
          }
        } catch (error) {
          console.error('Database auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.provider = account?.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.provider = token.provider as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Only attempt database operations if MongoDB is connected
      if (!client) {
        console.log('✅ Social auth successful (no database configured)')
        return true
      }

      try {
        const db = client.db()
        
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({
          email: user.email
        })

        if (!existingUser && account?.provider) {
          // Create new user with social auth data
          await db.collection('users').insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
            emailVerified: new Date(),
            createdAt: new Date(),
            piCoins: 100, // Welcome bonus
            role: 'user'
          })
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        // Don't fail auth just because database is unavailable
        return true
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
