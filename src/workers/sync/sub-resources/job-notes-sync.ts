import { Pool } from 'pg';
import { config } from '../../../config/index.js';
import { createLogger } from '../../../utils/logger.js';
import { getSTClient } from '../../../servicetitan/client.js';

const logger = createLogger({ module: 'job-notes-sync' });

export class JobNotesSync {
  private db: Pool;
  private stClient: ReturnType<typeof getSTClient>;

  constructor() {
    this.db = new Pool({ connectionString: config.database.url });
    this.stClient = getSTClient();
  }

  async sync(fullSync: boolean = false) {
    const batchId = crypto.randomUUID();
    logger.info({ batchId, fullSync }, 'Starting job notes sync');

    // Get jobs to sync (recent jobs or all)
    const jobsResult = await this.db.query(`
      SELECT id FROM master.jobs 
      ${fullSync ? '' : 'WHERE synced_at > NOW() - INTERVAL \'1 day\''}
      ORDER BY id
      LIMIT 1000
    `);

    const jobIds = jobsResult.rows.map(r => r.id);
    logger.info({ count: jobIds.length }, 'Syncing notes for jobs');

    let totalFetched = 0;
    let totalProcessed = 0;

    for (const jobId of jobIds) {
      try {
        const notes = await this.fetchNotesForJob(jobId);
        
        if (notes.length > 0) {
          // Insert to raw
          for (const note of notes) {
            await this.db.query(`
              INSERT INTO raw.st_job_notes (job_id, payload, batch_id)
              VALUES ($1, $2, $3)
            `, [jobId, JSON.stringify(note), batchId]);
          }

          // Upsert to master
          for (const note of notes) {
            await this.db.query(`
              INSERT INTO master.job_notes (id, job_id, text, created_by_id, created_on, pinned, synced_at)
              VALUES ($1, $2, $3, $4, $5, $6, NOW())
              ON CONFLICT (id) DO UPDATE SET
                text = EXCLUDED.text,
                pinned = EXCLUDED.pinned,
                synced_at = NOW()
            `, [
              note.id,
              jobId,
              note.text,
              note.createdById,
              note.createdOn,
              note.pinned ?? false,
            ]);
          }

          totalFetched += notes.length;
          totalProcessed += notes.length;
        }
      } catch (error: any) {
        logger.warn({ jobId, error: error.message }, 'Failed to sync notes for job');
      }
    }

    logger.info({ totalFetched, totalProcessed }, 'Job notes sync complete');
    return { fetched: totalFetched, processed: totalProcessed };
  }

  private async fetchNotesForJob(jobId: number): Promise<any[]> {
    const { apiBaseUrl, tenantId } = config.serviceTitan;
    const url = `${apiBaseUrl}/jpm/v2/tenant/${tenantId}/jobs/${jobId}/notes`;

    try {
      const response = await this.stClient.get<{ data?: any[] } | any[]>(url);
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return responseData;
      }
      return responseData?.data || [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async close() {
    await this.db.end();
  }
}
