import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Milestone {
  id: string;
  title: string;
  date: Date;
  desc?: string;
  category?: string;
  order?: number;
}

export interface TimelineDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineModel extends Model<TimelineDocument> {}

const MilestoneSchema = new Schema<Milestone>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  desc: { type: String },
  category: { type: String },
  order: { type: Number },
}, { _id: false });

const TimelineSchema = new Schema<TimelineDocument, TimelineModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true },
  milestones: { type: [MilestoneSchema], default: [] },
}, { timestamps: true });

export const Timeline = mongoose.model<TimelineDocument, TimelineModel>('Timeline', TimelineSchema);