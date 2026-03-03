import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, UserCog, Mail } from 'lucide-react';

interface SplashProps {
  onStart: () => void;
  onAdmin: () => void;
}

const Splash: React.FC<SplashProps> = ({ onStart, onAdmin }) => {
  const logoUrl = "https://storage.googleapis.com/dala-prod-public-storage/attachments/6497176a-f745-4485-bb74-0dcedcab5db4/1772512446143_IMG_20260303_072854_807.jpg";
  const bgUrl = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/ee2477f7-3ea1-4907-a26a-4b19ee3ef57f/action-kick-background-b1c3d4b4-1772512515029.webp";
  const adminEmail = "kirubelfikir5@gmail.com";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-between min-h-screen w-full px-6 py-12 text-center text-white overflow-hidden"
    >
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-blue-900/90" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-full p-6 flex items-center justify-center border-4 border-yellow-400 shadow-2xl shadow-yellow-400/20"
        >
          <img 
            src={logoUrl} 
            alt="Chefe Addis Ababa Taekwondo Logo" 
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 w-full"
        >
          <div className="inline-block px-4 py-1.5 bg-yellow-400 text-blue-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-2 shadow-lg">
            \u1328\u1348\u12a0\u12f1\u1235 \u12a0\u1266\u1263 \u1274\u12ca\u1295\u12f6 (Chefe Addis Ababa Taekwondo)
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Addis Ababa World <br /> 
            <span className="text-yellow-400">Taekwondo</span> <br />
            Open Tournament 2026
          </h1>
          
          <div className="flex flex-col items-center space-y-2 text-blue-100/90">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-green-400" />
              <p className="font-semibold">April 05\u201308, 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <p className="text-sm">Addis Ababa, Ethiopia</p>
            </div>
          </div>

          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-xs font-medium">
              <Mail size={14} className="text-yellow-400" />
              <span>Contact: {adminEmail}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs space-y-4"
      >
        <button
          onClick={onStart}
          className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-xl shadow-lg shadow-yellow-400/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Trophy size={20} />
          REGISTER NOW
        </button>
        
        <button
          onClick={onAdmin}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white/80 font-medium rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
        >
          <UserCog size={18} />
          Admin Access
        </button>
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-8 flex gap-2">
        <div className="w-8 h-1 bg-green-500 rounded-full" />
        <div className="w-8 h-1 bg-yellow-400 rounded-full" />
        <div className="w-8 h-1 bg-red-500 rounded-full" />
      </div>
    </motion.div>
  );
};

export default Splash;