import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  privacyMode: 'private' | 'public';
  premium: boolean;
  createdAt: Date;
  lastLogin?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {}

const UserSchema = new Schema<UserDocument, UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  privacyMode: { type: String, enum: ['private', 'public'], default: 'private' },
  premium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);