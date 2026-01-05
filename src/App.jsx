import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate,
  useInView
} from 'framer-motion';
import { 
  Droplets, Menu, X, Phone, MapPin, Award, Factory, 
  ChevronRight, User, Lock, ArrowRight, Star, ShoppingCart, 
  Loader2, Trash2, CheckCircle, AlertCircle, Home, ShoppingBag, Settings
} from 'lucide-react';

// --- 1. TOAST NOTIFICATION (Mobile Optimized: Top Center) ---
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 left-0 right-0 z-[130] flex flex-col items-center gap-2 pointer-events-none px-4">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          layout
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border w-full max-w-sm ${
            toast.type === 'success' 
              ? 'bg-emerald-900/90 border-emerald-500/30 text-white' 
              : 'bg-slate-900/90 border-slate-500/30 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-400 shrink-0" /> : <AlertCircle size={18} className="text-cyan-400 shrink-0" />}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate">{toast.title}</h4>
            <p className="text-xs opacity-80 truncate">{toast.message}</p>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- 2. SPOTLIGHT CARD ---
function SpotlightCard({ children, className = "" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-slate-800 bg-slate-900 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}

// --- 3. ANIMATED COUNTER ---
const Counter = ({ from, to, duration = 2 }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true });
  
  useEffect(() => {
    if (!inView) return;
    const node = nodeRef.current;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const currentValue = Math.floor(progress * (to - from) + from);
      node.textContent = currentValue;
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
};

// --- 4. PRELOADER ---
const Preloader = ({ finishLoading }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[150] bg-slate-950 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => setTimeout(finishLoading, 2500)}
          className="relative"
        >
          <div className="text-6xl font-bold text-white flex items-center gap-2 justify-center">
            <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Droplets className="w-16 h-16 text-cyan-500" />
            </motion.span>
            <div>
              <span className="font-hindi tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">जल</span>
              <span className="font-sans font-light italic text-cyan-400">sa</span>
            </div>
          </div>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "100%" }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mt-4 rounded-full mx-auto max-w-[200px]"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- UTILITY COMPONENTS ---

const Button = ({ children, primary = false, onClick, className = "", loading = false, disabled = false }) => (
  <motion.button
    whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
    whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center gap-2 justify-center relative overflow-hidden ${
      primary 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20' 
        : 'bg-white text-blue-900 border border-slate-100'
    } ${disabled ? 'opacity-50 grayscale' : ''} ${className}`}
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : children}
  </motion.button>
);

const JalsaLogo = ({ light = false, size = "large" }) => (
  <div className={`font-bold tracking-tight flex items-center gap-1 ${light ? 'text-white' : 'text-slate-900'} ${size === "small" ? "scale-75 origin-left" : ""}`}>
    <Droplets className={`w-7 h-7 ${light ? 'text-cyan-400' : 'text-cyan-600'}`} fill="currentColor" />
    <span className="font-hindi text-3xl mt-[-4px]">जल</span>
    <span className="font-sans italic text-2xl font-light">sa</span>
  </div>
);

// --- MAIN APP ---
function App() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Interactions
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'partner'
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('home'); // For bottom nav

  // Detect Mobile for conditional rendering
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.size === product.size);
      if (existing) return prev.map(p => p.size === product.size ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    addToast("Added", `${product.size} added to list.`);
  };

  const handleRemoveFromCart = (size) => setCartItems(prev => prev.filter(item => item.size !== size));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    addToast("Verifying", "Checking credentials...", "info");
    await new Promise(r => setTimeout(r, 1500));
    setUser({ name: "Sanjay", id: "RJ-882" });
    setActiveModal(null);
    addToast("Success", "Welcome back, Sanjay!");
  };

  const handleCheckout = async () => {
    if(cartItems.length === 0) return;
    addToast("Sending", "Connecting to server...", "info");
    await new Promise(r => setTimeout(r, 2000));
    setCartItems([]);
    setCartOpen(false);
    addToast("Order Sent", `Order #${Math.floor(Math.random() * 9999)} placed.`);
  };

  const products = [
    { size: "200ml", type: "Party", desc: "Events & Weddings", image: "https://images.unsplash.com/photo-1625740822008-e45a33797600?auto=format&fit=crop&q=80", badge: "Best Seller" },
    { size: "1 Litre", type: "Regular", desc: "Daily Hydration", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80", badge: null },
    { size: "20 Litre", type: "Bulk", desc: "Home & Office", image: "https://images.unsplash.com/photo-1533025625785-3e2844a49c47?auto=format&fit=crop&q=80", badge: "Value" },
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 overflow-x-hidden pb-24 md:pb-0 select-none">
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <AnimatePresence>
        {loading && <Preloader finishLoading={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          {/* Top Progress Bar */}
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 origin-left z-[60]" style={{ scaleX }} />

          {/* --- TOP HEADER (Mobile Only) --- */}
          <div className={`md:hidden fixed top-0 w-full z-40 transition-all duration-300 px-6 py-4 flex justify-between items-center ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
             <JalsaLogo size="small" />
             <div className="flex gap-4">
                <button onClick={() => setActiveModal('partner')} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Partner?</button>
             </div>
          </div>

          {/* --- DESKTOP NAV --- */}
          <nav className={`hidden md:block fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
              <JalsaLogo size={scrolled ? "small" : "large"} />
              <div className="flex items-center gap-8 font-medium text-slate-600">
                {['Home', 'Products', 'Process'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-600 text-sm uppercase tracking-wider">{item}</a>
                ))}
                <button onClick={() => setCartOpen(true)} className="relative hover:text-cyan-600">
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {cartItems.reduce((acc, i) => acc + i.qty, 0)}
                    </span>
                  )}
                </button>
                {user ? (
                   <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">{user.name[0]}</div>
                ) : (
                   <Button primary onClick={() => setActiveModal('login')} className="px-6 py-2 text-xs">Login</Button>
                )}
              </div>
            </div>
          </nav>

          {/* --- BOTTOM NAV (Mobile Only - The "App" Feel) --- */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 px-6 py-3 pb-safe">
             <div className="flex justify-between items-center">
                <button onClick={() => { setActiveTab('home'); document.getElementById('home').scrollIntoView({behavior:'smooth'}); }} className={`flex flex-col items-center gap-1 ${activeTab==='home' ? 'text-cyan-600' : 'text-slate-400'}`}>
                   <Home size={24} strokeWidth={activeTab==='home'? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Home</span>
                </button>
                <button onClick={() => { setActiveTab('products'); document.getElementById('products').scrollIntoView({behavior:'smooth'}); }} className={`flex flex-col items-center gap-1 ${activeTab==='products' ? 'text-cyan-600' : 'text-slate-400'}`}>
                   <ShoppingBag size={24} strokeWidth={activeTab==='products'? 2.5 : 2} />
                   <span className="text-[10px] font-medium">Shop</span>
                </button>
                <div className="relative -mt-8">
                   <button 
                     onClick={() => setCartOpen(true)}
                     className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg shadow-cyan-500/40 transform transition-transform active:scale-95"
                   >
                     <ShoppingCart size={24} />
                     {cartItems.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                           {cartItems.length}
                        </span>
                     )}
                   </button>
                </div>
                <button onClick={() => { setActiveTab('profile'); if(!user) setActiveModal('login'); }} className={`flex flex-col items-center gap-1 ${activeTab==='profile' ? 'text-cyan-600' : 'text-slate-400'}`}>
                   {user ? <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">{user.name[0]}</div> : <User size={24} strokeWidth={activeTab==='profile'? 2.5 : 2} />}
                   <span className="text-[10px] font-medium">{user ? 'Me' : 'Login'}</span>
                </button>
             </div>
          </div>

          {/* --- CART DRAWER (Bottom Sheet on Mobile, Sidebar on Desktop) --- */}
          <AnimatePresence>
            {cartOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />
                <motion.div 
                  initial={isMobile ? { y: "100%" } : { x: "100%" }} 
                  animate={isMobile ? { y: 0 } : { x: 0 }} 
                  exit={isMobile ? { y: "100%" } : { x: "100%" }} 
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={`fixed bg-white shadow-2xl z-[101] flex flex-col
                    ${isMobile ? 'bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem]' : 'right-0 top-0 h-full w-full max-w-md'}
                  `}
                >
                  {/* Handle Bar for Mobile */}
                  {isMobile && <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />}

                  <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="text-cyan-500"/> Your Order</h2>
                    <button onClick={() => setCartOpen(false)} className="hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 pb-20">
                        <ShoppingBag size={48} strokeWidth={1} />
                        <p className="mt-4 text-sm">Cart is empty</p>
                      </div>
                    ) : (
                      cartItems.map((item, idx) => (
                        <motion.div layout key={`${item.size}-${idx}`} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <img src={item.image} className="w-16 h-16 object-cover rounded-xl" alt={item.size} />
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-slate-900 text-sm">{item.size}</h4>
                            <div className="text-xs text-slate-500">{item.type}</div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="font-mono font-bold text-sm">x{item.qty}</span>
                             <button onClick={() => handleRemoveFromCart(item.size)} className="text-red-400 bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="p-6 border-t bg-slate-50">
                     <Button primary className="w-full shadow-lg shadow-cyan-500/20" onClick={handleCheckout} disabled={cartItems.length === 0}>
                        Send Inquiry
                     </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* --- HERO SECTION --- */}
          <section id="home" className="relative min-h-[90vh] md:min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
             {/* Background Blobs */}
             <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-cyan-200/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/4" />
             <div className="absolute bottom-0 left-0 w-[70vw] h-[70vw] bg-blue-300/20 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/4" />

            <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }}
                className="order-2 md:order-1 text-center md:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-blue-100 text-blue-600 text-[10px] font-bold tracking-widest mb-6 uppercase">
                  <Star className="w-3 h-3 fill-blue-600" /> Premium Water
                </div>
                <h1 className="text-5xl md:text-8xl font-black leading-tight text-slate-900 mb-4 md:mb-8">
                  Pure. <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Life.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                  From <strong>Mokampura's</strong> deep aquifers. 7-step purification for the elite taste of Rajasthan.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                  <Button primary onClick={() => setActiveModal('partner')}>Become Partner</Button>
                  <Button onClick={() => document.getElementById('products').scrollIntoView({behavior: 'smooth'})}>Our Products</Button>
                </div>
                
                {/* Mobile Stats */}
                <div className="grid grid-cols-2 gap-4 mt-10 md:mt-12 border-t border-slate-200/60 pt-6">
                    <div>
                      <div className="text-2xl font-bold text-slate-900"><Counter from={0} to={5000} />+</div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Bottles/Hr</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900"><Counter from={0} to={100} />%</div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Purity</div>
                    </div>
                </div>
              </motion.div>
              
              {/* Bottle Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1 }}
                className="order-1 md:order-2 relative flex justify-center h-[400px] md:h-[600px] items-center"
              >
                 <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-cyan-200/50 flex items-center justify-center">
                    <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-gradient-to-tr from-cyan-100 to-blue-50 blur-3xl"></div>
                 </div>
                 
                 <motion.img 
                   src="https://png.pngtree.com/png-vector/20250325/ourmid/pngtree-water-bottle-png-image_15868794.png"
                   alt="Jalsa Bottle"
                   className="relative z-10 h-[100%] md:h-[110%] w-auto object-contain drop-shadow-2xl"
                   animate={{ y: [-15, 15, -15] }} 
                   transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                 />
              </motion.div>
            </div>
          </section>

          {/* --- PRODUCTS SECTION (Mobile: Horizontal Scroll, Desktop: Grid) --- */}
          <section id="products" className="py-20 bg-slate-950 text-white relative overflow-hidden">
            <div className="container mx-auto">
              <div className="px-6 mb-10 md:mb-16 md:text-center">
                <span className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">The Collection</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2">Hydration for Every Need</h2>
              </div>
              
              {/* Responsive Container: Snap Scroll on Mobile */}
              <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 pb-8 hide-scrollbar">
                {products.map((item, idx) => (
                  <SpotlightCard key={idx} className="min-w-[85vw] md:min-w-0 snap-center rounded-3xl p-6 md:p-8 flex flex-col bg-slate-900 border-slate-800">
                      {item.badge && (
                        <div className="self-end bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 shadow-lg shadow-amber-500/20">
                          {item.badge}
                        </div>
                      )}
                      
                      <div className="h-48 md:h-64 mb-6 relative flex items-center justify-center">
                         <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl transform scale-75"></div>
                         <motion.img 
                           src={item.image} 
                           alt={item.size}
                           className="h-full w-auto object-contain drop-shadow-xl z-10"
                           whileHover={{ scale: 1.1 }}
                         />
                      </div>

                      <h3 className="text-2xl font-bold text-white">{item.size}</h3>
                      <p className="text-slate-400 text-sm mb-6">{item.desc}</p>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="mt-auto w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                        Add to Order
                      </button>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </section>

          {/* --- PROCESS SECTION --- */}
          <section id="process" className="py-20 bg-white">
            <div className="container mx-auto px-6">
               <div className="mb-12">
                  <span className="text-blue-600 text-xs font-bold tracking-[0.2em] uppercase">Why Jalsa?</span>
                  <h2 className="text-3xl font-bold text-slate-900 mt-2">Mokampura's Pride</h2>
               </div>

               <div className="grid gap-6">
                  {[
                    { title: "Deep Source", text: "Aquifers at Mundara Road", icon: Droplets, color: "text-blue-500" },
                    { title: "7-Step Filter", text: "RO + UV + Ozonization", icon: Lock, color: "text-cyan-500" },
                    { title: "Touch-Free", text: "Fully automated bottling", icon: Factory, color: "text-indigo-500" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className={`p-3 rounded-xl bg-white shadow-sm ${feature.color}`}>
                        <feature.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{feature.title}</h4>
                        <p className="text-xs text-slate-500">{feature.text}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* --- FOOTER --- */}
          <footer className="bg-slate-950 text-slate-400 py-12 pb-32 md:pb-12 border-t border-slate-900">
            <div className="container mx-auto px-6 text-center md:text-left">
              <JalsaLogo light />
              <p className="mt-4 text-xs opacity-60 leading-relaxed max-w-md mx-auto md:mx-0">
                Purest water from the heart of Pali. <br/>
                License No: 30251229122754361
              </p>
              <div className="mt-8 flex flex-col gap-4 text-sm">
                 <div className="flex items-center justify-center md:justify-start gap-3">
                    <MapPin size={16} className="text-cyan-500"/>
                    <span>Mokampura, Pali 306115</span>
                 </div>
                 <div className="flex items-center justify-center md:justify-start gap-3">
                    <Phone size={16} className="text-cyan-500"/>
                    <span>+91 98XXX XXXXX</span>
                 </div>
              </div>
              <p className="mt-10 text-[10px] opacity-30">© 2025 Eeji Enterprises | Designed by Sanjay Choudhary</p>
            </div>
          </footer>
        </>
      )}

      {/* --- MODALS (Optimized for Mobile) --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-slate-900/80 backdrop-blur-sm p-0 md:p-4"
            onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-[2rem] md:rounded-3xl overflow-hidden relative shadow-2xl"
            >
              {/* Modal Handle */}
              <div className="md:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 absolute left-0 right-0 top-0 z-30" />
              
              <button onClick={() => setActiveModal(null)} className="hidden md:block absolute top-4 right-4 text-white z-20"><X size={20}/></button>

              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-8 pt-12 text-white text-center">
                 <h3 className="text-2xl font-bold">{activeModal === 'login' ? 'Welcome Back' : 'Join Us'}</h3>
                 <p className="text-blue-100 text-sm mt-1">Please enter your details below.</p>
              </div>

              <div className="p-8 pb-10 bg-white">
                {activeModal === 'login' ? (
                   <form className="space-y-4" onSubmit={handleLoginSubmit}>
                      <input required type="text" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-cyan-500 text-sm" placeholder="Distributor ID" />
                      <input required type="password" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-cyan-500 text-sm" placeholder="Password" />
                      <Button primary className="w-full py-4 shadow-lg shadow-cyan-500/20">Login</Button>
                   </form>
                ) : (
                   <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveModal(null); addToast("Sent", "Request received."); }}>
                      <input required type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                      <input required type="tel" placeholder="Mobile" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                      <Button primary className="w-full py-4 shadow-lg shadow-cyan-500/20">Send Request</Button>
                   </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;