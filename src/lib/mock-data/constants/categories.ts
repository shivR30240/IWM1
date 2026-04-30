import type { TicketCategory } from "@/types";

export interface CategoryInfo {
  id: TicketCategory;
  name: string;
  nameHi: string;
  icon: string;
  templates: { en: string; hi: string }[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "water_supply", name: "Water Supply", nameHi: "जल आपूर्ति", icon: "Droplets",
    templates: [
      { en: "No water supply in {area} since {days} days. Taps are completely dry.", hi: "{area} में {days} दिनों से पानी की सप्लाई बंद है। नल पूरी तरह सूखे हैं।" },
      { en: "Water pressure extremely low in {area}. Unable to fill tanks.", hi: "{area} में पानी का प्रेशर बहुत कम है। टंकी नहीं भर पा रही।" },
      { en: "Contaminated water coming from taps in {area}. Water is yellowish.", hi: "{area} में नल से गंदा पानी आ रहा है। पानी पीला दिख रहा है।" },
      { en: "Water pipeline burst near {address}. Water wasting on road.", hi: "{address} के पास पानी की पाइपलाइन फट गई है। सड़क पर पानी बह रहा है।" },
    ],
  },
  {
    id: "drainage", name: "Drainage", nameHi: "नाली/सीवर", icon: "Waves",
    templates: [
      { en: "Drainage overflowing in {area}. Sewage water on the street.", hi: "{area} में नाली उबल रही है। गंदा पानी सड़क पर आ रहा है।" },
      { en: "Blocked drain near {address}. Causing waterlogging.", hi: "{address} के पास नाली बंद है। पानी जमा हो रहा है।" },
      { en: "Sewer line damaged in {area}. Bad smell throughout the area.", hi: "{area} में सीवर लाइन टूटी है। पूरे इलाके में बदबू आ रही है।" },
    ],
  },
  {
    id: "roads", name: "Roads", nameHi: "सड़कें", icon: "Route",
    templates: [
      { en: "Large pothole on {address}. Dangerous for vehicles.", hi: "{address} पर बड़ा गड्ढा है। वाहनों के लिए खतरनाक है।" },
      { en: "Road completely damaged in {area}. Needs immediate repair.", hi: "{area} में सड़क पूरी तरह टूट चुकी है। तुरंत मरम्मत जरूरी।" },
      { en: "Road digging work left incomplete near {address}. No barricades.", hi: "{address} के पास सड़क खुदाई का काम अधूरा छोड़ दिया। कोई बैरिकेड नहीं।" },
    ],
  },
  {
    id: "electricity", name: "Electricity", nameHi: "बिजली", icon: "Zap",
    templates: [
      { en: "Power outage in {area} for {days} days. No information given.", hi: "{area} में {days} दिनों से बिजली गुल है। कोई जानकारी नहीं दी गई।" },
      { en: "Electricity wire hanging dangerously low near {address}.", hi: "{address} के पास बिजली का तार खतरनाक रूप से नीचे लटक रहा है।" },
      { en: "Frequent power cuts in {area}. 4-5 times daily.", hi: "{area} में बार-बार बिजली कट हो रही है। दिन में 4-5 बार।" },
    ],
  },
  {
    id: "sanitation", name: "Sanitation", nameHi: "स्वच्छता", icon: "Sparkles",
    templates: [
      { en: "Open defecation issue near {address}. Needs public toilet.", hi: "{address} के पास खुले में शौच की समस्या। सार्वजनिक शौचालय जरूरी।" },
      { en: "Unhygienic conditions in {area} market area.", hi: "{area} बाज़ार क्षेत्र में अस्वच्छ स्थिति है।" },
    ],
  },
  {
    id: "garbage_collection", name: "Garbage Collection", nameHi: "कचरा संग्रहण", icon: "Trash2",
    templates: [
      { en: "Garbage not collected from {area} for {days} days. Piling up.", hi: "{area} में {days} दिनों से कचरा नहीं उठाया गया। ढेर लग रहा है।" },
      { en: "Garbage dump on vacant plot near {address}. Health hazard.", hi: "{address} के पास खाली प्लॉट पर कचरे का ढेर। स्वास्थ्य को खतरा।" },
      { en: "No dustbin placed in {area}. People throwing garbage on road.", hi: "{area} में कोई कूड़ेदान नहीं रखा। लोग सड़क पर कचरा फेंक रहे हैं।" },
    ],
  },
  {
    id: "street_lights", name: "Street Lights", nameHi: "सड़क बत्ती", icon: "Lightbulb",
    templates: [
      { en: "Street lights not working in {area} for a week. Very dark at night.", hi: "{area} में एक हफ्ते से स्ट्रीट लाइट बंद हैं। रात में अंधेरा रहता है।" },
      { en: "Broken street light pole near {address}. Safety risk.", hi: "{address} के पास स्ट्रीट लाइट का खंभा टूटा है। सुरक्षा का खतरा।" },
    ],
  },
  {
    id: "parks", name: "Parks & Gardens", nameHi: "पार्क और उद्यान", icon: "TreePine",
    templates: [
      { en: "Park in {area} not maintained. Overgrown grass, broken benches.", hi: "{area} के पार्क की देखभाल नहीं हो रही। घास बढ़ी हुई, टूटी बेंच।" },
      { en: "Playground equipment broken in {area} park. Dangerous for children.", hi: "{area} पार्क में खेल के उपकरण टूटे हुए हैं। बच्चों के लिए खतरनाक।" },
    ],
  },
  {
    id: "building_permits", name: "Building & Permits", nameHi: "भवन और अनुमति", icon: "Building2",
    templates: [
      { en: "Illegal construction near {address}. No permit displayed.", hi: "{address} के पास अवैध निर्माण। कोई अनुमति नहीं दिखाई।" },
      { en: "Building encroachment on public footpath in {area}.", hi: "{area} में सार्वजनिक फुटपाथ पर भवन अतिक्रमण।" },
    ],
  },
  {
    id: "other", name: "Other", nameHi: "अन्य", icon: "HelpCircle",
    templates: [
      { en: "Stray animal menace in {area}. Dogs attacking passersby.", hi: "{area} में आवारा जानवरों का आतंक। कुत्ते राहगीरों पर हमला कर रहे।" },
      { en: "Noise pollution from construction in {area} during night hours.", hi: "{area} में रात के समय निर्माण कार्य से ध्वनि प्रदूषण।" },
    ],
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
