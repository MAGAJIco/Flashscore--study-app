
/**
 * Replit Object Storage Integration
 * Provides persistent file storage across deployments
 */

interface StorageOptions {
  bucket?: string;
  contentType?: string;
}

export class ReplitStorage {
  private static instance: ReplitStorage;
  
  private constructor() {}
  
  public static getInstance(): ReplitStorage {
    if (!ReplitStorage.instance) {
      ReplitStorage.instance = new ReplitStorage();
    }
    return ReplitStorage.instance;
  }

  /**
   * Upload text content to storage
   */
  async uploadText(key: string, content: string, options?: StorageOptions): Promise<void> {
    try {
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content, ...options })
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading to storage:', error);
      throw error;
    }
  }

  /**
   * Download text content from storage
   */
  async downloadText(key: string): Promise<string> {
    try {
      const response = await fetch(`/api/storage/download?key=${encodeURIComponent(key)}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error downloading from storage:', error);
      throw error;
    }
  }

  /**
   * Upload file/blob to storage
   */
  async uploadFile(key: string, file: File | Blob, options?: StorageOptions): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      if (options?.bucket) formData.append('bucket', options.bucket);

      const response = await fetch('/api/storage/upload-file', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`File upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Delete object from storage
   */
  async delete(key: string): Promise<void> {
    try {
      const response = await fetch('/api/storage/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting from storage:', error);
      throw error;
    }
  }

  /**
   * List objects in storage
   */
  async list(prefix?: string): Promise<string[]> {
    try {
      const url = prefix 
        ? `/api/storage/list?prefix=${encodeURIComponent(prefix)}`
        : '/api/storage/list';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`List failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.objects || [];
    } catch (error) {
      console.error('Error listing storage objects:', error);
      throw error;
    }
  }
}

export const replitStorageInstance = ReplitStorage.getInstance();
