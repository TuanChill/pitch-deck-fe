import type {
  UploadPitchDeckResponse,
  PitchDeckAnalysisResponse
} from '@/types/response/pitch-deck';
import { generateMockAnalysis } from '@/utils/mock-analysis';

export const uploadPitchDeck = async (file: File): Promise<UploadPitchDeckResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  // TODO: Replace with actual API call when ready
  // const response = await httpClient.post<UploadPitchDeckResponse>(
  //   API_URL.PITCH_DECK.UPLOAD,
  //   formData,
  //   { headers: { 'Content-Type': 'multipart/form-data' } }
  // );
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    uuid: `deck_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    filename: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadedAt: new Date().toISOString()
  };
};

export const analyzePitchDeck = async (
  deckId: string,
  filename?: string
): Promise<PitchDeckAnalysisResponse> => {
  // TODO: Replace with actual API call when ready
  // const response = await httpClient.post<PitchDeckAnalysisResponse>(
  //   API_URL.ANALYSIS.START,
  //   { deckId }
  // );
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  return generateMockAnalysis(deckId, filename || 'pitch-deck.pdf');
};

export const deletePitchDeck = async (_uploadId: string): Promise<void> => {
  // TODO: Replace with actual API call when ready
  // await httpClient.delete(`/pitch-deck/${uploadId}`);

  await new Promise((resolve) => setTimeout(resolve, 500));
};
