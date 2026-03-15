import { DbRecord, DbId } from './types';

// In-memory mock database
class MockDatabase {
  private data: Map<string, Map<DbId, DbRecord<any>>> = new Map();

  constructor() {
    // Initialize collections
    this.data.set('learningSpaces', new Map());
    this.data.set('materials', new Map());
    this.data.set('materialChunks', new Map());
    this.data.set('materialVisualElements', new Map());
    this.data.set('topics', new Map());
    this.data.set('concepts', new Map());
    this.data.set('studyCards', new Map());
    this.data.set('practiceQuizzes', new Map());
    this.data.set('quizQuestions', new Map());
    this.data.set('weakAreas', new Map());
    this.data.set('exportJobs', new Map());
  }

  // Generic CRUD operations
  async create<T extends DbRecord<any>>(collection: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const collectionMap = this.data.get(collection);
    if (!collectionMap) throw new Error(`Collection ${collection} not found`);

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = { ...item, id, createdAt: now, updatedAt: now } as T;

    collectionMap.set(id, record);
    return record;
  }

  async findById<T extends DbRecord<any>>(collection: string, id: DbId): Promise<T | null> {
    const collectionMap = this.data.get(collection);
    if (!collectionMap) return null;

    return (collectionMap.get(id) as T) || null;
  }

  async findMany<T extends DbRecord<any>>(collection: string, filter?: (item: T) => boolean): Promise<T[]> {
    const collectionMap = this.data.get(collection);
    if (!collectionMap) return [];

    const items = Array.from(collectionMap.values()) as T[];
    return filter ? items.filter(filter) : items;
  }

  async update<T extends DbRecord<any>>(collection: string, id: DbId, updates: Partial<T>): Promise<T | null> {
    const collectionMap = this.data.get(collection);
    if (!collectionMap) return null;

    const existing = collectionMap.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    collectionMap.set(id, updated);
    return updated as T;
  }

  async delete(collection: string, id: DbId): Promise<boolean> {
    const collectionMap = this.data.get(collection);
    if (!collectionMap) return false;

    return collectionMap.delete(id);
  }

  // Bulk operations
  async createMany<T extends DbRecord<any>>(collection: string, items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    return Promise.all(items.map(item => this.create(collection, item)));
  }

  // Clear all data (for testing)
  clear() {
    this.data.forEach(collection => collection.clear());
  }
}

// Singleton instance
export const mockDb = new MockDatabase();