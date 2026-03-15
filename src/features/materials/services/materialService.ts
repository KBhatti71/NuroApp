import { Material } from '@/lib/types/domain';
import { mockDb } from '@/lib/db/mockDatabase';

/**
 * Service for managing materials
 * Provides CRUD operations and business logic for materials
 */
export class MaterialService {
  /**
   * Get all materials for a learning space
   */
  async getMaterialsByLearningSpace(learningSpaceId: string): Promise<Material[]> {
    const records = await mockDb.findMany<Material>('materials');
    return records.filter((record: Material) => record.learningSpaceId === learningSpaceId);
  }

  /**
   * Get a material by ID
   */
  async getMaterial(id: string): Promise<Material | null> {
    const record = await mockDb.findById<Material>('materials', id);
    return record;
  }

  /**
   * Create a new material
   */
  async createMaterial(data: Omit<Material, 'id' | 'uploadedAt' | 'chunks' | 'visualElements' | 'metadata'>): Promise<Material> {
    const materialData = {
      ...data,
      uploadedAt: new Date().toISOString(),
      chunks: [],
      visualElements: [],
      metadata: {
        title: data.title,
        sourceType: data.sourceType,
        wordCount: 0,
        language: 'en'
      }
    };

    const material = await mockDb.create<Material>('materials', materialData);
    return material;
  }

  /**
   * Update material parsing status
   */
  async updateMaterialStatus(id: string, parsingStatus: Material['parsingStatus']): Promise<Material | null> {
    const record = await mockDb.update<Material>('materials', id, { parsingStatus });
    return record;
  }

  /**
   * Delete a material
   */
  async deleteMaterial(id: string): Promise<boolean> {
    try {
      await mockDb.delete('materials', id);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const materialService = new MaterialService();