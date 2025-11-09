
"use client";

import { useState, useEffect } from 'react';
import { MagajiCoAppLauncher } from '../components/MagajiCoAppLauncher';
import { Brain, TrendingUp, Users, Shield, Zap, Globe, Award, Sparkles, Target, Trophy, BarChart3, Gamepad2, MessageSquare, Star, Clock, Bolt } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [activeMetric, setActiveMetric] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics = [
    { value: '87%', label: 'AI Accuracy', icon: Brain, color: 'from-purple-500 to-blue-500' },
    { value: '2.4M', label: 'Predictions', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { value: '150K', label: 'Active Users', icon: Users, color: 'from-orange-500 to-red-500' },
    { value: '100%', label: 'Privacy First', icon: Shield, color: 'from-cyan-500 to-blue-500' }
  ];

  const newFeatures = [
    {
      icon: Gamepad2,
      title: 'Interactive Challenges',
      description: 'Compete with friends in prediction tournaments',
      status: 'New',
      color: 'purple',
      link: '/en/challenges'
    },
    {
      icon: MessageSquare,
      title: 'Live Match Chat',
      description: 'Real-time discussions during games',
      status: 'Beta',
      color: 'blue',
      link: '/en/chats'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges and unlock exclusive rewards',
      status: 'Live',
      color: 'yellow',
      link: '/en/achievements'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your prediction performance',
      status: 'Live',
      color: 'green',
      link: '/en/analytics'
    },
    {
      icon: Star,
      title: 'Kids Safe Mode',
      description: 'Educational sports content for children',
      status: 'Live',
      color: 'pink',
      link: '/en/kids'
    },
    {
      icon: Bolt,
      title: 'Flash Predictions',
      description: 'Quick predictions for live matches',
      status: 'Coming Soon',
      color: 'orange',
      link: '/en/live'
    }
  ];

  const coreFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Machine learning models trained on millions of matches',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays yours. End-to-end encryption.',
      color: 'blue'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Live predictions for leagues worldwide',
      color: 'cyan'
    }
  ];

  const testimonials = [
    {
      quote: "The AI predictions are incredibly accurate. I've improved my win rate by 40%!",
      author: "Alex M.",
      role: "Sports Enthusiast",
      rating: 5
    },
    {
      quote: "Love the kids mode! My son learns about sports while having fun.",
      author: "Sarah K.",
      role: "Parent",
      rating: 5
    },
    {
      quote: "Best sports prediction platform I've used. Clean interface, fast updates.",
      author: "James R.",
      role: "Pro Bettor",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % newFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className={`relative z-10 text-center max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Trust Badge */}
          <div className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full backdrop-blur-xl">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Trusted by 150,000+ sports enthusiasts</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Predict the Future
            </span>
            <br />
            <span className="text-white">of Sports</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Advanced AI meets beautiful design. Experience sports predictions that are as accurate as they are elegant.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/en/predictions">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Start Predicting Free
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
            
            <Link href="/en/matches">
              <button className="px-8 py-4 border border-white/20 rounded-full font-medium text-lg hover:bg-white/5 transition-all">
                Watch Demo
              </button>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
                    activeMetric === index
                      ? 'bg-gradient-to-br ' + metric.color + ' border-white/30 scale-105'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 mx-auto transition-all duration-500 ${
                    activeMetric === index ? 'text-white' : 'text-gray-400'
                  }`} />
                  <div className={`text-3xl font-black mb-1 transition-all duration-500 ${
                    activeMetric === index ? 'text-white' : 'text-gray-300'
                  }`}>
                    {metric.value}
                  </div>
                  <div className={`text-sm transition-all duration-500 ${
                    activeMetric === index ? 'text-white/90' : 'text-gray-500'
                  }`}>
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* New Features Showcase */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              What's New
            </span>
          </h2>
          <p className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            Discover our latest features designed to enhance your sports prediction experience
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              return (
                <Link key={index} href={feature.link}>
                  <div
                    className={`group p-6 rounded-3xl border transition-all duration-500 hover:scale-105 cursor-pointer ${
                      isActive 
                        ? `bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 border-${feature.color}-500/40`
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 text-${feature.color}-400`} />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        feature.status === 'New' ? 'bg-green-500/20 text-green-300' :
                        feature.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-300' :
                        feature.status === 'Live' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Designed for Excellence
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12">
            Join the Community
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { stat: '98%', label: 'User Satisfaction' },
              { stat: '2.4M+', label: 'Predictions Made' },
              { stat: '150K+', label: 'Active Users' }
            ].map((item, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {item.stat}
                </div>
                <div className="text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-32 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-4xl font-light text-gray-300 leading-relaxed mb-8">
            "The future of sports analytics isn't just about data—it's about making intelligent predictions accessible to everyone."
          </blockquote>
          <p className="text-gray-500">— MagajiCo Vision</p>
        </div>
      </section>

      {/* App Launcher Section */}
      <section className="py-12">
        <MagajiCoAppLauncher />
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands making smarter predictions every day.
            </p>
            <Link href="/en/predictions">
              <button className="px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-xl hover:scale-105 transition-all hover:shadow-2xl hover:shadow-purple-500/50">
                Get Started Free
              </button>
            </Link>
            <p className="text-sm text-gray-400 mt-4">No credit card required</p>
          </div>
        </div>
      </section>
    </div>
  );
}
