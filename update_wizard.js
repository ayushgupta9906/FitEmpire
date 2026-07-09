const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'fitempire-admin', 'src', 'pages', 'PartnerOnboardingPage.tsx');

const content = `import React, { useState, useEffect } from 'react';
import { 
  Building, MapPin, FileText, CheckCircle, Clock, Users, CreditCard, Landmark, Check
} from 'lucide-react';
import api from '../services/api';

const STEPS = [
  { id: 1, title: 'Basic Details', icon: Building },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Uploads', icon: FileText },
  { id: 4, title: 'Facilities', icon: CheckCircle },
  { id: 5, title: 'Plans', icon: CreditCard },
  { id: 6, title: 'Hours', icon: Clock },
  { id: 7, title: 'Capacity', icon: Users },
  { id: 8, title: 'Pricing', icon: CreditCard },
  { id: 9, title: 'Bank', icon: Landmark },
  { id: 10, title: 'Verify', icon: Check },
];

export function PartnerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [draftData, setDraftData] = useState<any>({
    gymName: '', ownerName: '', gst: '', pan: '',
    address: '', city: '', pincode: '',
    tradeLicense: '', panDoc: '', photos: [],
    facilities: { ac: false, parking: false, shower: false, wifi: false, cafe: false },
    plans: [{ name: '', months: 1, price: 0, description: '' }],
    hours: { open: '06:00', close: '22:00' },
    capacity: 50,
    basePrice: 500,
    bank: { name: '', accountNo: '', ifsc: '' }
  });
  
  // Dummy owner ID for now
  const ownerId = "11111111-1111-1111-1111-111111111111";

  useEffect(() => {
    // Fetch draft on load
    api.get(\`/gyms/onboarding/draft/\${ownerId}\`).then(res => {
        if(res.data?.data?.draftData) {
            try {
                const parsed = JSON.parse(res.data.data.draftData);
                if(Object.keys(parsed).length > 0) setDraftData(parsed);
                if(res.data.data.currentStep) setCurrentStep(res.data.data.currentStep);
            } catch(e) {}
        }
    }).catch(e => console.error(e));
  }, []);

  const updateDraft = (key: string, value: any) => {
    setDraftData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (currentStep < 10) {
        await api.post(\`/gyms/onboarding/draft/\${ownerId}\`, {
          currentStep: currentStep + 1,
          draftData: JSON.stringify(draftData)
        });
        setCurrentStep(s => s + 1);
      } else {
        await api.post(\`/gyms/onboarding/submit/\${ownerId}\`);
        alert("Registration Submitted Successfully!");
      }
    } catch (e) {
      alert("Error saving draft");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Partner Onboarding</h1>
          <p className="text-slate-500 mt-1">Register your gym to start earning on FitEmpire.</p>
        </div>
      </div>

      {/* Progress Wizard Header */}
      <div className="flex items-center justify-between overflow-x-auto pb-4 custom-scrollbar">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center mx-2 flex-shrink-0">
              <div className={\`w-12 h-12 rounded-full flex items-center justify-center border-2 
                \${isActive ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]' : 
                  isPassed ? 'border-green-500 bg-green-500 text-white' : 
                  'border-slate-200 bg-white text-slate-400'}\`}>
                <Icon size={20} />
              </div>
              <span className={\`text-xs mt-2 font-medium \${isActive ? 'text-[#6C63FF]' : 'text-slate-500'}\`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 1: Basic Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gym Name</label>
                <input value={draftData.gymName} onChange={e=>updateDraft('gymName', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="e.g. Gold's Gym" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                <input value={draftData.ownerName} onChange={e=>updateDraft('ownerName', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
                <input value={draftData.gst} onChange={e=>updateDraft('gst', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="22AAAAA0000A1Z5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number</label>
                <input value={draftData.pan} onChange={e=>updateDraft('pan', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="ABCDE1234F" />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 2: Address Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                <input value={draftData.address} onChange={e=>updateDraft('address', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="123 Fitness Street" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input value={draftData.city} onChange={e=>updateDraft('city', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                <input value={draftData.pincode} onChange={e=>updateDraft('pincode', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="400001" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 3: Document Uploads</h2>
            <p className="text-slate-500 text-sm">Provide image URLs for your gym verification.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trade License URL</label>
                <input value={draftData.tradeLicense} onChange={e=>updateDraft('tradeLicense', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PAN Card Image URL</label>
                <input value={draftData.panDoc} onChange={e=>updateDraft('panDoc', e.target.value)} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="https://..." />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 4: Gym Facilities</h2>
            <div className="grid grid-cols-2 gap-4">
              {['AC', 'Parking', 'Shower', 'WiFi', 'Cafe'].map(f => (
                <label key={f} className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" checked={draftData.facilities[f.toLowerCase()] || false} 
                    onChange={e => updateDraft('facilities', {...draftData.facilities, [f.toLowerCase()]: e.target.checked})} 
                    className="w-5 h-5 text-[#6C63FF] rounded" />
                  <span className="font-medium text-slate-700">{f}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Step 5: Membership Plans</h2>
                <button onClick={() => updateDraft('plans', [...draftData.plans, {name: '', months: 1, price: 0, description: ''}])} className="text-sm bg-slate-100 px-3 py-1 rounded-lg font-medium">+ Add Plan</button>
            </div>
            {draftData.plans.map((plan: any, i: number) => (
                <div key={i} className="p-4 border rounded-xl space-y-3 bg-slate-50">
                    <div className="grid grid-cols-3 gap-3">
                        <input placeholder="Plan Name (e.g. Pro)" value={plan.name} onChange={e => {
                            const newPlans = [...draftData.plans]; newPlans[i].name = e.target.value; updateDraft('plans', newPlans);
                        }} className="px-3 py-2 border rounded-lg w-full" />
                        <input placeholder="Duration (Months)" type="number" value={plan.months} onChange={e => {
                            const newPlans = [...draftData.plans]; newPlans[i].months = parseInt(e.target.value); updateDraft('plans', newPlans);
                        }} className="px-3 py-2 border rounded-lg w-full" />
                        <input placeholder="Price (₹)" type="number" value={plan.price} onChange={e => {
                            const newPlans = [...draftData.plans]; newPlans[i].price = parseInt(e.target.value); updateDraft('plans', newPlans);
                        }} className="px-3 py-2 border rounded-lg w-full" />
                    </div>
                    <input placeholder="Description" value={plan.description} onChange={e => {
                            const newPlans = [...draftData.plans]; newPlans[i].description = e.target.value; updateDraft('plans', newPlans);
                    }} className="px-3 py-2 border rounded-lg w-full" />
                </div>
            ))}
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 6: Working Hours</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Time</label>
                <input value={draftData.hours.open} onChange={e=>updateDraft('hours', {...draftData.hours, open: e.target.value})} type="time" className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Closing Time</label>
                <input value={draftData.hours.close} onChange={e=>updateDraft('hours', {...draftData.hours, close: e.target.value})} type="time" className="w-full px-4 py-2 border rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 7: Gym Capacity</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Concurrent Members</label>
              <input value={draftData.capacity} onChange={e=>updateDraft('capacity', parseInt(e.target.value))} type="number" className="w-full md:w-1/2 px-4 py-2 border rounded-xl" placeholder="50" />
              <p className="text-slate-500 text-sm mt-1">This helps us manage slot bookings to prevent overcrowding.</p>
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 8: Pay-Per-Session Pricing</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price per session (₹)</label>
              <input value={draftData.basePrice} onChange={e=>updateDraft('basePrice', parseInt(e.target.value))} type="number" className="w-full md:w-1/2 px-4 py-2 border rounded-xl" placeholder="500" />
              <p className="text-slate-500 text-sm mt-1">Pricing for casual users booking a single day pass.</p>
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold">Step 9: Bank Details for Payouts</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
                <input value={draftData.bank.name} onChange={e=>updateDraft('bank', {...draftData.bank, name: e.target.value})} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="John Doe Fitness" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                <input value={draftData.bank.accountNo} onChange={e=>updateDraft('bank', {...draftData.bank, accountNo: e.target.value})} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                <input value={draftData.bank.ifsc} onChange={e=>updateDraft('bank', {...draftData.bank, ifsc: e.target.value})} type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="HDFC0001234" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 10 && (
          <div className="space-y-4 animate-in fade-in flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Ready to Submit</h2>
            <p className="text-slate-500 text-center max-w-md">
              Please review all your details. Once submitted, your application will be reviewed by the admin team within 24-48 hours.
            </p>
            <div className="w-full max-w-md bg-slate-50 p-4 rounded-xl border mt-4 text-sm font-mono text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                Data summary: {draftData.gymName} - {draftData.city}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 1 || loading}
          className="px-6 py-3 rounded-xl border border-slate-200 font-medium text-slate-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#6C63FF] font-medium text-white shadow-lg shadow-[#6C63FF]/30 hover:bg-[#5b54d6] disabled:opacity-50"
        >
          {loading ? 'Saving...' : currentStep === 10 ? 'Submit Application' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, content);
console.log("Updated PartnerOnboardingPage.tsx");
