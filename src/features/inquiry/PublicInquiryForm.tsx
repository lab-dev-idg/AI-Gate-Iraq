import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createIntakeItem } from '@/src/admin/adminStore';

interface PublicInquiryFormProps {
  onSuccessSubmitted?: () => void;
}

export const PublicInquiryForm: React.FC<PublicInquiryFormProps> = ({ onSuccessSubmitted }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [serviceInterest, setServiceInterest] = useState('ڕاوێژکاری بازرگانی AI');
  const [message, setMessage] = useState('');

  // Status & Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const servicesList = [
    'ڕاوێژکاری بازرگانی AI',
    'کورتەی بازاڕ',
    'دۆخی مەرزەکان',
    'گۆڕینەوەی دراو',
    'خەمڵاندنی تێچوو',
    'ئەکاونتی بازرگانی KYC',
    'دابینکردن و سەرچاوەدۆزی',
    'بەدواداچوونی بار',
    'نەخشەی لۆجستیک',
    'دیمۆی گشتی'
  ];

  const handleClear = () => {
    setName('');
    setCompany('');
    setContact('');
    setServiceInterest('ڕاوێژکاری بازرگانی AI');
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'تکایە ناوت بنووسە.';
    }
    if (!contact.trim()) {
      newErrors.contact = 'تکایە ڕێگای پەیوەندی بنووسە.';
    }
    if (!message.trim()) {
      newErrors.message = 'تکایە پەیامێک بنووسە.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      createIntakeItem({
        name: name.trim(),
        company: company.trim(),
        contact: contact.trim(),
        serviceInterest,
        category: 'public_inquiry',
        message: message.trim()
      });

      setIsSubmitted(true);
      setErrors({});
      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    }
  };

  return (
    <div id="public-inquiry-container" className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden text-right leading-relaxed font-sans">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پەیوەندی بازرگانی</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">داواکاری پەیوەندی یان دیمۆ</h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
              ئەگەر دەتەوێت دیمۆ، ڕاوێژکاری، یان پەیوەندی بازرگانی بنێریت، ئەم فۆڕمە پڕ بکەوە. ئەمە لە دۆخی پایلۆتدا تەنها لە براوسەرەکەتدا هەڵدەگیرێت.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 py-8"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">سەرکەوتوو بوو!</h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  داواکارییەکەت بە سەرکەوتوویی تۆمار کرا. لە دۆخی پایلۆتدا ئەم داتایە تەنها لە براوسەرەکەتدا هەڵگیراوە.
                </p>
              </div>
              <button
                onClick={handleClear}
                className="mt-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 text-xs font-bold rounded-xl transition duration-200"
              >
                ناردنی داواکارییەکی تر
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block pr-1">ناو <span className="text-emerald-400">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="ناوت بنووسە"
                    className={`w-full bg-slate-950/40 border ${errors.name ? 'border-red-500/50 focus:border-red-500/80' : 'border-slate-800 focus:border-emerald-500/40'} rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition duration-200`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-[10px] font-bold flex items-center gap-1 mt-1 justify-end">
                      <span>{errors.name}</span>
                      <AlertCircle className="w-3 h-3" />
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 block pr-1">کۆمپانیا</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="ناوی کۆمپانیا یان رێکخراو (ئارەزوومەندانە)"
                    className="w-full bg-slate-950/40 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact */}
                <div className="space-y-1.5 text-slate-300">
                  <label className="text-xs font-bold text-slate-400 block pr-1">ژمارە یان ئیمەیل <span className="text-emerald-400">*</span></label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (errors.contact) setErrors(prev => ({ ...prev, contact: '' }));
                    }}
                    placeholder="نموونە: info@company.com یان 0750XXXXXXX"
                    className={`w-full bg-slate-950/40 border ${errors.contact ? 'border-red-500/50 focus:border-red-500/80' : 'border-slate-800 focus:border-emerald-500/40'} rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none text-left focus:ring-1 focus:ring-emerald-500/25 transition duration-200`}
                  />
                  {errors.contact && (
                    <p className="text-red-400 text-[10px] font-bold flex items-center gap-1 mt-1 justify-end">
                      <span>{errors.contact}</span>
                      <AlertCircle className="w-3 h-3" />
                    </p>
                  )}
                </div>

                {/* Service Interest */}
                <div className="space-y-1.5 text-slate-300">
                  <label className="text-xs font-bold text-slate-400 block pr-1 font-sans">خزمەتگوزاریی ئارەزوومەند</label>
                  <select
                    value={serviceInterest}
                    onChange={(e) => setServiceInterest(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/40 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition duration-200 cursor-pointer"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv} value={srv} className="bg-slate-900 text-slate-200">
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5 text-slate-300">
                <label className="text-xs font-bold text-slate-400 block pr-1">پەیام <span className="text-emerald-400">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  rows={4}
                  placeholder="دەربارەی پرۆژەکەت یان جۆری هاوکاری زیاتر بنووسە..."
                  className={`w-full bg-slate-950/40 border ${errors.message ? 'border-red-500/50 focus:border-red-500/80' : 'border-slate-800 focus:border-emerald-500/40'} rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition duration-200 max-h-40 min-h-[80px]`}
                />
                {errors.message && (
                  <p className="text-red-400 text-[10px] font-bold flex items-center gap-1 mt-1 justify-end">
                    <span>{errors.message}</span>
                    <AlertCircle className="w-3 h-3" />
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 justify-start">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 transition duration-200 shadow-md shadow-emerald-500/5 hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5 transform rotate-270" />
                  <span>ناردنی داواکاری</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>پاککردنەوە</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
