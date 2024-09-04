import { Schema, model } from 'mongoose';
import { FileImportStatus } from '../types/enums';
import { IFileImport } from 'interfaces/FileImport';

const fileImportSchema = new Schema<IFileImport>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filePath: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(FileImportStatus),
      default: FileImportStatus.Pending,
    },
  },
  {
    timestamps: true,
  }
);

const FileImport = model<IFileImport>('FileImport', fileImportSchema);
export default FileImport;
