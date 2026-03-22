import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, CupSoda } from 'lucide-react';
import DragonMascot from './components/DragonMascot';

const CHE_THAI_PRICE = 5;

export default function App() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    netId: '',
    gradYear: '',
    quantity: 0,
    paymentMethod: '',
    referrals: '',
    pickupAgreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.netId || !formData.gradYear) {
        alert('Please fill out all required personal info fields.');
        return;
      }
    }
    if (step === 2) {
      if (formData.quantity < 1) {
        alert('Please order at least 1 cup of Chè Thái!');
        return;
      }
    }
    if (step === 3) {
      if (!formData.paymentMethod) {
        alert('Please provide your Venmo ID or Phone Number.');
        return;
      }
      if (!formData.pickupAgreed) {
        alert('You must agree to the pickup terms to proceed.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalCost: formData.quantity * CHE_THAI_PRICE,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit order');
      }

      setStep(4); // Success step
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDragonMessage = () => {
    switch (step) {
      case 0: return "Hi there! I'm the Cornell Dragon Boat mascot. Ready for some delicious Chè Thái?";
      case 1: return "Awesome! Let's get some basic info so we know who you are.";
      case 2: return "Yum! How many cups of Chè Thái would you like? They are $5 each.";
      case 3: return "Almost done! Just need your payment info and pickup confirmation.";
      case 4: return "Roar-some! Your order is placed. Don't forget to send your payment!";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 font-sans flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-lg">
        <DragonMascot message={getDragonMessage()} />

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 relative">
          
          {/* Progress Bar */}
          {step < 4 && (
            <div className="h-2 bg-emerald-100 w-full">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <div className="p-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 0: Intro */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <h1 className="text-3xl font-bold text-emerald-900">
                    Cornell Dragon Boat Club
                  </h1>
                  <h2 className="text-xl font-medium text-emerald-700">
                    Chè Thái Fundraiser!
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Please support our goal of racing in San Francisco by purchasing a delicious, refreshing cup of sweet Vietnamese fruit cocktail :))
                  </p>
                  <button
                    onClick={handleNext}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-8"
                  >
                    Start Order <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-6">Personal Info</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ezra Cornell"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="ezra@cornell.edu"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Net ID *</label>
                      <input
                        type="text"
                        name="netId"
                        value={formData.netId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="ec123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Grad Year *</label>
                      <select
                        name="gradYear"
                        value={formData.gradYear}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                    <button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                      Next <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Order */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-2">Your Order</h2>
                  
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center">
                    <CupSoda className="w-16 h-16 text-emerald-500 mb-4" />
                    <label className="block text-lg font-medium text-emerald-900 mb-4">
                      Quantity of Chè Thái cups
                    </label>
                    
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setFormData(p => ({ ...p, quantity: Math.max(0, p.quantity - 1) }))}
                        className="w-12 h-12 rounded-full bg-white border-2 border-emerald-200 text-emerald-600 text-2xl font-bold flex items-center justify-center hover:bg-emerald-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-4xl font-bold text-emerald-900 w-12 text-center">
                        {formData.quantity}
                      </span>
                      <button 
                        onClick={() => setFormData(p => ({ ...p, quantity: p.quantity + 1 }))}
                        className="w-12 h-12 rounded-full bg-emerald-600 text-white text-2xl font-bold flex items-center justify-center hover:bg-emerald-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-slate-100">
                    <span className="text-lg text-slate-600">Total Cost:</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      ${formData.quantity * CHE_THAI_PRICE}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                    <button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                      Next <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment & Pickup */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-4">Payment & Pickup</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number or Venmo ID *
                    </label>
                    <p className="text-xs text-slate-500 mb-2">Whichever payment method you will use.</p>
                    <input
                      type="text"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="@ezra-cornell or 607-123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Referrals
                    </label>
                    <p className="text-xs text-slate-500 mb-2">If a club member referred you, please write their name(s).</p>
                    <input
                      type="text"
                      name="referrals"
                      value={formData.referrals}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="pickupAgreed"
                        checked={formData.pickupAgreed}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-amber-900 leading-relaxed font-medium">
                        I agree to pick up my order from Willard Straight Hall on April 10, 2026 between 10am-2pm. If not, I will send a friend to pick them up. *
                      </span>
                    </label>
                  </div>

                  {submitError && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button onClick={handleBack} disabled={isSubmitting} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50">
                      Back
                    </button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                      ) : (
                        <><CheckCircle2 className="w-5 h-5" /> Submit Order</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-emerald-900">Thank You!</h2>
                  <p className="text-slate-600">Your order has been recorded.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 mt-8">
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-2">Payment Instructions</h3>
                    
                    <div className="space-y-3 text-sm text-slate-700">
                      <p>
                        <strong className="text-emerald-700">Step 1:</strong> Venmo <strong className="text-slate-900">@HilaryKuang</strong> or Zelle <strong className="text-slate-900">415-307-1306</strong> for your order to be purchased! 
                        <br/><span className="text-slate-500 italic mt-1 block">If you don't have Venmo or Zelle, stop by our table and order in-person with cash.</span>
                      </p>
                      <p>
                        <strong className="text-emerald-700">Step 2:</strong> Write <strong className="bg-emerald-100 px-2 py-1 rounded text-emerald-800">Dragonboat + {formData.quantity} cups + {formData.netId}</strong> in the payment subject line/description.
                      </p>
                      <p>
                        <strong className="text-emerald-700">Step 3:</strong> You will receive an email regarding pickup once we receive your payment!
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mt-6">
                    Questions? Reach out to <a href="mailto:en329@cornell.edu" className="text-emerald-600 hover:underline font-medium">en329@cornell.edu</a>
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
