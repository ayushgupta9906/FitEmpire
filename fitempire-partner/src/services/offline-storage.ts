export class OfflineTurnstileStore {
  private dbName = 'fitempire_offline_v1';

  async cacheActivePass(tokenHash: string, memberData: any): Promise<void> {
    try {
      localStorage.setItem(`offline_pass_${tokenHash}`, JSON.stringify({
        data: memberData,
        cachedAt: Date.now(),
      }));
    } catch (e) {
      console.warn('LocalStorage offline cache full:', e);
    }
  }

  getOfflinePass(tokenHash: string): any | null {
    const raw = localStorage.getItem(`offline_pass_${tokenHash}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      // Valid for 24 hours offline
      if (Date.now() - parsed.cachedAt < 86400000) {
        return parsed.data;
      }
    } catch (e) {
      return null;
    }
    return null;
  }
}

export const offlineStore = new OfflineTurnstileStore();
