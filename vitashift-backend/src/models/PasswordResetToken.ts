import mongoose, { Schema, Document, Model } from 'mongoose';

export interface PasswordResetTokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

interface PasswordResetTokenModel extends Model<PasswordResetTokenDocument> {}

const PasswordResetTokenSchema = new Schema<PasswordResetTokenDocument, PasswordResetTokenModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const PasswordResetToken = mongoose.model<PasswordResetTokenDocument, PasswordResetTokenModel>('PasswordResetToken', PasswordResetTokenSchema);