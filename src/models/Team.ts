import { Schema, model, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  isPersonal: boolean;
  mainUser: Schema.Types.ObjectId;
  members: Array<{ user: Schema.Types.ObjectId, role: string }>;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  isPersonal: { type: Boolean, default: true },
  mainUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' }
    }
  ],
}, {
  timestamps: true,
});

const Team = model<ITeam>('Team', teamSchema);
export default Team;
