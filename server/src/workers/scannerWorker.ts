import fs from 'fs';
import path from 'path';
import File from '../models/File';
import { broadcastLog } from '../routes/logs';

interface ScanJob {
  fileId: string;
  filePath: string;
}

class ScannerWorker {
  private jobQueue: ScanJob[] = [];
  private isProcessing = false;

  // Keywords to check for malicious content
  private maliciousKeywords = [
    'rm -rf',
    'eval(',
    'bitcoin',
    'crypto',
    'malware',
    'virus',
    'trojan',
    'backdoor',
    'keylogger',
    'rootkit'
  ];

  constructor() {
    this.startProcessing();
  }

  addJob(job: ScanJob): void {
    this.jobQueue.push(job);
    const message = `Job added to queue: ${job.fileId}`;
    console.log(message);
    broadcastLog(message, 'info');
  }

  private async startProcessing(): Promise<void> {
    while (true) {
      if (this.jobQueue.length > 0 && !this.isProcessing) {
        await this.processNextJob();
      }
      await this.sleep(1000); // Check every second
    }
  }

  private async processNextJob(): Promise<void> {
    if (this.jobQueue.length === 0) return;

    this.isProcessing = true;
    const job = this.jobQueue.shift()!;

    try {
      const processingMessage = `Processing job: ${job.fileId}`;
      console.log(processingMessage);
      broadcastLog(processingMessage, 'info');
      
      // Update status to scanning
      await File.findByIdAndUpdate(job.fileId, {
        status: 'scanning'
      });

      // Simulate scanning time (2-5 seconds)
      const scanTime = Math.random() * 3000 + 2000; // 2-5 seconds
      await this.sleep(scanTime);

      // Check file content for malicious keywords
      const isInfected = await this.scanFile(job.filePath);

      // Update file status and result
      await File.findByIdAndUpdate(job.fileId, {
        status: isInfected ? 'infected' : 'clean',
        result: isInfected ? 'infected' : 'clean',
        scannedAt: new Date()
      });

      const resultMessage = `Scan completed for ${job.fileId}: ${isInfected ? 'INFECTED' : 'CLEAN'}`;
      console.log(resultMessage);
      broadcastLog(resultMessage, isInfected ? 'error' : 'success');

      // Optional: Trigger webhook if infected
      if (isInfected) {
        await this.triggerInfectedWebhook(job.fileId);
      }

    } catch (error) {
      const errorMessage = `Error processing job ${job.fileId}: ${error}`;
      console.error(errorMessage);
      broadcastLog(errorMessage, 'error');
      
      // Update status to indicate error
      await File.findByIdAndUpdate(job.fileId, {
        status: 'infected',
        result: 'infected',
        scannedAt: new Date()
      });
    } finally {
      this.isProcessing = false;
    }
  }

  private async scanFile(filePath: string): Promise<boolean> {
    try {
      // Read file content
      const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
      return this.scanContent(content, filePath);
    } catch (error) {
      console.error('Error scanning file:', error);
      return false;
    }
  }

  public async scanContent(content: string, filename: string): Promise<boolean> {
    try {
      const lowerContent = content.toLowerCase();
      
      // Check for malicious keywords
      for (const keyword of this.maliciousKeywords) {
        if (lowerContent.includes(keyword.toLowerCase())) {
          const keywordMessage = `Found malicious keyword: ${keyword}`;
          console.log(keywordMessage);
          broadcastLog(keywordMessage, 'warning');
          return true;
        }
      }

      // Additional checks for specific file types
      const ext = path.extname(filename).toLowerCase();
      
      if (ext === '.pdf') {
        // For PDFs, we could add more sophisticated checks
        // For now, just check for keywords in text content
        return false;
      } else if (ext === '.docx') {
        // For DOCX files, check for embedded scripts or macros
        // This is a simplified check
        return false;
      } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // For images, check for embedded data or steganography
        // This is a simplified check
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error scanning content:', error);
      return false;
    }
  }

  private async triggerInfectedWebhook(fileId: string): Promise<void> {
    try {
      // In a real application, you would send a webhook to notify about infected files
      const webhookMessage = `Webhook triggered for infected file: ${fileId}`;
      console.log(webhookMessage);
      broadcastLog(webhookMessage, 'warning');
      
      // Example webhook implementation:
      // await axios.post(process.env.WEBHOOK_URL, {
      //   fileId,
      //   status: 'infected',
      //   timestamp: new Date().toISOString()
      // });
    } catch (error) {
      const errorMessage = `Error triggering webhook: ${error}`;
      console.error(errorMessage);
      broadcastLog(errorMessage, 'error');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getQueueLength(): number {
    return this.jobQueue.length;
  }

  isWorkerBusy(): boolean {
    return this.isProcessing;
  }
}

export default ScannerWorker; 