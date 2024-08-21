import { Schema, model, Document } from 'mongoose';

export interface IFileImport extends Document {
  user: Schema.Types.ObjectId;
  filePath: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const fileImportSchema = new Schema<IFileImport>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
}, {
  timestamps: true,
});

const FileImport = model<IFileImport>('FileImport', fileImportSchema);
export default FileImport;
