// backend/src/services/domainServices.ts
import { Job, JobRun, JobRunStatus } from "../models/domain";

// Input type for creating a job
export interface CreateJobInput {
  name: string;
  description?: string;
  type?: string;
}

// Input type for updating a job
export interface UpdateJobInput {
  name?: string;
  description?: string;
  type?: string;
  archived?: boolean;
}

// Input type for creating a job run
export interface CreateJobRunInput {
  jobId: number;
  // optional metadata config at creation time
  metadata?: Record<string, unknown>;
}

export interface JobService {
  /**
   * Create a new job.
   */
  createJob(input: CreateJobInput): Promise<Job>;

  /**
   * Return all jobs. Later we can add filters/pagination.
   */
  listJobs(): Promise<Job[]>;

  /**
   * Get a single job by ID.
   * Returns null if not found.
   */
  getJobById(id: number): Promise<Job | null>;

  /**
   * Update an existing job with partial fields.
   * Returns the updated job, or null if not found.
   */
  updateJob(id: number, updates: UpdateJobInput): Promise<Job | null>;

  /**
   * Archive a job (soft delete).
   */
  archiveJob(id: number): Promise<Job | null>;
}
export interface JobRunService {
  /**
   * Create a new run for a given job.
   * Typically starts as PENDING or RUNNING depending on design.
   */
  createRun(input: CreateJobRunInput): Promise<JobRun>;

  /**
   * Update the status and timing fields of a run.
   * This is where we will enforce valid status transitions later.
   */
  updateRunStatus(
    runId: number,
    newStatus: JobRunStatus,
    options?: {
      errorMessage?: string;
      // when the status change happened; defaults to "now"
      timestamp?: Date;
    },
  ): Promise<JobRun | null>;

  /**
   * Get all runs for a specific job.
   */
  getRunsForJob(jobId: number): Promise<JobRun[]>;

  /**
   * Get a single run by its ID.
   */
  getRunById(runId: number): Promise<JobRun | null>;
}
