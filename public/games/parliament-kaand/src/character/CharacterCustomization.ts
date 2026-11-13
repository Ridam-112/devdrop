export type HairStyle = 'CLASSIC_PARTED' | 'GANDHI_TOPI' | 'CURLY_CROP' | 'TURBAN';
export type OutfitStyle = 'NEHRU_JACKET_KURTA' | 'FORMAL_SUIT' | 'TRADITIONAL_KURTA';

export interface CharacterCustomizationConfig {
  name: string;
  party: string;
  constituency: string;
  hairStyle: HairStyle;
  outfitStyle: OutfitStyle;
  jacketColor: string;
  kurtaColor: string;
  trouserColor: string;
  shoeColor: string;
  skinTone: string;
  hairColor: string;
  glasses: boolean;
  stole: boolean;
  stoleColor: string;
  partyBadge: boolean;
  mustache: boolean;
}

export const DEFAULT_MP_CUSTOMIZATION: CharacterCustomizationConfig = {
  name: "Hon'ble MP Rajesh Sharma",
  party: "Jan Kalyan Front (JKF)",
  constituency: "North Delhi Central",
  hairStyle: "CLASSIC_PARTED",
  outfitStyle: "NEHRU_JACKET_KURTA",
  jacketColor: "#1e3a8a", // Royal Blue Nehru Jacket
  kurtaColor: "#f8fafc",  // Pure White Khadi Kurta
  trouserColor: "#f1f5f9", // Crisp White Pajama
  shoeColor: "#1c1917",   // Formal Oxford Black Shoes
  skinTone: "#d97706",    // Warm Indian skin tone
  hairColor: "#1e293b",   // Dark charcoal black hair
  glasses: true,          // Round gold-rimmed parliament spectacles
  stole: true,            // Silk stole
  stoleColor: "#f59e0b",  // Golden saffron stole
  partyBadge: true,       // Lapel badge
  mustache: true,         // Dignified mustache
};
