import React, { useState } from 'react';
import { Calculator, Info, ShieldCheck } from 'lucide-react';
import { Currency, formatCurrency, calculateMortgage } from '../utils/formatters';

interface MortgageCalculatorProps {
  initialPriceAed: number;
  currency: Currency;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  initialPriceAed,
  currency,
}) => {
  const [price, setPrice] = useState<number>(initialPriceAed);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(4.25);
  const [years, setYears] = useState<number>(25);

  const result = calculateMortgage(price, downPaymentPercent, interestRate, years);
  const dldTransferFeeAed = price * 0.04; // 4% Dubai Land Department standard
  const trusteeFeeAed = 4200; // Standard Dubai Trustee registration fee

  return (
    <div className="bg-[#111C30] border border-[#C8A96B]/30 p-6 md:p-8 text-white relative">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C8A96B]/10 border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Dubai Mortgage & Capital Planner</h3>
            <p className="text-xs text-slate-400">Estimate monthly debt service & UAE acquisition fees</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#DFC58E] font-mono bg-[#0B1220] px-2.5 py-1 border border-[#C8A96B]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>UAE Central Bank Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders and Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Price Input */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">Property Value (AED)</span>
              <span className="text-[#C8A96B] font-mono font-bold">{formatCurrency(price, currency)}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={150000000}
              step={500000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#C8A96B] bg-slate-800 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>1M AED</span>
              <span>50M AED</span>
              <span>150M AED</span>
            </div>
          </div>

          {/* Down Payment % Slider */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">Down Payment ({downPaymentPercent}%)</span>
              <span className="text-[#C8A96B] font-mono font-bold">{formatCurrency(result.downPaymentAmount, currency)}</span>
            </div>
            <input
              type="range"
              min={20}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[#C8A96B] bg-slate-800 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>20% (UAE Min for Non-Residents)</span>
              <span>40%</span>
              <span>60%</span>
            </div>
          </div>

          {/* Loan Duration & Interest Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Annual Interest Rate ({interestRate}%)
              </label>
              <select
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-[#0B1220] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value={3.75}>3.75% Fixed (Tier 1 UAE Bank)</option>
                <option value={4.25}>4.25% Standard Prime Rate</option>
                <option value={4.85}>4.85% Non-Resident Investor Rate</option>
                <option value={5.5}>5.50% Variable Market Index</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Loan Term ({years} Years)
              </label>
              <select
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-[#0B1220] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years (Max UAE Term)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output Summary Card */}
        <div className="lg:col-span-5 bg-[#0B1220] border border-[#C8A96B]/20 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#DFC58E] uppercase block mb-1">
              Estimated Monthly Repayment
            </span>
            <div className="text-3xl font-serif font-bold text-white tabular-nums mb-4 text-[#DFC58E]">
              {formatCurrency(result.monthlyRepayment, currency)}
              <span className="text-xs font-sans font-normal text-slate-400 ml-1">/ month</span>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Principal Financed</span>
                <span className="font-mono tabular-nums text-white">{formatCurrency(result.loanAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Down Payment Required</span>
                <span className="font-mono tabular-nums text-white">{formatCurrency(result.downPaymentAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>DLD Transfer Fee (4%)</span>
                <span className="font-mono tabular-nums text-white">{formatCurrency(dldTransferFeeAed, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Trustee & Admin Fees</span>
                <span className="font-mono tabular-nums text-white">{formatCurrency(trusteeFeeAed, currency)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
            <span>
              HS ESTATE Private Advisory facilitates pre-approvals across Emirates NBD, FAB, and international private banks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
