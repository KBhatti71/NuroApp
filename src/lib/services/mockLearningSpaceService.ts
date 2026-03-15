import { LearningSpaceService, CreateLearningSpaceData } from '../contracts';
import { LearningSpace } from '../../types/domain';
import { mockDb } from '../../db/mockDatabase';

export class MockLearningSpaceService implements LearningSpaceService {
  async createLearningSpace(data: CreateLearningSpaceData): Promise<LearningSpace> {
    return mockDb.create('learningSpaces', {
      userId: 'mock-user-id', // TODO: get from auth context
      ...data,
    });
  }

  async getLearningSpace(id: string): Promise<LearningSpace | null> {
    return mockDb.findById('learningSpaces', id);
  }

  async listLearningSpaces(): Promise<LearningSpace[]> {
    return mockDb.findMany('learningSpaces');
  }

  async updateLearningSpace(id: string, data: Partial<LearningSpace>): Promise<LearningSpace | null> {
    return mockDb.update('learningSpaces', id, data);
  }
}

// Singleton instance
export const mockLearningSpaceService = new MockLearningSpaceService();