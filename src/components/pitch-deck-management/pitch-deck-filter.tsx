import { PITCH_DECK_STATUS } from '@/constants/pitch-deck-status';
import type { PitchDeckStatus } from '@/constants/pitch-deck-status';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PitchDeckFilterProps {
  selectedStatus: PitchDeckStatus | 'all';
  onStatusChange: (status: PitchDeckStatus | 'all') => void;
  totalCount: number;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'uploading', label: PITCH_DECK_STATUS.uploading.label },
  { value: 'processing', label: PITCH_DECK_STATUS.processing.label },
  { value: 'ready', label: PITCH_DECK_STATUS.ready.label },
  { value: 'error', label: PITCH_DECK_STATUS.error.label }
] as const;

export const PitchDeckFilter = ({
  selectedStatus,
  onStatusChange,
  totalCount
}: PitchDeckFilterProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <Select
        value={selectedStatus}
        onValueChange={(value) => onStatusChange(value as PitchDeckStatus | 'all')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{totalCount}</span> pitch deck
        {totalCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
};
