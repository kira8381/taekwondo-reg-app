import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  Download, 
  LogOut, 
  ChevronRight,
  User,
  Shield,
  Weight,
  Target,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Users
} from 'lucide-react';
import { Athlete, AppScreen } from '../types';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface AdminPanelProps {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  athletes: Athlete[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ screen, setScreen, athletes }) => {
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState<string>('All');
  const [filterBelt, setFilterBelt] = useState<string>('All');
  const [filterWeight, setFilterWeight] = useState<string>('All');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') {
      setScreen('admin-dashboard');
      toast.success('እንኳን በደህና መጡ! (Welcome, Administrator)');
    } else {
      toast.error('የይለፍ ቃል የተሳሳተ ነው! (Invalid credentials)');
    }
  };

  const filteredAthletes = useMemo(() => {
    return athletes.filter(a => {
      const matchesSearch = a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           a.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           a.phone.includes(searchTerm);
      
      const matchesAge = filterAge === 'All' || a.ageCategory === filterAge;
      const matchesBelt = filterBelt === 'All' || a.beltLevel === filterBelt;
      
      let matchesWeight = true;
      if (filterWeight !== 'All') {
        const weight = a.weightCategory;
        if (filterWeight === 'Under 45') matchesWeight = weight < 45;
        else if (filterWeight === '45-55') matchesWeight = weight >= 45 && weight < 55;
        else if (filterWeight === '55-65') matchesWeight = weight >= 55 && weight < 65;
        else if (filterWeight === '65-75') matchesWeight = weight >= 65 && weight < 75;
        else if (filterWeight === 'Over 75') matchesWeight = weight >= 75;
      }

      return matchesSearch && matchesAge && matchesBelt && matchesWeight;
    });
  }, [athletes, searchTerm, filterAge, filterBelt, filterWeight]);

  const exportToExcel = () => {
    if (filteredAthletes.length === 0) {
      toast.error('ለኤክስፖርት የሚሆን ዳታ የለም! (No data to export)');
      return;
    }
    
    // Prepare data for Excel
    const dataToExport = filteredAthletes.map(a => ({
      'Full Name': a.fullName,
      'Gender': a.gender,
      'Age Category': a.ageCategory,
      'Belt Level': a.beltLevel,
      'Club': a.club,
      'Weight (KG)': a.weightCategory,
      'Phone': a.phone,
      'Email': a.email,
      'Coach': a.coach,
      'Payment Method': a.paymentMethod,
      'Registration Fee': a.registrationFee,
      'Registration Date': new Date(a.registrationDate).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registered_Athletes");
    
    // Write and Download
    XLSX.writeFile(workbook, `Addis_Taekwondo_Athletes_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('ኤክሴል ፋይል በተሳካ ሁኔታ ተዘጋጅቷል! (Excel file exported successfully)');
  };

  if (screen === 'admin-login') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        
        <button 
          onClick={() => setScreen('splash')}
          className="absolute top-8 left-6 text-white/60 hover:text-white flex items-center gap-2 transition-colors z-10"
        >
          <ArrowLeft size={20} />
          መነሻ ገጽ (Back)
        </button>
        
        <div className="w-full max-w-sm space-y-8 relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-blue-600/20">
              <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">የአስተዳዳሪ መግቢያ</h1>
            <p className="text-slate-400 mt-2 text-sm">Enter your credentials to manage athletes</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] mt-2"
            >
              ይግቡ (Sign In)
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#F8FAFC] pb-20"
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">የአስተዳዳሪ ዳሽቦርድ</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Admin Dashboard • 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95"
            >
              <FileSpreadsheet size={18} />
              Excel Export
            </button>
            <button 
              onClick={() => setScreen('splash')}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-slate-100"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Athletes" value={athletes.length} icon={<Users className="text-blue-500" />} color="blue" />
          <StatCard label="Black Belts" value={athletes.filter(a => a.beltLevel === 'Black Belt').length} icon={<Shield className="text-amber-500" />} color="amber" />
          <StatCard label="Seniors" value={athletes.filter(a => a.ageCategory === 'Senior').length} icon={<Target className="text-red-500" />} color="red" />
          <StatCard label="Total Clubs" value={new Set(athletes.map(a => a.club)).size} icon={<Weight className="text-emerald-500" />} color="emerald" />
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="በስም ወይም በክለብ ይፈልጉ... (Search by name or club...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age Category</label>
                <div className="relative">
                  <select 
                    value={filterAge}
                    onChange={(e) => setFilterAge(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="All">All Ages</option>
                    <option value="Cadet">Cadet</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                  </select>
                  <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Belt Level</label>
                <div className="relative">
                  <select 
                    value={filterBelt}
                    onChange={(e) => setFilterBelt(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="All">All Belts</option>
                    <option value="Color Belt">Color Belt</option>
                    <option value="Black Belt">Black Belt</option>
                  </select>
                  <Shield size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Weight Range</label>
                <div className="relative">
                  <select 
                    value={filterWeight}
                    onChange={(e) => setFilterWeight(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="All">All Weights</option>
                    <option value="Under 45">Under 45kg</option>
                    <option value="45-55">45-55kg</option>
                    <option value="55-65">55-65kg</option>
                    <option value="65-75">65-75kg</option>
                    <option value="Over 75">Over 75kg</option>
                  </select>
                  <Weight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-800 text-xl">የተመዘገቡ ስፖርተኞች</h2>
            <span className="bg-blue-100 text-blue-600 px-3 py-0.5 rounded-full text-xs font-black">{filteredAthletes.length}</span>
          </div>
          <button 
            onClick={exportToExcel}
            className="md:hidden p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
          >
            <Download size={20} />
          </button>
        </div>

        {/* Athletes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAthletes.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-slate-500 font-medium">ምንም አይነት መረጃ አልተገኘም (No athletes found matching criteria)</p>
            </div>
          ) : (
            filteredAthletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} onClick={() => setSelectedAthlete(athlete)} />
            ))
          )}
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedAthlete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAthlete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white relative">
                <button 
                  onClick={() => setSelectedAthlete(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black">
                    {selectedAthlete.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedAthlete.fullName}</h2>
                    <p className="text-blue-100 text-sm opacity-80">{selectedAthlete.club} • {selectedAthlete.beltLevel}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Gender" value={selectedAthlete.gender} />
                  <DetailItem label="Birth Date" value={selectedAthlete.dateOfBirth} />
                  <DetailItem label="Age Category" value={selectedAthlete.ageCategory} />
                  <DetailItem label="Nationality" value={selectedAthlete.nationality} />
                  <DetailItem label="Weight" value={`${selectedAthlete.weightCategory} KG`} />
                  <DetailItem label="Height" value={`${selectedAthlete.height} CM`} />
                </div>
                
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <DetailItem label="Phone" value={selectedAthlete.phone} />
                    <DetailItem label="Email" value={selectedAthlete.email || 'N/A'} />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Competition & Medical</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Coach" value={selectedAthlete.coach || 'N/A'} />
                    <DetailItem label="Events" value={selectedAthlete.eventCategory.join(', ')} />
                    <DetailItem label="Blood Type" value={selectedAthlete.bloodType} />
                    <DetailItem label="Condition" value={selectedAthlete.medicalCondition ? selectedAthlete.medicalConditionDetail || 'Yes' : 'None'} />
                  </div>
                </div>

                {selectedAthlete.paymentScreenshot && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Receipt</h4>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={selectedAthlete.paymentScreenshot} alt="Receipt" className="w-full object-contain max-h-[400px]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => setSelectedAthlete(null)}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>{icon}</div>
        <span className="text-2xl font-black text-slate-900">{value}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
    </div>
  );
};

const AthleteCard = ({ athlete, onClick }: { athlete: Athlete, onClick: () => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={onClick}
    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-100">
          {athlete.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 truncate text-base">{athlete.fullName}</h3>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{athlete.club}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">{athlete.ageCategory}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${athlete.beltLevel === 'Black Belt' ? 'bg-slate-900 text-amber-400' : 'bg-green-50 text-green-700'}`}>
              {athlete.beltLevel}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] font-bold text-slate-300 uppercase mb-1">{new Date(athlete.registrationDate).toLocaleDateString()}</div>
        <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
      <div className="flex items-center gap-2 text-slate-400">
        <Weight size={14} />
        <span className="text-[11px] font-bold">{athlete.weightCategory} KG</span>
      </div>
      <div className="flex items-center gap-2 text-slate-400 justify-end">
        <User size={14} />
        <span className="text-[11px] font-bold uppercase">{athlete.gender}</span>
      </div>
    </div>
  </motion.div>
);

const DetailItem = ({ label, value }: { label: string, value: string | number }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value}</p>
  </div>
);

export default AdminPanel;