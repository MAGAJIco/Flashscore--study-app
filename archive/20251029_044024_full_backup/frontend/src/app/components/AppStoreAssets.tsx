
"use client";

import React from 'react';

// App Store metadata and assets
export const APP_STORE_METADATA = {
  name: "Sports Central - AI Predictions",
  shortDescription: "AI-powered sports predictions, live scores, community voting & Pi rewards",
  longDescription: `Join 1000+ sports fans in the ultimate sports prediction community! 

🔮 AI-POWERED PREDICTIONS
• Advanced machine learning algorithms analyze team stats, player form, and historical data
• Get accurate predictions for NFL, NBA, MLB, Soccer and more
• 5(1's) betting strategy integration for smarter wagering

🏆 INTERACTIVE COMMUNITY
• Vote on community predictions and debates
• Participate in daily sports quizzes
• Live match chat with fellow fans
• Author leaderboards and achievement system

🪙 EARN PI COINS
• Get rewarded for accurate predictions
• Earn coins for community participation
• Spend coins in the integrated store
• Track your earnings and achievements

📊 LIVE SPORTS DATA
• Real-time scores and match updates
• Comprehensive team and player statistics
• Latest sports news and analysis
• Personalized content feed

🎯 FEATURES
• Offline mode for uninterrupted use
• Dark/light theme options
• Push notifications for matches
• Comprehensive security features
• Mobile-optimized interface

Perfect for casual fans and serious bettors alike. Download now and start your winning streak!`,
  
  keywords: [
    "sports predictions", "AI betting", "sports community", "live scores", 
    "NFL predictions", "NBA predictions", "soccer predictions", "MLB predictions",
    "sports betting", "pi network", "cryptocurrency rewards", "sports quiz",
    "fantasy sports", "sports statistics", "betting tips", "sports news"
  ],
  
  category: "Sports",
  contentRating: "13+", // Due to betting-related content
  
  features: [
    "🤖 Advanced AI prediction algorithms",
    "🏆 Community voting and discussions", 
    "📱 Mobile-optimized responsive design",
    "🔒 Enterprise-grade security",
    "🪙 Pi coin reward system",
    "📊 Real-time sports data",
    "🎯 Interactive quizzes and games",
    "📰 Latest sports news integration",
    "🌙 Dark and light themes",
    "📡 Offline functionality",
    "🔔 Smart push notifications",
    "🏅 Achievement system",
    "📈 Performance analytics",
    "🔐 Privacy-focused design"
  ],
  
  permissions: [
    {
      name: "Internet Access",
      reason: "Required for live sports data, predictions, and community features",
      technical: "android.permission.INTERNET"
    },
    {
      name: "Network State",
      reason: "Check connection status for offline mode",
      technical: "android.permission.ACCESS_NETWORK_STATE"
    },
    {
      name: "Notifications",
      reason: "Send match updates and prediction reminders (optional)",
      technical: "android.permission.POST_NOTIFICATIONS"
    },
    {
      name: "Storage",
      reason: "Cache data for offline access and store user preferences",
      technical: "android.permission.WRITE_EXTERNAL_STORAGE"
    },
    {
      name: "Biometric Authentication",
      reason: "Secure login with fingerprint or face recognition (optional)",
      technical: "android.permission.USE_BIOMETRIC"
    }
  ],
  
  screenshots: {
    phone: [
      {
        title: "AI Sports Predictions",
        description: "Get accurate predictions powered by advanced machine learning"
      },
      {
        title: "Community Voting",
        description: "Vote on predictions and engage with fellow sports fans"
      },
      {
        title: "Live Sports Scores",
        description: "Stay updated with real-time scores and match data"
      },
      {
        title: "Interactive Quizzes",
        description: "Test your sports knowledge with daily quizzes"
      },
      {
        title: "Pi Coin Rewards",
        description: "Earn cryptocurrency rewards for accurate predictions"
      }
    ],
    tablet: [
      {
        title: "Dashboard Overview",
        description: "Comprehensive sports hub with personalized content"
      },
      {
        title: "Detailed Analytics",
        description: "In-depth statistics and performance metrics"
      }
    ]
  },
  
  pricing: {
    model: "Freemium",
    freeFeatures: [
      "Basic AI predictions",
      "Community voting",
      "Live scores",
      "Daily quizzes",
      "Basic Pi coin earning"
    ],
    premiumFeatures: [
      "Advanced AI analysis",
      "Unlimited predictions",
      "Priority customer support",
      "Advanced statistics",
      "Higher Pi coin rewards",
      "Ad-free experience"
    ],
    subscription: {
      monthly: "$4.99",
      yearly: "$39.99" // Save 33%
    }
  },
  
  support: {
    email: "support@sportscentral.app",
    website: "https://sportscentral.app",
    faq: "https://sportscentral.app/faq",
    privacyPolicy: "https://sportscentral.app/privacy",
    termsOfService: "https://sportscentral.app/terms"
  },
  
  technicalSpecs: {
    minAndroidVersion: "8.0 (API level 26)",
    minIOSVersion: "13.0",
    targetSdk: "34",
    size: "~25MB",
    languages: ["English", "Spanish", "French", "German", "Italian"],
    accessibility: [
      "VoiceOver/TalkBack support",
      "High contrast mode",
      "Large text support",
      "Keyboard navigation",
      "Screen reader compatible"
    ]
  }
};

// Component for displaying app store preview
interface AppStorePreviewProps {
  platform?: 'google' | 'apple';
}

export const AppStorePreview: React.FC<AppStorePreviewProps> = ({ platform = 'google' }) => {
  const metadata = APP_STORE_METADATA;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black">
      {/* App Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
          <span className="text-3xl font-bold text-white">SC</span>
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{metadata.name}</h1>
          <p className="text-gray-600 mb-2">{metadata.category}</p>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">⭐</span>
              ))}
              <span className="text-sm text-gray-600 ml-1">4.8 (1,247)</span>
            </div>
            
            <div className="text-sm text-gray-600">
              {metadata.contentRating}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              Install
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg">
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Screenshots</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {metadata.screenshots.phone.map((screenshot, index) => (
            <div key={index} className="flex-shrink-0">
              <div className="w-40 h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-xs font-medium">{screenshot.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">About this app</h3>
        <p className="text-sm text-gray-700 mb-3">{metadata.shortDescription}</p>
        
        <div className="text-sm text-gray-700 whitespace-pre-line">
          {metadata.longDescription.split('\n').slice(0, 5).join('\n')}
        </div>
        
        <button className="text-blue-600 text-sm font-medium mt-2">
          Read more
        </button>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {metadata.features.slice(0, 8).map((feature, index) => (
            <div key={index} className="text-sm text-gray-700">
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-medium mb-2">Downloads</h4>
          <p className="text-gray-600">10K+</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Size</h4>
          <p className="text-gray-600">{metadata.technicalSpecs.size}</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Current version</h4>
          <p className="text-gray-600">1.0.0</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Requires Android</h4>
          <p className="text-gray-600">{metadata.technicalSpecs.minAndroidVersion} and up</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Content rating</h4>
          <p className="text-gray-600">{metadata.contentRating}</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Developer</h4>
          <p className="text-gray-600">Sports Central Team</p>
        </div>
      </div>
    </div>
  );
};
