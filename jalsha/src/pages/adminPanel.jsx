import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Save, Trash2, UserPlus, 
  Package, CheckCircle, Wallet, MessageCircle, 
  Settings, Power, BadgePercent, LogOut, 
  LayoutDashboard, Layers, BookOpen, FileText, 
  MapPin, UploadCloud, Loader2, Image as ImageIcon, X 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Cloudinary Credentials (Fixed based on your data)
const CLOUDINARY_UPLOAD_PRESET = "salon_preset"; 
const CLOUDINARY_CLOUD_NAME = "dvoenforj";

// --- LOCAL HELPERS ---

const SpinnerIcon = ({ size = 18, color = "text-white/80" }) => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="flex items-center justify-center"
  >
    <Loader2 size={size} className={color} />
  </motion.div>
);

// --- SMART SUGGESTIONS DATA ---
const SUGGESTIONS = {
    sizes: ["20 Litre Jar", "1 Litre Bottle", "500ml Bottle", "250ml Pouch", "Chilled Camper"],
    tags: ["Best Seller", "New Arrival", "Wedding Special", "Office Pack", "Economy"],
    descriptions: [
        "Premium RO purified water with added minerals.",
        "Perfect for weddings and large gatherings.",
        "Compact size, easy to carry for events.",
        "ISI Certified, hygienic and safe packaging.",
        "High margin product for daily wholesale."
    ]
};

const SuggestionChip = ({ text, onClick }) => (
    <button 
        type="button"
        onClick={() => onClick(text)}
        className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-1 rounded-md hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50 transition-all whitespace-nowrap"
    >
        {text}
    </button>
);

// --- MODALS ---

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState({
        size: '', pricePerCrate: '', stock: '', crateSize: '',
        img: '', desc: '', tag: '', lowStockThreshold: '50'
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({ size: '', pricePerCrate: '', stock: '0', crateSize: '12', img: '', desc: '', tag: '', lowStockThreshold: '50' });
        }
    }, [product]);

    // 🔹 Cloudinary Upload Logic (Ye photo ko server pe bhejega)
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); 
        data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: data
            });
            const uploadedImage = await res.json();
            
            if (uploadedImage.secure_url) {
                setFormData({ ...formData, img: uploadedImage.secure_url });
                toast.success("Image Uploaded Successfully!");
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Upload Error. Check Internet connection.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Fallback image if none provided
        const finalData = {
            ...formData,
            img: formData.img || "https://placehold.co/400x600/1e293b/ffffff?text=No+Image"
        };
        await onSave(finalData);
        setSubmitting(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-[#121212] border border-cyan-500/50 w-full max-w-lg rounded-2xl p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-serif text-cyan-400 flex items-center gap-2">
                                {product ? <><Edit size={20}/> Edit Product</> : <><Plus size={20}/> Add New Product</>}
                            </h2>
                            <button onClick={onClose}><X className="text-slate-500 hover:text-white" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* --- IMAGE UPLOADER SECTION (Start) --- */}
                            <div className="flex flex-col gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5 border-dashed group hover:border-cyan-500/30 transition-colors">
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Product Image</label>
                                
                                <div className="flex items-center gap-4">
                                    {/* Preview Box */}
                                    <div className="w-24 h-24 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-white/10 shrink-0 relative">
                                        {uploading ? (
                                            <SpinnerIcon size={24} color="text-cyan-500" />
                                        ) : formData.img ? (
                                            <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="text-slate-600" />
                                        )}
                                    </div>

                                    {/* Controls */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        {/* Hidden File Input */}
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleImageUpload} 
                                            className="hidden" 
                                            accept="image/*"
                                        />
                                        
                                        {/* Main Upload Button */}
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current.click()} 
                                            className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-500 transition-colors flex items-center justify-center gap-2 w-full shadow-lg shadow-cyan-500/20"
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Uploading...' : <><UploadCloud size={16}/> Upload from Gallery</>}
                                        </button>

                                        {/* Manual URL Input (Secondary) */}
                                        <input 
                                            type="text" 
                                            placeholder="...or paste image link" 
                                            value={formData.img} 
                                            onChange={e => setFormData({...formData, img: e.target.value})} 
                                            className="w-full bg-transparent text-xs text-slate-500 focus:text-white outline-none border-b border-white/10 focus:border-cyan-500/50 py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* --- IMAGE UPLOADER SECTION (End) --- */}

                            {/* Product Name */}
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Product Name (Size)</label>
                                <input type="text" placeholder="e.g. 1 Litre Bottle" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none mt-1"/>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {SUGGESTIONS.sizes.map(s => <SuggestionChip key={s} text={s} onClick={(val) => setFormData({...formData, size: val})} />)}
                                </div>
                            </div>

                            {/* Numbers Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Price / Crate (₹)</label>
                                    <input type="number" placeholder="Price" value={formData.pricePerCrate} onChange={e => setFormData({...formData, pricePerCrate: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none mt-1"/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Stock Qty</label>
                                    <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none mt-1"/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Bottles per Crate</label>
                                    <input type="number" placeholder="Qty" value={formData.crateSize} onChange={e => setFormData({...formData, crateSize: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none mt-1"/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Low Stock Alert</label>
                                    <input type="number" placeholder="e.g. 50" value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none mt-1"/>
                                </div>
                            </div>

                            {/* Tag */}
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Marketing Tag</label>
                                <input type="text" placeholder="Tag (e.g. Best Seller)" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none mt-1"/>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {SUGGESTIONS.tags.map(t => <SuggestionChip key={t} text={t} onClick={(val) => setFormData({...formData, tag: val})} />)}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Description</label>
                                <textarea 
                                    placeholder="Product details..." 
                                    value={formData.desc} 
                                    onChange={e => setFormData({...formData, desc: e.target.value})} 
                                    className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none h-24 resize-none mt-1"
                                />
                                <div className="flex flex-col gap-1 mt-2">
                                    {SUGGESTIONS.descriptions.map((d, i) => (
                                        <div key={i} onClick={() => setFormData({...formData, desc: d})} className="text-[10px] text-slate-500 hover:text-cyan-400 cursor-pointer truncate border-b border-white/5 py-1">
                                            ✨ {d}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 text-gray-400 font-bold uppercase rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" disabled={submitting || uploading} className="flex-1 bg-cyan-600 text-white font-bold uppercase py-3 rounded-xl hover:bg-cyan-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
                                    {submitting ? <SpinnerIcon size={16}/> : <><Save size={16}/> {product ? 'Update Product' : 'Save Product'}</>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const AddDealerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', shopName: '', location: '', mobile: '', gstin: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      await onSave(formData);
      setSubmitting(false);
      onClose();
  };

  return (
      <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-[#121212] border border-cyan-500/50 w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><UserPlus size={20} className="text-cyan-500"/> Add New Dealer</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Owner Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none"/>
                        <input type="text" placeholder="Shop / Agency Name" required value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none"/>
                        <div className="relative">
                            <input type="text" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none"/>
                             <div className="absolute right-3 top-3 text-slate-500"><MapPin size={16}/></div>
                        </div>
                        <input type="tel" placeholder="Mobile Number" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none"/>
                        <input type="text" placeholder="GST Number (Optional)" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} className="w-full bg-[#050505] border border-white/20 p-3 rounded-xl text-white focus:border-cyan-500 outline-none"/>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 text-gray-400 font-bold uppercase rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
                            <button type="submit" disabled={submitting} className="flex-1 bg-cyan-600 text-white font-bold uppercase py-3 rounded-xl hover:bg-cyan-500 transition-colors">
                                {submitting ? <SpinnerIcon size={16}/> : 'Add Dealer'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
          )}
      </AnimatePresence>
  );
};

const AdminActionButton = ({ onClick, loading, children, className, variant="primary" }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={loading}
      onClick={onClick}
      className={`w-full py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${variant === "primary" ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : ''}
        ${variant === "success" ? 'bg-slate-800 hover:bg-slate-700 text-green-400' : ''}
        ${variant === "outline" ? 'bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600 hover:text-white' : ''}
        ${className}
      `}
    >
      {loading ? <SpinnerIcon size={16} color="text-white" /> : children}
    </motion.button>
  );
};

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

// --- MAIN ADMIN COMPONENT ---

const AdminView = ({ products, orders, dealers, onStockUpdate, onStatusUpdate, onDealerUpdate, onSaveProduct, onDeleteProduct, onAddDealer, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loadingAction, setLoadingAction] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDealerModal, setShowDealerModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('adminToken');

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeDealers = Array.isArray(dealers) ? dealers : [];

  const totalRevenue = safeOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingCount = safeOrders.filter(o => o.status === 'Pending').length;

  const handleEditClick = (product) => {
      setEditingProduct(product);
      setShowProductModal(true);
  };

  const handleAddClick = () => {
      setEditingProduct(null);
      setShowProductModal(true);
  };

  const handleStockClick = async (id, newStock) => {
      setLoadingAction(id);
      await onStockUpdate(id, newStock);
      setLoadingAction(null);
  };

  const handleStatusClick = async (id, status) => {
      setLoadingAction(id);
      await onStatusUpdate(id, status);
      setLoadingAction(null);
  };

  const handleDealerPay = async (id) => {
    const amount = prompt("Enter payment amount received (₹):");
    if (amount) {
      setLoadingAction(id);
      await onDealerUpdate(id, amount, 'Credit', 'Cash Payment Received');
      setLoadingAction(null);
    }
  };

  const handleDeleteClick = async (id) => {
      if(window.confirm("Delete this product?")) {
          await onDeleteProduct(id);
      }
  }

  const fetchApplications = async () => {
      try {
          const res = await fetch(`${API_URL}/api/applications`, { headers: { 'x-auth-token': token } });
          const data = await res.json();
          setApplications(Array.isArray(data) ? data : []);
      } catch (err) { console.error("App Fetch Error", err); }
  };

  useEffect(() => {
      if (activeTab === 'requests') {
          fetchApplications();
      }
  }, [activeTab]);

  const handleApproveApplication = async (app) => {
      if(!window.confirm(`Approve ${app.name} as a Dealer?`)) return;
      
      setLoadingAction(app._id);
      try {
          const dealerRes = await fetch(`${API_URL}/api/dealers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-auth-token': token }, 
              body: JSON.stringify({
                  name: app.name,
                  shopName: app.shopName,
                  location: app.city,
                  mobile: app.mobile,
                  gstin: app.gstin || "" 
              })
          });

          if (dealerRes.ok) {
              await fetch(`${API_URL}/api/applications/${app._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                  body: JSON.stringify({ status: 'Approved' })
              });
              
              toast.success("Dealer Created & Request Approved!");
              fetchApplications(); 
          } else {
              throw new Error("Failed to create dealer");
          }
      } catch (err) {
          toast.error(err.message);
      } finally {
          setLoadingAction(null);
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 font-sans">
      
      <ProductModal 
        isOpen={showProductModal} 
        onClose={() => setShowProductModal(false)} 
        product={editingProduct}
        onSave={onSaveProduct}
      />

      <AddDealerModal 
         isOpen={showDealerModal}
         onClose={() => setShowDealerModal(false)}
         onSave={onAddDealer}
      />

      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950">
            <LayoutDashboard size={20} fill="currentColor" />
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

      <main className="p-6 space-y-8 max-w-lg mx-auto">
        
        {/* DASHBOARD */}
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
              <div className="flex justify-between items-end mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Inventory</h2>
                  <button onClick={handleAddClick} className="text-xs text-cyan-400 flex items-center gap-1 font-bold hover:bg-cyan-500/10 px-2 py-1 rounded transition-colors">
                      <Plus size={14}/> Add Product
                  </button>
              </div>
              
              {products.length === 0 && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-4 bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-blue-300">Inventory Empty.</div>
                      <button onClick={handleAddClick} className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-2">
                          <UploadCloud size={14}/> Add New
                      </button>
                  </motion.div>
              )}

              <div className="space-y-3">
                {products.length === 0 ? (
                    <div className="text-center py-10 bg-slate-900 rounded-xl border border-white/5 border-dashed">
                        <Package size={40} className="mx-auto text-slate-700 mb-2"/>
                        <p className="text-slate-500 text-sm">No products found.</p>
                    </div>
                ) : (
                    products.map((p, i) => (
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={p._id || p.id} className="bg-slate-900 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-lg p-1">
                            <img src={p.img || p.imageUrl} className="w-full h-full object-contain" alt="" onError={(e) => e.target.src = "https://placehold.co/100?text=Bottle"} />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold">{p.size}</div>
                            <div className="text-xs text-slate-500">Stock: {p.stock}</div>
                        </div>
                        <div className={`text-sm font-bold ${p.stock < (p.lowStockThreshold || 50) ? 'text-red-400' : 'text-green-400'}`}>
                            {p.stock} Crates
                        </div>
                    </motion.div>
                    ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-xl font-bold">Orders Management</h2>
            {safeOrders.length === 0 && <div className="text-slate-500 text-center py-10 bg-slate-900 rounded-xl border border-white/5">No orders yet.</div>}
            {safeOrders.map((order, i) => (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={order._id || order.id} className="bg-slate-900 p-5 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${
                   order.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' :
                   order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400' :
                   'bg-green-500/20 text-green-400'
                }`}>
                  {order.status}
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">{order.orderId}</div>
                    <div className="font-bold text-lg">{order.customerName}</div>
                    <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-red-400'}`}>
                        {order.paymentStatus || 'Unpaid'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-lg mb-4 text-sm text-slate-300 space-y-1">
                  {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.size || item.productName}</span>
                      </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-white">
                      <span>Total</span>
                      <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {order.status === 'Pending' && (
                   <AdminActionButton 
                      onClick={() => handleStatusClick(order._id, 'Dispatched')} 
                      loading={loadingAction === order._id}
                      variant="primary"
                   >
                      Accept & Dispatch
                   </AdminActionButton>
                )}
                {order.status === 'Dispatched' && (
                   <AdminActionButton 
                      onClick={() => handleStatusClick(order._id, 'Delivered')} 
                      loading={loadingAction === order._id}
                      variant="success"
                   >
                      <CheckCircle size={16} /> Mark Delivered
                   </AdminActionButton>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* STOCK */}
        {activeTab === 'stock' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Inventory Control</h2>
                  <button onClick={handleAddClick} className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
                      <Plus size={20}/>
                  </button>
              </div>
              
              {products.length === 0 && <div className="text-center text-slate-500 py-10">Inventory is empty. Add items.</div>}

              {products.map((p, i) => (
                 <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={p._id || p.id} className="bg-slate-900 p-6 rounded-2xl border border-white/5 flex flex-col gap-4 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(p)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-cyan-400"><Edit size={14}/></button>
                        <button onClick={() => handleDeleteClick(p._id || p.id)} className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 text-red-400"><Trash2 size={14}/></button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-xl p-2">
                             <img src={p.img || p.imageUrl} className="w-full h-full object-contain" alt="" onError={(e) => e.target.src = "https://placehold.co/100?text=Bottle"} />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold">{p.size}</h3>
                           <div className="text-xs text-slate-500">Price: ₹{p.pricePerCrate}</div>
                        </div>
                    </div>
                    
                    <div className="bg-black/40 p-2 rounded-xl flex items-center justify-between">
                       <motion.button 
                          whileTap={{scale: 0.9}} 
                          onClick={() => handleStockClick(p._id, Math.max(0, p.stock - 10))} 
                          className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
                       >
                          {loadingAction === p._id ? <SpinnerIcon size={12} /> : <div className="text-2xl font-bold">-</div>}
                       </motion.button>
                       <div className="text-center">
                          <div className={`text-2xl font-mono font-bold ${p.stock < (p.lowStockThreshold || 50) ? 'text-red-500' : 'text-white'}`}>{p.stock}</div>
                          <div className="text-[9px] uppercase tracking-widest text-slate-500">Crates Available</div>
                       </div>
                       <motion.button 
                          whileTap={{scale: 0.9}} 
                          onClick={() => handleStockClick(p._id, p.stock + 10)} 
                          className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-green-500/20 hover:text-green-400 transition-colors"
                       >
                          {loadingAction === p._id ? <SpinnerIcon size={12} /> : <Plus size={16}/>}
                       </motion.button>
                    </div>
                 </motion.div>
              ))}
           </motion.div>
        )}

        {/* KHATA */}
        {activeTab === 'credit' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="text-cyan-500"/> Khata Book
                  </h2>
                  <button onClick={() => setShowDealerModal(true)} className="text-xs bg-cyan-600/20 text-cyan-400 px-3 py-1.5 rounded-lg font-bold border border-cyan-500/30 flex items-center gap-2 hover:bg-cyan-600 hover:text-white transition-colors">
                      <UserPlus size={14}/> Add Dealer
                  </button>
              </div>

              {safeDealers.length === 0 && (
                  <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-white/5 border-dashed">
                      <div className="mx-auto text-slate-600 mb-3 flex justify-center"><UserPlus size={32}/></div>
                      <p className="text-slate-500 text-sm">No active accounts found.</p>
                      <p className="text-slate-600 text-xs">Add a dealer to start tracking payments.</p>
                  </div>
              )}

              {safeDealers.map((d, i) => (
                 <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={d._id || d.id} className="bg-slate-900 p-5 rounded-2xl border border-white/5 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                           <div className="font-bold text-lg">{d.shopName}</div>
                           <div className="text-xs text-slate-400">{d.name}</div>
                           <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin size={10} /> {d.location}
                           </div>
                        </div>
                        <div className="text-right">
                           <div className={`font-mono font-bold text-xl ${d.balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              ₹{d.balance.toLocaleString()}
                           </div>
                           <div className="text-[9px] uppercase tracking-widest text-slate-500">Current Due</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                       <div className="text-xs text-slate-400">Last Paid: <span className="text-white">{d.lastPaymentAmount ? `₹${d.lastPaymentAmount}` : 'N/A'}</span></div>
                       <div className="w-32">
                         <AdminActionButton 
                            onClick={() => handleDealerPay(d._id)}
                            loading={loadingAction === d._id}
                            variant="outline"
                            className="py-2 text-xs uppercase"
                         >
                            <Wallet size={12}/> Receive
                         </AdminActionButton>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </motion.div>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <UserPlus className="text-cyan-500"/> New Applications
                </h2>
                
                {applications.length === 0 && (
                    <div className="text-center py-10 bg-slate-900 rounded-xl border border-white/5 border-dashed">
                        <p className="text-slate-500 text-sm">No new requests pending.</p>
                    </div>
                )}

                {applications.map((app, i) => (
                    <motion.div 
                        key={app._id} 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: i * 0.1 }} 
                        className={`p-5 rounded-2xl border relative ${
                            app.status === 'Approved' 
                            ? 'bg-slate-900/50 border-green-500/20 opacity-60' 
                            : 'bg-slate-900 border-white/10'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="font-bold text-lg text-white">{app.shopName}</div>
                                <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{app.name}</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                app.status === 'Approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {app.status || 'New'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4 bg-black/20 p-3 rounded-lg">
                            <div>📱 {app.mobile}</div>
                            <div>📍 {app.city}</div>
                            <div className="col-span-2">📦 Potential: <span className="text-white">{app.volume}</span></div>
                            {app.gstin && <div className="col-span-2">🧾 GST: {app.gstin}</div>}
                        </div>

                        {app.status !== 'Approved' && (
                            <div className="flex gap-3">
                                <a 
                                    href={`https://wa.me/91${app.mobile}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex-1 py-2 bg-white/5 text-white text-xs font-bold uppercase rounded-lg hover:bg-white/10 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={14}/> Chat
                                </a>
                                <button 
                                    onClick={() => handleApproveApplication(app)}
                                    disabled={loadingAction === app._id}
                                    className="flex-1 py-2 bg-cyan-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-cyan-500 flex items-center justify-center gap-2"
                                >
                                    {loadingAction === app._id ? <SpinnerIcon size={12}/> : <><CheckCircle size={14}/> Approve</>}
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="text-cyan-500"/> Configuration
                </h2>

                <div className="bg-slate-900 p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><Power size={20}/></div>
                            <div>
                                <div className="font-bold">Shop Status</div>
                                <div className="text-xs text-slate-500">Accepting orders online</div>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><BadgePercent size={20}/></div>
                            <div>
                                <div className="font-bold">Delivery Charges</div>
                                <div className="text-xs text-slate-500">Auto-calculate at checkout</div>
                            </div>
                        </div>
                        <span className="font-mono text-cyan-400">₹0</span>
                    </div>
                </div>
            </motion.div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 px-2 py-3 flex justify-around items-center z-50 safe-area-bottom">
        <NavButton icon={LayoutDashboard} label="Dash" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={Package} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} count={pendingCount} />
        <NavButton icon={Layers} label="Stock" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
        <NavButton icon={BookOpen} label="Khata" active={activeTab === 'credit'} onClick={() => setActiveTab('credit')} />
        <NavButton icon={FileText} label="Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
        <NavButton icon={Settings} label="Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
};

export default AdminView;