
import { describe, it, expect } from 'vitest';

describe('Shared Package Imports', () => {
  it('should import models from @magajico/shared', async () => {
    const { User, Match, Team } = await import('@magajico/shared');
    
    expect(User).toBeDefined();
    expect(Match).toBeDefined();
    expect(Team).toBeDefined();
  });

  it('should import services from @magajico/shared', async () => {
    const { timeZoneService, translationService } = await import('@magajico/shared');
    
    expect(timeZoneService).toBeDefined();
    expect(translationService).toBeDefined();
  });

  it('should import utils from @magajico/shared', async () => {
    const { apiManager, cacheManager, clientStorage } = await import('@magajico/shared');
    
    expect(apiManager).toBeDefined();
    expect(cacheManager).toBeDefined();
    expect(clientStorage).toBeDefined();
  });

  it('should import types from @magajico/shared', async () => {
    const types = await import('@magajico/shared');
    expect(types).toBeDefined();
  });

  it('should support alternative @shared alias', async () => {
    const shared = await import('@shared');
    expect(shared).toBeDefined();
  });
});
