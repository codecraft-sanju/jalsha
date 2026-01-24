import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronDown, ChevronUp, AlertCircle, 
  Wifi, ShieldCheck, DollarSign, MessageCircle, 
  Truck, Package, Users, Lock, X, MousePointer, Smartphone,
  BadgePercent, FileText, History
} from 'lucide-react';

const ManualSection = ({ title, icon: Icon, children, isOpen, onClick, highlight = false }) => {
  return (
    <div className={`border rounded-xl bg-slate-900/50 overflow-hidden mb-4 transition-all duration-300 shrink-0 ${highlight ? 'border-cyan-500/50 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]' : 'border-white/10 hover:border-cyan-500/30'}`}>
      <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-cyan-900/20 text-cyan-400' : 'text-slate-200 hover:bg-white/5'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isOpen ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            <Icon size={20} />
          </div>
          <span className="font-bold text-lg">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-white/10 text-slate-300 space-y-4 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SystemManual({ onClose }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => setOpenIndex(openIndex === index ? -1 : index);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col h-screen w-screen overflow-hidden">
      
      {/* CSS to Hide Scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header (Fixed) */}
      <div className="w-full bg-slate-900 border-b border-white/10 p-4 md:p-6 flex justify-between items-center shadow-2xl z-20 shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="text-cyan-400" size={28} />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">System Manual</h1>
            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Jalsa Operational Guide</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div 
        className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto p-4 md:p-6 pb-32 no-scrollbar overscroll-contain"
        data-lenis-prevent="true" 
      >
        
        {/* 1. KHATA BOOK LOGIC */}
        <ManualSection title="Khata Book & Ledger History" icon={DollarSign} isOpen={openIndex === 0} onClick={() => toggle(0)} highlight>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mb-4">
            <h3 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">Digital Munim Logic</h3>
            <p>This system replaces your physical register. It tracks every Rupee automatically.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2"><AlertCircle size={14}/> Debit (Positive +)</h4>
              <p className="text-xs text-slate-400 mb-2">Meaning: <strong>UDHAAR (Pending)</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                <li>Happens when Order is dispatched.</li>
                <li>Means dealer owes you money.</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <h4 className="text-green-400 font-bold mb-1 flex items-center gap-2"><ShieldCheck size={14}/> Credit (Negative -)</h4>
              <p className="text-xs text-slate-400 mb-2">Meaning: <strong>PAYMENT (Received)</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                <li>Happens when you click "Receive".</li>
                <li>Means dealer paid cash/UPI.</li>
              </ul>
            </div>
          </div>

          {/* VISUAL GUIDE: LEDGER */}
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
             <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <History className="text-cyan-400" size={18} />
                New: Detailed History View
             </h4>
             <div className="space-y-4">
                <div className="flex gap-4 items-start bg-slate-800/50 p-3 rounded-lg border border-white/5">
                   <div className="bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded h-fit whitespace-nowrap mt-1">CLICK ROW</div>
                   <div>
                      <strong className="text-white text-sm block">Open Passbook</strong>
                      <p className="text-xs text-slate-400 mt-1">
                        In the 'Khata' tab, <strong>click anywhere on a Dealer's card</strong> to open their full transaction history. 
                        You will see exactly which date they took goods (Debit) and which date they paid (Credit).
                      </p>
                   </div>
                </div>
                <div className="flex gap-4 items-start bg-slate-800/50 p-3 rounded-lg border border-white/5">
                   <div className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded h-fit whitespace-nowrap mt-1">RECEIVE BTN</div>
                   <div>
                      <strong className="text-white text-sm block">Quick Payment</strong>
                      <p className="text-xs text-slate-400 mt-1">Use the 'Receive' button for quick cash entry without opening the full history.</p>
                   </div>
                </div>
             </div>
          </div>
        </ManualSection>

        {/* 2. DISCOUNT SYSTEM */}
        <ManualSection title="Wholesale Discount Logic" icon={BadgePercent} isOpen={openIndex === 1} onClick={() => toggle(1)}>
          <p>We have introduced a <strong>Bulk Quantity Discount</strong> system. This encourages dealers to buy more crates at once.</p>
          
          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl mt-4">
             <h4 className="text-cyan-400 font-bold text-sm mb-3">How it works (Example):</h4>
             <ul className="space-y-3 text-xs md:text-sm">
                <li className="flex justify-between border-b border-cyan-500/10 pb-2">
                    <span className="text-slate-400">Regular Price:</span>
                    <span className="text-white font-mono">₹90 per crate</span>
                </li>
                <li className="flex justify-between border-b border-cyan-500/10 pb-2">
                    <span className="text-slate-400">Bulk Threshold (Condition):</span>
                    <span className="text-white font-mono">100 Crates</span>
                </li>
                <li className="flex justify-between">
                    <span className="text-slate-400">Discounted Price:</span>
                    <span className="text-green-400 font-bold font-mono">₹80 per crate</span>
                </li>
             </ul>
          </div>

          <div className="mt-4 text-xs text-slate-400 bg-black/30 p-3 rounded-lg">
             <strong>Automation:</strong> When a customer adds 99 crates, cart shows ₹90. As soon as they add the 100th crate, the price automatically updates to ₹80 for all items.
          </div>
        </ManualSection>

        {/* 3. ORDER & INVOICE */}
        <ManualSection title="Orders & Bill Generation" icon={FileText} isOpen={openIndex === 2} onClick={() => toggle(2)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">1</div>
                <div><h4 className="font-bold text-orange-400">Pending</h4><p className="text-slate-400">Order placed by dealer. Admin needs to verify stock.</p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</div>
                <div><h4 className="font-bold text-blue-400">Dispatched</h4><p className="text-slate-400">Goods left factory. <strong>System automatically debits Dealer's Khata.</strong></p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">3</div>
                <div><h4 className="font-bold text-green-400">PDF Invoice</h4><p className="text-slate-400">Customers can now download a PDF Bill from their 'My Orders' section.</p></div>
            </div>
          </div>
        </ManualSection>

        {/* 4. REAL TIME STOCK */}
        <ManualSection title="Live Stock Control (Socket.io)" icon={Wifi} isOpen={openIndex === 3} onClick={() => toggle(3)}>
          <p>The system uses <strong>Real-time Sockets</strong>. No refresh needed.</p>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mt-3">
            <h4 className="font-bold text-white mb-2">Example Scenario:</h4>
            <p className="mb-2">Assume you have only <strong>50 Crates</strong> left.</p>
            <ol className="list-decimal pl-4 space-y-2 text-slate-400">
              <li>Dealer A (Jaipur) orders 50 crates.</li>
              <li>Dealer B (Ajmer) is looking at the screen.</li>
              <li>Instantly, Dealer B's screen will show <strong>Sold Out</strong>.</li>
            </ol>
            <p className="mt-3 text-cyan-400 text-xs">Benefit: Prevents taking orders for stock you don't have.</p>
          </div>
        </ManualSection>

        {/* 5. DEALER ONBOARDING */}
        <ManualSection title="Dealer Onboarding (Requests Tab)" icon={Users} isOpen={openIndex === 4} onClick={() => toggle(4)}>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mb-4">
            <h3 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">The Gatekeeper System</h3>
            <p>Strangers fill a form. You approve them. Only then they become a Dealer.</p>
          </div>
          <div className="space-y-3">
             <div className="flex gap-4 items-center bg-slate-800/50 p-3 rounded-lg border border-white/5">
                <div className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded h-fit whitespace-nowrap">APPROVE BUTTON</div>
                <p className="text-xs text-slate-400">Clicking this creates a permanent <strong>Khata Account</strong> for the user and allows them to order.</p>
             </div>
          </div>
        </ManualSection>

        {/* 6. WHATSAPP CHECKOUT */}
        <ManualSection title="Why WhatsApp Checkout?" icon={MessageCircle} isOpen={openIndex === 5} onClick={() => toggle(5)}>
          <p>We intentionally avoided Payment Gateways (Razorpay/Paytm) for 2 reasons:</p>
          <div className="space-y-3 mt-3">
            <div className="flex gap-3">
              <div className="min-w-[4px] bg-cyan-500 rounded-full"/>
              <div>
                <strong className="text-white block">1. Saving 2% Fees</strong>
                <span className="text-slate-400">Gateways charge 2% per transaction. In wholesale, margins are thin. We save that money.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="min-w-[4px] bg-cyan-500 rounded-full"/>
              <div>
                <strong className="text-white block">2. Personal Touch</strong>
                <span className="text-slate-400">Wholesale runs on relationships. WhatsApp allows negotiation and confirmation before dispatch.</span>
              </div>
            </div>
          </div>
        </ManualSection>

        {/* 7. CUSTOMER DASHBOARD */}
        <ManualSection title="Customer App Features" icon={Smartphone} isOpen={openIndex === 6} onClick={() => toggle(6)}>
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
             <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800 p-3 rounded border border-white/5">
                   <strong className="text-white block mb-1">❌ No Password Needed</strong>
                   <span className="text-slate-400">Customer logs in using just their Mobile Number. Simple and fast.</span>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-white/5">
                   <strong className="text-white block mb-1">📜 PDF Invoices</strong>
                   <span className="text-slate-400">Customers can download professional GST invoices for their tax records.</span>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-white/5 col-span-2">
                   <strong className="text-white block mb-1">📦 Live Tracking</strong>
                   <span className="text-slate-400">Status changes (Pending &rarr; Dispatched) are reflected instantly.</span>
                </div>
             </div>
          </div>
        </ManualSection>

        {/* 8. ADMIN ACCESS SECTION */}
        <ManualSection title="Admin & Security Guide" icon={Lock} isOpen={openIndex === 7} onClick={() => toggle(7)}>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
             <div className="mb-4">
               <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                 <ShieldCheck className="text-cyan-400" size={20}/> How to Access Admin Panel?
               </h4>
               <p className="text-slate-400 text-sm leading-relaxed">
                 There is a <strong>Hidden 'Staff Login' Button</strong> in the website footer.
               </p>
             </div>

             <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded-r mb-3">
                <p className="text-xs text-blue-300">
                   <strong>🆕 Auto-Admin Creation:</strong> The first time you login with the credentials in your <code>.env</code> file, the system automatically creates the Super Admin account. No manual setup needed.
                </p>
             </div>

             <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r">
                <p className="text-xs text-red-300">
                   <strong>⚠️ Security Note:</strong> Never share your Admin Email & Password. Anyone with access can change stock and modify dealer balances.
                </p>
             </div>
          </div>
        </ManualSection>

      </div>
    </div>
  );
}