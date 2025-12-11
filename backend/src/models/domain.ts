// enum for JobRunStatus 
export enum JobRunStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// interface for Job
export interface Job {
  id: number;
  name: string;
  description?: string;
  type?: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// interface for JobRun
export interface JobRun {
  id: number;
  jobId: number;
  status: JobRunStatus;
  startedAt?: Date;
  finishedAt?: Date;
  errorMessage?: string;
  cancelledAt?: Date;
  metadata?: Record<string, unknown>; // flexible JSON container
}

