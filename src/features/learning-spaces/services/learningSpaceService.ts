import { LearningSpace } from '@/lib/types/domain';
import { mockDb } from '@/lib/db/mockDatabase';

/**
 * Service for managing learning spaces
 * Provides CRUD operations and business logic for learning spaces
 */
export class LearningSpaceService {
  /**
   * Get all learning spaces
   */
  async getLearningSpaces(): Promise<LearningSpace[]> {
    const records = await mockDb.findMany<LearningSpace>('learningSpaces');
    return records;
  }

  /**
   * Get a learning space by ID
   */
  async getLearningSpace(id: string): Promise<LearningSpace | null> {
    const record = await mockDb.findById<LearningSpace>('learningSpaces', id);
    if (!record) return null;

    return record;
  }

  /**
   * Create a new learning space
   */
  async createLearningSpace(data: Omit<LearningSpace, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningSpace> {
    const record = await mockDb.create<LearningSpace>('learningSpaces', data);
    return record;
  }

  /**
   * Update a learning space
   */
  async updateLearningSpace(id: string, data: Partial<Omit<LearningSpace, 'id' | 'createdAt'>>): Promise<LearningSpace | null> {
    const record = await mockDb.update<LearningSpace>('learningSpaces', id, data);
    if (!record) return null;

    return record;
  }

  /**
   * Delete a learning space
   */
  async deleteLearningSpace(id: string): Promise<boolean> {
    try {
      await mockDb.delete('learningSpaces', id);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const learningSpaceService = new LearningSpaceService();