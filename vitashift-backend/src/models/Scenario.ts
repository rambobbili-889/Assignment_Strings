import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ScenarioResultMetrics {
  wealth?: number;
  happiness?: number;
  risk?: number;
  [key: string]: number | undefined;
}

export interface ScenarioResultTimelineItem {
  year: number;
  event: string;
}

export interface ScenarioDocument extends Document {
  userId: mongoose.Types.ObjectId;
  decision_type: string;
  input_scenario: string;
  variables: Record<string, number | string | boolean>;
  status: 'queued' | 'processing' | 'done' | 'failed';
  result?: {
    outcome_timeline: ScenarioResultTimelineItem[];
    metrics: ScenarioResultMetrics;
  };
  createdAt: Date;
  processedAt?: Date;
}

interface ScenarioModel extends Model<ScenarioDocument> {}

const ScenarioSchema = new Schema<ScenarioDocument, ScenarioModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  decision_type: { type: String, required: true },
  input_scenario: { type: String, required: true },
  variables: { type: Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['queued', 'processing', 'done', 'failed'], default: 'queued' },
  result: {
    outcome_timeline: [{ year: Number, event: String }],
    metrics: { type: Schema.Types.Mixed, default: {} },
  },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

export const Scenario = mongoose.model<ScenarioDocument, ScenarioModel>('Scenario', ScenarioSchema);