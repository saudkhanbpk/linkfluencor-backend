import { Schema, Document } from 'mongoose';
import { FileImportStatus } from '../types/enums';

export interface IFileImport extends Document {
  user: Schema.Types.ObjectId;
  filePath: string;
  status: FileImportStatus;
  createdAt: Date;
  updatedAt: Date;
}
