/**
 * PESTLE Tab
 * PESTLE analysis tab with mock data
 */

import { MOCK_PESTLE_DATA } from '@/types/mock-data/swot-pestle.types';

import { PESTLEList } from './pestle-list';

export function PestleTab() {
  return <PESTLEList data={MOCK_PESTLE_DATA} />;
}
