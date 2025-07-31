# Real-Time Log Viewer

## 🎯 **Feature Overview**

The MalScanX application now includes a **real-time log viewer** that displays backend logs directly in the frontend UI. This provides live visibility into:

- File upload events
- Scan job processing
- Malicious keyword detection
- Server status and errors
- Webhook notifications

## 📍 **Location**

The log viewer appears as a **floating button** in the **bottom-right corner** of the application.

## 🎨 **UI Features**

### **Toggle Button**
- **Green**: Connected to server logs
- **Red**: Disconnected from server logs
- Click to show/hide the log viewer

### **Terminal-like Interface**
- **Dark theme** with terminal aesthetics
- **Color-coded logs**:
  - 🟢 **Green**: Success messages
  - 🔴 **Red**: Error messages  
  - 🟡 **Yellow**: Warning messages
  - ⚪ **Gray**: Info messages
- **Timestamp** for each log entry
- **Auto-scroll** to latest logs
- **Clear button** to reset logs

## 🔧 **Technical Implementation**

### **Frontend (React)**
- **Server-Sent Events (SSE)** for real-time streaming
- **EventSource** API for connection management
- **Fallback demo logs** when server is offline
- **Auto-reconnection** handling

### **Backend (Node.js)**
- **SSE endpoint**: `/logs/stream`
- **Broadcast function** for sending logs to all connected clients
- **Log integration** in scanner worker and upload routes
- **Connection management** with client tracking

## 📊 **Log Types**

| Type | Color | Description |
|------|-------|-------------|
| `info` | Gray | General information |
| `success` | Green | Successful operations |
| `warning` | Yellow | Warnings and alerts |
| `error` | Red | Errors and failures |

## 🚀 **Usage**

1. **Start the application**:
   ```bash
   ./start-dev.sh
   ```

2. **Access the frontend**: http://localhost:5173

3. **Click the log button** in bottom-right corner

4. **Watch real-time logs** as you:
   - Upload files
   - Monitor scan progress
   - View scan results

## 🔍 **Example Logs**

```
[14:30:15] 🚀 Server running on port 3001
[14:30:15] 📖 API Documentation: http://localhost:3001/api-docs
[14:30:16] MongoDB connected successfully
[14:30:20] File uploaded: document.pdf (2.45MB)
[14:30:20] Job added to queue: 688b90cc0e04e4446e3a0b5c
[14:30:22] Processing job: 688b90cc0e04e4446e3a0b5c
[14:30:25] Found malicious keyword: rm -rf
[14:30:25] Scan completed for 688b90cc0e04e4446e3a0b5c: INFECTED
[14:30:25] Webhook triggered for infected file: 688b90cc0e04e4446e3a0b5c
```

## 🛠 **Development**

### **Adding New Log Sources**

1. **Import the broadcast function**:
   ```typescript
   import { broadcastLog } from '../routes/logs';
   ```

2. **Send logs**:
   ```typescript
   broadcastLog('Your message here', 'info');
   ```

3. **Available types**: `'info'`, `'success'`, `'warning'`, `'error'`

### **Customizing the UI**

The log viewer component is located at:
```
client/src/components/LogViewer.tsx
```

You can customize:
- **Position**: Change `fixed bottom-4 right-4`
- **Size**: Modify `w-96 h-64`
- **Colors**: Update the color classes
- **Behavior**: Adjust auto-scroll and connection logic

## 🔗 **API Endpoints**

- **SSE Stream**: `GET /logs/stream`
- **Health Check**: `GET /health`
- **Upload**: `POST /upload`
- **Files**: `GET /files`

## 🎯 **Benefits**

✅ **Real-time monitoring** of backend operations  
✅ **Debugging assistance** for development  
✅ **User feedback** on scan progress  
✅ **Production monitoring** capabilities  
✅ **Non-intrusive** UI that doesn't affect main functionality  

The log viewer enhances the development experience and provides valuable insights into the application's behavior! 🎉 