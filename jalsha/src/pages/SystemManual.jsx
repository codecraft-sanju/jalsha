import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronDown, ChevronUp, AlertCircle, 
  Wifi, ShieldCheck, DollarSign, MessageCircle, 
  Truck, Package, Users, Info, Lock, X, MousePointer, Smartphone 
} from 'lucide-react';

const ManualSection = ({ title, icon: Icon, children, isOpen, onClick }) => {
  return (
    <div className="border border-white/10 rounded-xl bg-slate-900/50 overflow-hidden mb-4 transition-all duration-300 hover:border-cyan-500/30 shrink-0">
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
            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Workflow & Logic Guide</p>
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
        <ManualSection title="Khata Book Logic (The +/- Mystery)" icon={DollarSign} isOpen={openIndex === 0} onClick={() => toggle(0)}>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mb-4">
            <h3 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">Business Concept</h3>
            <p>Yeh system "Digital Munim" ki tarah kaam karta hai. Har dealer ka ek card hota hai jo uska hisaab dikhata hai.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
              <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2"><AlertCircle size={14}/> Positive Balance (+)</h4>
              <p className="text-xs text-slate-400 mb-2">Matlab: <strong>UDHAARI (Pending Payment)</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                <li>Jab aap order dispatch karte hain.</li>
                <li>Action: Dealer se paisa lena hai.</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <h4 className="text-green-400 font-bold mb-1 flex items-center gap-2"><ShieldCheck size={14}/> Negative Balance (-)</h4>
              <p className="text-xs text-slate-400 mb-2">Matlab: <strong>ADVANCE (Extra Payment)</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                <li>Jab dealer extra payment kar de.</li>
                <li>Example: 5000 ka bill, 6000 pay kiye.</li>
              </ul>
            </div>
          </div>

          {/* VISUAL GUIDE: KHATA */}
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
             <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <MousePointer className="text-cyan-400" size={18} />
                Live Control Guide
             </h4>
             <div className="relative rounded-lg overflow-hidden border border-white/20 mb-6 shadow-xl h-48 md:h-64 bg-slate-950/50 flex items-center justify-center group">
                <img 
                  src="/khatabook.png" 
                  alt="Khata Book" 
                  className="h-full w-auto object-contain max-w-full" 
                  onError={(e) => e.target.style.display = 'none'} 
                />
             </div>
             <div className="space-y-4">
                <div className="flex gap-4 items-start bg-slate-800/50 p-3 rounded-lg border border-white/5">
                   <div className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded h-fit whitespace-nowrap mt-1">RECEIVE BUTTON</div>
                   <div>
                      <strong className="text-white text-sm block">Payment Entry</strong>
                      <p className="text-xs text-slate-400 mt-1">Jab dealer cash ya online payment kare, button dabayein. Amount enter karte hi balance kam ho jayega.</p>
                   </div>
                </div>
             </div>
          </div>
        </ManualSection>

        {/* 2. WHATSAPP CHECKOUT */}
        <ManualSection title="Why WhatsApp Checkout? (No Gateway)" icon={MessageCircle} isOpen={openIndex === 1} onClick={() => toggle(1)}>
          <p>Humne is website par Razorpay ya Paytm ka gateway nahi lagaya hai. Uske 2 bade reasons hain:</p>
          <div className="space-y-3 mt-3">
            <div className="flex gap-3">
              <div className="min-w-[4px] bg-cyan-500 rounded-full"/>
              <div>
                <strong className="text-white block">1. 2% Commission Saving</strong>
                <span className="text-slate-400">Online payment gateways har transaction par 2% charge karte hain. Wholesale mein margin kam hota hai, hum wo bachate hain.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="min-w-[4px] bg-cyan-500 rounded-full"/>
              <div>
                <strong className="text-white block">2. Personal Touch</strong>
                <span className="text-slate-400">Wholesale rishton par chalta hai. WhatsApp par aap dealer se direct baat karke order modify kar sakte hain.</span>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-slate-900 p-3 rounded border border-white/10 text-xs font-mono text-cyan-300">
             Flow: User Carts Items &rarr; Click Checkout &rarr; WhatsApp Opens &rarr; Chat &amp; Pay &rarr; Dispatch.
          </div>
        </ManualSection>

        {/* 3. REAL TIME STOCK */}
        <ManualSection title="Live Stock Control (Socket.io)" icon={Wifi} isOpen={openIndex === 2} onClick={() => toggle(2)}>
          <p>Yeh system ka sabse advanced feature hai. Iska matlab hai <strong>"Instant Update"</strong>.</p>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mt-3">
            <h4 className="font-bold text-white mb-2">Example Scenario:</h4>
            <p className="mb-2">Maan lijiye aapke paas aakhri <strong>50 Crates</strong> bache hain.</p>
            <ol className="list-decimal pl-4 space-y-2 text-slate-400">
              <li>Ek dealer <strong>Jaipur</strong> mein baitha hai, dusra <strong>Ajmer</strong> mein.</li>
              <li>Jaipur wale ne 50 crates order kar diye.</li>
              <li>Bina page refresh kiye, Ajmer wale ki screen par usi waqt stock <strong>0 (Sold Out)</strong> ho jayega.</li>
            </ol>
            <p className="mt-3 text-cyan-400">Benefit: Isse "Over-Booking" ki pareshani khatam ho jati hai.</p>
          </div>
        </ManualSection>

        {/* 4. DEALER APPROVALS */}
        <ManualSection title="Dealer Onboarding (Requests Tab)" icon={Users} isOpen={openIndex === 3} onClick={() => toggle(3)}>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mb-4">
            <h3 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">The Gatekeeper System</h3>
            <p>Har koi website par aakar wholesale rate nahi dekh sakta. Naye log form bharte hain, jo yahan <strong>"Requests"</strong> tab mein aate hain.</p>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
             <div className="relative rounded-lg overflow-hidden border border-white/20 mb-6 shadow-xl h-48 md:h-64 bg-slate-950/50 flex items-center justify-center group">
                <img src="/request.png" alt="Requests" className="h-full w-auto object-contain max-w-full" onError={(e) => e.target.style.display = 'none'} />
             </div>
             <div className="space-y-3">
                <div className="flex gap-4 items-center bg-slate-800/50 p-3 rounded-lg border border-white/5">
                   <div className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded h-fit whitespace-nowrap">APPROVE BUTTON</div>
                   <p className="text-xs text-slate-400">Isse dabate hi user ka <strong>Khata</strong> khul jata hai aur wo orders laga sakta hai.</p>
                </div>
             </div>
          </div>
        </ManualSection>

        {/* 5. ORDER LIFECYCLE */}
        <ManualSection title="Order Processing Workflow" icon={Truck} isOpen={openIndex === 4} onClick={() => toggle(4)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">1</div>
                <div><h4 className="font-bold text-orange-400">Pending</h4><p className="text-slate-400">Order aaya hai.</p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</div>
                <div><h4 className="font-bold text-blue-400">Dispatched</h4><p className="text-slate-400">Gaadi nikal gayi. <strong>Paisa khate mein jud gaya (+).</strong></p></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">3</div>
                <div><h4 className="font-bold text-green-400">Delivered</h4><p className="text-slate-400">Order complete.</p></div>
            </div>
          </div>
        </ManualSection>

        {/* ✅ 6. CUSTOMER DASHBOARD (NEW SECTION) */}
        <ManualSection title="Customer App (Order Tracking)" icon={Smartphone} isOpen={openIndex === 5} onClick={() => toggle(5)}>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mb-4">
            <h3 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-widest">Self-Service Portal</h3>
            <p>Customer ko baar-baar call karke puchne ki zaroorat nahi "Mera maal kahan hai?". Woh khud check kar sakta hai.</p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-white/10">
             {/* Image Container */}
             <div className="relative rounded-lg overflow-hidden border border-white/20 mb-6 shadow-xl h-48 md:h-64 bg-slate-950/50 flex items-center justify-center group">
                <img 
                  src="/myorder.png" 
                  alt="Customer Dashboard" 
                  className="h-full w-auto object-contain max-w-full" 
                  onError={(e) => e.target.style.display = 'none'} 
                />
             </div>

             {/* Features Breakdown */}
             <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800 p-3 rounded border border-white/5">
                   <strong className="text-white block mb-1">❌ No Password Needed</strong>
                   <span className="text-slate-400">Customer bas apna Registered Mobile Number dalega aur login ho jayega. Password yaad rakhne ki tension nahi.</span>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-white/5">
                   <strong className="text-white block mb-1">📦 Live Tracking</strong>
                   <span className="text-slate-400">Jaise hi aap Admin panel se "Dispatch" karenge, customer ko yahan status update dikh jayega.</span>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-white/5 col-span-2">
                   <strong className="text-white block mb-1">📜 Order History</strong>
                   <span className="text-slate-400">Pichle saare orders aur unka total amount yahan safe rehta hai.</span>
                </div>
             </div>
          </div>
        </ManualSection>

        {/* 7. TECHNICAL FEATURES */}
        <ManualSection title="Hidden Technical Features" icon={Package} isOpen={openIndex === 6} onClick={() => toggle(6)}>
          <ul className="grid md:grid-cols-2 gap-3 text-xs">
            <li className="bg-slate-800 p-3 rounded border border-white/5"><strong className="text-white block mb-1">Offline Cart</strong>Internet jane par bhi cart data save rehta hai.</li>
            <li className="bg-slate-800 p-3 rounded border border-white/5"><strong className="text-white block mb-1">Mobile Dock</strong>Bottom menu for easy mobile access.</li>
            <li className="bg-slate-800 p-3 rounded border border-white/5"><strong className="text-white block mb-1">Cloudinary</strong>Images direct cloud par upload hoti hain.</li>
          </ul>
        </ManualSection>

        {/* 8. ADMIN ACCESS SECTION */}
        <ManualSection title="Admin Access Guide (Staff Login)" icon={Lock} isOpen={openIndex === 7} onClick={() => toggle(7)}>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-white/10">
             <div className="mb-4">
               <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                 <ShieldCheck className="text-cyan-400" size={20}/> How to Access Admin Panel?
               </h4>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Website ke bilkul niche (Footer area mein) ek hidden button diya gaya hai.
                 Yeh sirf Staff aur Owners ke liye hai.
               </p>
             </div>

             <div className="relative rounded-lg overflow-hidden border border-white/20 mb-4 shadow-xl h-40 md:h-56 bg-slate-950/50 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"/>
                <img 
                  src="/stafflogin.png" 
                  alt="Staff Login Location" 
                  className="h-full w-auto object-contain max-w-full relative z-0" 
                  onError={(e) => e.target.style.display = 'none'} 
                />
                <div className="absolute bottom-2 left-4 z-20 text-white text-xs font-bold tracking-widest bg-cyan-600 px-2 py-1 rounded shadow-lg">
                   CLICK HERE
                </div>
             </div>

             <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r">
                <p className="text-xs text-red-300">
                   <strong>⚠️ Security Note:</strong> Is panel ka <strong>Email & Password</strong> secured hai. 
                   Kripya access ke liye website developer se sampark karein. (Credentials are not public).
                </p>
             </div>
          </div>
        </ManualSection>

      </div>
    </div>
  );
}