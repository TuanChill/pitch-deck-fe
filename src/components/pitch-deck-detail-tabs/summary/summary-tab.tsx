/**
 * Summary Tab
 * Summary tab content with startup snapshot
 */

import { MOCK_SUMMARY_DATA } from '@/types/mock-data/summary.types';

import { StartupSnapshot } from './startup-snapshot';

export function SummaryTab() {
  return <StartupSnapshot data={MOCK_SUMMARY_DATA} />;
}
