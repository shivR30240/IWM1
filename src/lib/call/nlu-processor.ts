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
    confidence: 0.85,
  };

  console.log('✅ NLU processing complete:', result);
  return result;
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
