export interface IndoreLocation {
  wardNumber: number;
  wardName: string;
  latitude: number;
  longitude: number;
  addresses: string[];
}

export const INDORE_LOCATIONS: IndoreLocation[] = [
  { wardNumber: 1, wardName: "Rajwada", latitude: 22.7196, longitude: 75.8577, addresses: ["Near Rajwada Palace", "Khajuri Bazaar", "Kajuri Sadak"] },
  { wardNumber: 2, wardName: "Cloth Market", latitude: 22.7185, longitude: 75.8562, addresses: ["MT Cloth Market", "Jawahar Marg", "Siyaganj"] },
  { wardNumber: 5, wardName: "MG Road", latitude: 22.7236, longitude: 75.8654, addresses: ["MG Road near GPO", "Press Complex", "Regal Square"] },
  { wardNumber: 7, wardName: "Palasia", latitude: 22.7257, longitude: 75.8784, addresses: ["Palasia Square", "New Palasia", "56 Dukan Area"] },
  { wardNumber: 10, wardName: "Sapna Sangeeta", latitude: 22.7281, longitude: 75.8826, addresses: ["Sapna Sangeeta Road", "Near C21 Mall", "Apollo DB City"] },
  { wardNumber: 12, wardName: "Vijay Nagar", latitude: 22.7533, longitude: 75.8937, addresses: ["Vijay Nagar Square", "Scheme No. 54", "Near Bombay Hospital"] },
  { wardNumber: 15, wardName: "Bhawarkuan", latitude: 22.7412, longitude: 75.8654, addresses: ["Bhawarkuan Square", "Sneh Nagar", "Near Bhawarkuan Overbridge"] },
  { wardNumber: 18, wardName: "Geeta Bhawan", latitude: 22.7140, longitude: 75.8690, addresses: ["Geeta Bhawan Square", "South Tukoganj", "Behind Geeta Bhawan"] },
  { wardNumber: 20, wardName: "Sudama Nagar", latitude: 22.6992, longitude: 75.8660, addresses: ["Sudama Nagar Main Road", "Ring Road Sudama Nagar", "Near Sudama Nagar Square"] },
  { wardNumber: 22, wardName: "Annapurna", latitude: 22.6921, longitude: 75.8573, addresses: ["Annapurna Road", "Annapurna Mandir Area", "Annapurna Nagar"] },
  { wardNumber: 25, wardName: "Khajrana", latitude: 22.7047, longitude: 75.9050, addresses: ["Khajrana Ganesh Mandir Road", "Ring Road Khajrana", "Near Khajrana Square"] },
  { wardNumber: 28, wardName: "Musakhedi", latitude: 22.7090, longitude: 75.8435, addresses: ["Musakhedi Main Road", "Near Chappan Dukan", "Musakhedi Naka"] },
  { wardNumber: 30, wardName: "Banganga", latitude: 22.7350, longitude: 75.8490, addresses: ["Banganga Road", "Near Old Palasia", "Banganga Chouraha"] },
  { wardNumber: 33, wardName: "Tilak Nagar", latitude: 22.7100, longitude: 75.8750, addresses: ["Tilak Nagar Road", "Near MR-10", "Tilak Nagar Colony"] },
  { wardNumber: 35, wardName: "Nanda Nagar", latitude: 22.7460, longitude: 75.8700, addresses: ["Nanda Nagar Road", "Near AB Road", "Nanda Nagar Colony"] },
  { wardNumber: 38, wardName: "Scheme No. 78", latitude: 22.7500, longitude: 75.8850, addresses: ["Scheme No. 78 Part 2", "Near Aurobindo Hospital", "Scheme 78 Main Road"] },
  { wardNumber: 40, wardName: "Saket Nagar", latitude: 22.7350, longitude: 75.9010, addresses: ["Saket Nagar Main Road", "Behind Saket Square", "Saket Extension"] },
  { wardNumber: 42, wardName: "Bengali Square", latitude: 22.7468, longitude: 75.8810, addresses: ["Bengali Square", "Near Bengali Colony", "Bengali Chouraha"] },
  { wardNumber: 45, wardName: "LIG Colony", latitude: 22.7380, longitude: 75.8760, addresses: ["LIG Colony Main Road", "Near Indraprastha Tower", "LIG Square"] },
  { wardNumber: 48, wardName: "Mahalaxmi Nagar", latitude: 22.7210, longitude: 75.9030, addresses: ["Mahalaxmi Nagar Road", "Near Laxmi Narayan Temple", "Mahalaxmi Extension"] },
  { wardNumber: 50, wardName: "Vishnupuri", latitude: 22.7315, longitude: 75.8610, addresses: ["Vishnupuri Colony", "Old Vishnupuri", "Near Vishnupuri Bridge"] },
  { wardNumber: 52, wardName: "Kanadia Road", latitude: 22.7600, longitude: 75.8650, addresses: ["Kanadia Road", "Near Kanadia Chouraha", "IIM Road"] },
  { wardNumber: 55, wardName: "Nipania", latitude: 22.7680, longitude: 75.9050, addresses: ["Nipania Road", "AB Bypass Nipania", "Near Nipania Square"] },
  { wardNumber: 58, wardName: "Bicholi Mardana", latitude: 22.7700, longitude: 75.8500, addresses: ["Bicholi Mardana Road", "Near Bicholi Hapsi", "Bicholi Main Rd"] },
  { wardNumber: 60, wardName: "Pardesipura", latitude: 22.7450, longitude: 75.8550, addresses: ["Pardesipura Main Road", "Near Pardesipura Square", "Pardesipura Colony"] },
  { wardNumber: 62, wardName: "Rau", latitude: 22.6600, longitude: 75.8700, addresses: ["Rau Main Road", "AB Road Rau", "Near Rau Railway Station"] },
  { wardNumber: 65, wardName: "Mhow Naka", latitude: 22.6800, longitude: 75.8600, addresses: ["Mhow Naka Square", "Near Khandwa Road", "Mhow Road"] },
  { wardNumber: 68, wardName: "Treasure Island", latitude: 22.7295, longitude: 75.8895, addresses: ["Near Treasure Island Mall", "Mangal City Area", "MR-10 Road"] },
  { wardNumber: 70, wardName: "AB Road", latitude: 22.7150, longitude: 75.8800, addresses: ["AB Road near LIG", "Agra Bombay Road", "Near Industry House"] },
  { wardNumber: 72, wardName: "Malviya Nagar", latitude: 22.6950, longitude: 75.8480, addresses: ["Malviya Nagar Main Road", "Airport Road", "Near Malviya Nagar Square"] },
];

export const INDORE_CENTER = { lat: 22.7196, lng: 75.8577 };
export const INDORE_BOUNDS = { latMin: 22.65, latMax: 22.78, lngMin: 75.83, lngMax: 75.92 };
