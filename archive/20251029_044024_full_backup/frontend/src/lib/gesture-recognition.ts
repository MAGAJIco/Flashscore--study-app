
'use client';

type GestureType = 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'double-tap' | 'long-press' | 'pinch' | 'shake';

interface GestureConfig {
  swipeThreshold: number;
  longPressDuration: number;
  doubleTapDelay: number;
  shakeThreshold: number;
}

interface GestureHandler {
  type: GestureType;
  callback: (data?: any) => void;
}

class GestureRecognition {
  private handlers: Map<GestureType, GestureHandler[]> = new Map();
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartTime: number = 0;
  private lastTapTime: number = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private isListening: boolean = false;

  private config: GestureConfig = {
    swipeThreshold: 50,
    longPressDuration: 500,
    doubleTapDelay: 300,
    shakeThreshold: 15,
  };

  constructor(customConfig?: Partial<GestureConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }
  }

  on(type: GestureType, callback: (data?: any) => void) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push({ type, callback });

    // Auto-start listening when first handler is added
    if (!this.isListening) {
      this.startListening();
    }
  }

  off(type: GestureType, callback?: (data?: any) => void) {
    if (!callback) {
      this.handlers.delete(type);
    } else {
      const handlers = this.handlers.get(type);
      if (handlers) {
        this.handlers.set(
          type,
          handlers.filter(h => h.callback !== callback)
        );
      }
    }
  }

  private startListening() {
    if (typeof window === 'undefined' || this.isListening) return;

    this.isListening = true;

    // Touch events
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchmove', this.handleTouchMove);

    // Device motion for shake detection
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleDeviceMotion);
    }
  }

  stopListening() {
    if (typeof window === 'undefined') return;

    this.isListening = false;

    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchmove', this.handleTouchMove);

    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', this.handleDeviceMotion);
    }
  }

  private handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();

    // Long press detection
    this.longPressTimer = setTimeout(() => {
      this.trigger('long-press', { x: this.touchStartX, y: this.touchStartY });
    }, this.config.longPressDuration);
  };

  private handleTouchEnd = (e: TouchEvent) => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    const duration = Date.now() - this.touchStartTime;

    // Swipe detection
    if (Math.abs(deltaX) > this.config.swipeThreshold || Math.abs(deltaY) > this.config.swipeThreshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.trigger('swipe-right', { distance: deltaX, duration });
        } else {
          this.trigger('swipe-left', { distance: Math.abs(deltaX), duration });
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.trigger('swipe-down', { distance: deltaY, duration });
        } else {
          this.trigger('swipe-up', { distance: Math.abs(deltaY), duration });
        }
      }
    }

    // Double tap detection
    const now = Date.now();
    if (now - this.lastTapTime < this.config.doubleTapDelay) {
      this.trigger('double-tap', { x: touch.clientX, y: touch.clientY });
    }
    this.lastTapTime = now;
  };

  private handleTouchMove = (e: TouchEvent) => {
    // Cancel long press if finger moves
    if (this.longPressTimer) {
      const touch = e.touches[0];
      const moved = Math.abs(touch.clientX - this.touchStartX) > 10 || 
                   Math.abs(touch.clientY - this.touchStartY) > 10;
      
      if (moved) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    }
  };

  private handleDeviceMotion = (e: DeviceMotionEvent) => {
    const acc = e.accelerationIncludingGravity;
    if (!acc || !acc.x || !acc.y || !acc.z) return;

    const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    
    if (magnitude > this.config.shakeThreshold) {
      this.trigger('shake', { magnitude });
    }
  };

  private trigger(type: GestureType, data?: any) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler.callback(data));
    }
  }

  destroy() {
    this.stopListening();
    this.handlers.clear();
  }
}

export const gestureRecognition = new GestureRecognition();

// Convenience hook for React components
export function useGestures(gestures: Record<GestureType, (data?: any) => void>) {
  if (typeof window === 'undefined') return;

  const recognition = new GestureRecognition();

  Object.entries(gestures).forEach(([type, callback]) => {
    recognition.on(type as GestureType, callback);
  });

  return () => recognition.destroy();
}
