import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Shield, CheckCircle, Car } from 'lucide-react';
import { Inquiry } from '../types';

interface ContactPageProps {
  onInquirySubmitted: (inquiry: Inquiry) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onInquirySubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-08');
  const [inquiryType, setInquiryType] = useState<'Investment Consultation' | 'Viewing' | 'General'>('Investment Consultation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInq: Inquiry = {
      id: 'inq-' + Date.now(),
      propertyTitle: 'Private Desk Consultation Mandate',
      userName: name,
      userEmail: email,
      userPhone: phone,
      inquiryType,
      preferredDate,
      message,
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onInquirySubmitted(newInq);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A38446] font-semibold block mb-2">
            Confidential Inquiries · Dubai, UAE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B1220] tracking-tight">
            The Private Client Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Connect with our Senior Managing Partners for discreet discussions regarding prime acquisitions, portfolio divestments, or UAE Golden Visa legal structuring.
          </p>
        </div>

        {/* 2-Column Split: Contact Details & Office (5 Col) vs Consultation Form (7 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Office & Direct Lines */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="bg-[#0B1220] border border-[#C8A96B]/40 p-8 text-white shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFC58E] block mb-2">
                Dubai Global Headquarters
              </span>
              <h3 className="font-serif font-bold text-2xl text-white mb-4">
                Boulevard Plaza Tower 1
              </h3>
              
              <div className="space-y-4 text-xs font-mono text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Level 32, Executive Suite 3204</span>
                    <span>Downtown Dubai, United Arab Emirates</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Directly adjacent to Burj Khalifa & Dubai Opera</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <div>
                    <span className="text-white font-bold block">+971 4 821 9900</span>
                    <span className="text-[11px] text-slate-400">Direct Brokerage Switchboard</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <div>
                    <span className="text-white font-bold block">private.desk@hsestate.ae</span>
                    <span className="text-[11px] text-slate-400">Encrypted Inbound Dispatch</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Hours of Operation</span>
                    <span>Monday – Saturday: 09:00 – 19:00 GST</span>
                    <span className="text-[11px] text-slate-400 block">Sunday: By Confirmed Appointment Only</span>
                  </div>
                </div>
              </div>

              {/* VIP Valet Note */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-start gap-3 text-xs text-slate-400">
                <Car className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <span>
                  Complimentary VIP valet parking is situated at the Boulevard Plaza Tower 1 main ceremonial drop-off.
                </span>
              </div>
            </div>

            {/* Regulatory Credentials */}
            <div className="bg-white border border-slate-200 p-6 shadow-sm text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#0B1220] font-serif font-bold text-sm">
                <Shield className="w-4 h-4 text-[#C8A96B]" />
                <span>Regulatory Authorizations</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                HS ESTATE is fully authorized by the Dubai Real Estate Regulatory Agency (RERA), commercial broker license #984021, Office Registration Number (ORN) 29481.
              </p>
            </div>

          </div>

          {/* Right Column: VIP Consultation Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F6F7F9] border border-[#C8A96B] flex items-center justify-center mx-auto text-[#C8A96B]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#0B1220]">
                  Private Inquiry Registered
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, {name}. A Senior Managing Partner has received your submission and will contact you via your specified preference within 2 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[#0B1220] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#111C30]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="font-serif font-bold text-2xl text-[#0B1220]">
                    Request a Private Consultation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    All client discussions are held under strict non-disclosure terms.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your Legal Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maximilian Sterling"
                      className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="principal@capital.com"
                        className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Inquiry Purpose</label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value as any)}
                        className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                      >
                        <option value="Investment Consultation">Institutional Investment Consultation</option>
                        <option value="Viewing">Private Trophy Viewing Arrangement</option>
                        <option value="General">UAE Golden Visa & Relocation Desk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Acquisition Criteria or Notes
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify preferred neighborhoods (Palm Jumeirah, Downtown, Emirates Hills), target capital allocation, or specific off-market requirements..."
                      className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#0B1220] hover:bg-[#111C30] text-white text-xs uppercase tracking-widest font-bold border border-[#C8A96B] transition-colors shadow-md"
                    >
                      Submit Confidential Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
