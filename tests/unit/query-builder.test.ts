import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryBuilder } from '../../src/api/utils/query-builder.js';

describe('QueryBuilder', () => {
  let mockDb: any;
  let qb: QueryBuilder;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
    };
    qb = new QueryBuilder(mockDb);
  });

  describe('list()', () => {
    it('should build basic query with defaults', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '10' }] })
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test' }] });

      const result = await qb.list('master.test_table', {});

      expect(mockDb.query).toHaveBeenCalledTimes(2);
      expect(result.meta.limit).toBe(100);
      expect(result.meta.offset).toBe(0);
    });

    it('should apply search filter', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '5' }] })
        .mockResolvedValueOnce({ rows: [] });

      await qb.list('master.test_table', { search: 'pool' }, {
        searchFields: ['name', 'description'],
      });

      const countCall = mockDb.query.mock.calls[0];
      expect(countCall[0]).toContain('ILIKE');
      expect(countCall[1]).toContain('%pool%');
    });

    it('should apply active_only filter when activeColumn specified', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '3' }] })
        .mockResolvedValueOnce({ rows: [] });

      await qb.list('master.test_table', { active_only: true }, {
        activeColumn: 'is_active',
      });

      const countCall = mockDb.query.mock.calls[0];
      expect(countCall[0]).toContain('is_active = true');
    });

    it('should skip active_only filter when activeColumn not specified', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '5' }] })
        .mockResolvedValueOnce({ rows: [] });

      await qb.list('master.test_table', { active_only: true }, {
        // No activeColumn specified
      });

      const countCall = mockDb.query.mock.calls[0];
      expect(countCall[0]).not.toContain('active');
    });

    it('should respect limit cap of 1000', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '5000' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await qb.list('master.test_table', { limit: 9999 });

      expect(result.meta.limit).toBe(1000);
    });

    it('should calculate has_more correctly', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ total: '100' }] })
        .mockResolvedValueOnce({ rows: new Array(50).fill({ id: 1 }) });

      const result = await qb.list('master.test_table', { limit: 50 });

      expect(result.meta.has_more).toBe(true);
    });
  });

  describe('getById()', () => {
    it('should return record if found', async () => {
      const mockRecord = { id: 1, name: 'Test' };
      mockDb.query.mockResolvedValueOnce({ rows: [mockRecord] });

      const result = await qb.getById('master.test_table', 1);

      expect(result).toEqual(mockRecord);
    });

    it('should return null if not found', async () => {
      mockDb.query.mockResolvedValueOnce({ rows: [] });

      const result = await qb.getById('master.test_table', 999);

      expect(result).toBeNull();
    });
  });
});
