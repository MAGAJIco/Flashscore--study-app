'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  onDateChange?: (date: Date) => void;
}

export default function DateSelector({ onDateChange }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate array of dates (3 days before and 3 days after selected date)
  const generateDates = () => {
    const dates = [];
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const dates = generateDates();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const scrollToPrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const scrollToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.getDate() + '.' + (date.getMonth() + 1) + '.';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div 
      className="border-b"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center px-2 py-2">
        <button
          onClick={scrollToPrevWeek}
          className="p-2 transition-colors rounded-lg"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-around gap-1 overflow-x-auto scrollbar-hide">
          {dates.map((date, index) => {
            const today = isToday(date);
            const selected = isSelected(date);

            return (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className="flex flex-col items-center min-w-[60px] px-2 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: selected 
                    ? 'var(--accent-color)' 
                    : today 
                    ? 'var(--bg-tertiary)' 
                    : 'transparent',
                  color: selected 
                    ? 'white' 
                    : 'var(--text-primary)',
                  border: today && !selected 
                    ? '1px solid var(--accent-color)' 
                    : '1px solid transparent'
                }}
              >
                <span className="text-xs font-medium opacity-80">
                  {formatDay(date)}
                </span>
                <span className="text-sm font-bold mt-1">
                  {formatDate(date)}
                </span>
                {today && (
                  <div className="w-1 h-1 rounded-full bg-current mt-1" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={scrollToNextWeek}
          className="p-2 transition-colors rounded-lg"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
