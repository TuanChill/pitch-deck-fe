'use client';

import { PIPELINE_STAGE_ORDER } from '@/constants/pipeline-stages';
import { usePipelineStore } from '@/stores/pipeline.store';
import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import { PipelineNode } from './pipeline-node';

const nodeTypes = {
  pipeline: PipelineNode
};

interface PipelineFlowProps {
  className?: string;
}

export function PipelineFlow({ className }: PipelineFlowProps) {
  const stages = usePipelineStore((s) => s.stages);

  // Build nodes from stages
  const nodes: Node[] = useMemo(() => {
    return PIPELINE_STAGE_ORDER.map((stageId, index) => {
      const stage = stages[stageId];

      return {
        id: stageId,
        type: 'pipeline',
        position: { x: index * 250, y: 0 },
        data: stage
      };
    });
  }, [stages]);

  // Build edges connecting stages
  const edges: Edge[] = useMemo(() => {
    return PIPELINE_STAGE_ORDER.slice(0, -1).map((stageId, index) => {
      const nextStageId = PIPELINE_STAGE_ORDER[index + 1];
      const isCompleted = stages[stageId].status === 'completed';
      const isRunning = stages[nextStageId].status === 'running';

      return {
        id: `e-${stageId}-${nextStageId}`,
        source: stageId,
        target: nextStageId,
        animated: isRunning,
        style: {
          strokeWidth: 2,
          stroke: isCompleted ? '#10b981' : '#d1d5db'
        }
      };
    });
  }, [stages]);

  // Handle node click (future: show stage details)
  const onNodeClick = useCallback(() => {
    // Reserved for future stage detail modal
  }, []);

  return (
    <div className={className} style={{ height: '200px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        preventScrolling={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

// Wrapper with provider for SSR compatibility
export function PipelineVisualization({ className }: PipelineFlowProps) {
  return (
    <ReactFlowProvider>
      <PipelineFlow className={className} />
    </ReactFlowProvider>
  );
}
