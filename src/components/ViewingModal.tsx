import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, CheckCircle, FileText, Phone, Mail, User } from 'lucide-react';
import { Property, Inquiry } from '../types';

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onInquirySubmitted: (inquiry: Inquiry) => void;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  isOpen,
  onClose,
  property,
  onInquirySubmitted,
}) => {
  const [inquiryType, setInquiryType] = useState<'Viewing' | 'Brochure' | 'Investment Consultation'>('Viewing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-05');
  const [preferredTime, setPreferredTime] = useState('14:00 GST');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newRef = 'HS-VIP-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(newRef);

    try {
      const persisted = await import('../lib/supabase').then(m => m.submitPropertyInquiry({
        propertyId: property?.id,
        propertyTitle: property?.title || 'General VIP Advisory Portfolio',
        userName: name || 'VIP Private Client',
        userEmail: email,
        userPhone: phone,
        inquiryType,
        preferredDate: inquiryType === 'Viewing' ? `${preferredDate} at ${preferredTime}` : undefined,
        message: message || `Client requested ${inquiryType} for ${property?.title || 'portfolio assets'}.`,
      }));

      onInquirySubmitted(persisted);
      setSubmitted(true);
    } catch (err) {
      console.error('Inquiry error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0B1220] border border-[#C8A96B]/50 p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#111C30] border border-[#C8A96B] flex items-center justify-center mx-auto text-[#C8A96B]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">Private Desk Confirmed</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you. Your request has been assigned to our Senior Managing Partner. A dedicated advisor will reach out to you via confidential phone or encrypted WhatsApp within 2 hours.
            </p>
            <div className="p-3 bg-[#111C30] border border-[#C8A96B]/30 inline-block font-mono text-xs text-[#DFC58E]">
              Booking Reference: <span className="font-bold text-white">{refId}</span>
            </div>
            <div>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] transition-colors"
              >
                Return to Exploration
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-mono tracking-widest text-[#DFC58E] uppercase block">
                HS ESTATE Private Client Desk
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                {property ? property.title : 'Schedule Private VIP Advisory'}
              </h3>
              {property && (
                <p className="text-xs text-slate-400 mt-1">{property.location}</p>
              )}
            </div>

            {/* Inquiry Type Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['Viewing', 'Brochure', 'Investment Consultation'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInquiryType(t)}
                  className={`py-2 text-[11px] font-medium transition-colors border ${
                    inquiryType === t
                      ? 'bg-[#C8A96B] text-[#0B1220] border-[#C8A96B] font-semibold'
                      : 'bg-[#111C30] text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {t === 'Viewing' ? 'Private Viewing' : t === 'Brochure' ? 'Confidential Dossier' : 'Advisory Call'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Alexander Sinclair"
                    className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@investment.com"
                      className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {inquiryType === 'Viewing' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Preferred Time</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-[#111C30] border border-slate-700 text-white pl-9 pr-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                      >
                        <option value="10:00 GST">10:00 GST (Morning)</option>
                        <option value="14:00 GST">14:00 GST (Early Afternoon)</option>
                        <option value="16:30 GST">16:30 GST (Sunset Viewing)</option>
                        <option value="19:00 GST">19:00 GST (Evening Ambient)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Special Requirements / Notes</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mention specific confidentiality preferences, Golden Visa inquiries, or chauffeur pickup requirements..."
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-3 focus:border-[#C8A96B] focus:outline-none placeholder-slate-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] transition-colors shadow-lg"
                >
                  Confirm Confidential Request
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                HS ESTATE adheres strictly to Dubai RERA Real Estate Brokerage Code of Ethics.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
