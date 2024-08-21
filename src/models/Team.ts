import { Schema, model, Document } from 'mongoose';
import { TeamMemberRole } from '../types/enums';

export interface ITeam extends Document {
  name: string;
  isPersonal: boolean;
  mainUser: Schema.Types.ObjectId;
  members: Array<{ user: Schema.Types.ObjectId; role: TeamMemberRole }>;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    isPersonal: { type: Boolean, default: true },
    mainUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: Object.values(TeamMemberRole),
          default: TeamMemberRole.Editor,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = model<ITeam>('Team', teamSchema);
export default Team;
