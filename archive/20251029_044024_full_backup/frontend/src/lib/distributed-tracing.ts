
interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  status: 'success' | 'error';
  attributes: Record<string, any>;
}

class DistributedTracing {
  private spans: Map<string, TraceSpan> = new Map();

  generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  startSpan(name: string, parentSpanId?: string): string {
    const spanId = this.generateId();
    const traceId = parentSpanId 
      ? this.spans.get(parentSpanId)?.traceId || this.generateId()
      : this.generateId();

    this.spans.set(spanId, {
      traceId,
      spanId,
      parentSpanId,
      name,
      startTime: Date.now(),
      status: 'success',
      attributes: {},
    });

    return spanId;
  }

  endSpan(spanId: string, status: 'success' | 'error' = 'success', attributes: Record<string, any> = {}) {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.endTime = Date.now();
    span.status = status;
    span.attributes = { ...span.attributes, ...attributes };

    // Log span for debugging
    const duration = span.endTime - span.startTime;
    console.log(`[Trace] ${span.name}: ${duration}ms [${status}]`, span.attributes);

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(span);
    }
  }

  private sendToAnalytics(span: TraceSpan) {
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon('/api/analytics', JSON.stringify({
        type: 'trace',
        span,
      }));
    }
  }

  getAttribute(spanId: string, key: string): any {
    return this.spans.get(spanId)?.attributes[key];
  }

  setAttribute(spanId: string, key: string, value: any) {
    const span = this.spans.get(spanId);
    if (span) {
      span.attributes[key] = value;
    }
  }
}

export const tracer = new DistributedTracing();
