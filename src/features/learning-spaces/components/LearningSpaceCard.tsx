import React from 'react';
import { LearningSpace } from '@/lib/types/domain';
// @ts-ignore - using JS component during migration
import { Card } from '@/components/ui/Card';

interface LearningSpaceCardProps {
  learningSpace: LearningSpace;
  onClick?: () => void;
}

export const LearningSpaceCard: React.FC<LearningSpaceCardProps> = ({
  learningSpace,
  onClick
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {learningSpace.title}
        </h3>
        {learningSpace.description && (
          <p className="text-gray-600 text-sm mb-3">
            {learningSpace.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{learningSpace.type.replace('_', ' ')}</span>
          <span>{learningSpace.materialIds.length} materials</span>
        </div>
      </div>
    </Card>
  );
};