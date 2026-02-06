/**
 * Pitch Deck Tabs
 * Main tabs container for pitch deck detail page
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AnalyticsTab } from './analytics';
import { PestleTab } from './pestle';
import { RecommendationTab } from './recommendation';
import { SummaryTab } from './summary';
import { SwotTab } from './swot';
import { TabContentWrapper } from './tab-content-wrapper';

interface PitchDeckTabsProps {
  deckId?: string;
}

export function PitchDeckTabs({ deckId }: PitchDeckTabsProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="swot">SWOT</TabsTrigger>
        <TabsTrigger value="pestle">PESTLE</TabsTrigger>
        <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
      </TabsList>

      <TabContentWrapper>
        <TabsContent value="summary" className="mt-0">
          <SummaryTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <AnalyticsTab deckId={deckId || ''} />
        </TabsContent>

        <TabsContent value="swot" className="mt-0">
          <SwotTab deckId={deckId} />
        </TabsContent>

        <TabsContent value="pestle" className="mt-0">
          <PestleTab deckId={deckId} />
        </TabsContent>

        <TabsContent value="recommendation" className="mt-0">
          <RecommendationTab deckId={deckId} />
        </TabsContent>
      </TabContentWrapper>
    </Tabs>
  );
}
