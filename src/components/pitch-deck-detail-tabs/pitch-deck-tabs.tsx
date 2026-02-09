/**
 * Pitch Deck Tabs
 * Main tabs container for pitch deck detail page
 */

import type { DeckCurrentStep } from '@/constants/pitch-deck-status';

import { PipelineRunningBanner } from '@/components/pipeline-visualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AnalyticsTab } from './analytics';
import { RecommendationTab } from './recommendation';
import { SummaryTab } from './summary';
import { TabContentWrapper } from './tab-content-wrapper';

interface PitchDeckTabsProps {
  deckId?: string;
  currentStep?: DeckCurrentStep;
}

export function PitchDeckTabs({ deckId, currentStep }: PitchDeckTabsProps) {
  return (
    <>
      <PipelineRunningBanner currentStep={currentStep} />
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Keypoint</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
        </TabsList>

        <TabContentWrapper>
          <TabsContent value="summary" className="mt-0">
            <SummaryTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsTab deckId={deckId || ''} />
          </TabsContent>

          <TabsContent value="recommendation" className="mt-0">
            <RecommendationTab deckId={deckId} />
          </TabsContent>
        </TabContentWrapper>
      </Tabs>
    </>
  );
}
