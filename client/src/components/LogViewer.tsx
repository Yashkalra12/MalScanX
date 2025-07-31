import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    // Simulate WebSocket connection for real-time logs
    const eventSource = new EventSource('http://localhost:3001/logs/stream');
    
    eventSource.onopen = () => {
      setIsConnected(true);
      addLog('Connected to server logs', 'success');
    };

    eventSource.onmessage = (event) => {
      try {
        const logData = JSON.parse(event.data);
        if (logData.message !== 'ping') { // Skip ping messages
          addLog(logData.message, logData.type || 'info');
        }
      } catch (error) {
        addLog('Error parsing log data', 'error');
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      addLog('Disconnected from server logs', 'error');
      
      // Add some demo logs when server is not available
      setTimeout(() => {
        addLog('Server not running - showing demo logs', 'warning');
        addLog('Job added to queue: demo-file-123', 'info');
        addLog('Processing job: demo-file-123', 'info');
        addLog('Found malicious keyword: rm -rf', 'warning');
        addLog('Scan completed for demo-file-123: INFECTED', 'error');
        addLog('Webhook triggered for infected file: demo-file-123', 'warning');
      }, 1000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100 logs
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-gray-300';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`mb-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
          isConnected 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-medium">
            {isVisible ? 'Hide' : 'Show'} Logs
          </span>
        </div>
      </button>

      {/* Log Viewer */}
      {isVisible && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-96 h-64 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 px-4 py-2 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-300 text-sm font-medium">Backend Logs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <button
                onClick={clearLogs}
                className="text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Log Content */}
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Waiting for logs...
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2">
                    <span className="text-gray-500 text-xs min-w-[60px]">
                      {log.timestamp}
                    </span>
                    <span className={`${getLogColor(log.type)} flex-1`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-4 py-2 rounded-b-lg text-xs text-gray-400">
            {logs.length} logs • {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogViewer; 