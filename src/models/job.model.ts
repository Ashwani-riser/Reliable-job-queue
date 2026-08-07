import { Schema, model, Document } from "mongoose";

export enum JobStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  DLQ = "DLQ",
}

export interface IJob extends Document {
  name: string;
  email: string;
  queueJobId?: string;
  status: JobStatus;
  attempts: number;
  error?: string | null;
}

const jobSchema = new Schema<IJob>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    queueJobId: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.QUEUED,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Job = model<IJob>("Job", jobSchema);

export default Job;