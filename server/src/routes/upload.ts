import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File';
import ScannerWorker from '../workers/scannerWorker';
import { broadcastLog } from './logs';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

// Initialize scanner worker
const scannerWorker = new ScannerWorker();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file for scanning
 *     description: Upload a file (PDF, DOCX, JPG, PNG) for security scanning
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: File to upload (max 5MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 fileId:
 *                   type: string
 *                   description: ID of the uploaded file
 *       400:
 *         description: No file uploaded or invalid file type
 *       500:
 *         description: Server error
 */
// POST /upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create file record in database
    const fileRecord = new File({
      filename: req.file.originalname,
      path: req.file.path,
      status: 'pending',
      uploadedAt: new Date()
    });

    await fileRecord.save();

    const uploadMessage = `File uploaded: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`;
    console.log(uploadMessage);
    broadcastLog(uploadMessage, 'success');

    // Add scan job to queue
    scannerWorker.addJob({
      fileId: fileRecord._id?.toString() || '',
      filePath: req.file.path
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileId: fileRecord._id
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

export default router; 