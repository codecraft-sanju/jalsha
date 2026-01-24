import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
} from 'framer-motion';
// Fixed: Using core Lenis directly to avoid React 19 conflicts
import Lenis from 'lenis';
import { 
  Droplets, X, Menu, 
  ArrowRight, Package, 
  Zap, ChevronDown,
  Facebook, Instagram, Linkedin, Truck, Layers, Calculator,
  Phone, Mail, MapPin, Award, Users, Clock,
  LogOut, CheckCircle, Lock, Loader2, Search,
  UserPlus, 
  // ✅ FIXED: Added missing icons
  Settings, AlertCircle, Trash2 
} from 'lucide-react';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';

// --- IMPORT THE NEW ADMIN PANEL ---
// Make sure this path matches where you saved AdminPanel.jsx
import AdminView from './pages/adminPanel'; 

// --- CONFIGURATION & ASSETS ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919867165845";

const NOISE_BG = "url('https://grainy-gradients.vercel.app/noise.svg')";

// --- VISUAL MICRO-COMPONENTS ---

const GrainOverlay = () => (
  <div className="hidden md:block pointer-events-none fixed inset-0 z-[10] opacity-[0.04] mix-blend-overlay will-change-opacity" style={{ backgroundImage: NOISE_BG }} />
);

const BlurPatch = ({ color = "bg-cyan-500", className }) => (
  <div className={`absolute rounded-full blur-[100px] opacity-20 pointer-events-none ${color} ${className}`} />
);

const Spinner = ({ size = 18, color = "text-white/80" }) => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="flex items-center justify-center"
  >
    <Loader2 size={size} className={color} />
  </motion.div>
);

const Reveal = ({ children, direction = "up", delay = 0, className = "" }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LuxuryButton = ({ children, primary = false, onClick, className = "", icon: Icon, disabled, loading = false }) => (
  <motion.button
    whileHover={{ scale: (disabled || loading) ? 1 : 1.05 }}
    whileTap={{ scale: (disabled || loading) ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled || loading}
    className={`relative px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase overflow-hidden group transition-all duration-500 flex items-center justify-center gap-3 ${
      (disabled || loading)
        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-80'
        : primary 
          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_-5px_rgba(6,182,212,0.6)]' 
          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
    } ${className}`}
  >
    <span className="relative z-10 flex items-center gap-2">
      {loading ? (
          <>Processing <Spinner size={16} color={primary ? "text-slate-900" : "text-white"} /></>
      ) : (
          <>
            {children}
            {Icon && <Icon size={16} />}
          </>
      )}
    </span>
    {primary && !disabled && !loading && (
      <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    )}
  </motion.button>
);

const ShimmerHeadline = () => {
  return (
    <div className="relative inline-block">
      <h1 className="text-6xl md:text-[10rem] font-black text-white/10 leading-[0.8] tracking-tighter select-none mix-blend-overlay">
        BULK SUPPLY
      </h1>
      <motion.div 
        className="absolute inset-0 text-6xl md:text-[10rem] font-black leading-[0.8] tracking-tighter select-none text-transparent bg-clip-text bg-[linear-gradient(110deg,rgba(255,255,255,0.1)_40%,#22d3ee_50%,rgba(255,255,255,0.1)_60%)] bg-[length:250%_100%]"
        animate={{ backgroundPosition: ["100% 0%", "-100% 0%"] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
        style={{ WebkitBackgroundClip: "text" }}
      >
        BULK SUPPLY
      </motion.div>
      <div className="absolute inset-0 text-6xl md:text-[10rem] font-black leading-[0.8] tracking-tighter select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-transparent opacity-80 pointer-events-none">
        BULK SUPPLY
      </div>
    </div>
  );
};

const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 5,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/10 will-change-transform"
          style={{ width: b.size, height: b.size, left: `${b.left}%`, bottom: -50 }}
          animate={{ y: -1200, opacity: [0, 1, 0] }}
          transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
};

// --- CUSTOMER UI COMPONENTS ---

const MobileDock = ({ itemCount, onOpenCart, onOpenMenu, onOpenDashboard }) => {
  return (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 left-4 right-4 h-16 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl z-[50] flex items-center justify-between px-6 shadow-2xl shadow-black/80 md:hidden"
    >
      <div className="flex items-center gap-6">
          <button onClick={onOpenMenu} className="text-white/60 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1">
            <Menu size={22} />
          </button>
          
          <button onClick={onOpenDashboard} className="text-white/60 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 relative">
            <UserPlus size={22} />
          </button>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 -top-6">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] text-white border-4 border-slate-950"
        >
          <Droplets size={24} fill="currentColor" />
        </motion.button>
      </div>

      <div className="flex items-center justify-end">
          <button onClick={onOpenCart} className="relative text-white/60 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1">
            <Package size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse shadow-lg">
                {itemCount}
              </span>
            )}
          </button>
      </div>
    </motion.div>
  );
};

const ParallaxBottle = () => {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { 
    damping: 25, 
    stiffness: 120, 
    mass: 0.2 
  }); 
  const y = useTransform(smoothY, [0, 500, 1000], ['-35%', '25%', '50%']);
  const rotate = useTransform(smoothY, [0, 500], [5, 0]); 
  const scale = useTransform(smoothY, [0, 500], [1.1, 0.9]); 
  const opacity = useTransform(smoothY, [800, 1200], [1, 0]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <BlurPatch className="w-[80vw] h-[80vw] bg-cyan-500/20 md:opacity-10" />
      <motion.div 
        style={{ y, rotate, scale, opacity }} 
        className="relative h-[65vh] md:h-[95vh] w-auto aspect-[1/3] z-20 will-change-transform transform-gpu"
      >
        <img 
          src="./1litre.png" alt="Jalsa Premium" 
          className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </motion.div>
    </div>
  );
};

const ProductCard = ({ p, onUpdateCart, cartItem, index }) => {
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = p.stock <= 0;
  const isLowStock = p.stock < (p.lowStockThreshold || 50);

  const handleIncrement = () => {
    if (quantity < p.stock) {
      onUpdateCart(p, quantity + 1);
    } else {
      toast.error('Cannot exceed available stock!');
    }
  };
  const handleDecrement = () => { if (quantity > 0) onUpdateCart(p, quantity - 1); };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="snap-center shrink-0 w-[85vw] md:w-[400px]"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative h-[600px] rounded-[2rem] bg-slate-900 border border-white/10 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_50px_-20px_rgba(6,182,212,0.3)] flex flex-col transform-gpu"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Top Half (Image) */}
        <div className="h-[55%] flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 relative p-6">
           <div className="absolute inset-0 bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-500" />
           <motion.img 
             src={p.img || p.imageUrl} alt={p.size} 
             className={`h-full w-auto object-contain drop-shadow-2xl z-10 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
             whileHover={!isOutOfStock ? { scale: 1.1, z: 50 } : {}}
             onError={(e) => {e.target.src = "https://placehold.co/200x400/000/FFF?text=Bottle"}}
           />
           {p.tag && !isOutOfStock && (
             <span className="absolute top-6 right-6 bg-white text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
               {p.tag}
             </span>
           )}
           {isOutOfStock && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/90 backdrop-blur text-white text-lg font-bold px-6 py-2 rounded-full uppercase tracking-widest z-30 border-2 border-red-400 rotate-[-10deg] shadow-xl">
                Sold Out
              </span>
           )}
           <div className="absolute bottom-4 left-6 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] text-white/70 uppercase tracking-widest">
              1 Crate = {p.crateSize} Units
           </div>
        </div>

        {/* Bottom Half */}
        <div className="h-[45%] p-8 flex flex-col justify-between relative z-10 bg-slate-900/50 backdrop-blur-md">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-3xl font-bold text-white font-hindi">{p.size}</h3>
              <div className="text-right">
                <span className="text-lg text-cyan-400 font-mono block">₹{p.pricePerCrate}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Per Crate</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
            {isLowStock && !isOutOfStock && (
              <div className="text-orange-400 text-xs flex items-center gap-1 mb-2">
                <AlertCircle size={12} /> Only {p.stock} crates left
              </div>
            )}
          </div>
          
          <div className="space-y-3">
              <div className={`flex items-center justify-between bg-slate-950 rounded-xl p-1 border border-white/10 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDecrement}
                  className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                > - </motion.button>
                <div className="flex flex-col items-center">
                   <span className="text-white font-mono text-xl font-bold">{quantity}</span>
                   <span className="text-[9px] text-slate-500 uppercase tracking-widest">Crates</span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleIncrement}
                  className="w-12 h-12 flex items-center justify-center text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
                > + </motion.button>
              </div>
              
              <div className={`text-center text-[11px] text-cyan-400/80 tracking-wide transition-opacity duration-300 h-4 ${quantity > 0 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
                Total Bottles: {quantity * p.crateSize}
              </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- REUSABLE SECTIONS ---

const HeroSection = ({ openPartnerModal }) => (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 z-10">
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mt-[20vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex items-center justify-center gap-2 mb-4 md:mb-8">
          <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] tracking-[0.3em] font-bold uppercase backdrop-blur-md shadow-[0_0_15px_-5px_rgba(6,182,212,0.5)] flex items-center gap-2">
            <Truck size={12} /> Wholesale Only
          </span>
        </motion.div>
        <div className="mt-8 relative w-full z-0"><ShimmerHeadline /></div>
        <Reveal direction="up" delay={0.2}>
          <p className="mt-12 text-slate-400 text-sm md:text-lg max-w-xs md:max-w-md mx-auto font-light leading-relaxed relative z-20 backdrop-blur-sm bg-slate-950/30 p-4 rounded-xl">
            Direct from Mokampura Factory. <span className="block mt-2 text-cyan-400 font-medium">Book Full Truck Loads (FTL) or Wholesale Crates.</span>
          </p>
        </Reveal>
        <Reveal direction="up" delay={0.4}>
          <div className="mt-10 md:mt-12 flex gap-4 relative z-20">
            <LuxuryButton primary onClick={openPartnerModal} icon={ArrowRight}>Start Distributorship</LuxuryButton>
          </div>
        </Reveal>
      </div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 text-white/30 z-10">
        <ChevronDown size={16} />
      </motion.div>
    </section>
);

const StatItem = ({ label, value, icon: Icon, index }) => (
  <Reveal direction="up" delay={index * 0.1}>
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400">
        <Icon size={24} />
      </div>
      <div className="text-3xl md:text-4xl font-black text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  </Reveal>
);

const FeatureTile = ({ icon: Icon, title, desc, delay }) => (
  <Reveal direction="up" delay={delay}>
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] transition-colors hover:border-cyan-500/30 group">
      <Icon className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" size={32} />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  </Reveal>
);

const SplashLoader = () => (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center relative">
        <motion.div initial={{ y: -100, opacity: 0, scale: 0.5 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "bounceOut" }} className="text-cyan-500 mb-6">
          <Droplets size={80} fill="currentColor" />
        </motion.div>
        <motion.div initial={{ width: 0, height: 0, opacity: 0.8 }} animate={{ width: 200, height: 200, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500 rounded-full" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-6xl font-black tracking-tighter text-white font-hindi flex items-center gap-1">
          <span className="text-cyan-500">जल</span>sa
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-4 text-[10px] text-slate-500 uppercase tracking-[0.4em]">Premium Hydration</motion.div>
      </div>
    </div>
);

const SocialIcon = ({ Icon }) => (
   <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white transition-all duration-300">
      <Icon size={18} />
   </a>
);

const CartDrawer = ({ isOpen, onClose, cart, onCheckout, onUpdateCart }) => {
  const items = Object.values(cart);
  const totalCrates = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = items.reduce((acc, item) => acc + (item.quantity * item.pricePerCrate), 0);
  const [loading, setLoading] = useState(false);
  const [mobileInput, setMobileInput] = useState(localStorage.getItem('jalsa_customer_mobile') || '');

  const handleCheckoutClick = async () => {
      if (!mobileInput || mobileInput.length < 10) {
          toast.error("Please enter a valid mobile number");
          return;
      }
      setLoading(true);
      await onCheckout(mobileInput);
      setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-white/10 z-[70] p-8 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div><h2 className="text-2xl font-bold text-white">Stock List</h2><p className="text-xs text-slate-500">Review your bulk inquiry</p></div>
              <button onClick={onClose}><X className="text-slate-400 hover:text-white" /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-slate-500 text-center mt-20 flex flex-col items-center gap-4"><Package size={48} className="opacity-20"/><div>No crates selected.</div></div>
              ) : (
                items.map((item) => (
                  <div key={item._id || item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center pr-2">
                    <div className="flex items-center gap-3">
                      <img src={item.img} alt="mini" className="w-10 h-auto object-contain" />
                      <div>
                        <div className="font-bold text-white text-sm">{item.size}</div>
                        <div className="text-xs text-cyan-400">{item.quantity} Crates</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-white font-mono text-sm">₹{item.quantity * item.pricePerCrate}</div>
                          <div className="text-[9px] text-slate-500">{(item.quantity * item.crateSize)} Bottles</div>
                        </div>
                        <button 
                            onClick={() => onUpdateCart(item, 0)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                            title="Remove Item"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4 space-y-4">
               <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Total Crates</span><span className="text-white font-bold">{totalCrates}</span></div>
               <div className="flex justify-between items-center text-xl"><span className="text-slate-400">Est. Total</span><span className="text-cyan-400 font-bold font-mono">₹{totalCost.toLocaleString()}</span></div>
               
               <div className="space-y-2">
                   <label className="text-xs text-slate-400 uppercase tracking-wider">Contact Number</label>
                   <input 
                       type="tel" 
                       placeholder="Enter your mobile number" 
                       value={mobileInput}
                       onChange={(e) => setMobileInput(e.target.value)}
                       className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500"
                   />
               </div>

               <LuxuryButton primary className="w-full" onClick={handleCheckoutClick} disabled={items.length === 0} loading={loading}>Request via WhatsApp</LuxuryButton>
               <p className="text-[10px] text-center text-slate-600">Note: Final pricing and delivery charges will be confirmed by our sales team.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FullScreenMenu = ({ isOpen, onClose, openPartner }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5 }} className="fixed inset-0 bg-cyan-600 z-[80] flex flex-col p-8 md:p-20">
        <div className="flex justify-between items-center text-slate-900 mb-20">
          <div className="font-black text-2xl tracking-tighter">जलsa.</div>
          <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-white"><X size={24}/></button>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4">
          {['Factory Info', 'Products', 'Logistics'].map((item, i) => (
            <motion.div key={item} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + (i * 0.1) }} className="text-5xl md:text-7xl font-black text-slate-900 hover:text-white transition-colors cursor-pointer tracking-tighter" onClick={onClose}>{item}</motion.div>
          ))}
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl font-black text-white cursor-pointer tracking-tighter underline decoration-4" onClick={openPartner}>Become a Dealer</motion.div>
        </div>
        <div className="flex gap-6 text-slate-900"><Instagram /> <Facebook /> <Linkedin /></div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PartnerModal = ({ isOpen, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({ name: '', shop: '', mobile: '', city: '', volume: '100 - 500 Crates', gstin: '' });

    const handleSubmit = async () => {
        if(!form.name || !form.mobile) {
            toast.error("Name and Mobile are required");
            return;
        }
        if(!/^\d{10}$/.test(form.mobile)) {
            toast.error("Invalid Mobile Number (10 digits required)");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: form.name, 
                    shopName: form.shop, 
                    mobile: form.mobile, 
                    city: form.city, 
                    volume: form.volume,
                    gstin: form.gstin 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Submission failed');
            }

            const message = `*New Dealership Application*\n\nName: ${form.name}\nShop: ${form.shop}\nMobile: ${form.mobile}\nCity: ${form.city}\nVolume: ${form.volume}\n\n*Reference ID:* ${data.id}`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

            setSuccess(true);
            setTimeout(() => {
                 setSuccess(false);
                 onClose();
                 setForm({ name: '', shop: '', mobile: '', city: '', volume: '100 - 500 Crates', gstin: '' });
            }, 2500);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl z-[95] overflow-hidden flex flex-col shadow-2xl">
              {success ? (
                  <div className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                      <motion.div initial={{scale:0}} animate={{scale:1}} className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-slate-900 mb-6">
                          <CheckCircle size={40}/>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Application Sent!</h3>
                      <p className="text-slate-400">We have received your details.<br/>Opening WhatsApp now...</p>
                  </div>
              ) : (
                <>
                  <div className="p-8 bg-gradient-to-br from-cyan-600 to-blue-700 relative overflow-hidden">
                      <div className="relative z-10 text-white"><h3 className="text-3xl font-bold mb-2">Dealer Application</h3><p className="text-blue-100 text-sm">Join the distribution network of Mokampura's finest water.</p></div>
                      <Droplets className="absolute -bottom-4 -right-4 text-white/20 w-32 h-32" />
                      <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40"><X size={18}/></button>
                  </div>
                  <div className="p-8 space-y-4 overflow-y-auto">
                      <input type="text" placeholder="Owner Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                      <input type="text" placeholder="Shop / Agency Name" value={form.shop} onChange={e => setForm({...form, shop: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                      <div className="flex gap-4"><input type="tel" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" /><input type="text" placeholder="Area / City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" /></div>
                      <input type="text" placeholder="GST Number (Optional)" value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <label className="text-slate-400 text-xs uppercase tracking-wider mb-2 block">Expected Monthly Offtake</label>
                        <select value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none">
                            <option>100 - 500 Crates</option>
                            <option>500 - 1000 Crates</option>
                            <option>Full Truck Load (FTL)</option>
                        </select>
                      </div>
                      <LuxuryButton primary className="w-full" onClick={handleSubmit} loading={submitting}>Submit Application</LuxuryButton>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
};

const CustomerDashboard = ({ isOpen, onClose }) => {
  const [mobile, setMobile] = useState(localStorage.getItem('jalsa_customer_mobile') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jalsa_customer_mobile'));
  const [myOrders, setMyOrders] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  const fetchCustomerData = async (phone) => {
    setLoading(true);
    try {
      const orderRes = await fetch(`${API_URL}/api/orders?mobile=${phone}`);
      const orderData = await orderRes.json();
      if(Array.isArray(orderData)) setMyOrders(orderData);

      const appRes = await fetch(`${API_URL}/api/applications?mobile=${phone}`);
      const appData = await appRes.json();
      if(Array.isArray(appData)) setMyApps(appData);

    } catch (err) {
      console.error("Tracking Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isLoggedIn && mobile) {
      fetchCustomerData(mobile);
    }
  }, [isOpen, isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (mobile.length === 10) {
      localStorage.setItem('jalsa_customer_mobile', mobile);
      setIsLoggedIn(true);
      fetchCustomerData(mobile);
      toast.success("Dashboard Loaded");
    } else {
      toast.error("Please enter valid 10-digit mobile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jalsa_customer_mobile');
    setIsLoggedIn(false);
    setMobile('');
    setMyOrders([]);
    setMyApps([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]" />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25 }} 
            className="fixed right-0 top-0 h-full w-full md:max-w-md bg-slate-950 border-l border-white/10 z-[95] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus size={20} className="text-cyan-500"/> My Account
                </h2>
                {isLoggedIn && <p className="text-xs text-slate-500 font-mono mt-1">+91 {mobile}</p>}
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>

            {!isLoggedIn ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 mb-6">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Track Your Orders</h3>
                <p className="text-slate-400 mb-8 text-sm">Enter your registered mobile number to view order history and dealership status.</p>
                
                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <input 
                    type="tel" 
                    placeholder="Mobile Number (e.g. 9876543210)" 
                    value={mobile} 
                    onChange={e => setMobile(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white text-center text-lg tracking-widest outline-none focus:border-cyan-500 transition-colors"
                  />
                  <LuxuryButton primary className="w-full justify-center" onClick={handleLogin}>View Dashboard</LuxuryButton>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex p-4 gap-2">
                  <button onClick={() => setActiveTab('orders')} className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}>
                    Orders ({myOrders.length})
                  </button>
                  <button onClick={() => setActiveTab('applications')} className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}>
                    Applications ({myApps.length})
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-20"><Spinner size={30} /></div>
                  ) : (
                    <>
                      {activeTab === 'orders' && (
                        <>
                          {myOrders.length === 0 && <div className="text-center text-slate-500 py-10">No orders found for this number.</div>}
                          {myOrders.map((order) => (
                            <div key={order._id || order.id} className="bg-slate-900 p-4 rounded-xl border border-white/5">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Order ID: {order.orderId}</div>
                                  <div className="text-xs text-slate-400">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                  order.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' :
                                  order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {order.status}
                                </div>
                              </div>
                              <div className="space-y-1 mb-3">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm text-slate-300">
                                    <span>{item.quantity}x {item.size}</span>
                                    <span>₹{item.priceAtPurchase * item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Total Amount</span>
                                <span className="text-cyan-400 font-mono font-bold">₹{order.totalAmount}</span>
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {activeTab === 'applications' && (
                          <>
                           {myApps.length === 0 && <div className="text-center text-slate-500 py-10">No applications found.</div>}
                           {myApps.map((app) => (
                             <div key={app._id} className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                   <h4 className="font-bold text-white">{app.shopName}</h4>
                                   <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                                     app.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                   }`}>
                                     {app.status || 'Under Review'}
                                   </span>
                                </div>
                                <div className="text-xs text-slate-400">
                                  <p>Applied for: {app.volume}</p>
                                  <p>Location: {app.city}</p>
                                </div>
                             </div>
                           ))}
                          </>
                      )}
                    </>
                  )}
                </div>

                <div className="p-4 border-t border-white/10">
                  <button onClick={handleLogout} className="w-full py-3 text-red-400 text-xs uppercase font-bold hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onLogin(email, password);
            onClose();
            toast.success("Welcome back, Admin!");
        } catch (err) {
            setError('Invalid credentials');
            toast.error("Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]" />
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-slate-900 border border-white/10 rounded-2xl z-[95] overflow-hidden flex flex-col shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-bold text-white flex items-center gap-2"><Lock size={18} className="text-cyan-500"/> Staff Login</h3>
                             <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white"/></button>
                        </div>
                        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-xs mb-4">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="email" placeholder="Admin Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500"/>
                            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500"/>
                            <LuxuryButton primary className="w-full justify-center" loading={loading} onClick={handleSubmit}>Access Panel</LuxuryButton>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- MAIN CONTROLLER APP ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('customer'); // 'customer' or 'admin'
  const [loginOpen, setLoginOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [dashboardOpen, setDashboardOpen] = useState(false); 

  // DYNAMIC DATA STATES
  const [products, setProducts] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]); 
  
  const [cart, setCart] = useState(() => {
      try {
        const saved = localStorage.getItem('jalsa_cart');
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        return {};
      }
  }); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  // --- LENIS SMOOTH SCROLL SETUP ---
  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smoothWheel: true,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
        lenis.destroy();
    };
  }, []);

  useEffect(() => {
      localStorage.setItem('jalsa_cart', JSON.stringify(cart));
  }, [cart]);

  // --- API CALLS ---
  const fetchProducts = async () => {
    try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (data && Array.isArray(data)) {
            setProducts(data);
        } else {
            setProducts([]);
        }
    } catch (err) { 
        console.error("API Error", err); 
        setProducts([]); 
    }
  };

  const fetchAdminData = async () => {
      if(!token) return;
      try {
          const ordersRes = await fetch(`${API_URL}/api/orders`, { headers: { 'x-auth-token': token } });
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);

          const dealersRes = await fetch(`${API_URL}/api/dealers`, { headers: { 'x-auth-token': token } });
          const dealersData = await dealersRes.json();
          setDealers(Array.isArray(dealersData) ? dealersData : []);

      } catch (err) { console.error("Admin Fetch Error", err); }
  };

  // --- INITIALIZATION & SOCKETS ---
  useEffect(() => {
    fetchProducts();
    if (token) {
        setViewMode('admin');
        fetchAdminData();
    }

    const newSocket = io(API_URL);
    newSocket.on('connect', () => console.log('🟢 Socket Connected'));
    
    newSocket.on('stock_updated', (updatedProduct) => {
        setProducts(prev => {
             if(updatedProduct.deleted) {
                 return prev.filter(p => p._id !== updatedProduct._id);
             }
             const exists = prev.find(p => p._id === updatedProduct._id);
             if (exists) {
                 return prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p));
             }
             return [...prev, updatedProduct];
        });
    });

    newSocket.on('new_order', (newOrder) => {
        if(token) { 
            setOrders(prev => [newOrder, ...prev]);
            toast("New Order Received!", { icon: '📦' });
        }
    });

    newSocket.on('order_status_updated', (updatedOrder) => {
        if(token) {
            setOrders(prev => prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o)));
        }
    });

    newSocket.on('dealer_updated', (updatedDealer) => {
        if(token) {
            setDealers(prev => {
                 const exists = prev.find(d => d._id === updatedDealer._id);
                 if (exists) return prev.map(d => (d._id === updatedDealer._id ? updatedDealer : d));
                 return [...prev, updatedDealer];
            });
        }
    });

    setTimeout(() => setLoading(false), 2000);

    return () => newSocket.disconnect();
  }, [token]);

  // --- HANDLERS ---

  const handleLogin = async (email, password) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
          localStorage.setItem('adminToken', data.token);
          setToken(data.token);
          setViewMode('admin');
          fetchAdminData();
      } else {
          throw new Error(data.msg);
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('adminToken');
      setToken(null);
      setViewMode('customer');
      setOrders([]);
      setDealers([]);
      toast("Logged out successfully");
  };

  const handleUpdateCart = (product, newQty) => {
    if (newQty > product.stock) {
      toast.error(`Only ${product.stock} crates available`);
      return;
    }
    const pid = product._id || product.id;
    setCart(prev => {
      const newCart = { ...prev };
      if (newQty <= 0) {
          delete newCart[pid];
          toast('Removed from cart', { icon: '🗑️' });
      } else {
          const isAdd = (!prev[pid] || newQty > prev[pid].quantity);
          newCart[pid] = { ...product, quantity: newQty };
          if(isAdd) toast.success(`Added ${newQty} crates`);
      }
      return newCart;
    });
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const getCartCount = () => Object.keys(cart).length;

  const handleWhatsAppCheckout = async (customerMobile) => {
    const items = Object.values(cart);
    if (items.length === 0) return;

    const totalEstimate = items.reduce((acc, item) => acc + (item.quantity * item.pricePerCrate), 0);
    const orderItems = items.map(i => ({ productId: i._id, size: i.size, quantity: i.quantity, priceAtPurchase: i.pricePerCrate }));

    try {
        const orderData = {
            customerName: "Web Customer", 
            customerMobile: customerMobile,
            items: orderItems,
            totalAmount: totalEstimate,
            paymentStatus: "Unpaid"
        };

        const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if(res.ok) {
            localStorage.setItem('jalsa_customer_mobile', customerMobile);

            const savedOrder = await res.json();
            let message = `*Wholesale Inquiry - जलsa Water*\n*Order ID:* ${savedOrder.orderId}\n\nI have placed an order via website:\n`;
            items.forEach(item => {
                message += `🔹 ${item.size} x ${item.quantity} Crates\n`;
            });
            message += `\n*Total Value: ₹${totalEstimate.toLocaleString()}*`;
            
            window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            
            setCart({});
            setCartOpen(false);
            toast.success("Order Placed Successfully!");
        } else {
            const err = await res.json();
            toast.error(err.msg || "Stock issue or server error");
        }
    } catch (err) {
        toast.error("Network Error. Please try again.");
    }
  };

  // Admin Handlers
  const handleStockUpdate = async (id, newStock) => {
      try {
          await fetch(`${API_URL}/api/products/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
              body: JSON.stringify({ stock: newStock })
          });
          toast.success("Stock Updated");
      } catch (err) { toast.error('Update failed'); }
  };

  const handleOrderStatus = async (id, status) => {
      try {
          await fetch(`${API_URL}/api/orders/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
              body: JSON.stringify({ status })
          });
          toast.success(`Order marked as ${status}`);
      } catch (err) { toast.error('Status update failed'); }
  };

  const handleDealerTransaction = async (id, amount, type, description) => {
      try {
          await fetch(`${API_URL}/api/dealers/${id}/transaction`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
              body: JSON.stringify({ amount: Number(amount), type, description })
          });
          toast.success("Transaction Recorded");
      } catch (err) { toast.error('Transaction failed'); }
  };

  const handleSaveProduct = async (productData) => {
      try {
          const url = productData._id 
            ? `${API_URL}/api/products/${productData._id}` 
            : `${API_URL}/api/products`;
          
          const method = productData._id ? 'PUT' : 'POST';

          const res = await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
              body: JSON.stringify(productData)
          });

          if (!res.ok) throw new Error('Failed to save');
          
          fetchProducts();
          toast.success(productData._id ? "Product Updated" : "Product Created");
      } catch (err) {
          toast.error("Database Connection Failed");
      }
  };

  const handleDeleteProduct = async (id) => {
      try {
          await fetch(`${API_URL}/api/products/${id}`, {
              method: 'DELETE',
              headers: { 'x-auth-token': token }
          });
          toast.success("Product Deleted");
      } catch (err) {
          toast.error("Delete Failed");
      }
  };

  const handleAddDealer = async (dealerData) => {
      try {
          const res = await fetch(`${API_URL}/api/dealers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
              body: JSON.stringify(dealerData)
          });
          if(res.ok) {
              fetchAdminData();
              toast.success("Dealer Added");
          } else {
              throw new Error('Failed');
          }
      } catch(err) {
          toast.error("Failed to add dealer");
      }
  };

  if (loading) return <SplashLoader />;

  // RENDER: Admin View
  if (viewMode === 'admin' && token) {
    return (
      <>
        <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}} />
        <AdminView 
          products={products} 
          orders={orders} 
          dealers={dealers}
          onStockUpdate={handleStockUpdate}
          onStatusUpdate={handleOrderStatus}
          onDealerUpdate={handleDealerTransaction}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddDealer={handleAddDealer}
          onLogout={handleLogout} 
        />
      </>
    );
  }

  // RENDER: Customer View
  return (
        <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500/30">
        <Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}} />
        <GrainOverlay />
        <FloatingBubbles />
        <ParallaxBottle />
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-40 px-8 py-6 hidden md:flex justify-between items-center mix-blend-difference text-white">
            <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <Droplets className="text-cyan-400" size={24}/> जलsa.
            </div>
            <div className="flex gap-8 text-sm font-bold tracking-widest uppercase opacity-80">
            <button onClick={() => setMenuOpen(true)} className="hover:text-cyan-400 transition-colors">Catalog</button>
            <button onClick={() => setPartnerOpen(true)} className="hover:text-cyan-400 transition-colors">Distributorship</button>
            </div>
            
            <div className="flex items-center gap-6">
                <button onClick={() => setDashboardOpen(true)} className="flex items-center gap-2 text-sm font-bold uppercase hover:text-cyan-400 transition-colors">
                    <UserPlus size={18} /> My Orders
                </button>
                <button onClick={() => setCartOpen(true)} className="flex gap-2 items-center hover:text-cyan-400 transition-colors font-bold uppercase text-sm">
                    <Package size={18} /> Bulk List ({getCartCount()})
                </button>
            </div>
        </nav>

        {/* Main Content */}
        <main className="relative pb-0">
            <HeroSection openPartnerModal={() => setPartnerOpen(true)} />

            <div className="bg-cyan-500 text-slate-950 py-4 overflow-hidden whitespace-nowrap relative z-20 rotate-[-2deg] scale-110 shadow-2xl origin-left my-20 border-y-4 border-slate-950">
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} className="flex gap-12 font-black text-4xl md:text-6xl uppercase tracking-tighter items-center transform-gpu">
                {[1,2,3,4,5,6].map(i => (
                <span key={i} className="flex items-center gap-4">Wholesale Supply <Zap fill="currentColor" size={32}/> Bulk Orders <Truck fill="currentColor" size={32}/></span>
                ))}
            </motion.div>
            </div>

            <section className="py-20 relative z-10">
            <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
                <Reveal direction="left">
                    <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">Stock <span className="text-cyan-500">Order</span></h2>
                    <p className="text-slate-400 mt-2 text-sm">Select crates count for your shop/godown.</p>
                </Reveal>
            </div>
            
            {/* Dynamic Product List (Empty State Handling) */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-12 scrollbar-hide pt-10">
                {products.length === 0 ? (
                    <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-3xl mx-6">
                        <Package size={48} className="mx-auto text-slate-700 mb-4"/>
                        <p className="text-slate-500">Inventory Loading or Empty...</p>
                        <p className="text-xs text-slate-600 mt-2">Login as Admin to add stock.</p>
                    </div>
                ) : (
                    products.map((p, index) => (
                    <ProductCard key={p._id || p.id} index={index} p={p} onUpdateCart={handleUpdateCart} cartItem={cart[p._id || p.id]} />
                    ))
                )}
            </div>
            </section>

            <section className="container mx-auto px-6 py-20 relative z-10 grid md:grid-cols-3 gap-6">
            <FeatureTile icon={Truck} title="Factory Direct" desc="We manage our own logistics fleet." delay={0.1} />
            <FeatureTile icon={Layers} title="Stackable" desc="Crates designed for safe warehousing." delay={0.2} />
            <FeatureTile icon={Calculator} title="High Margin" desc="Competitive pricing structure for dealers." delay={0.3} />
            </section>

            <section className="py-24 border-y border-white/5 bg-slate-900/40 relative z-10 backdrop-blur-sm">
            <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                <StatItem icon={Users} value="120+" label="Active Dealers" index={0} />
                <StatItem icon={Clock} value="24h" label="Dispatch Time" index={1} />
                <StatItem icon={Award} value="ISO" label="Certified Plant" index={2} />
                <StatItem icon={Truck} value="10k+" label="Crates Delivered" index={3} />
            </div>
            </section>

            <section className="relative py-32 flex flex-col items-center justify-center text-center px-6">
            <BlurPatch color="bg-blue-600" className="w-[300px] h-[300px]" />
            <Reveal direction="up">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 max-w-2xl relative z-10">Ready to stock <span className="text-cyan-400">जलsa</span>?</h2>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
                <LuxuryButton primary onClick={() => setPartnerOpen(true)} className="scale-125 z-10">Apply for Dealership</LuxuryButton>
            </Reveal>
            </section>
        </main>

        {/* Global Overlays */}
        <MobileDock 
          itemCount={getCartCount()} 
          onOpenCart={() => setCartOpen(true)} 
          onOpenMenu={() => setMenuOpen(true)} 
          onOpenDashboard={() => setDashboardOpen(true)}
        />
        
        <CartDrawer 
            isOpen={cartOpen} 
            onClose={() => setCartOpen(false)} 
            cart={cart} 
            onUpdateCart={handleUpdateCart}
            onCheckout={handleWhatsAppCheckout} 
        />
        
        <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} openPartner={() => { setMenuOpen(false); setPartnerOpen(true); }} />
        <PartnerModal isOpen={partnerOpen} onClose={() => setPartnerOpen(false)} />
        <CustomerDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />

        {/* Footer */}
        <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="text-3xl font-black text-white tracking-tighter mb-6 flex items-center gap-2">
                        <Droplets className="text-cyan-500" /> जलsa.
                    </div>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">Pure hydration, bottled at source. Proudly serving Rajasthan.</p>
                    <div className="flex gap-4 mb-8">
                        <SocialIcon Icon={Instagram} /> <SocialIcon Icon={Facebook} /> <SocialIcon Icon={Linkedin} />
                    </div>
                    {/* ADMIN LOGIN */}
                    <div>
                        <button onClick={() => token ? setViewMode('admin') : setLoginOpen(true)} className="text-[10px] uppercase tracking-widest text-slate-700 hover:text-cyan-500 transition-colors flex items-center gap-2 border border-slate-800 px-3 py-1 rounded-full">
                            <Settings size={10} /> Staff Login
                        </button>
                    </div>
                </div>
                
                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li className="hover:text-cyan-400 cursor-pointer transition-colors">Product Catalog</li>
                        <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setPartnerOpen(true)}>Partner Program</li>
                        <li className="hover:text-cyan-400 cursor-pointer transition-colors">Quality Reports</li>
                        <li className="hover:text-cyan-400 cursor-pointer transition-colors">Contact Support</li>
                    </ul>
                </div>
                
                {/* Contact */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Factory Contact</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li className="flex items-start gap-3"><MapPin size={16} className="text-cyan-500 mt-1 shrink-0" /><span>Plot No. 45, Industrial Area, Mokampura</span></li>
                        <li className="flex items-center gap-3"><Phone size={16} className="text-cyan-500 shrink-0" /><span>+91 9867165845</span></li>
                        <li className="flex items-center gap-3"><Mail size={16} className="text-cyan-500 shrink-0" /><span>sales@jalsawater.com</span></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Distributor Updates</h4>
                    <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex">
                        <input type="email" placeholder="Your email" className="bg-transparent text-white px-4 py-2 w-full text-sm outline-none" />
                        <button className="bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-500 transition-colors"><ArrowRight size={16} /></button>
                    </div>
                    <p className="text-xs text-slate-600 mt-4">Subscribe for price updates and seasonal offers.</p>
                </div>
                </div>
                
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
                <p>&copy; 2026 Eeji Enterprises Pvt Ltd.</p>
                <div className="flex gap-6"><span>Privacy Policy</span><span>Terms of Trade</span></div>
                </div>
            </div>
        </footer>
        </div>
  );
}