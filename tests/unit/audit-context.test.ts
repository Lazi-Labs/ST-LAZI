import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setAuditContext, withAuditContext } from '../../src/utils/audit-context.js';

describe('Audit Context', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: vi.fn().mockResolvedValue({}),
      connect: vi.fn(),
      release: vi.fn(),
    };
  });

  describe('setAuditContext()', () => {
    it('should set all context variables', async () => {
      await setAuditContext(mockClient, {
        actorType: 'user',
        actorId: 'user-123',
        requestId: 'req-456',
        mutationId: 'mut-789',
        syncBatchId: 'batch-000',
      });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('set_config'),
        ['user', 'user-123', 'req-456', 'mut-789', 'batch-000']
      );
    });

    it('should handle missing optional fields', async () => {
      await setAuditContext(mockClient, {
        actorType: 'system',
      });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.any(String),
        ['system', '', '', '', '']
      );
    });
  });

  describe('withAuditContext()', () => {
    let mockPool: any;

    beforeEach(() => {
      mockPool = {
        connect: vi.fn().mockResolvedValue({
          query: vi.fn().mockResolvedValue({}),
          release: vi.fn(),
        }),
      };
    });

    it('should execute function with context and cleanup', async () => {
      const mockFn = vi.fn().mockResolvedValue('result');

      const result = await withAuditContext(mockPool, { actorType: 'api' }, mockFn);

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();
    });

    it('should release client even on error', async () => {
      const client = {
        query: vi.fn().mockResolvedValue({}),
        release: vi.fn(),
      };
      mockPool.connect.mockResolvedValue(client);
      
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'));

      await expect(withAuditContext(mockPool, { actorType: 'api' }, mockFn))
        .rejects.toThrow('Test error');
      
      expect(client.release).toHaveBeenCalled();
    });
  });
});
