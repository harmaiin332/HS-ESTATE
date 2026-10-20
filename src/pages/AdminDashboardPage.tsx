import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  DollarSign,
  Building2,
  Users,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Property, Inquiry, PropertyType } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';

interface AdminDashboardPageProps {
  properties: Property[];
  inquiries: Inquiry[];
  currency: Currency;
  onAddProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  onUpdateInquiryStatus: (id: string, newStatus: Inquiry['status']) => void;
  onSelectProperty: (p: Property) => void;
  onExitAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  properties,
  inquiries,
  currency,
  onAddProperty,
  onDeleteProperty,
  onUpdateInquiryStatus,
  onSelectProperty,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries'>('properties');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Property Form State
  const [newTitle, setNewTitle] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('Palm Jumeirah');
  const [newType, setNewType] = useState<PropertyType>('Villa');
  const [newPrice, setNewPrice] = useState<number>(35000000);
  const [newBeds, setNewBeds] = useState<number>(5);
  const [newBaths, setNewBaths] = useState<number>(6);
  const [newSqft, setNewSqft] = useState<number>(7500);

  // Compute Summary Statistics
  const totalValueAed = properties.reduce((acc, p) => acc + p.priceAed, 0);
  const avgSqftPrice = Math.round(
    properties.reduce((acc, p) => acc + p.priceAed / p.sqft, 0) / (properties.length || 1)
  );
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProp: Property = {
      id: 'hs-admin-' + Date.now(),
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      purpose: 'buy',
      type: newType,
      priceAed: Number(newPrice),
      location: `${newNeighborhood}, Dubai, UAE`,
      neighborhood: newNeighborhood,
      bedrooms: Number(newBeds),
      bathrooms: Number(newBaths),
      sqft: Number(newSqft),
      completionYear: 2025,
      developer: 'HS Curated Portfolio',
      isFeatured: true,
      images: [
        properties[0]?.images[0] || '/src/assets/images/hero_dubai_skyline_1792534461827.jpg'
      ],
      description: `Newly curated bespoke luxury ${newType.toLowerCase()} located in ${newNeighborhood}, Dubai. Offering exceptional privacy, floor-to-ceiling glass, and high capital growth potential.`,
      features: ['Turnkey Finishing', 'Prime Location', 'Full Smart Home Integration'],
      amenities: ['Concierge 24/7', 'Private Parking', 'Swimming Pool'],
      coordinates: { lat: 25.12, lng: 55.15 },
      agent: properties[0]?.agent || {
        name: 'Alexander Sterling',
        role: 'Managing Director, Ultra-Prime Advisory',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        phone: '+971 4 821 9900',
        whatsapp: '+971 50 123 4567',
        email: 'alexander.s@hsestate.ae',
        languages: ['English', 'German'],
        reraNumber: 'BRN 48291'
      }
    };

    onAddProperty(newProp);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Admin Header */}
        <div className="bg-[#0B1220] border border-[#C8A96B]/40 p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#111C30] border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white">HS ESTATE Admin Portal</h1>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#C8A96B] text-[#0B1220] font-bold px-2 py-0.5">
                  RERA Management
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Dubai Brokerage ORN 29481 · Operations & Inventory Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>List New Property</span>
            </button>
            <button
              onClick={onExitAdmin}
              className="px-4 py-2.5 bg-[#111C30] hover:bg-slate-800 text-slate-300 hover:text-white text-xs uppercase tracking-wider font-semibold border border-slate-700 transition-colors"
            >
              Exit to Site
            </button>
          </div>
        </div>

        {/* 4 Summary Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Active Portfolio Listed Value
            </div>
            <div className="text-2xl font-serif font-bold text-[#0B1220] tabular-nums">
              {formatCurrency(totalValueAed, currency)}
            </div>
            <div className="text-[11px] text-[#A38446] font-mono mt-1">
              {properties.length} Total Curated Units
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Active Client Inquiries
            </div>
            <div className="text-2xl font-serif font-bold text-[#0B1220] tabular-nums">
              {inquiries.length} Inquiries
            </div>
            <div className="text-[11px] text-amber-600 font-mono mt-1">
              {newInquiriesCount} Awaiting Response
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Average Portfolio Price / Sqft
            </div>
            <div className="text-2xl font-serif font-bold text-[#0B1220] tabular-nums">
              {avgSqftPrice.toLocaleString()} AED
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Prime benchmark index
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Golden Visa Allocations
            </div>
            <div className="text-2xl font-serif font-bold text-[#0B1220] tabular-nums">
              100% Eligible
            </div>
            <div className="text-[11px] text-emerald-600 font-mono mt-1">
              Above 2M AED Threshold
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6 bg-white px-6 pt-3 shadow-sm text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'properties' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Property Inventory ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'inquiries' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Client Inquiries & Viewing Logs ({inquiries.length})
          </button>
        </div>

        {/* Tab 1: Properties Table */}
        {activeTab === 'properties' && (
          <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1220] text-[#DFC58E] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Typology</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Asking Price (AED)</th>
                  <th className="p-4">Area</th>
                  <th className="p-4">Beds / Baths</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-10 object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-slate-900 block truncate max-w-xs">
                          {p.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id.slice(0, 8)}</span>
                          {p.isFeatured && (
                            <span className="text-[9px] font-mono uppercase bg-[#C8A96B]/20 text-[#A38446] px-1 py-0.2 border border-[#C8A96B]/30">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{p.type}</td>
                    <td className="p-4 text-slate-700">{p.neighborhood}</td>
                    <td className="p-4 font-mono font-bold text-[#0B1220] tabular-nums">
                      {formatCurrency(p.priceAed, currency)}
                    </td>
                    <td className="p-4 font-mono text-slate-600 tabular-nums">
                      {p.sqft.toLocaleString()} sqft
                    </td>
                    <td className="p-4 font-mono text-slate-600 tabular-nums">
                      {p.bedrooms}B / {p.bathrooms}BA
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectProperty(p)}
                          className="p-1.5 text-slate-600 hover:text-[#0B1220] hover:bg-slate-100"
                          title="Inspect Public Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProperty(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Inquiries Management */}
        {activeTab === 'inquiries' && (
          <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1220] text-[#DFC58E] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Client Name & Contact</th>
                  <th className="p-4">Inquiry Category</th>
                  <th className="p-4">Target Residence</th>
                  <th className="p-4">Schedule / Notes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-serif font-bold text-slate-900">{inq.userName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{inq.userEmail}</div>
                      <div className="text-[11px] font-mono text-slate-500">{inq.userPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-[11px] uppercase bg-slate-100 text-slate-700 px-2 py-0.5">
                        {inq.inquiryType}
                      </span>
                    </td>
                    <td className="p-4 font-serif font-bold text-slate-800 max-w-xs truncate">
                      {inq.propertyTitle || 'General Advisory'}
                    </td>
                    <td className="p-4 max-w-xs text-slate-600">
                      {inq.preferredDate && (
                        <div className="font-mono font-bold text-[11px] text-slate-800 mb-0.5">
                          {inq.preferredDate}
                        </div>
                      )}
                      <p className="line-clamp-2 text-[11px]">{inq.message}</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-[11px] font-mono font-bold px-2 py-1 border focus:outline-none ${
                          inq.status === 'Viewing Scheduled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Viewing Scheduled">Viewing Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">{inq.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0B1220] border border-[#C8A96B]/50 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-white mb-1">List New Dubai Property</h3>
            <p className="text-xs text-slate-400 mb-6">Enter official RERA title deed listing details</p>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Property Name / Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Grand Azure Frond Villa"
                  className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">District</label>
                  <select
                    value={newNeighborhood}
                    onChange={(e) => setNewNeighborhood(e.target.value)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="Palm Jumeirah">Palm Jumeirah</option>
                    <option value="Downtown Dubai">Downtown Dubai</option>
                    <option value="Dubai Marina">Dubai Marina</option>
                    <option value="Emirates Hills">Emirates Hills</option>
                    <option value="DIFC">DIFC</option>
                    <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Typology</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Price (AED)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    step={500000}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 font-mono focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Built-Up Area (Sqft)</label>
                  <input
                    type="number"
                    required
                    value={newSqft}
                    onChange={(e) => setNewSqft(Number(e.target.value))}
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 font-mono focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={newBeds}
                    onChange={(e) => setNewBeds(Number(e.target.value))}
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 font-mono focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={newBaths}
                    onChange={(e) => setNewBaths(Number(e.target.value))}
                    className="w-full bg-[#111C30] border border-slate-700 text-white p-2.5 font-mono focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Confirm & Publish Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
