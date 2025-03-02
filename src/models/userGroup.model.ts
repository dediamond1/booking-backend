import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserGroup extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  permissions: any;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
  defaultRoles?: string[];
  groupType?: string;
}

const userGroupSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  permissions: {
    type: Schema.Types.Mixed,
    default: {},
  },
  userCount: {
    type: Number,
    default: 0,
  },
  defaultRoles: [{
    type: String,
  }],
  groupType: {
    type: String,
  },
}, {
  timestamps: true,
});

const UserGroup: Model<IUserGroup> = mongoose.model<IUserGroup>('UserGroup', userGroupSchema);

export default UserGroup;