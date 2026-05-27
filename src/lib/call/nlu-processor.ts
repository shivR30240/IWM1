import { TicketCategory, TicketPriority } from '@/types';

/**
 * Natural Language Understanding Processor
 * Extracts structured information from complaint transcripts
 */

export interface ProcessedComplaint {
  category: TicketCategory;
  priority: TicketPriority;
  location: {
    wardNumber: number | null;
    wardName: string | null;
    area: string | null;
    fullAddress: string;
  };
  summary: string;
  summaryHi: string;
  confidence: number;
}

// Category keywords mapping
const CATEGORY_KEYWORDS: Record<TicketCategory, string[]> = {
  water_supply: [
    'water', 'पानी', 'jal', 'supply', 'tanker', 'pipeline', 'leakage',
    'no water', 'water not coming', 'पानी नहीं', 'जल आपूर्ति'
  ],
  drainage: [
    'drainage', 'drain', 'naali', 'sewage', 'clogged', 'overflow',
    'नाली', 'सीवेज', 'overflowing', 'blocked drain'
  ],
  roads: [
    'road', 'sadak', 'pothole', 'street', 'damaged', 'repair',
    'सड़क', 'गड्ढा', 'potholes', 'road damage'
  ],
  electricity: [
    'electricity', 'bijli', 'power', 'wire', 'pole', 'light', 'current',
    'बिजली', 'electric', 'power cut', 'electricity issue'
  ],
  sanitation: [
    'sanitation', 'clean', 'safai', 'toilet', '公共卫生', 'dirty',
    'सफाई', 'cleanliness', 'sanitation issue'
  ],
  garbage_collection: [
    'garbage', 'kachra', 'waste', 'trash', 'collection', 'kooda',
    'कचरा', 'garbage not collected', 'waste management'
  ],
  street_lights: [
    'street light', 'streetlight', 'light not working', 'dark', 'pole light',
    'स्ट्रीट लाइट', 'light issue', 'no light'
  ],
  parks: [
    'park', 'garden', 'udyan', 'playground', 'park maintenance',
    'पार्क', 'garden issue', 'park condition'
  ],
  building_permits: [
    'building', 'permit', 'construction', 'illegal', 'authorization',
    'निर्माण', 'building violation', 'illegal construction'
  ],
  other: []
};

// Ward area mappings for Indore
const WARD_MAPPINGS: Record<string, { wardNumber: number; name: string }> = {
  'vijay nagar': { wardNumber: 15, name: 'Vijay Nagar' },
  'vijaynagar': { wardNumber: 15, name: 'Vijay Nagar' },
  'rajwada': { wardNumber: 1, name: 'Rajwada' },
  'sapna sangeeta': { wardNumber: 23, name: 'Sapna Sangeeta' },
  'sapan sangeeta': { wardNumber: 23, name: 'Sapna Sangeeta' },
  'bhawarkuan': { wardNumber: 12, name: 'Bhawarkuan' },
  'palace square': { wardNumber: 8, name: 'Palace Square' },
  'palasia': { wardNumber: 18, name: 'Palasia' },
  'new market': { wardNumber: 25, name: 'New Market' },
  'old town': { wardNumber: 3, name: 'Old Town' },
  'saket': { wardNumber: 30, name: 'Saket' },
  'sudama nagar': { wardNumber: 42, name: 'Sudama Nagar' },
  'niranjanpur': { wardNumber: 35, name: 'Niranjanpur' },
};

// Priority keywords
const PRIORITY_KEYWORDS: Record<TicketPriority, string[]> = {
  critical: [
    'emergency', 'urgent', 'danger', 'accident', 'dangerous', 'critical',
    'तत्काल', 'आपातकाल', 'serious', 'life threatening', 'immediate'
  ],
  high: [
    'high priority', 'important', 'severe', 'major issue', 'बहुत महत्वपूर्ण',
    'not working for days', 'safety issue', 'health hazard'
  ],
  medium: [
    'medium', 'moderate', 'needs attention', 'समस्या', 'issue',
    'problem', 'not working'
  ],
  low: [
    'low', 'minor', 'small issue', 'cosmetic', 'सामान्य',
    'improvement needed', 'suggestion'
  ]
};

/**
 * Process complaint transcript and extract structured information
 */
export async function processComplaint(transcript: string): Promise<ProcessedComplaint> {
  console.log('🧠 Processing complaint with NLU...');

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'mock_api_key') {
    try {
      console.log('📡 Calling Google Gemini API for transcript analysis...');
      const geminiResult = await processWithGemini(transcript, apiKey);
      console.log('✅ NLU processing complete via Gemini:', geminiResult);
      return geminiResult;
    } catch (geminiError) {
      console.error('❌ Gemini NLU processing failed. Falling back to rule-based processing:', geminiError);
    }
  } else {
    console.log('ℹ️ GEMINI_API_KEY not configured or mock. Using rule-based local processing.');
  }

  // Local Rule-Based Processing (Fallback)
  const lowerTranscript = transcript.toLowerCase();

  // Extract category
  const category = extractCategory(lowerTranscript);

  // Extract location
  const location = extractLocation(lowerTranscript);

  // Determine priority
  const priority = extractPriority(lowerTranscript, category);

  // Generate summary
  const summary = generateSummary(transcript, category, location);
  const summaryHi = generateSummaryHindi(transcript, category, location);

  const result: ProcessedComplaint = {
    category,
    priority,
    location,
    summary,
    summaryHi,
    confidence: 0.70, // Lower confidence for rule-based heuristics
  };

  console.log('✅ NLU processing complete via Local Fallback:', result);
  return result;
}

/**
 * Advanced NLU processing using Gemini 2.5 Flash
 */
async function processWithGemini(transcript: string, apiKey: string): Promise<ProcessedComplaint> {
  const prompt = `
You are an expert natural language understanding processor for the Indore Voice Connect helpline in Indore, Madhya Pradesh, India.
Your task is to analyze the following civic complaint transcript and extract structured information.

The complaint might be in English, Hindi, or a mix of both (Hinglish).

Transcript: "${transcript}"

Extract the information strictly in the following JSON format. Return ONLY the JSON object, with no backticks, no markdown fencing, and no additional text.

{
  "category": "water_supply" | "drainage" | "roads" | "electricity" | "sanitation" | "garbage_collection" | "street_lights" | "parks" | "building_permits" | "other",
  "priority": "low" | "medium" | "high" | "critical",
  "location": {
    "wardNumber": number | null,
    "wardName": string | null,
    "area": string | null,
    "fullAddress": string
  },
  "summary": string,
  "summaryHi": string,
  "confidence": number
}

Rules for extraction:
1. "category": Match the complaint content to one of the 10 allowed categories.
2. "priority": Determine based on severity:
   - "critical": Live high-voltage wires, open manholes on main roads, severe water contamination, safety hazards.
   - "high": Clogged main sewage lines, no water supply for multiple days, entire streetlights out.
   - "medium": Potholes, minor drainage, single street light not working, routine garbage pile.
   - "low": Garden maintenance, general suggestion, minor building permit inquiries.
3. "location":
   - "wardNumber": Try to identify or infer the ward number (Indore has 85 wards. Standard mappings: Vijay Nagar is Ward 15, Rajwada is Ward 1, Sapna Sangeeta is Ward 23, Bhawarkuan is Ward 12, Palace Square is Ward 8, Palasia is Ward 18, New Market is Ward 25, Saket is Ward 30, Sudama Nagar is Ward 42, Niranjanpur is Ward 35). If not mentioned, set to null.
   - "wardName": Name of the Indore ward (e.g. "Vijay Nagar", "Rajwada").
   - "area": Specific colony or neighborhood mentioned (e.g., "Scheme 54", "LIG Colony", "Ranjeet Hanuman").
   - "fullAddress": Synthesize a full description of the address context.
4. "summary": Provide a highly concise, professional 1-sentence summary of the specific issue in English.
5. "summaryHi": Provide a highly concise, professional 1-sentence summary of the specific issue in Hindi (Devanagari script).
6. "confidence": A decimal between 0.0 and 1.0.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Invalid or empty response from Gemini API');
  }

  const result = JSON.parse(rawText.trim());
  
  // Ensure categories are valid and correct potential formatting issues
  const validCategories = [
    'water_supply', 'drainage', 'roads', 'electricity', 
    'sanitation', 'garbage_collection', 'street_lights', 
    'parks', 'building_permits', 'other'
  ];
  if (!validCategories.includes(result.category)) {
    result.category = 'other';
  }

  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (!validPriorities.includes(result.priority)) {
    result.priority = 'medium';
  }

  // Set default fallback values if missing
  result.location = result.location || {};
  result.location.wardNumber = typeof result.location.wardNumber === 'number' ? result.location.wardNumber : null;
  result.location.wardName = result.location.wardName || (result.location.wardNumber ? `Ward ${result.location.wardNumber}` : 'Unknown');
  result.location.area = result.location.area || null;
  result.location.fullAddress = result.location.fullAddress || transcript.substring(0, 100);
  result.summary = result.summary || 'Civic complaint registered';
  result.summaryHi = result.summaryHi || 'नागरिक शिकायत दर्ज की गई';
  result.confidence = typeof result.confidence === 'number' ? result.confidence : 0.8;

  return result as ProcessedComplaint;
}

/**
 * Extract complaint category from transcript
 */
function extractCategory(transcript: string): TicketCategory {
  let bestMatch: TicketCategory = 'other';
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (transcript.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category as TicketCategory;
    }
  }

  return bestMatch;
}

/**
 * Extract location information from transcript
 */
function extractLocation(transcript: string): ProcessedComplaint['location'] {
  let wardNumber: number | null = null;
  let wardName: string | null = null;
  let area: string | null = null;

  // Look for ward number patterns: "ward 15", "ward number 23", "ward no. 12"
  const wardPatterns = [
    /ward\s*(?:number|#|no\.?)\s*(\d+)/i,
    /ward\s+(\d+)/i,
  ];

  for (const pattern of wardPatterns) {
    const match = transcript.match(pattern);
    if (match && match[1]) {
      wardNumber = parseInt(match[1]);
      break;
    }
  }

  // Look for area names
  for (const [areaName, wardInfo] of Object.entries(WARD_MAPPINGS)) {
    if (transcript.includes(areaName)) {
      area = areaName;
      if (!wardNumber) {
        wardNumber = wardInfo.wardNumber;
        wardName = wardInfo.name;
      }
      break;
    }
  }

  // Extract full address context
  const fullAddress = extractAddressContext(transcript);

  return {
    wardNumber,
    wardName: wardName || (wardNumber ? `Ward ${wardNumber}` : null),
    area,
    fullAddress,
  };
}

/**
 * Extract address context from transcript
 */
function extractAddressContext(transcript: string): string {
  // Simple extraction - in production, use NER (Named Entity Recognition)
  const addressKeywords = ['near', 'area', 'road', 'street', 'zone', 'colony', 'locality'];
  
  for (const keyword of addressKeywords) {
    const index = transcript.indexOf(keyword);
    if (index !== -1) {
      // Extract surrounding context
      const start = Math.max(0, index - 20);
      const end = Math.min(transcript.length, index + 50);
      return transcript.substring(start, end).trim();
    }
  }

  return transcript.substring(0, 100);
}

/**
 * Determine priority based on keywords and category
 */
function extractPriority(transcript: string, category: TicketCategory): TicketPriority {
  // Check for priority keywords
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (transcript.includes(keyword.toLowerCase())) {
        return priority as TicketPriority;
      }
    }
  }

  // Default priority based on category
  const defaultPriorities: Record<TicketCategory, TicketPriority> = {
    water_supply: 'high',
    drainage: 'high',
    electricity: 'high',
    roads: 'medium',
    sanitation: 'medium',
    garbage_collection: 'medium',
    street_lights: 'medium',
    parks: 'low',
    building_permits: 'high',
    other: 'medium',
  };

  return defaultPriorities[category];
}

/**
 * Generate English summary
 */
function generateSummary(
  transcript: string,
  category: TicketCategory,
  location: ProcessedComplaint['location']
): string {
  const locationStr = location.wardName
    ? ` in ${location.wardName}`
    : location.area
    ? ` near ${location.area}`
    : '';

  return `${category.replace('_', ' ')} complaint${locationStr}. ${transcript.substring(0, 150)}`;
}

/**
 * Generate Hindi summary
 */
function generateSummaryHindi(
  transcript: string,
  category: TicketCategory,
  location: ProcessedComplaint['location']
): string {
  const categoryHindi: Record<TicketCategory, string> = {
    water_supply: 'जल आपूर्ति',
    drainage: 'नाली/सीवेज',
    roads: 'सड़क',
    electricity: 'बिजली',
    sanitation: 'सफाई',
    garbage_collection: 'कचरा संग्रह',
    street_lights: 'स्ट्रीट लाइट',
    parks: 'पार्क',
    building_permits: 'निर्माण अनुमति',
    other: 'अन्य',
  };

  const locationStr = location.wardName
    ? ` - ${location.wardName}`
    : '';

  return `${categoryHindi[category]} शिकायत${locationStr}`;
}
