// backend/src/repositories/inMemoryRepositories.ts

import { Job, JobRun, JobRunStatus } from "../models/domain";

export interface JobRepository {
  create(input: { name: string; description?: string; type?: string }): Promise<Job>;
  list(options?: { includeArchived?: boolean }): Promise<Job[]>;
  getById(id: number): Promise<Job | null>;
  update(
    id: number,
    updates: { name?: string; description?: string; type?: string; archived?: boolean },
  ): Promise<Job | null>;
  archive(id: number): Promise<Job | null>;
}

export interface JobRunRepository {
  create(input: { jobId: number; status?: JobRunStatus; metadata?: Record<string, unknown> }): Promise<JobRun>;
  listByJobId(jobId: number): Promise<JobRun[]>;
  getById(id: number): Promise<JobRun | null>;
  update(
    id: number,
    updates: {
      status?: JobRunStatus;
      startedAt?: Date;
      finishedAt?: Date;
      cancelledAt?: Date;
      errorMessage?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<JobRun | null>;
}

export class InMemoryJobRepository implements JobRepository {
  private jobsById: Map<number, Job> = new Map();
  private nextJobId: number = 1;

  async create(input: { name: string; description?: string; type?: string }): Promise<Job> {
    const now = new Date();

    const job: Job = {
      id: this.nextJobId,
      name: input.name,
      description: input.description,
      type: input.type,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    this.jobsById.set(this.nextJobId, job);
    this.nextJobId += 1;

    return job;
  }

  async list(options?: { includeArchived?: boolean }): Promise<Job[]> {
    const includeArchived = options?.includeArchived ?? false;

    const allJobs = Array.from(this.jobsById.values());
    if (includeArchived) {
      return allJobs;
    }

    return allJobs.filter((job) => !job.archived);
  }

  async getById(id: number): Promise<Job | null> {
    return this.jobsById.get(id) ?? null;
  }

  async update(
    id: number,
    updates: { name?: string; description?: string; type?: string; archived?: boolean },
  ): Promise<Job | null> {
    const existingJob = this.jobsById.get(id);
    if (!existingJob) {
      return null;
    }

    const updatedJob: Job = {
      ...existingJob,
      ...updates,
      updatedAt: new Date(),
    };

    this.jobsById.set(id, updatedJob);
    return updatedJob;
  }

  async archive(id: number): Promise<Job | null> {
    return this.update(id, { archived: true });
  }
}

export class InMemoryJobRunRepository implements JobRunRepository {
  private runsById: Map<number, JobRun> = new Map();
  private nextRunId: number = 1;

  async create(input: {
    jobId: number;
    status?: JobRunStatus;
    metadata?: Record<string, unknown>;
  }): Promise<JobRun> {
    const run: JobRun = {
      id: this.nextRunId,
      jobId: input.jobId,
      status: input.status ?? JobRunStatus.PENDING,
      metadata: input.metadata,
    };

    this.runsById.set(this.nextRunId, run);
    this.nextRunId += 1;

    return run;
  }

  async listByJobId(jobId: number): Promise<JobRun[]> {
    return Array.from(this.runsById.values()).filter((run) => run.jobId === jobId);
  }

  async getById(id: number): Promise<JobRun | null> {
    return this.runsById.get(id) ?? null;
  }

  async update(
    id: number,
    updates: {
      status?: JobRunStatus;
      startedAt?: Date;
      finishedAt?: Date;
      cancelledAt?: Date;
      errorMessage?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<JobRun | null> {
    const existingRun = this.runsById.get(id);
    if (!existingRun) {
      return null;
    }

    const updatedRun: JobRun = {
      ...existingRun,
      ...updates,
    };

    this.runsById.set(id, updatedRun);
    return updatedRun;
  }
}
