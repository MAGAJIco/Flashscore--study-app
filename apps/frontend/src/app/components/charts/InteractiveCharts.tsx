"use client";
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

// Win Probability Timeline Chart
interface WinProbabilityChartProps extends ChartProps {
  data: Array<{
    time: number;
    homeProbability: number;
    awayProbability: number;
    homeTeam: string;
    awayTeam: string;
  }>;
}

export const WinProbabilityChart: React.FC<WinProbabilityChartProps> = ({ 
  data, 
  width = '100%', 
  height = '300px',
  style = {}
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current, 'dark');
    
    const option = {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff88',
        textStyle: {
          color: '#fff'
        },
        formatter: (params: any) => {
          const dataPoint = params[0];
          const time = `${dataPoint.name}'`;
          const homeProb = params[0].value;
          const awayProb = params[1].value;
          return `
            <div style="padding: 8px;">
              <div style="color: #00ff88; font-weight: bold;">${time}</div>
              <div style="color: #00a2ff;">${data[0]?.homeTeam}: ${homeProb}%</div>
              <div style="color: #ff6b35;">${data[0]?.awayTeam}: ${awayProb}%</div>
            </div>
          `;
        }
      },
      legend: {
        data: [data[0]?.homeTeam || 'Home', data[0]?.awayTeam || 'Away'],
        textStyle: {
          color: '#fff'
        },
        top: '10px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(d => `${d.time}'`),
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: '#aaa'
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          color: '#aaa',
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [
        {
          name: data[0]?.homeTeam || 'Home',
          type: 'line',
          stack: 'probability',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 162, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 162, 255, 0.05)' }
            ])
          },
          lineStyle: {
            color: '#00a2ff',
            width: 3
          },
          itemStyle: {
            color: '#00a2ff'
          },
          data: data.map(d => d.homeProbability)
        },
        {
          name: data[0]?.awayTeam || 'Away',
          type: 'line',
          stack: 'probability',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
              { offset: 1, color: 'rgba(255, 107, 53, 0.05)' }
            ])
          },
          lineStyle: {
            color: '#ff6b35',
            width: 3
          },
          itemStyle: {
            color: '#ff6b35'
          },
          data: data.map(d => d.awayProbability)
        }
      ],
      animation: true,
      animationDuration: 1000
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [data]);

  return (
    <div 
      ref={chartRef} 
      style={{ width, height, ...style }}
    />
  );
};

// Performance Metrics Chart
interface PerformanceMetricsProps extends ChartProps {
  data: Array<{
    time: string;
    accuracy: number;
    engagement: number;
    revenue: number;
  }>;
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsProps> = ({
  data,
  width = '100%',
  height = '400px',
  style = {}
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current, 'dark');
    
    const option = {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff88',
        textStyle: { color: '#fff' }
      },
      legend: {
        data: ['Accuracy (%)', 'Engagement (%)', 'Revenue ($K)'],
        textStyle: { color: '#fff' },
        top: '10px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(d => new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
        axisLabel: { color: '#aaa' }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Percentage',
          position: 'left',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#aaa', formatter: '{value}%' },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        {
          type: 'value',
          name: 'Revenue ($K)',
          position: 'right',
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
          axisLabel: { color: '#aaa', formatter: '{value}K' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Accuracy (%)',
          type: 'line',
          smooth: true,
          lineStyle: { color: '#00ff88', width: 3 },
          itemStyle: { color: '#00ff88' },
          data: data.map(d => d.accuracy.toFixed(1))
        },
        {
          name: 'Engagement (%)',
          type: 'line',
          smooth: true,
          lineStyle: { color: '#00a2ff', width: 3 },
          itemStyle: { color: '#00a2ff' },
          data: data.map(d => d.engagement.toFixed(1))
        },
        {
          name: 'Revenue ($K)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { color: '#fbbf24', width: 3 },
          itemStyle: { color: '#fbbf24' },
          data: data.map(d => (d.revenue / 1000).toFixed(1))
        }
      ],
      animation: true,
      animationDuration: 1000
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width, height, ...style }} />;
};

// Heat Map Visualization
interface HeatMapProps extends ChartProps {
  data: Array<{ x: number; y: number; intensity: number }>;
  sport: 'soccer' | 'basketball' | 'football';
  title?: string;
}

export const InteractiveHeatMap: React.FC<HeatMapProps> = ({
  data,
  sport,
  title = 'Player Activity Heat Map',
  width = '100%',
  height = '400px',
  style = {}
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current, 'dark');
    
    // Convert data to heatmap format
    const heatmapData = data.map(d => [d.x, d.y, d.intensity]);
    
    const option = {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      title: {
        text: title,
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold'
        },
        left: 'center',
        top: '10px'
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff88',
        textStyle: { color: '#fff' },
        formatter: (params: any) => {
          return `
            <div>
              <div>Position: (${params.value[0].toFixed(1)}, ${params.value[1].toFixed(1)})</div>
              <div>Activity: ${(params.value[2] * 100).toFixed(1)}%</div>
            </div>
          `;
        }
      },
      grid: {
        height: '70%',
        top: '20%'
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
        axisLabel: { color: '#aaa' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
        axisLabel: { color: '#aaa' }
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        textStyle: { color: '#fff' },
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', 
                  '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [{
        name: 'Activity',
        type: 'heatmap',
        data: heatmapData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 255, 136, 0.5)'
          }
        }
      }],
      animation: true,
      animationDuration: 1500
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data, sport, title]);

  return <div ref={chartRef} style={{ width, height, ...style }} />;
};

// Revenue Breakdown Donut Chart
interface RevenueBreakdownProps extends ChartProps {
  data: {
    subscriptions: number;
    advertising: number;
    partnerships: number;
    premium: number;
  };
}

export const RevenueBreakdownChart: React.FC<RevenueBreakdownProps> = ({
  data,
  width = '100%',
  height = '300px',
  style = {}
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');
    
    const pieData = [
      { value: data.subscriptions, name: 'Subscriptions', itemStyle: { color: '#00ff88' } },
      { value: data.advertising, name: 'Advertising', itemStyle: { color: '#00a2ff' } },
      { value: data.partnerships, name: 'Partnerships', itemStyle: { color: '#fbbf24' } },
      { value: data.premium, name: 'Premium Features', itemStyle: { color: '#8b5cf6' } }
    ];

    const option = {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff88',
        textStyle: { color: '#fff' },
        formatter: '{a} <br/>{b}: {c}% ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: '#fff' },
        data: pieData.map(d => d.name)
      },
      series: [
        {
          name: 'Revenue',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: '#fff'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 255, 136, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData
        }
      ],
      animation: true,
      animationDuration: 1000
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width, height, ...style }} />;
};

// League Performance Radar Chart
interface LeaguePerformanceProps extends ChartProps {
  data: Array<{
    league: string;
    accuracy: number;
    engagement: number;
    volume: number;
    revenue: number;
    growth: number;
  }>;
}

export const LeaguePerformanceRadar: React.FC<LeaguePerformanceProps> = ({
  data,
  width = '100%',
  height = '400px',
  style = {}
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current, 'dark');
    
    const indicators = [
      { name: 'Accuracy', max: 100 },
      { name: 'Engagement', max: 100 },
      { name: 'Volume', max: 100 },
      { name: 'Revenue', max: 100 },
      { name: 'Growth', max: 100 }
    ];

    const seriesData = data.slice(0, 3).map((league, index) => ({
      value: [
        league.accuracy,
        league.engagement,
        league.volume,
        league.revenue,
        league.growth
      ],
      name: league.league,
      itemStyle: {
        color: ['#00ff88', '#00a2ff', '#fbbf24', '#ef4444', '#8b5cf6'][index]
      }
    }));

    const option = {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      title: {
        text: 'League Performance Comparison',
        textStyle: { color: '#fff', fontSize: 16 },
        left: 'center',
        top: '10px'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff88',
        textStyle: { color: '#fff' }
      },
      legend: {
        data: data.slice(0, 3).map(d => d.league),
        textStyle: { color: '#fff' },
        bottom: '10px'
      },
      radar: {
        indicator: indicators,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#aaa' }
      },
      series: [{
        name: 'League Performance',
        type: 'radar',
        data: seriesData
      }],
      animation: true,
      animationDuration: 1000
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width, height, ...style }} />;
};

export default {
  WinProbabilityChart,
  PerformanceMetricsChart,
  InteractiveHeatMap,
  RevenueBreakdownChart,
  LeaguePerformanceRadar
};