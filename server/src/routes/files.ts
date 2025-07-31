import express from 'express';
import File from '../models/File';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: File ID
 *         filename:
 *           type: string
 *           description: Original filename
 *         path:
 *           type: string
 *           description: File path on server
 *         status:
 *           type: string
 *           enum: [pending, scanning, clean, infected]
 *           description: Current scan status
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: Upload timestamp
 *         scannedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Scan completion timestamp
 *         result:
 *           type: string
 *           enum: [clean, infected, null]
 *           nullable: true
 *           description: Scan result
 * 
 * /files:
 *   get:
 *     summary: Get all scanned files
 *     description: Retrieve all files with their scan status and results
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/File'
 *       500:
 *         description: Server error
 */
// GET /files
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    
    res.json({
      files: files.map(file => ({
        _id: file._id,
        filename: file.filename,
        path: file.path,
        status: file.status,
        uploadedAt: file.uploadedAt,
        scannedAt: file.scannedAt,
        result: file.result
      }))
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files'
    });
  }
});

export default router; 