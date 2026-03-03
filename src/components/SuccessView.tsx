import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Share2, Mail, Clock } from 'lucide-react';

interface SuccessViewProps {
  onBackToSplash: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onBackToSplash }) => {
  const adminEmail = "kirubelfikir5@gmail.com";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white"
    >
      <div className="mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100/50"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">ምዝገባው ተጠናቅቋል! <br /><span className="text-blue-600">(Registration Submitted!)</span></h1>
        <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
          Your application for the Addis Ababa World Taekwondo Open Tournament 2026 has been received successfully.
        </p>
      </div>

      <div className="w-full max-w-sm p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-6 text-left shadow-sm">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-200/60">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
            <Trophy size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">ቀጣይ እርምጃዎች</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Next Steps</p>
          </div>
        </div>
        <ul className="space-y-4">
          <li className="flex gap-4 items-start">
            <div className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 font-black text-xs text-blue-600 shadow-sm mt-0.5">1</div>
            <p className="text-sm text-slate-600 leading-snug">
              Our team will verify your payment and registration details.
            </p>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 font-black text-xs text-white shadow-md shadow-blue-600/20 mt-0.5">
              <Clock size={12} />
            </div>
            <p className="text-sm text-slate-800 font-bold leading-snug">
              You will receive a confirmation email <span className="text-blue-600">within 5 minutes.</span>
            </p>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 font-black text-xs text-blue-600 shadow-sm mt-0.5">3</div>
            <p className="text-sm text-slate-600 leading-snug">
              Check your email (and spam folder) for the official tournament schedule.
            </p>
          </li>
        </ul>
      </div>

      <div className="w-full max-w-sm p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
          <Mail size={20} />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">አዘጋጁን ያግኙ (Contact Organizer)</p>
          <a href={`mailto:${adminEmail}`} className="text-sm font-bold text-blue-900 hover:underline">{adminEmail}</a>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3 px-4">
        <button 
          onClick={onBackToSplash}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all hover:bg-slate-800"
        >
          Return to Home (ተመለስ)
        </button>
        <button 
          className="w-full py-3 bg-white text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-200 active:scale-95 transition-all hover:bg-slate-50"
        >
          <Share2 size={18} />
          Share with Team
        </button>
      </div>
    </motion.div>
  );
};

export default SuccessView;