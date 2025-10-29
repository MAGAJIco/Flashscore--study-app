"use client";
import React, { useState, useEffect } from "react";

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  reward: number;
  status: 'available' | 'in-progress' | 'completed';
  progress: number;
  timeLimit?: string;
}

// Remove the first MissionBriefing component and keep only one

export function MissionBriefing() {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [fade, setFade] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [metricFade, setMetricFade] = useState(true);

  const metrics = [
    { label: "Accuracy Rate", value: "94.2%", icon: "🎯", color: "#22c55e" },
    { label: "Active Users", value: "1,247", icon: "👥", color: "#06b6d4" },
    { label: "Predictions Made", value: "15,892", icon: "🔮", color: "#8b5cf6" },
    { label: "Total Winnings", value: "$2.1M", icon: "💰", color: "#f59e0b" }
  ];

  const missions: Mission[] = [
    {
      id: 'daily-predictions',
      title: 'Daily Prediction Master',
      description: 'Make 5 predictions with 80%+ confidence',
      difficulty: 'Medium',
      reward: 150,
      status: 'available',
      progress: 0,
      timeLimit: '24 hours'
    },
    {
      id: 'streak-builder',
      title: 'Streak Builder',
      description: 'Achieve a 3-day prediction streak',
      difficulty: 'Hard',
      reward: 300,
      status: 'in-progress',
      progress: 66
    },
    {
      id: 'community-champion',
      title: 'Community Champion',
      description: 'Help 10 users with predictions',
      difficulty: 'Expert',
      reward: 500,
      status: 'available',
      progress: 0
    }
  ];

  useEffect(() => {
    // Set initial mission
    if (missions.length > 0) {
      setCurrentMission(missions[0]);
    }

    // Fade animation timer for title
    const titleTimer = setInterval(() => {
      setFade(prev => !prev);
    }, 3000);

    // Metric rotation timer
    const metricTimer = setInterval(() => {
      setMetricFade(false);
      setTimeout(() => {
        setActiveMetric((prev) => (prev + 1) % metrics.length);
        setMetricFade(true);
      }, 500);
    }, 3000);

    return () => {
      clearInterval(titleTimer);
      clearInterval(metricTimer);
    };
  }, []);

  const acceptMission = (mission: Mission) => {
    setCurrentMission({ ...mission, status: 'in-progress' });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const currentMetric = metrics[activeMetric];

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border-2 border-blue-500">
      {/* Metrics Display Section */}
      <div className="mb-6">
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          backgroundColor: "#1f2937",
          borderRadius: "0.75rem",
          color: "#fff",
          textAlign: "center",
          transition: "opacity 0.5s",
          opacity: metricFade ? 1 : 0
        }}>
          <div style={{
            fontSize: "2rem",
            color: currentMetric.color,
            transform: metricFade ? "translateY(0)" : "translateY(-10px)",
            transition: "transform 0.5s, opacity 0.5s"
          }}>
            {currentMetric.icon}
          </div>
          <div style={{
            fontSize: "1rem",
            marginTop: "0.5rem",
            transform: metricFade ? "translateY(0)" : "translateY(-10px)",
            transition: "transform 0.5s, opacity 0.5s"
          }}>
            {currentMetric.label}
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginTop: "0.25rem",
            color: currentMetric.color,
            transform: metricFade ? "translateY(0)" : "translateY(-10px)",
            transition: "transform 0.5s, opacity 0.5s"
          }}>
            {currentMetric.value}
          </div>
        </div>
      </div>

      {/* Mission Briefing Section */}
      <div className="flex items-center mb-4">
        <div className="text-3xl mr-3">🎯</div>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          transform: fade ? "translateY(-5px)" : "translateY(0px)",
          transition: "transform 0.5s ease-in-out"
        }}>
          Mission Briefing
        </h2>
      </div>

      {currentMission && (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-blue-400">
                {currentMission.title}
              </h3>
              <span className={`text-sm font-semibold ${getDifficultyColor(currentMission.difficulty)}`}>
                {currentMission.difficulty}
              </span>
            </div>
            
            <p className="text-gray-300 mb-3">
              {currentMission.description}
            </p>

            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">💰</span>
                <span className="text-yellow-400 font-bold">
                  {currentMission.reward} Pi Coins
                </span>
              </div>
              {currentMission.timeLimit && (
                <div className="flex items-center">
                  <span className="text-red-400 mr-1">⏰</span>
                  <span className="text-red-400 text-sm">
                    {currentMission.timeLimit}
                  </span>
                </div>
              )}
            </div>

            {currentMission.status === 'in-progress' && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentMission.progress}%` }}
                ></div>
              </div>
            )}

            <div className="flex gap-2">
              {currentMission.status === 'available' && (
                <button
                  onClick={() => acceptMission(currentMission)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Accept Mission
                </button>
              )}
              {currentMission.status === 'in-progress' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed">
                  In Progress ({currentMission.progress}%)
                </button>
              )}
              {currentMission.status === 'completed' && (
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold">
                  Claim Reward
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {missions.slice(1).map((mission) => (
              <div key={mission.id} className="bg-gray-800 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-400 text-sm mb-1">
                  {mission.title}
                </h4>
                <p className="text-gray-400 text-xs mb-2">
                  {mission.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 text-xs">
                    💰 {mission.reward}
                  </span>
                  <span className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}