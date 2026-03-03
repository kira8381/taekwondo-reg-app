import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  User, 
  Info, 
  ShieldAlert, 
  CreditCard, 
  Upload, 
  CheckCircle2,
  Phone,
  Mail,
  Wallet,
  Building2,
  Coins,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { Athlete } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface RegistrationFormProps {
  onSubmit: (athlete: Athlete) => void;
  onBack: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<Partial<Athlete>>({
    eventCategory: [],
    gender: 'Male',
    ageCategory: 'Senior',
    beltLevel: 'Color Belt',
    bloodType: 'O',
    medicalCondition: false,
    paymentMethod: 'Telebirr',
    registrationFee: 500
  });

  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (category: string) => {
    const current = formData.eventCategory || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setFormData(prev => ({ ...prev, eventCategory: updated }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
        setFormData(prev => ({ ...prev, paymentScreenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullName || !formData.phone || !formData.club) {
      toast.error('እባክዎ ሁሉንም አስፈላጊ መረጃዎች ይሙሉ (Please fill in all required fields)');
      return;
    }

    if (!formData.registrationFee || formData.registrationFee <= 0) {
      toast.error('እባክዎ ትክክለኛ የክፍያ መጠን ያስገቡ (Please enter a valid registration fee)');
      return;
    }

    // For non-Cash payments, require a screenshot
    if (formData.paymentMethod !== 'Cash' && !formData.paymentScreenshot) {
      toast.error('እባክዎ የክፍያውን ደረሰኝ ፎቶ ያስገቡ (Please upload your payment screenshot)');
      return;
    }

    const newAthlete: Athlete = {
      ...formData as Athlete,
      id: Math.random().toString(36).substr(2, 9),
      registrationDate: new Date().toISOString(),
    };

    onSubmit(newAthlete);
    toast.success('ምዝገባዎ በተሳካ ሁኔታ ተልኳል! (Registration submitted successfully!)');
  };

  const sectionClasses = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 mb-6";
  const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
  const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder:text-slate-400";

  const paymentMethods = [
    { id: 'Telebirr', icon: Wallet, label: 'Telebirr', description: '0913998381 (\u1328\u1348\u12a0\u12f1\u1235 \u12a0\u1266\u1263 \u1274\u12ca\u1295\u12f6)', color: 'blue' },
    { id: 'CBE Birr', icon: Building2, label: 'CBE Birr', description: '1000123456789 (\u1328\u1348\u12a0\u12f1\u1235 \u12a0\u1266\u1263 \u1274\u12ca\u1295\u12f6)', color: 'green' },
    { id: 'Bank Transfer', icon: Receipt, label: 'Bank Transfer', description: 'CBE / Abyssinia / Dashen', color: 'indigo' },
    { id: 'Cash', icon: Coins, label: 'Cash', description: 'Pay at the reception', color: 'yellow' },
  ];

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="min-h-screen w-full bg-slate-50 pb-12"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold text-lg text-blue-900 uppercase tracking-tight">Athlete Registration</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="px-4 mt-6 max-w-2xl mx-auto">
        
        {/* 1. Personal Information */}
        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <User size={18} />
            <h3 className="font-bold">Personal Information</h3>
          </div>

          <div>
            <label className={labelClasses}>Full Name *</label>
            <input 
              name="fullName" 
              required 
              onChange={handleInputChange} 
              className={inputClasses} 
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Gender</label>
              <select name="gender" onChange={handleInputChange} className={inputClasses}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Date of Birth</label>
              <input name="dateOfBirth" type="date" required onChange={handleInputChange} className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Age Category</label>
              <select name="ageCategory" onChange={handleInputChange} className={inputClasses}>
                <option value="Cadet">Cadet</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Nationality</label>
              <input name="nationality" placeholder="e.g. Ethiopian" onChange={handleInputChange} className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Phone *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  name="phone" 
                  required 
                  onChange={handleInputChange} 
                  className={inputClasses.replace('px-4', 'pl-11 pr-4')} 
                  placeholder="0911..." 
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  name="email" 
                  type="email" 
                  onChange={handleInputChange} 
                  className={inputClasses.replace('px-4', 'pl-11 pr-4')} 
                  placeholder="name@email.com" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Competition Information */}
        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2 text-green-600">
            <Info size={18} />
            <h3 className="font-bold">Competition Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Club / Team *</label>
              <input name="club" required onChange={handleInputChange} className={inputClasses} placeholder="Club name" />
            </div>
            <div>
              <label className={labelClasses}>Coach Name</label>
              <input name="coach" onChange={handleInputChange} className={inputClasses} placeholder="Coach name" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Belt Level</label>
              <select name="beltLevel" onChange={handleInputChange} className={inputClasses}>
                <option value="Color Belt">Color Belt</option>
                <option value="Black Belt">Black Belt</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Dan / Kup</label>
              <input name="danKup" onChange={handleInputChange} className={inputClasses} placeholder="e.g. 1st Dan" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Weight (KG)</label>
              <input name="weightCategory" type="number" step="0.1" onChange={handleInputChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Height (CM)</label>
              <input name="height" type="number" onChange={handleInputChange} className={inputClasses} />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Event Category</label>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Kyorugi', 'Poomsae', 'Both'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={() => handleCheckboxChange(cat)}
                    checked={formData.eventCategory?.includes(cat)}
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Medical & Emergency */}
        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <ShieldAlert size={18} />
            <h3 className="font-bold">Medical & Emergency</h3>
          </div>

          <div>
            <label className={labelClasses}>Blood Type</label>
            <select name="bloodType" onChange={handleInputChange} className={inputClasses}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-bold text-slate-700">Any Medical Condition?</p>
              <p className="text-xs text-slate-500">Allergies, injuries, etc.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, medicalCondition: !prev.medicalCondition }))}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                formData.medicalCondition ? "bg-red-500" : "bg-slate-300"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                formData.medicalCondition ? "left-7" : "left-1"
              )} />
            </button>
          </div>

          {formData.medicalCondition && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2 overflow-hidden"
            >
              <label className={labelClasses}>Describe Condition</label>
              <textarea 
                name="medicalConditionDetail" 
                onChange={handleInputChange} 
                className={cn(inputClasses, "min-h-[100px] resize-none")}
                placeholder="Details here..."
              />
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Emergency Contact</label>
              <input name="emergencyContact" onChange={handleInputChange} className={inputClasses} placeholder="Name" />
            </div>
            <div>
              <label className={labelClasses}>Emergency Phone</label>
              <input name="emergencyPhone" onChange={handleInputChange} className={inputClasses} placeholder="09..." />
            </div>
          </div>
        </section>

        {/* 4. Payment */}
        <section className={sectionClasses}>
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <CreditCard size={18} />
            <h3 className="font-bold">Payment Dashboard</h3>
          </div>

          {/* Payment Summary Header - FLEXIBLE FEE */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg mb-6">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100 opacity-80">Registration Fee (Flexible)</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative group">
                  <input
                    type="number"
                    name="registrationFee"
                    value={formData.registrationFee}
                    onChange={handleInputChange}
                    className="bg-white/10 text-3xl font-black w-36 px-4 py-2 rounded-2xl border border-white/30 focus:border-white focus:bg-white/20 outline-none transition-all placeholder:text-white/30"
                    placeholder="500"
                    required
                  />
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-yellow-400 text-blue-900 p-1 rounded-full shadow-lg">
                      <Info size={12} />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold opacity-80 uppercase">ETB</span>
              </div>
              <p className="text-[11px] mt-4 flex items-center gap-1 text-blue-50 font-medium">
                <AlertCircle size={14} className="opacity-80" />
                \u12e8\u12ad\u134d\u12eb\u12cd\u1295 \u1218\u1320\u1295 \u1218\u1208\u12c8\u1325 \u12ed\u127d\u120b\u1209 (You can adjust the amount)
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          </div>

          <div>
            <label className={labelClasses}>Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 transition-all duration-200 text-left flex flex-col items-start gap-2",
                    formData.paymentMethod === method.id 
                      ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    formData.paymentMethod === method.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <method.icon size={20} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-tight",
                      formData.paymentMethod === method.id ? "text-blue-900" : "text-slate-700"
                    )}>{method.label}</p>
                  </div>
                  {formData.paymentMethod === method.id && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-blue-600 rounded-full p-0.5">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={formData.paymentMethod}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Method Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <p className={labelClasses}>Instructions</p>
                <div className="flex items-start gap-3 mt-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    {paymentMethods.find(m => m.id === formData.paymentMethod)?.icon && 
                     React.createElement(paymentMethods.find(m => m.id === formData.paymentMethod)!.icon, { size: 18, className: "text-blue-600" })}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {paymentMethods.find(m => m.id === formData.paymentMethod)?.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {paymentMethods.find(m => m.id === formData.paymentMethod)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-3">
                <label className={labelClasses}>
                  {formData.paymentMethod === 'Cash' ? 'Upload Receipt (Optional)' : 'Upload Screenshot *'}
                </label>
                <div 
                  className={cn(
                    "relative h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden",
                    screenshot ? "border-green-400 bg-green-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                  )}
                >
                  {screenshot ? (
                    <div className="relative w-full h-full group">
                      <img src={screenshot} className="w-full h-full object-cover" alt="Screenshot" />
                      <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-center">
                          <Upload className="mx-auto text-white mb-2" size={24} />
                          <p className="text-white text-[10px] font-bold uppercase">Tap to Replace</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Upload className="text-blue-600" size={20} />
                      </div>
                      <p className="text-xs text-slate-800 font-bold mb-1">Click or Drag to Upload</p>
                      <p className="text-[10px] text-slate-400">Supported: JPG, PNG, PDF</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-8"
        >
          <CheckCircle2 size={20} />
          COMPLETE REGISTRATION
        </button>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;