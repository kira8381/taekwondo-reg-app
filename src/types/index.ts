export interface Athlete {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  ageCategory: 'Cadet' | 'Junior' | 'Senior';
  nationality: string;
  phone: string;
  email: string;
  club: string;
  coach: string;
  beltLevel: 'Color Belt' | 'Black Belt';
  danKup: string;
  weightCategory: number;
  height: number;
  eventCategory: string[];
  bloodType: 'A' | 'B' | 'AB' | 'O';
  medicalCondition: boolean;
  medicalConditionDetail?: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Bank Transfer' | 'Cash';
  paymentScreenshot?: string;
  registrationFee: number;
  registrationDate: string;
}

export type AppScreen = 'splash' | 'registration' | 'admin-login' | 'admin-dashboard' | 'success';