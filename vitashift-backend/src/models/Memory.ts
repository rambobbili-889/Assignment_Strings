import mongoose, { Schema, Document, Model } from 'mongoose';

export interface MediaItem {
  url: string;
  s3Key?: string;
  thumbUrl?: string;
}

export interface MemoryDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  media: MediaItem[];
  date: Date;
  tags: string[];
  mood?: number;
  visibility: 'private' | 'public';
  createdAt: Date;
  deletedAt?: Date | null;
}

interface MemoryModel extends Model<MemoryDocument> {}

const MemorySchema = new Schema<MemoryDocument, MemoryModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  media: [{
    url: { type: String, required: true },
    s3Key: { type: String },
    thumbUrl: { type: String },
  }],
  date: { type: Date, required: true },
  tags: [{ type: String }],
  mood: { type: Number, min: 0, max: 10 },
  visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

export const Memory = mongoose.model<MemoryDocument, MemoryModel>('Memory', MemorySchema);