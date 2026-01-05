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
  Loader2, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';

// --- 1. TOAST NOTIFICATION SYSTEM (NEW) ---
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-[120] flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.9 }}
          className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border backdrop-blur-md ${
            toast.type === 'success' 
              ? 'bg-emerald-900/90 border-emerald-500/50 text-white' 
              : 'bg-red-900/90 border-red-500/50 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-red-400" />}
          <div>
            <h4 className="font-bold text-sm">{toast.title}</h4>
            <p className="text-xs opacity-80">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-auto opacity-50 hover:opacity-100"><X size={14} /></button>
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
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
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
      className="fixed inset-0 z-[60] bg-slate-950 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => setTimeout(finishLoading, 2000)}
          className="relative"
        >
          <div className="text-6xl md:text-8xl font-bold text-white flex items-center gap-2">
            <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Droplets className="w-16 h-16 md:w-24 md:h-24 text-cyan-500" />
            </motion.span>
            <span className="font-hindi tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">जल</span>
            <span className="font-sans font-light italic text-cyan-400">sa</span>
          </div>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "100%" }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mt-4 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- UTILITY COMPONENTS ---

const SectionHeading = ({ title, subtitle, light = false }) => (
  <div className="text-center mb-16 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <span className={`uppercase tracking-[0.3em] text-xs font-bold ${light ? 'text-cyan-300' : 'text-blue-600'}`}>
        {subtitle}
      </span>
      <h2 className={`text-4xl md:text-6xl font-bold mt-3 ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <div className={`w-24 h-1.5 mx-auto mt-6 rounded-full ${light ? 'bg-gradient-to-r from-cyan-400 to-transparent' : 'bg-gradient-to-r from-blue-600 to-transparent'}`}></div>
    </motion.div>
  </div>
);

const Button = ({ children, primary = false, onClick, className = "", loading = false, disabled = false }) => (
  <motion.button
    whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
    whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center gap-2 justify-center relative overflow-hidden ${
      primary 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/50 hover:brightness-110' 
        : 'bg-white text-blue-900 border-2 border-transparent hover:border-blue-100'
    } ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : children}
  </motion.button>
);

const JalsaLogo = ({ light = false, size = "large" }) => (
  <div className={`font-bold tracking-tight flex items-center gap-1 ${light ? 'text-white' : 'text-slate-900'} ${size === "small" ? "scale-75 origin-left" : ""}`}>
    <Droplets className={`w-8 h-8 ${light ? 'text-cyan-400' : 'text-cyan-600'}`} fill="currentColor" />
    <span className="font-hindi text-4xl mt-[-4px]">जल</span>
    <span className="font-sans italic text-3xl font-light">sa</span>
  </div>
);

// --- MAIN APP COMPONENT ---
function App() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // State for Interactions
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'partner' | null
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null); // Simulated logged in user
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.size === product.size);
      if (existing) {
        return prev.map(p => p.size === product.size ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    addToast("Added to Cart", `${product.size} bottle added successfully.`);
  };

  const handleRemoveFromCart = (size) => {
    setCartItems(prev => prev.filter(item => item.size !== size));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    // Simulate API Call
    addToast("Authenticating", "Verifying credentials...", "info");
    
    // Artificial delay
    await new Promise(r => setTimeout(r, 2000));
    
    setUser({ name: "Sanjay Choudhary", id: "RJ-2025-882" });
    setActiveModal(null);
    addToast("Welcome Back!", "Successfully logged in as Distributor.");
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    addToast("Sending Application", "Please wait...", "info");
    await new Promise(r => setTimeout(r, 2000));
    setActiveModal(null);
    addToast("Application Sent", "Our team will contact you within 24 hours.");
  };

  const handleCheckout = async () => {
    if(cartItems.length === 0) return;
    addToast("Processing Order", "Connecting to supply chain...", "info");
    await new Promise(r => setTimeout(r, 2000));
    setCartItems([]);
    setCartOpen(false);
    addToast("Order Placed!", `Order ID #${Math.floor(Math.random() * 10000)} created successfully.`);
  };

  const products = [
    { size: "200ml", type: "Party Edition", desc: "Compact luxury for events.", image: "https://images.unsplash.com/photo-1625740822008-e45a33797600?auto=format&fit=crop&q=80", badge: "Best Seller" },
    { size: "1 Litre", type: "Daily Hydration", desc: "Your essential companion.", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80", badge: null },
    { size: "20 Litre", type: "Bulk Reserve", desc: "Corporate & Home solutions.", image: "https://images.unsplash.com/photo-1533025625785-3e2844a49c47?auto=format&fit=crop&q=80", badge: "Value" },
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 overflow-x-hidden selection:bg-cyan-300 selection:text-blue-900 cursor-default">
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <AnimatePresence>
        {loading && <Preloader finishLoading={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          {/* Top Progress Bar */}
          <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 origin-left z-50 shadow-[0_0_15px_rgba(6,182,212,0.7)]" style={{ scaleX }} />

          {/* --- NAVBAR --- */}
          <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
              <JalsaLogo size={scrolled ? "small" : "large"} />
              
              <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                {['Home', 'Products', 'Process'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-600 transition-colors relative group text-sm uppercase tracking-wider">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full"></span>
                  </a>
                ))}
                
                {/* Cart Trigger */}
                <button onClick={() => setCartOpen(true)} className="relative hover:text-cyan-600 transition-colors">
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce">
                      {cartItems.reduce((acc, i) => acc + i.qty, 0)}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{user.name.split(' ')[0]}</div>
                      <div className="text-slate-500">ID: {user.id}</div>
                    </div>
                  </div>
                ) : (
                  <Button primary onClick={() => setActiveModal('login')} className="px-6 py-2.5 text-xs uppercase">Distributor Login</Button>
                )}
              </div>

              <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
             
             {/* Mobile Menu */}
             <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="md:hidden bg-white border-t overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col p-6 gap-4">
                    {['Home', 'Products', 'Process'].map((item) => (
                      <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">{item}</a>
                    ))}
                    <button onClick={() => { setIsMenuOpen(false); setCartOpen(true); }} className="flex items-center gap-2 font-medium">
                      Cart ({cartItems.length})
                    </button>
                    {!user && <Button primary onClick={() => { setIsMenuOpen(false); setActiveModal('login'); }}>Login</Button>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* --- CART DRAWER (NEW) --- */}
          <AnimatePresence>
            {cartOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100]" />
                <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] p-6 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-8 pb-4 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="text-cyan-500"/> Order Inquiry</h2>
                    <button onClick={() => setCartOpen(false)} className="hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <ShoppingBagIcon />
                        <p className="mt-4">Your inquiry list is empty</p>
                        <Button onClick={() => setCartOpen(false)} className="mt-4 text-xs">Browse Products</Button>
                      </div>
                    ) : (
                      cartItems.map((item, idx) => (
                        <motion.div layout key={`${item.size}-${idx}`} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <img src={item.image} className="w-16 h-16 object-cover rounded-lg" alt={item.size} />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900">{item.size} - {item.type}</h4>
                            <div className="text-sm text-slate-500">Quantity: {item.qty} units (min)</div>
                          </div>
                          <button onClick={() => handleRemoveFromCart(item.size)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="pt-6 border-t mt-auto">
                     <div className="flex justify-between mb-4 font-bold text-lg">
                        <span>Total SKUs</span>
                        <span>{cartItems.length}</span>
                     </div>
                     <Button primary className="w-full" onClick={handleCheckout} disabled={cartItems.length === 0}>
                        Send Inquiry to Distributor
                     </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* --- HERO SECTION --- */}
          <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
             {/* Background Animated Blobs */}
             <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] bg-cyan-200/20 rounded-full blur-[100px]" 
             />
             <motion.div 
               animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/20 rounded-full blur-[100px]" 
             />

            <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -100 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg border border-blue-100 text-blue-600 text-[10px] font-bold tracking-[0.2em] mb-8 uppercase">
                  <Star className="w-3 h-3 fill-blue-600" /> Premium Source
                </div>
                <h1 className="text-6xl md:text-8xl font-black leading-[1.05] text-slate-900 mb-8">
                  Pure. <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Liquid Life.</span>
                </h1>
                <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-light">
                  Sourced from the deep aquifers of <strong className="text-slate-800">Mokampura</strong>. 
                  Refined through 7 stages of purification for the elite taste of Rajasthan.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button primary onClick={() => setActiveModal('partner')}>Partner With Us <ArrowRight size={16}/></Button>
                  <Button onClick={() => document.getElementById('products').scrollIntoView({behavior: 'smooth'})} className="bg-white/50 backdrop-blur border-slate-300">View Collection</Button>
                </div>
                
                {/* Stats Row */}
                <div className="mt-12 flex gap-8 border-t border-slate-200 pt-8">
                    <div>
                      <div className="text-3xl font-bold text-slate-900 flex items-center">
                        <Counter from={0} to={5000} />+
                      </div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Bottles / Hour</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-900 flex items-center">
                          <Counter from={0} to={100} />%
                      </div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Purity Guaranteed</div>
                    </div>
                </div>
              </motion.div>
              
              {/* 3D Parallax Image Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="relative flex justify-center h-[600px] items-center"
              >
                 {/* Circle Backdrop */}
                 <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-200/50 flex items-center justify-center">
                    <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-cyan-100 to-blue-50 blur-3xl"></div>
                 </div>
                 
                 {/* HERO BOTTLE IMAGE */}
                 <motion.img 
                   src="https://png.pngtree.com/png-vector/20250325/ourmid/pngtree-water-bottle-png-image_15868794.png"
                   alt="Jalsa Premium Bottle"
                   className="relative z-10 w-auto h-[110%] object-cover drop-shadow-2xl mix-blend-multiply filter contrast-125"
                   animate={{ y: [-20, 20, -20] }} 
                   transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                   style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} 
                 />

                 {/* Floating Elements */}
                 <motion.div 
                   animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                   className="absolute top-20 right-10 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/50"
                 >
                    <div className="flex items-center gap-3">
                       <div className="bg-cyan-500 p-2 rounded-full text-white"><Award size={20}/></div>
                       <div>
                          <div className="text-xs font-bold text-slate-400 uppercase">Minerals</div>
                          <div className="text-lg font-bold text-slate-800">Added</div>
                       </div>
                    </div>
                 </motion.div>
              </motion.div>
            </div>
          </section>

          {/* --- PRODUCTS SECTION (SPOTLIGHT EFFECT) --- */}
          <section id="products" className="py-32 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            <div className="container mx-auto px-6 relative z-10">
              <SectionHeading title="The Collection" subtitle="Choose Excellence" light />
              
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                {products.map((item, idx) => (
                  <SpotlightCard key={idx} className="rounded-3xl p-8 group">
                      {item.badge && (
                        <div className="absolute top-6 right-6 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                          {item.badge}
                        </div>
                      )}
                      
                      <div className="relative z-10 flex flex-col items-center h-full">
                          <div className="w-full h-64 mb-8 relative overflow-hidden rounded-2xl bg-white/5 p-4 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                             <motion.img 
                               src={item.image} 
                               alt={item.size}
                               className="h-full w-auto object-contain drop-shadow-lg mix-blend-overlay opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                             />
                          </div>

                          <h3 className="text-3xl font-bold mb-2 text-white">{item.size}</h3>
                          <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-4">{item.type}</div>
                          <p className="text-slate-400 mb-8 text-center text-sm leading-relaxed">{item.desc}</p>
                          
                          <div className="mt-auto w-full flex gap-3">
                              <button 
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 py-4 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/50"
                              >
                                Add to Order
                              </button>
                          </div>
                      </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </section>

          {/* --- MANUFACTURING (PREMIUM GRID) --- */}
          <section id="process" className="py-32 bg-white">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-20 items-center">
                <div className="w-full lg:w-1/2">
                  <SectionHeading title="Eeji Enterprises" subtitle="Precision Manufacturing" />
                  <p className="text-slate-600 text-lg mb-10 leading-relaxed font-light">
                    Located in <strong>Mokampura, Pali</strong>, our facility represents the pinnacle of hydration technology. 
                    We utilize a 7-step filtration process ensuring every drop is safe, sweet, and mineral-rich.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Source", text: "Deep underground aquifer at Mundara Road", icon: Droplets, color: "text-blue-500" },
                      { title: "Purification", text: "Advanced RO + UV + Ozonization Tech", icon: Lock, color: "text-cyan-500" },
                      { title: "Automation", text: "Human-contact free bottling line", icon: Factory, color: "text-indigo-500" }
                    ].map((feature, i) => (
                      <motion.div 
                        whileHover={{ x: 10, backgroundColor: "rgba(241, 245, 249, 1)" }}
                        key={i} 
                        className="flex items-center gap-6 p-6 rounded-2xl border border-slate-100 transition-all cursor-default"
                      >
                        <div className={`p-4 rounded-xl bg-slate-50 ${feature.color}`}>
                          <feature.icon size={28} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">{feature.title}</h4>
                          <p className="text-slate-500 text-sm mt-1">{feature.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white h-[600px] group">
                    <img 
                      src="https://images.unsplash.com/photo-1565610222536-ef125c59da2c?auto=format&fit=crop&q=80" 
                      alt="Factory"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-10">
                      <div className="flex items-center gap-3 text-cyan-400 mb-2">
                          <MapPin size={20} />
                          <span className="text-sm font-bold tracking-widest uppercase">Mokampura, Pali</span>
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-6">Visit Our Plant</h3>
                      <div className="flex gap-4">
                          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex-1">
                             <div className="text-2xl font-bold text-white">ISO</div>
                             <div className="text-xs text-slate-300 uppercase">Certified</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex-1">
                             <div className="text-2xl font-bold text-white">100%</div>
                             <div className="text-xs text-slate-300 uppercase">Automated</div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- CTA / FOOTER --- */}
          <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-cyan-600 to-blue-700 p-12 rounded-3xl shadow-2xl shadow-cyan-900/20 relative overflow-hidden mb-20 transform -translate-y-32">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to Distribute?</h2>
                   <p className="text-cyan-100">Join Eeji Enterprises and grow your business today.</p>
                 </div>
                 <div className="relative z-10">
                   <Button onClick={() => setActiveModal('login')} className="bg-white text-blue-900 border-none shadow-xl hover:bg-cyan-50">
                     Access Portal
                   </Button>
                 </div>
              </div>

              <div className="grid md:grid-cols-4 gap-12 border-b border-slate-900 pb-12">
                <div className="col-span-1 md:col-span-2">
                  <JalsaLogo light />
                  <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-60">
                    Redefining purity standards in Rajasthan. <br/>
                    License No: 30251229122754361
                  </p>
                  <div className="mt-6">
                    <form onSubmit={(e) => { e.preventDefault(); addToast("Subscribed", "You have joined our newsletter."); }} className="flex gap-2">
                        <input type="email" placeholder="Email for updates" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-cyan-500" required />
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-4 font-bold text-xs uppercase tracking-wider">Join</button>
                    </form>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Contact</h4>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <MapPin size={18} className="text-cyan-500 mt-1 shrink-0" />
                      <span>Pani ki Tanki ke samne, Khimel Bypass, Mokampura, Pali 306115</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone size={18} className="text-cyan-500" />
                      <span>+91 98XXX XXXXX</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    {['Privacy Policy', 'Terms of Service', 'Partner Agreement'].map(link => (
                      <li key={link} onClick={() => addToast("Coming Soon", "Legal pages are being updated.", "info")} className="hover:text-cyan-400 cursor-pointer transition-colors">{link}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-40">
                <p>&copy; 2025 Eeji Enterprises. All rights reserved.</p>
                <p>Designed by Sanjay Choudhary</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* --- UNIVERSAL MODAL SYSTEM --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-20">
                <X size={20} />
              </button>
              
              {/* HEADER */}
              <div className="bg-gradient-to-br from-blue-700 to-cyan-500 p-10 text-white text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                 <div className="relative z-10">
                   <JalsaLogo light size="small" />
                   <h3 className="text-2xl font-bold mt-6">{activeModal === 'login' ? 'Welcome Partner' : 'Join the Network'}</h3>
                   <p className="text-blue-100 text-sm mt-2">{activeModal === 'login' ? 'Login to manage your inventory' : 'Fill details to become a distributor'}</p>
                 </div>
              </div>

              {/* BODY */}
              <div className="p-8 bg-white max-h-[60vh] overflow-y-auto">
                {activeModal === 'login' ? (
                   /* LOGIN FORM */
                   <form className="space-y-5" onSubmit={handleLoginSubmit}>
                      <div className="group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Distributor ID</label>
                        <div className="relative">
                           <User className="absolute left-3 top-3 text-slate-400" size={18} />
                           <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="RJ-2025-XXX" />
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Password</label>
                        <div className="relative">
                           <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                           <input required type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="••••••••" />
                        </div>
                      </div>
                      <Button primary className="w-full py-4 shadow-lg shadow-cyan-500/30" loading={false}>Secure Login</Button>
                   </form>
                ) : (
                   /* PARTNER FORM */
                   <form className="space-y-5" onSubmit={handlePartnerSubmit}>
                      <div className="flex gap-4">
                         <input required type="text" placeholder="First Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                         <input required type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                      </div>
                      <input required type="text" placeholder="Business Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                      <input required type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
                      <textarea placeholder="Tell us about your location" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-24"></textarea>
                      <Button primary className="w-full py-4 shadow-lg shadow-cyan-500/30">Submit Application</Button>
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


const ShoppingBagIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default App;