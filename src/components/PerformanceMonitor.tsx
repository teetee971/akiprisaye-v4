import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

function sendToAnalytics(metric: Metric) {
  // En production, envoyer à votre service d'analytics
  if (import.meta.env.DEV) {
    console.log('📊 Web Vital:', metric);
  }
  
  // Exemple:  envoyer à Google Analytics
  // gtag('event', metric.name, {
  //   value: Math.round(metric.value),
  //   metric_rating: metric.rating,
  // });
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Core Web Vitals (v4)
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Remplace FID depuis web-vitals v3
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null; // Component invisible
}
