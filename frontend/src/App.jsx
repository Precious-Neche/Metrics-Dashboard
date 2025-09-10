import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function MetricsDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await axios.get('http://localhost:8080/metrics', {
          timeout: 5000
        });
        parseMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError(`Backend connection issue: ${error.message}`);
        // Show mock data for demonstration
        setCurrentMetrics({
          cpu: Math.random() * 100,
          memory: 2000 + Math.random() * 3000,
          totalMemory: 8192 // 8GB
        });
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(fetchMetrics, 2000);
    fetchMetrics();

    return () => clearInterval(interval);
  }, []);

  const parseMetrics = (data) => {
    const lines = data.split('\n');
    const newMetrics = {};
    
    lines.forEach(line => {
      // Skip comments and empty lines
      if (line.startsWith('#') || line.trim() === '') return;
      
      // Handle CPU usage (20.3125)
      if (line.startsWith('cpu_usage_percent')) {
        const parts = line.split(' ');
        const value = parts[parts.length - 1]; // Get last part
        newMetrics.cpu = parseFloat(value);
      } 
      // Handle memory usage (7.312945152e+09)
      else if (line.startsWith('memory_usage_bytes')) {
        const parts = line.split(' ');
        const value = parts[parts.length - 1];
        newMetrics.memory = parseFloat(value) / 1024 / 1024 / 1024; // Convert bytes to GB
      }
      // Handle total memory (8.487542784e+09)
      else if (line.startsWith('memory_total_bytes')) {
        const parts = line.split(' ');
        const value = parts[parts.length - 1];
        newMetrics.totalMemory = parseFloat(value) / 1024 / 1024 / 1024; // Convert bytes to GB
      }
    });

    setCurrentMetrics(newMetrics);
    setMetrics(prev => {
      const newData = [...prev.slice(-29), { 
        ...newMetrics, 
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now()
      }];
      return newData;
    });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>🚀 Starting up system monitor...</h2>
        <p>Connecting to backend metrics</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📊 System Metrics Dashboard</h1>
      
      {error && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <h3>⚠️ Demo Mode</h3>
          <p>{error}</p>
          <p>Showing sample data. Make sure backend is running on port 8080.</p>
        </div>
      )}
      
      {/* Current Metrics */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', minWidth: '220px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>🖥️ CPU Usage</h3>
          <h2 style={{ margin: '10px 0', fontSize: '2em' }}>
            {currentMetrics.cpu ? `${currentMetrics.cpu.toFixed(1)}%` : 'N/A'}
          </h2>
          <small>Live processor load</small>
        </div>
        
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: '12px', minWidth: '220px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>💾 Memory Usage</h3>
          <h2 style={{ margin: '10px 0', fontSize: '2em' }}>
            {currentMetrics.memory ? `${currentMetrics.memory.toFixed(1)} GB` : 'N/A'}
          </h2>
          {currentMetrics.totalMemory && (
            <small>Total: {currentMetrics.totalMemory.toFixed(1)} GB</small>
          )}
        </div>
      </div>

      {/* Live Chart */}
      {metrics.length > 0 ? (
        <div style={{ height: '400px', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>📈 Live Performance</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  background: '#333', 
                  border: 'none', 
                  borderRadius: '6px',
                  color: 'white'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#667eea" 
                name="CPU %" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, fill: '#667eea' }}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#38ef7d" 
                name="Memory GB" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, fill: '#38ef7d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '12px' }}>
          <h3>⏳ Waiting for data...</h3>
          <p>Metrics will appear here shortly</p>
        </div>
      )}

      {/* Debug Info */}
      <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px', marginTop: '20px' }}>
        <h4>🔍 System Info</h4>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <strong>Status:</strong> {error ? '❌ Demo Mode' : '✅ Connected'}
          </div>
          <div>
            <strong>Data Points:</strong> {metrics.length}
          </div>
          <div>
            <strong>Last Update:</strong> {new Date().toLocaleTimeString()}
          </div>
          <div>
            <strong>Backend:</strong> 
            <a href="http://localhost:8080/metrics" target="_blank" style={{ marginLeft: '8px', color: '#1976d2' }}>
              View Raw Metrics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsDashboard;