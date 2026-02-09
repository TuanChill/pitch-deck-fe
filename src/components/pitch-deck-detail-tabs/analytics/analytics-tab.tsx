/**
 * Analytics Tab
 * Container for nested analytics tabs: General, SWOT, PESTLE
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PestleTab } from '../pestle';
import { SwotTab } from '../swot';
import { AnalyticsGeneralTab } from './analytics-general';

interface AnalyticsTabProps {
  deckId: string;
}

export function AnalyticsTab({ deckId }: AnalyticsTabProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="swot">SWOT</TabsTrigger>
        <TabsTrigger value="pestle">PESTLE</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-0">
        <AnalyticsGeneralTab deckId={deckId} />
      </TabsContent>

      <TabsContent value="swot" className="mt-0">
        <SwotTab deckId={deckId} />
      </TabsContent>

      <TabsContent value="pestle" className="mt-0">
        <PestleTab deckId={deckId} />
      </TabsContent>
    </Tabs>
  );
}
