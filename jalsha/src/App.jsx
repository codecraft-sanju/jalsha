import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  useInView
} from 'framer-motion';
import { 
  Droplets, X, Menu, 
  ArrowRight, Package, 
  Zap, ChevronDown,
  Facebook, Instagram, Linkedin, Truck, Layers, Calculator,
  Phone, Mail, MapPin, Award, Users, Clock,
  BarChart3, LayoutDashboard, Settings, LogOut, CheckCircle, AlertCircle,
  BookOpen, Plus, Minus, Wallet
} from 'lucide-react';

// --- CONFIGURATION & ASSETS ---
const IMG_200ML = "./200litre.png"; 
const IMG_1L = "./1litre.png";
const IMG_20L = "./20litre.png";

const WHATSAPP_NUMBER = "919800000000"; 
const NOISE_BG = "url('https://grainy-gradients.vercel.app/noise.svg')";

// --- INITIAL DATA (DATABASE SIMULATION) ---

// 1. PRODUCTS & STOCK
const INITIAL_PRODUCTS = [
  { 
    id: "p1",
    size: "200ml", 
    img: IMG_200ML, 
    crateSize: 30, 
    pricePerCrate: 240, 
    stock: 500, // Factory Stock
    desc: "Weddings & Events Preferred", 
    tag: "High Volume" 
  },
  { 
    id: "p2",
    size: "1 Litre", 
    img: IMG_1L, 
    crateSize: 12, 
    pricePerCrate: 180, 
    stock: 120, // Factory Stock
    desc: "Retail & Shop Standard", 
    tag: "Best Seller" 
  },
  { 
    id: "p3",
    size: "20 Litre", 
    img: IMG_20L, 
    crateSize: 1, 
    pricePerCrate: 60, 
    stock: 50, // Factory Stock
    desc: "Office & Home Delivery", 
    tag: "Recurring" 
  },
];

// 2. MOCK ORDERS (Previous History)
const MOCK_ORDERS = [
  { 
    id: "#ORD-992", 
    customer: "Roshni General Store", 
    items: "12x 1L Crates", 
    status: "Pending", 
    total: 2160, 
    time: "10 mins ago" 
  },
  { 
    id: "#ORD-991", 
    customer: "Hotel Raj Palace", 
    items: "50x 200ml Crates", 
    status: "Dispatched", 
    total: 12000, 
    time: "2 hours ago" 
  },
];

// 3. DEALERS KHATA (CREDIT BOOK)
const MOCK_DEALERS = [
  { id: 1, name: "Roshni General Store", location: "Kota Road", balance: -15000, lastPay: "2 days ago" },
  { id: 2, name: "Jai Shree Krishna Agency", location: "Market Yard", balance: -2400, lastPay: "Yesterday" },
  { id: 3, name: "City Mall Food Court", location: "Civil Lines", balance: 0, lastPay: "Paid Full" },
  { id: 4, name: "Sharma Distributors", location: "Station Road", balance: -45000, lastPay: "1 week ago" },
];

// --- 1. VISUAL MICRO-COMPONENTS ---

const GrainOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-[10] opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />
);

const BlurPatch = ({ color = "bg-cyan-500", className }) => (
  <div className={`absolute rounded-full blur-[100px] opacity-20 pointer-events-none ${color} ${className}`} />
);

// NEW: Reveal Component for Scroll Animations
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

const LuxuryButton = ({ children, primary = false, onClick, className = "", icon: Icon, disabled }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`relative px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase overflow-hidden group transition-all duration-500 flex items-center justify-center gap-3 ${
      disabled 
        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
        : primary 
          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_-5px_rgba(6,182,212,0.6)]' 
          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
    } ${className}`}
  >
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {Icon && <Icon size={16} />}
    </span>
    {primary && !disabled && (
      <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    )}
  </motion.button>
);

// --- 2. ANIMATION COMPONENTS ---

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
          className="absolute rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/10"
          style={{ width: b.size, height: b.size, left: `${b.left}%`, bottom: -50 }}
          animate={{ y: -1200, opacity: [0, 1, 0] }}
          transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
};

// --- 3. CUSTOMER UI COMPONENTS ---

const MobileDock = ({ itemCount, onOpenCart, onOpenMenu }) => {
  return (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 left-4 right-4 h-16 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl z-[50] flex items-center justify-between px-8 shadow-2xl shadow-black/80 md:hidden"
    >
      <button onClick={onOpenMenu} className="text-white/60 hover:text-cyan-400 transition-colors">
        <Menu size={24} />
      </button>
      
      <div className="absolute left-1/2 -translate-x-1/2 -top-6">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] text-white border-4 border-slate-950"
        >
          <Droplets size={24} fill="currentColor" />
        </motion.button>
      </div>

      <button onClick={onOpenCart} className="relative text-white/60 hover:text-cyan-400 transition-colors">
        <Package size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse shadow-lg">
            {itemCount}
          </span>
        )}
      </button>
    </motion.div>
  );
};

const ParallaxBottle = () => {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { damping: 15, stiffness: 100 }); 
  const y = useTransform(smoothY, [0, 500, 1000], ['-35%', '25%', '50%']);
  const rotate = useTransform(smoothY, [0, 500], [5, 0]); 
  const scale = useTransform(smoothY, [0, 500], [1.1, 0.9]); 
  const opacity = useTransform(smoothY, [800, 1200], [1, 0]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <BlurPatch className="w-[80vw] h-[80vw] bg-cyan-500/20 md:opacity-10" />
      <motion.div style={{ y, rotate, scale, opacity }} className="relative h-[65vh] md:h-[95vh] w-auto aspect-[1/3] z-20">
        <img 
          src={IMG_1L} alt="Jalsa Premium" 
          className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </motion.div>
    </div>
  );
};

const ProductCard = ({ p, onUpdateCart, cartItem, index }) => {
  const quantity = cartItem ? cartItem.quantity : 0;
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  // Stock Checks
  const isOutOfStock = p.stock <= 0;
  const isLowStock = p.stock < 50;

  const handleIncrement = () => onUpdateCart(p, quantity + 1);
  const handleDecrement = () => { if (quantity > 0) onUpdateCart(p, quantity - 1); };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="snap-center shrink-0 w-[85vw] md:w-[400px] perspective-1000"
    >
      <motion.div 
        style={{ rotateX, rotateY, z: 100 }}
        whileHover={{ scale: 1.02 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="relative h-[600px] rounded-[2rem] bg-slate-900 border border-white/10 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_50px_-20px_rgba(6,182,212,0.3)] flex flex-col"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Top Half (Image) */}
        <div className="h-[55%] flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 relative p-6">
           <div className="absolute inset-0 bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-500" />
           <motion.img 
             src={p.img} alt={p.size} 
             className={`h-full w-auto object-contain drop-shadow-2xl z-10 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
             whileHover={!isOutOfStock ? { scale: 1.1, rotate: 5 } : {}}
             onError={(e) => e.target.style.display = 'none'}
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
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.desc}</p>
            {isLowStock && !isOutOfStock && (
              <div className="text-orange-400 text-xs flex items-center gap-1 mb-2">
                <AlertCircle size={12} /> Only {p.stock} crates left
              </div>
            )}
          </div>
          
          <div className="space-y-3">
             <div className={`flex items-center justify-between bg-slate-950 rounded-xl p-1 border border-white/10 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                <button 
                  onClick={handleDecrement}
                  className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                > - </button>
                <div className="flex flex-col items-center">
                   <span className="text-white font-mono text-xl font-bold">{quantity}</span>
                   <span className="text-[9px] text-slate-500 uppercase tracking-widest">Crates</span>
                </div>
                <button 
                  onClick={handleIncrement}
                  className="w-12 h-12 flex items-center justify-center text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
                > + </button>
             </div>
             {quantity > 0 && (
                <div className="text-center text-[11px] text-cyan-400/80 tracking-wide animate-pulse">
                  Total Bottles: {quantity * p.crateSize}
                </div>
             )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 4. ADMIN PANEL COMPONENTS (FULL FEATURES) ---

const NavButton = ({ icon: Icon, label, active, onClick, count }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-cyan-400' : 'text-slate-500'}`}>
    <div className="relative">
       <Icon size={24} strokeWidth={active ? 2.5 : 2} />
       {count > 0 && (
         <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center">
           {count}
         </span>
       )}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const AdminView = ({ products, setProducts, orders, setOrders, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dealers, setDealers] = useState(MOCK_DEALERS);

  // Business Logic Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  // Feature: Update Stock
  const handleStockUpdate = (id, delta) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ));
  };

  // Feature: Manage Orders
  const handleOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: newStatus } : o
    ));
  };

  // Feature: Digital Khata Payment
  const handleDealerPayment = (id) => {
    const amount = prompt("Enter payment amount received (₹):");
    if (amount) {
      setDealers(prev => prev.map(d => 
        d.id === id ? { ...d, balance: d.balance + parseInt(amount), lastPay: "Just now" } : d
      ));
      alert(`Payment recorded! New Balance updated.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 font-sans">
      <GrainOverlay />
      
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950">
            <Droplets size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Mokampura Factory</span>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20">
          <LogOut size={18} />
        </button>
      </header>

      {/* Admin Content Area */}
      <main className="p-6 space-y-8 max-w-lg mx-auto">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 p-5 rounded-2xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase mb-2">Total Sales</div>
                <div className="text-2xl font-bold text-cyan-400">₹{totalRevenue.toLocaleString()}</div>
              </motion.div>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-slate-900 p-5 rounded-2xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase mb-2">Pending Orders</div>
                <div className="text-2xl font-bold text-orange-400">{pendingCount}</div>
              </motion.div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Live Inventory Overview</h2>
              <div className="space-y-3">
                {products.map((p, i) => (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={p.id} className="bg-slate-900 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/5 rounded-lg p-1">
                        <img src={p.img} className="w-full h-full object-contain" alt="" />
                     </div>
                     <div className="flex-1">
                        <div className="font-bold">{p.size}</div>
                        <div className="text-xs text-slate-500">Capacity: {p.crateSize} units/crate</div>
                     </div>
                     <div className={`text-sm font-bold ${p.stock < 50 ? 'text-red-400' : 'text-green-400'}`}>
                        {p.stock} Crates
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-xl font-bold">Orders Management</h2>
            {orders.length === 0 && <div className="text-slate-500 text-center py-10">No orders yet.</div>}
            {orders.map((order, i) => (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={order.id} className="bg-slate-900 p-5 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${
                   order.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' :
                   order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400' :
                   'bg-green-500/20 text-green-400'
                }`}>
                  {order.status}
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">{order.id} • {order.time}</div>
                    <div className="font-bold text-lg">{order.customer}</div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-lg mb-4 text-sm text-slate-300 flex justify-between">
                  <span>{order.items}</span>
                  <span className="font-mono font-bold text-white">₹{order.total.toLocaleString()}</span>
                </div>

                {order.status === 'Pending' && (
                   <button onClick={() => handleOrderStatus(order.id, 'Dispatched')} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                      Accept & Dispatch
                   </button>
                )}
                {order.status === 'Dispatched' && (
                   <button onClick={() => handleOrderStatus(order.id, 'Delivered')} className="w-full bg-slate-800 hover:bg-slate-700 text-green-400 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Mark Delivered
                   </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* TAB 3: STOCK MANAGEMENT */}
        {activeTab === 'stock' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold">Inventory Control</h2>
              {products.map((p, i) => (
                 <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={p.id} className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                       <img src={p.img} className="w-16 h-16 object-contain" alt="" />
                       <div>
                          <h3 className="text-lg font-bold">{p.size}</h3>
                          <div className="text-xs text-slate-500">Current Price: ₹{p.pricePerCrate}</div>
                       </div>
                    </div>
                    
                    <div className="bg-black/40 p-2 rounded-xl flex items-center justify-between">
                       <button onClick={() => handleStockUpdate(p.id, -10)} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 transition-colors">
                          <Minus size={16}/>
                       </button>
                       <div className="text-center">
                          <div className="text-2xl font-mono font-bold">{p.stock}</div>
                          <div className="text-[9px] uppercase tracking-widest text-slate-500">Crates Available</div>
                       </div>
                       <button onClick={() => handleStockUpdate(p.id, 10)} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-green-500/20 hover:text-green-400 transition-colors">
                          <Plus size={16}/>
                       </button>
                    </div>
                 </motion.div>
              ))}
           </motion.div>
        )}

        {/* TAB 4: KHATA (CREDIT BOOK) */}
        {activeTab === 'credit' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <BookOpen className="text-cyan-500"/> Khata Book (Udhaar)
              </h2>
              {dealers.map((d, i) => (
                 <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={d.id} className="bg-slate-900 p-5 rounded-2xl border border-white/5 relative">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="font-bold text-lg">{d.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                             <MapPin size={10} /> {d.location}
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`font-mono font-bold text-xl ${d.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                             {d.balance < 0 ? `-₹${Math.abs(d.balance).toLocaleString()}` : `₹${d.balance}`}
                          </div>
                          <div className="text-[9px] uppercase tracking-widest text-slate-500">Balance</div>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                       <div className="text-xs text-slate-400">Last Pay: <span className="text-white">{d.lastPay}</span></div>
                       <button 
                          onClick={() => handleDealerPayment(d.id)}
                          className="bg-green-600/20 text-green-400 border border-green-600/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                       >
                          <Wallet size={12}/> Record Pay
                       </button>
                    </div>
                 </motion.div>
              ))}
           </motion.div>
        )}
      </main>

      {/* Admin Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 px-2 py-3 flex justify-around items-center z-50 safe-area-bottom">
        <NavButton icon={LayoutDashboard} label="Dash" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={Package} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} count={pendingCount} />
        <NavButton icon={Layers} label="Stock" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
        <NavButton icon={BookOpen} label="Khata" active={activeTab === 'credit'} onClick={() => setActiveTab('credit')} />
        <NavButton icon={Settings} label="Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
};

// --- 5. REUSABLE SECTIONS ---

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

// --- 6. LOADER & HELPERS ---

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

// --- 7. MAIN CONTROLLER APP ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('customer'); 
  
  // STATE LIFTING: Sharing Data between Admin and Customer
  const [products, setProducts] = useState(INITIAL_PRODUCTS); // Inventory
  const [orders, setOrders] = useState(MOCK_ORDERS); // Order History
  
  const [cart, setCart] = useState({}); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  useEffect(() => { setTimeout(() => setLoading(false), 3000); }, []); 

  // LOGIC: Add to Cart with Stock Check
  const handleUpdateCart = (product, newQty) => {
    if (newQty > product.stock) {
      alert(`Sorry, only ${product.stock} crates available.`);
      return;
    }
    setCart(prev => {
      const newCart = { ...prev };
      if (newQty <= 0) delete newCart[product.id];
      else newCart[product.id] = { ...product, quantity: newQty };
      return newCart;
    });
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const getCartCount = () => Object.keys(cart).length;
  const getCartTotalCrates = () => Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  // LOGIC: Handle Checkout & Sync with Admin
  const handleWhatsAppCheckout = () => {
    const items = Object.values(cart);
    if (items.length === 0) return;

    // 1. Calculate Estimate
    const totalEstimate = items.reduce((acc, item) => acc + (item.quantity * item.pricePerCrate), 0);
    const orderItemsString = items.map(i => `${i.quantity}x ${i.size}`).join(', ');

    // 2. REAL-TIME STOCK DEDUCTION
    setProducts(prevProducts => prevProducts.map(p => {
       const cartItem = items.find(i => i.id === p.id);
       if (cartItem) {
         return { ...p, stock: p.stock - cartItem.quantity };
       }
       return p;
    }));

    // 3. SAVE ORDER TO ADMIN PANEL
    const newOrder = {
       id: `#ORD-${Math.floor(Math.random() * 10000)}`,
       customer: "New Web Inquiry",
       items: orderItemsString,
       status: "Pending",
       total: totalEstimate,
       time: "Just now"
    };
    setOrders(prev => [newOrder, ...prev]);

    // 4. WhatsApp Redirect
    let message = `*Wholesale Inquiry - जलsa Water*\n\nI am interested in ordering:\n`;
    items.forEach(item => {
      message += `🔹 ${item.size} x ${item.quantity} Crates\n`;
    });
    message += `\n*Est. Value: ₹${totalEstimate.toLocaleString()}*`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    // 5. Cleanup
    setCart({});
    setCartOpen(false);
  };

  if (loading) return <SplashLoader />;

  // RENDER: Admin View (If logged in)
  if (viewMode === 'admin') {
    return (
      <AdminView 
        products={products} 
        setProducts={setProducts} 
        orders={orders} 
        setOrders={setOrders} 
        onLogout={() => setViewMode('customer')} 
      />
    );
  }

  // RENDER: Customer View
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500/30">
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
        <button onClick={() => setCartOpen(true)} className="flex gap-2 items-center hover:text-cyan-400 transition-colors font-bold uppercase text-sm">
          <Package size={18} /> Bulk List ({getCartTotalCrates()})
        </button>
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
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-12 scrollbar-hide pt-10">
            {products.map((p, index) => (
              <ProductCard key={p.id} index={index} p={p} onUpdateCart={handleUpdateCart} cartItem={cart[p.id]} />
            ))}
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
      <MobileDock itemCount={getCartCount()} onOpenCart={() => setCartOpen(true)} onOpenMenu={() => setMenuOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onCheckout={handleWhatsAppCheckout} />
      <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} openPartner={() => { setMenuOpen(false); setPartnerOpen(true); }} />
      <PartnerModal isOpen={partnerOpen} onClose={() => setPartnerOpen(false)} />

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
                     <button onClick={() => setViewMode('admin')} className="text-[10px] uppercase tracking-widest text-slate-700 hover:text-cyan-500 transition-colors flex items-center gap-2 border border-slate-800 px-3 py-1 rounded-full">
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
                     <li className="flex items-center gap-3"><Phone size={16} className="text-cyan-500 shrink-0" /><span>+91 98000 00000</span></li>
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

// --- OVERLAY COMPONENTS (Restored Full Detail) ---

const CartDrawer = ({ isOpen, onClose, cart, onCheckout }) => {
  const items = Object.values(cart);
  const totalCrates = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = items.reduce((acc, item) => acc + (item.quantity * item.pricePerCrate), 0);

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
                  <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={item.img} alt="mini" className="w-8 h-auto object-contain" />
                      <div><div className="font-bold text-white">{item.size}</div><div className="text-xs text-cyan-400">{item.quantity} Crates</div></div>
                    </div>
                    <div className="text-right"><div className="text-white font-mono">₹{item.quantity * item.pricePerCrate}</div><div className="text-[9px] text-slate-500">{(item.quantity * item.crateSize)} Bottles</div></div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4 space-y-4">
               <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Total Crates</span><span className="text-white font-bold">{totalCrates}</span></div>
               <div className="flex justify-between items-center text-xl"><span className="text-slate-400">Est. Total</span><span className="text-cyan-400 font-bold font-mono">₹{totalCost.toLocaleString()}</span></div>
               <LuxuryButton primary className="w-full" onClick={onCheckout} disabled={items.length === 0}>Request via WhatsApp</LuxuryButton>
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

const PartnerModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl z-[95] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-8 bg-gradient-to-br from-cyan-600 to-blue-700 relative overflow-hidden">
             <div className="relative z-10 text-white"><h3 className="text-3xl font-bold mb-2">Dealer Application</h3><p className="text-blue-100 text-sm">Join the distribution network of Mokampura's finest water.</p></div>
             <Droplets className="absolute -bottom-4 -right-4 text-white/20 w-32 h-32" />
             <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40"><X size={18}/></button>
          </div>
          <div className="p-8 space-y-4 overflow-y-auto">
             <input type="text" placeholder="Owner Full Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
             <input type="text" placeholder="Shop / Agency Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
             <div className="flex gap-4"><input type="tel" placeholder="Mobile" className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" /><input type="text" placeholder="Area / City" className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" /></div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="text-slate-400 text-xs uppercase tracking-wider mb-2 block">Expected Monthly Offtake</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none">
                   <option>100 - 500 Crates</option>
                   <option>500 - 1000 Crates</option>
                   <option>Full Truck Load (FTL)</option>
                </select>
             </div>
             <LuxuryButton primary className="w-full" onClick={() => { alert('Application Sent!'); onClose(); }}>Submit Application</LuxuryButton>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);