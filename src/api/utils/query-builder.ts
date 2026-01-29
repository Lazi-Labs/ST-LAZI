import { Pool } from 'pg';

export interface ListParams {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  active_only?: boolean;
  updated_after?: string;
  search?: string;
  [key: string]: any;
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
    last_sync?: string;
  };
}

export class QueryBuilder {
  constructor(private db: Pool) {}

  async list<T>(
    table: string,
    params: ListParams,
    options: {
      searchFields?: string[];
      filterFields?: string[];
      defaultSort?: string;
      activeColumn?: string | null;
    } = {}
  ): Promise<ListResponse<T>> {
    const {
      limit = 100,
      offset = 0,
      sort = options.defaultSort || 'id',
      order = 'asc',
      active_only,
      updated_after,
      search,
      ...filters
    } = params;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Active filter - only apply if activeColumn is specified
    if (active_only === true || String(active_only) === 'true') {
      if (options.activeColumn) {
        conditions.push(`${options.activeColumn} = true`);
      }
      // If activeColumn is null or undefined, skip the filter
    }

    // Updated after filter
    if (updated_after) {
      conditions.push(`synced_at > $${paramIndex}`);
      values.push(updated_after);
      paramIndex++;
    }

    // Search filter
    if (search && options.searchFields?.length) {
      const searchConditions = options.searchFields.map(field => 
        `${field}::text ILIKE $${paramIndex}` 
      );
      conditions.push(`(${searchConditions.join(' OR ')})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Dynamic filters
    if (options.filterFields) {
      for (const field of options.filterFields) {
        if (filters[field] !== undefined) {
          conditions.push(`${field} = $${paramIndex}`);
          values.push(filters[field]);
          paramIndex++;
        }
      }
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    // Validate sort column (prevent SQL injection)
    const safeSort = sort.replace(/[^a-zA-Z0-9_]/g, '');
    const safeOrder = order === 'desc' ? 'DESC' : 'ASC';

    // Get total count
    const countResult = await this.db.query(
      `SELECT COUNT(*) as total FROM ${table} ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].total);

    // Get data
    const dataResult = await this.db.query(
      `SELECT *, 
        (SELECT MAX(synced_at) FROM ${table}) as _last_sync
       FROM ${table} 
       ${whereClause}
       ORDER BY ${safeSort} ${safeOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, Math.min(limit, 1000), offset]
    );

    const lastSync = dataResult.rows[0]?._last_sync;
    const data = dataResult.rows.map(({ _last_sync, ...row }: any) => row);

    return {
      data: data as T[],
      meta: {
        total,
        limit: Math.min(limit, 1000),
        offset,
        has_more: offset + data.length < total,
        last_sync: lastSync?.toISOString(),
      },
    };
  }

  async getById<T>(table: string, id: number | string): Promise<T | null> {
    const result = await this.db.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getByStId<T>(table: string, stId: number | string): Promise<T | null> {
    const result = await this.db.query(
      `SELECT * FROM ${table} WHERE st_id = $1`,
      [stId]
    );
    return result.rows[0] || null;
  }
}
