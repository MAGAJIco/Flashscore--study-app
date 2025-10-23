
"use client";

import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface Widget {
  id: string;
  type: 'predictions' | 'live-scores' | 'news' | 'stats' | 'leaderboard' | 'favorites';
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

const DraggableWidgets: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadWidgetLayout();
  }, []);

  const loadWidgetLayout = () => {
    const saved = ClientStorage.getItem<Widget[]>('widget_layout', [
      {
        id: 'predictions',
        type: 'predictions' as const,
        title: '🎯 Today\'s Predictions',
        icon: '🎯',
        position: { x: 20, y: 20 },
        size: { width: 350, height: 200 },
        visible: true
      },
      {
        id: 'live-scores',
        type: 'live-scores' as const,
        title: '⚽ Live Scores',
        icon: '⚽',
        position: { x: 390, y: 20 },
        size: { width: 350, height: 200 },
        visible: true
      },
      {
        id: 'stats',
        type: 'stats' as const,
        title: '📊 My Stats',
        icon: '📊',
        position: { x: 20, y: 240 },
        size: { width: 350, height: 180 },
        visible: true
      },
      {
        id: 'leaderboard',
        type: 'leaderboard' as const,
        title: '🏆 Leaderboard',
        icon: '🏆',
        position: { x: 390, y: 240 },
        size: { width: 350, height: 180 },
        visible: true
      }
    ]);
    setWidgets(saved);
  };

  const saveLayout = (updatedWidgets: Widget[]) => {
    ClientStorage.setItem('widget_layout', updatedWidgets);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, widgetId: string) => {
    if (!editMode) return;
    
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragging(widgetId);
    setDragOffset({
      x: clientX - widget.position.x,
      y: clientY - widget.position.y
    });
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const updatedWidgets = widgets.map(w =>
      w.id === dragging
        ? {
            ...w,
            position: {
              x: Math.max(0, clientX - dragOffset.x),
              y: Math.max(0, clientY - dragOffset.y)
            }
          }
        : w
    );
    setWidgets(updatedWidgets);
  };

  const handleDragEnd = () => {
    if (dragging) {
      saveLayout(widgets);
      setDragging(null);
    }
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [dragging, dragOffset]);

  const toggleWidget = (widgetId: string) => {
    const updated = widgets.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    setWidgets(updated);
    saveLayout(updated);
  };

  const resetLayout = () => {
    ClientStorage.removeItem('widget_layout');
    loadWidgetLayout();
  };

  const renderWidgetContent = (widget: Widget) => {
    const content: Record<string, JSX.Element> = {
      predictions: (
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.9rem', color: '#22c55e', marginBottom: '8px' }}>
            🎯 Lakers vs Warriors - 94% confidence
          </div>
          <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>
            ⚽ Chelsea vs Arsenal - 87% confidence
          </div>
        </div>
      ),
      'live-scores': (
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.9rem', color: '#ef4444', marginBottom: '8px' }}>
            🔴 LIVE: Man City 2 - 1 Liverpool (78')
          </div>
          <div style={{ fontSize: '0.9rem', color: '#f59e0b' }}>
            ⏱️ HT: Barcelona 1 - 0 Real Madrid
          </div>
        </div>
      ),
      stats: (
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.9rem', color: '#8b5cf6', marginBottom: '8px' }}>
            📈 Accuracy: 76% (↑ 3%)
          </div>
          <div style={{ fontSize: '0.9rem', color: '#22c55e' }}>
            💰 Pi Coins: 1,245 (+50 today)
          </div>
        </div>
      ),
      leaderboard: (
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '0.9rem', color: '#f59e0b', marginBottom: '8px' }}>
            🥇 Top Predictor: MagajiCo_Pro
          </div>
          <div style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
            📊 Your Rank: #127 (↑ 15)
          </div>
        </div>
      )
    };

    return content[widget.type] || <div>Widget content</div>;
  };

  return (
    <div style={{ position: 'relative', minHeight: '600px', padding: '20px' }}>
      {/* Edit Mode Toggle */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            background: editMode ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            backdropFilter: 'blur(10px)'
          }}
        >
          {editMode ? '✅ Done Editing' : '✏️ Edit Layout'}
        </button>
        {editMode && (
          <button
            onClick={resetLayout}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '10px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Widgets */}
      {widgets.filter(w => w.visible).map(widget => (
        <div
          key={widget.id}
          style={{
            position: 'absolute',
            left: widget.position.x,
            top: widget.position.y,
            width: widget.size.width,
            height: widget.size.height,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            cursor: editMode ? 'move' : 'default',
            transition: dragging === widget.id ? 'none' : 'all 0.3s ease',
            userSelect: 'none',
            overflow: 'hidden'
          }}
          onMouseDown={(e) => handleDragStart(e, widget.id)}
          onTouchStart={(e) => handleDragStart(e, widget.id)}
        >
          <div style={{
            background: 'rgba(139, 92, 246, 0.2)',
            padding: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>
              {widget.icon} {widget.title}
            </span>
            {editMode && (
              <button
                onClick={() => toggleWidget(widget.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.3)',
                  border: 'none',
                  color: '#ef4444',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ✕
              </button>
            )}
          </div>
          {renderWidgetContent(widget)}
        </div>
      ))}

      {/* Hidden Widgets Panel (Edit Mode) */}
      {editMode && widgets.some(w => !w.visible) && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(15px)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1000
        }}>
          <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '600' }}>
            Hidden Widgets:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {widgets.filter(w => !w.visible).map(widget => (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                style={{
                  background: 'rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  color: '#c4b5fd',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                + {widget.icon} {widget.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableWidgets;
