'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { usePerformance, useMemoryOptimization, useNetworkOptimization } from '@/hooks/use-performance';
import { bundleAnalyzer } from '@/lib/bundle-analyzer';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bundleReport, setBundleReport] = useState<any>(null);

  const { 
    metrics: performanceMetrics, 
    isOptimized, 
    bundleSize, 
    suggestions,
    refresh: refreshPerformance 
  } = usePerformance();

  const {
    memoryUsage,
    memoryUsageMB,
    isMemoryOptimized,
    measureMemoryUsage
  } = useMemoryOptimization();

  const {
    connectionType,
    isSlowConnection,
    saveData,
    optimizationStrategy
  } = useNetworkOptimization();

  // Convert performance metrics to display format
  const formatMetrics = useCallback(() => {
    const formattedMetrics: PerformanceMetric[] = [];

    // Largest Contentful Paint
    if (performanceMetrics.lcp) {
      formattedMetrics.push({
        name: 'LCP',
        value: performanceMetrics.lcp,
        unit: 'ms',
        threshold: 2500,
        status: performanceMetrics.lcp <= 2500 ? 'good' : performanceMetrics.lcp <= 4000 ? 'needs-improvement' : 'poor',
        description: 'Largest Contentful Paint - tiempo hasta el contenido principal'
      });
    }

    // First Input Delay
    if (performanceMetrics.fid !== undefined) {
      formattedMetrics.push({
        name: 'FID',
        value: performanceMetrics.fid,
        unit: 'ms',
        threshold: 100,
        status: performanceMetrics.fid <= 100 ? 'good' : performanceMetrics.fid <= 300 ? 'needs-improvement' : 'poor',
        description: 'First Input Delay - tiempo de respuesta a la primera interacción'
      });
    }

    // Cumulative Layout Shift
    if (performanceMetrics.cls !== undefined) {
      formattedMetrics.push({
        name: 'CLS',
        value: performanceMetrics.cls,
        unit: '',
        threshold: 0.1,
        status: performanceMetrics.cls <= 0.1 ? 'good' : performanceMetrics.cls <= 0.25 ? 'needs-improvement' : 'poor',
        description: 'Cumulative Layout Shift - estabilidad visual de la página'
      });
    }

    // Time to First Byte
    if (performanceMetrics.ttfb) {
      formattedMetrics.push({
        name: 'TTFB',
        value: performanceMetrics.ttfb,
        unit: 'ms',
        threshold: 600,
        status: performanceMetrics.ttfb <= 600 ? 'good' : performanceMetrics.ttfb <= 1500 ? 'needs-improvement' : 'poor',
        description: 'Time to First Byte - tiempo de respuesta del servidor'
      });
    }

    // Bundle Size
    if (bundleSize) {
      const bundleSizeKB = bundleSize / 1024;
      formattedMetrics.push({
        name: 'Bundle',
        value: bundleSizeKB,
        unit: 'KB',
        threshold: 500,
        status: bundleSizeKB <= 500 ? 'good' : bundleSizeKB <= 1000 ? 'needs-improvement' : 'poor',
        description: 'Tamaño del bundle JavaScript'
      });
    }

    // Memory Usage
    if (memoryUsageMB) {
      formattedMetrics.push({
        name: 'Memory',
        value: memoryUsageMB,
        unit: 'MB',
        threshold: 50,
        status: memoryUsageMB <= 50 ? 'good' : memoryUsageMB <= 100 ? 'needs-improvement' : 'poor',
        description: 'Uso de memoria JavaScript'
      });
    }

    setMetrics(formattedMetrics);
  }, [performanceMetrics, bundleSize, memoryUsageMB]);

  // Refresh all metrics
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // Refresh performance metrics
      refreshPerformance();
      measureMemoryUsage();
      
      // Generate bundle report
      const report = await bundleAnalyzer.generateReport();
      setBundleReport(report);
      
      // Update formatted metrics
      setTimeout(() => {
        formatMetrics();
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to refresh performance metrics:', error);
      setIsRefreshing(false);
    }
  }, [refreshPerformance, measureMemoryUsage, formatMetrics]);

  // Initialize metrics on mount
  useEffect(() => {
    formatMetrics();
    handleRefresh();
  }, [formatMetrics, handleRefresh]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'needs-improvement': return <AlertTriangle className="h-4 w-4" />;
      case 'poor': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Calculate overall score
  const calculateOverallScore = () => {
    if (metrics.length === 0) return 0;
    
    const scores = metrics.map(metric => {
      switch (metric.status) {
        case 'good': return 100;
        case 'needs-improvement': return 60;
        case 'poor': return 20;
        default: return 0;
      }
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const overallScore = calculateOverallScore();

  if (!isVisible && process.env.NODE_ENV !== 'development') {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-2" />
        Performance
      </Button>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Overall Score */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Puntuación General</span>
                <span className="text-2xl font-bold">{overallScore}</span>
              </div>
              <Progress value={overallScore} className="h-2" />
            </div>
            {isOptimized ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Core Web Vitals */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Core Web Vitals
            </h4>
            <div className="space-y-2">
              {metrics.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    <div>
                      <div className="font-medium">{metric.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {metric.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      {metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}{metric.unit}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(metric.status)}`}
                    >
                      {metric.status === 'good' ? 'Bueno' : 
                       metric.status === 'needs-improvement' ? 'Mejorar' : 'Malo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Red y Conexión
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tipo de conexión:</span>
                <Badge variant="outline">{connectionType}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Conexión lenta:</span>
                <Badge variant={isSlowConnection ? "destructive" : "default"}>
                  {isSlowConnection ? 'Sí' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Ahorro de datos:</span>
                <Badge variant={saveData ? "secondary" : "outline"}>
                  {saveData ? 'Activado' : 'Desactivado'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Estrategia:</span>
                <Badge variant="outline">{optimizationStrategy}</Badge>
              </div>
            </div>
          </div>

          {/* Bundle Information */}
          {bundleReport && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Bundle Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tamaño total:</span>
                  <span className="font-mono">
                    {(bundleReport.metrics.bundleSize / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo de carga:</span>
                  <span className="font-mono">
                    {bundleReport.metrics.loadTime.toFixed(2)} ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uso de memoria:</span>
                  <span className="font-mono">
                    {(bundleReport.metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Requests de red:</span>
                  <span className="font-mono">{bundleReport.metrics.networkRequests}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recomendaciones
              </h4>
              <div className="space-y-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="text-xs p-2 bg-blue-50 border border-blue-200 rounded text-blue-800">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              PageSpeed
            </Button>
            <Button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg) {
                      reg.update();
                    }
                  });
                }
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update SW
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Lightweight performance indicator for production
export function PerformanceIndicator() {
  const { isOptimized } = usePerformance();
  const [showDetails, setShowDetails] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <div 
        className="fixed top-4 right-4 z-50 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className={`w-3 h-3 rounded-full ${isOptimized ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
      </div>
      
      {showDetails && <PerformanceMonitor />}
    </>
  );
}