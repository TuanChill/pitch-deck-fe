import type { PipelineStage } from '@/types/domain/pipeline';
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Handle, Position, NodeProps } from 'reactflow';

type PipelineNodeData = PipelineStage;

const STATUS_ICONS = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle
} as const;

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-600 border-gray-300',
  running: 'bg-blue-50 text-blue-600 border-blue-300',
  completed: 'bg-green-50 text-green-600 border-green-300',
  failed: 'bg-red-50 text-red-600 border-red-300'
} as const;

export function PipelineNode({ data, selected }: NodeProps<PipelineNodeData>) {
  const StatusIcon = STATUS_ICONS[data.status];

  return (
    <div
      className={`min-w-[180px] rounded-lg border-2 bg-white p-4 shadow-sm transition-all ${STATUS_COLORS[data.status]} ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !border-2 !border-gray-600"
      />

      {/* Status icon and label */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-shrink-0">
          <StatusIcon className={`w-4 h-4 ${data.status === 'running' ? 'animate-spin' : ''}`} />
        </div>
        <span className="font-medium text-sm">{data.name}</span>
      </div>

      {/* Status text */}
      <div className="text-xs text-gray-600">
        {data.status === 'pending' && 'Waiting...'}
        {data.status === 'running' && 'Generating content'}
        {data.status === 'completed' && 'Complete'}
        {data.status === 'failed' && data.errorMessage}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !border-2 !border-gray-600"
      />
    </div>
  );
}
