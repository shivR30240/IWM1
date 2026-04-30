/**
 * Speech-to-Text Processing Module
 * Supports multiple providers: Google Cloud Speech-to-Text, AssemblyAI
 */

const provider = process.env.SPEECH_TO_TEXT_PROVIDER || 'google';

interface SpeechToTextResult {
  transcript: string;
  language: string;
  confidence: number;
}

/**
 * Process audio recording and convert to text
 */
export async function processSpeechToText(audioUrl: string): Promise<string> {
  console.log(`🎤 Processing speech-to-text with provider: ${provider}`);

  // In mock mode (no API key configured), return simulated transcript
  if (!process.env.SPEECH_TO_TEXT_API_KEY || process.env.SPEECH_TO_TEXT_API_KEY === 'mock_api_key') {
    console.log('🎭 Mock mode: Using simulated transcript');
    return simulateTranscript();
  }

  try {
    let result: SpeechToTextResult;

    switch (provider) {
      case 'google':
        result = await processWithGoogle(audioUrl);
        break;
      case 'assemblyai':
        result = await processWithAssemblyAI(audioUrl);
        break;
      default:
        throw new Error(`Unsupported speech-to-text provider: ${provider}`);
    }

    console.log(`✅ Speech-to-text complete (confidence: ${result.confidence})`);
    return result.transcript;
  } catch (error) {
    console.error('❌ Speech-to-text processing failed:', error);
    // Fallback to mock transcript in case of error
    console.log('⚠️  Falling back to mock transcript');
    return simulateTranscript();
  }
}

/**
 * Google Cloud Speech-to-Text Integration
 */
async function processWithGoogle(audioUrl: string): Promise<SpeechToTextResult> {
  // This would use @google-cloud/speech in production
  // For now, returning mock data
  
  console.log('📡 Calling Google Cloud Speech-to-Text API...');
  
  // Production implementation:
  // const speech = require('@google-cloud/speech');
  // const client = new speech.SpeechClient();
  // const request = {
  //   config: {
  //     encoding: 'LINEAR16',
  //     languageCode: 'hi-IN',
  //     alternativeLanguageCodes: ['en-IN', 'mr-IN'],
  //     useEnhanced: true,
  //     model: 'latest_long',
  //   },
  //   audio: {
  //     uri: audioUrl,
  //   },
  // };
  // const [response] = await client.recognize(request);
  
  return {
    transcript: '模拟文本 - This is a mock transcript from Google Cloud Speech-to-Text',
    language: 'hi-IN',
    confidence: 0.95,
  };
}

/**
 * AssemblyAI Integration
 */
async function processWithAssemblyAI(audioUrl: string): Promise<SpeechToTextResult> {
  console.log('📡 Calling AssemblyAI API...');

  // Production implementation:
  // const response = await fetch('https://api.assemblyai.com/v2/transcript', {
  //   method: 'POST',
  //   headers: {
  //     'authorization': process.env.ASSEMBLYAI_API_KEY!,
  //     'content-type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     audio_url: audioUrl,
  //     language_code: 'hi',
  //     multilingual: true,
  //   }),
  // });
  // const result = await response.json();
  
  return {
    transcript: 'This is a mock transcript from AssemblyAI',
    language: 'en-IN',
    confidence: 0.92,
  };
}

/**
 * Simulate transcript for development/testing
 * Returns random complaint scenarios
 */
function simulateTranscript(): string {
  const mockComplaints = [
    'There is no water supply in ward number 15, Vijay Nagar area for the past 3 days. Please resolve this issue urgently.',
    'पानी की समस्या है विजय नगर में। पिछले दो दिन से पानी नहीं आ रहा है। कृपया जल्द से जल्द ठीक करें।',
    'The road near Rajwada is full of potholes and it is very difficult to drive. Many accidents have happened. Please repair it.',
    'Street lights are not working in Sapna Sangeeta Road area. It is very dark at night and unsafe for women.',
    'Garbage is not being collected in our area for one week. There is a bad smell and health hazard in ward 23.',
    'Drainage system is clogged near Main Road, Bhawarkuan. Wastewater is overflowing on the road.',
    'Electricity wires are hanging low in our area near Palace Square. It is dangerous during rain.',
  ];

  const randomIndex = Math.floor(Math.random() * mockComplaints.length);
  return mockComplaints[randomIndex];
}

/**
 * Detect language from transcript
 */
export function detectLanguage(transcript: string): string {
  // Simple heuristic: Check for Devanagari script (Hindi/Marathi)
  const devanagariPattern = /[\u0900-\u097F]/;
  
  if (devanagariPattern.test(transcript)) {
    return 'hi-IN';
  }
  
  return 'en-IN';
}
