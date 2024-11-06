interface StorageConfig {
    prefix: string;
    version: string;
    storageType: 'localStorage' | 'sessionStorage';
  }
  
  export class PersistentStorage {
    private prefix: string;
    private version: string;
    private storage: Storage;
  
    constructor(config: StorageConfig) {
      this.prefix = config.prefix;
      this.version = config.version;
      this.storage = config.storageType === 'localStorage' ? localStorage : sessionStorage;
    }
  
    private getKey(key: string): string {
      return `${this.prefix}${this.version}_${key}`;
    }
  
    setItem(key: string, value: any): void {
      try {
        const serializedValue = JSON.stringify({
          value,
          timestamp: Date.now()
        });
        this.storage.setItem(this.getKey(key), serializedValue);
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    }
  
    getItem(key: string): any {
      try {
        const item = this.storage.getItem(this.getKey(key));
        if (!item) return null;
  
        const { value, timestamp } = JSON.parse(item);
        return value;
      } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
      }
    }
  
    removeItem(key: string): void {
      this.storage.removeItem(this.getKey(key));
    }
  
    clear(): void {
      Object.keys(this.storage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key);
        }
      });
    }
  }