import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import Splash from './components/Splash';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import SuccessView from './components/SuccessView';
import { AppScreen, Athlete } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load athletes from Supabase instead of localStorage
  useEffect(() => {
    const fetchAthletes = async () => {
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching athletes:', error.message);
        // Fallback to localStorage for demo persistence if Supabase fails
        const saved = localStorage.getItem('taekwondo_athletes');
        if (saved) setAthletes(JSON.parse(saved));
      } else if (data) {
        // Map DB snake_case to TS camelCase
        const mappedData: Athlete[] = data.map((d: any) => ({
          id: d.id,
          fullName: d.full_name,
          gender: d.gender,
          dateOfBirth: d.date_of_birth,
          ageCategory: d.age_category,
          nationality: d.nationality,
          phone: d.phone,
          email: d.email,
          club: d.club,
          coach: d.coach,
          beltLevel: d.belt_level,
          danKup: d.dan_kup,
          weightCategory: d.weight_category,
          height: d.height,
          eventCategory: d.event_category || [],
          bloodType: d.blood_type,
          medicalCondition: d.medical_condition,
          medicalConditionDetail: d.medical_condition_detail,
          emergencyContact: d.emergency_contact,
          emergencyPhone: d.emergency_phone,
          paymentMethod: d.payment_method,
          paymentScreenshot: d.payment_screenshot,
          registrationFee: d.registration_fee,
          registrationDate: d.registration_date,
        }));
        setAthletes(mappedData);
      }
    };

    fetchAthletes();
  }, [currentScreen]);

  const saveAthlete = async (athlete: Athlete) => {
    setIsLoading(true);
    
    // 1. Save to Supabase
    const { error } = await supabase.from('athletes').insert({
      full_name: athlete.fullName,
      gender: athlete.gender,
      date_of_birth: athlete.dateOfBirth,
      age_category: athlete.ageCategory,
      nationality: athlete.nationality,
      phone: athlete.phone,
      email: athlete.email,
      club: athlete.club,
      coach: athlete.coach,
      belt_level: athlete.beltLevel,
      dan_kup: athlete.danKup,
      weight_category: athlete.weightCategory,
      height: athlete.height,
      event_category: athlete.eventCategory,
      blood_type: athlete.bloodType,
      medical_condition: athlete.medicalCondition,
      medical_condition_detail: athlete.medicalConditionDetail,
      emergency_contact: athlete.emergencyContact,
      emergency_phone: athlete.emergencyPhone,
      payment_method: athlete.paymentMethod,
      payment_screenshot: athlete.paymentScreenshot,
      registration_fee: athlete.registrationFee,
    });

    if (error) {
      console.error('Registration Error:', error.message);
      toast.error('\u121d\u12dd\u1308\u1263 \u12a0\u120d\u1270\u1233\u12ab\u121d:: ' + error.message);
      setIsLoading(false);
      return;
    }

    // 2. Fallback local update
    const updated = [...athletes, athlete];
    setAthletes(updated);
    localStorage.setItem('taekwondo_athletes', JSON.stringify(updated));
    
    // 3. Trigger Email (Informed through toast as requested)
    // The admin notification is triggered automatically by the DB trigger on insert.
    // The athlete confirmation is still simulated here or can be added to the edge function.
    
    toast.success('\u121d\u12dd\u1308\u1263\u12ce \u1260\u1270\u1233\u12ab \u1201\u1294\u1273 \u1270\u120d\u12b3\u120d! (Registration successful!)');
    toast.info('\u12e8\u121b\u1228\u130b\u1308\u132b \u1218\u120d\u12a5\u12ad\u1275 \u1260 5 \u12f0\u1242\u1243 \u12cd\u1235\u1325 \u12ed\u12f0\u122d\u1235\u12ce\u1273\u120d! (Confirmation arriving soon!)');
    
    setIsLoading(false);
    setCurrentScreen('success');
  };

  const navigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <Splash key="splash" onStart={() => navigate('registration')} onAdmin={() => navigate('admin-login')} />
        )}
        {currentScreen === 'registration' && (
          <RegistrationForm 
            key="reg" 
            onSubmit={saveAthlete} 
            onBack={() => navigate('splash')} 
          />
        )}
        {currentScreen === 'success' && (
          <SuccessView key="success" onBackToSplash={() => navigate('splash')} />
        )}
        {currentScreen === 'admin-login' || currentScreen === 'admin-dashboard' ? (
          <AdminPanel 
            key="admin" 
            screen={currentScreen} 
            setScreen={navigate} 
            athletes={athletes} 
          />
        ) : null}
      </AnimatePresence>
      <Toaster position="top-center" richColors expand={true} />
    </div>
  );
};

export default App;