import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  path: string;
  status: 'pending' | 'scanning' | 'clean' | 'infected';
  uploadedAt: Date;
  scannedAt: Date | null;
  result: 'clean' | 'infected' | null;
}

const FileSchema: Schema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'scanning', 'clean', 'infected'],
    default: 'pending',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  scannedAt: {
    type: Date,
    default: null,
  },
  result: {
    type: String,
    enum: ['clean', 'infected', null],
    default: null,
  },
});

export default mongoose.model<IFile>('File', FileSchema); 