/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Folder,
  Image as ImageIcon,
  Video as VideoIcon,
  Plus,
  Trash2,
  Edit,
  Save,
  Settings,
  Sparkles,
  RefreshCw,
  FileText,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Play,
  Grid,
  Menu,
  X,
  Database,
  Upload,
  Link as LinkIcon,
  Download,
  Eye,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { PortfolioItem, SanityConfig } from "./types";
import {
  initialPortfolioItems,
  developerManualMarkdown,
  clientManualMarkdown
} from "./data";
import TrinoMascot, { MascotMood } from "./components/TrinoMascot";
import TrinoLogo from "./components/TrinoLogo";

export default function App() {
  // Navigation tabs: 'portfolio' | 'cms' | 'manuals'
  const [activeTab, setActiveTab] = useState<"portfolio" | "cms" | "manuals">("portfolio");
  
  // Portfolio database state
  const [items, setItems] = useState<PortfolioItem[]>([]);
  
  // Sanity configurations
  const [sanityConfig, setSanityConfig] = useState<SanityConfig>({
    projectId: "",
    dataset: "production",
    token: "",
    useRealSanity: false
  });

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // CMS Form States
  const [isEditing, setIsEditing] = useState<string | null>(null); // item ID being edited, or null for new
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<"image" | "video">("image");
  const [formCategory, setFormCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [formLayout, setFormLayout] = useState<"carousel" | "gallery">("gallery");
  const [mediaSource, setMediaSource] = useState<"url" | "upload">("url");
  const [formUrl, setFormUrl] = useState("");
  const [uploadedBase64, setUploadedBase64] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  
  // AI Generator state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiStatus, setAiStatus] = useState<string | null>(null);

  // Lightbox overlay state
  const [activeLightbox, setActiveLightbox] = useState<PortfolioItem | null>(null);

  // Active Manual Tab: 'developer' | 'client'
  const [manualTab, setManualTab] = useState<"developer" | "client">("client");
  
  // Clipboard copy feedback
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Mascot interactive vibe state
  const [mascotMood, setMascotMood] = useState<MascotMood>("general");

  // Load database and config from localStorage on startup
  useEffect(() => {
    const savedItems = localStorage.getItem("trino_portfolio_items");
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        setItems(initialPortfolioItems);
      }
    } else {
      setItems(initialPortfolioItems);
      localStorage.setItem("trino_portfolio_items", JSON.stringify(initialPortfolioItems));
    }

    const savedConfig = localStorage.getItem("trino_sanity_config");
    if (savedConfig) {
      try {
        setSanityConfig(JSON.parse(savedConfig));
      } catch (e) {}
    }
  }, []);

  // Save database when updated
  const saveItemsToLocalStorage = (newItems: PortfolioItem[]) => {
    setItems(newItems);
    localStorage.setItem("trino_portfolio_items", JSON.stringify(newItems));
  };

  // Reset database to default
  const handleResetData = () => {
    if (window.confirm("¿Estás seguro de que deseas restablecer el catálogo de fotos y videos a los valores por defecto? Se perderán las modificaciones locales.")) {
      saveItemsToLocalStorage(initialPortfolioItems);
      setSelectedCategory("Todos");
      alert("Catálogo restablecido correctamente.");
    }
  };

  // Extract all categories dynamically
  const categories: string[] = ["Todos", ...Array.from(new Set(items.map((item) => item.category))) as string[]];

  // Carousel slider offsets
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});

  const handleCarouselPrev = (categoryName: string, maxItems: number) => {
    setCarouselIndices((prev) => {
      const current = prev[categoryName] || 0;
      const next = current === 0 ? maxItems - 1 : current - 1;
      return { ...prev, [categoryName]: next };
    });
  };

  const handleCarouselNext = (categoryName: string, maxItems: number) => {
    setCarouselIndices((prev) => {
      const current = prev[categoryName] || 0;
      const next = current === maxItems - 1 ? 0 : current + 1;
      return { ...prev, [categoryName]: next };
    });
  };

  // Handle local file uploads with drag & drop or click
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    setUploadFileName(file.name);
    
    // Auto-detect type
    if (file.type.startsWith("video/")) {
      setFormType("video");
    } else if (file.type.startsWith("image/")) {
      setFormType("image");
    }

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUploadedBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Generate description copy using server-side Gemini AI
  const handleGenerateAiCopy = async () => {
    if (!formTitle) {
      alert("Por favor introduce el Título del Proyecto primero para que la IA tenga contexto.");
      return;
    }
    
    setIsGeneratingAi(true);
    setAiStatus("Generando descripción persuasiva con Gemini...");
    
    const categoryText = isCustomCategory ? customCategoryName : formCategory;

    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectTitle: formTitle,
          category: categoryText || "General",
          keywords: aiKeywords,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setFormDescription(data.text);
        setAiStatus("¡Descripción generada exitosamente!");
        setTimeout(() => setAiStatus(null), 3000);
      } else {
        throw new Error(data.error || "No se recibió respuesta válida del servidor.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error al generar copia: ${err.message || "Por favor, verifica que tu GEMINI_API_KEY esté configurada en Secrets."}`);
      setAiStatus("Error al conectar con la IA.");
      setTimeout(() => setAiStatus(null), 4000);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Create or Update Portfolio Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryText = isCustomCategory ? customCategoryName.trim() : formCategory;
    if (!formTitle.trim()) {
      alert("Por favor ingresa un título.");
      return;
    }
    if (!categoryText) {
      alert("Por favor especifica una clasificación o categoría.");
      return;
    }

    let finalMediaUrl = formUrl.trim();
    if (mediaSource === "upload") {
      if (!uploadedBase64) {
        alert("Por favor selecciona o arrastra un archivo multimedia.");
        return;
      }
      finalMediaUrl = uploadedBase64;
    } else {
      if (!finalMediaUrl) {
        alert("Por favor ingresa la URL de la imagen o video.");
        return;
      }
    }

    if (isEditing) {
      // Update item
      const updated = items.map((item) => {
        if (item.id === isEditing) {
          return {
            ...item,
            title: formTitle.trim(),
            description: formDescription.trim(),
            type: formType,
            url: finalMediaUrl,
            category: categoryText,
            layout: formLayout,
          };
        }
        return item;
      });
      saveItemsToLocalStorage(updated);
      alert("¡Elemento modificado exitosamente!");
    } else {
      // Create new item
      const newItem: PortfolioItem = {
        id: `custom-${Date.now()}`,
        title: formTitle.trim(),
        description: formDescription.trim(),
        type: formType,
        url: finalMediaUrl,
        category: categoryText,
        layout: formLayout,
        createdAt: new Date().toISOString()
      };
      saveItemsToLocalStorage([newItem, ...items]);
      alert("¡Nuevo elemento agregado al portafolio!");
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormTitle("");
    setFormDescription("");
    setFormType("image");
    setFormCategory(categories[1] !== "Todos" ? categories[1] : "Fotos carrusel");
    setIsCustomCategory(false);
    setCustomCategoryName("");
    setFormLayout("gallery");
    setMediaSource("url");
    setFormUrl("");
    setUploadedBase64("");
    setUploadFileName("");
    setAiKeywords("");
  };

  const handleEditItem = (item: PortfolioItem) => {
    setIsEditing(item.id);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormType(item.type);
    
    if (categories.includes(item.category)) {
      setFormCategory(item.category);
      setIsCustomCategory(false);
    } else {
      setIsCustomCategory(true);
      setCustomCategoryName(item.category);
    }
    
    setFormLayout(item.layout);
    if (item.url.startsWith("data:")) {
      setMediaSource("upload");
      setUploadedBase64(item.url);
      setUploadFileName("Archivo subido anteriormente");
      setFormUrl("");
    } else {
      setMediaSource("url");
      setFormUrl(item.url);
      setUploadedBase64("");
      setUploadFileName("");
    }
    
    // Jump scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este archivo del catálogo?")) {
      const filtered = items.filter((item) => item.id !== id);
      saveItemsToLocalStorage(filtered);
    }
  };

  // Helper to copy text to clipboard
  const handleCopyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  // Helper to trigger JSON download of current config
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "catalogo_portafolio.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#1B1D21] text-slate-100 font-sans antialiased selection:bg-[#C2FF01] selection:text-[#1B1D21]">
      {/* Dynamic Brand Header */}
      <header className="sticky top-0 z-40 bg-[#1B1D21]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 md:h-24 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-[#C2FF01] p-2.5 rounded-2xl shadow-lg shadow-[#C2FF01]/10">
                <TrinoMascot mood={mascotMood} size={40} animated={false} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <TrinoLogo height={24} color="#FFFFFF" />
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-slate-900 px-2 py-0.5 rounded text-[#C2FF01] border border-slate-800 font-bold">
                    Vibrante
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Inspirado en la música, la cultura y la creatividad colectiva</p>
              </div>
            </div>
            
            {/* Desktop Navigation with Trino Colors */}
            <nav className="flex space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-850">
              <button
                id="btn-nav-portfolio"
                onClick={() => setActiveTab("portfolio")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "portfolio"
                    ? "bg-[#C2FF01] text-[#1B1D21] shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Ver Portafolio</span>
              </button>
              
              <button
                id="btn-nav-cms"
                onClick={() => {
                  setActiveTab("cms");
                  if (!formCategory && categories.length > 1) {
                    setFormCategory(categories[1] !== "Todos" ? categories[1] : "Fotos carrusel");
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "cms"
                    ? "bg-[#DCB8FE] text-[#1B1D21] shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Gestor CMS</span>
              </button>

              <button
                id="btn-nav-manuals"
                onClick={() => setActiveTab("manuals")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "manuals"
                    ? "bg-[#00BBFC] text-[#1B1D21] shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Manuales Sanity</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: VISITOR PORTFOLIO */}
        {activeTab === "portfolio" && (
          <div className="space-y-12 animate-fade-in">
            {/* Interactive Hero Banner matching Trino Brand guidelines */}
            <div className="relative py-12 px-6 md:px-12 rounded-[2.5rem] bg-slate-950/80 border border-slate-800 overflow-hidden">
              {/* Decorative radial gradients matching Trino palette */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[400px] h-[400px] bg-[#C2FF01]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-[#DCB8FE]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left side: Authentic Trino Titles and Brand Intro */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#C2FF01] animate-pulse"></span>
                    <span className="text-[#C2FF01] font-bold">Identidad Visual Trino Integrada</span>
                  </div>
                  
                  {/* Styled like "Forager Bold Overlap" - thick, uppercase, overlapping overlaps */}
                  <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tighter text-white leading-none uppercase">
                    DISEÑO DE <br />
                    <span className="text-[#C2FF01] bg-gradient-to-r from-[#C2FF01] to-white bg-clip-text text-transparent">ESPACIOS</span> &amp; <br />
                    <span className="text-[#DCB8FE]">PRODUCCIÓN</span> VISUAL
                  </h1>
                  
                  <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                    Trino es una marca vibrante, cercana y curiosa. Diseñamos experiencias lúdicas cargadas de energía. Disfruta de esta galería autogestionada sincronizada con tu CMS favorito.
                  </p>

                  {/* Interactive Mood Selector for Trino Mascot */}
                  <div className="space-y-3 pt-2">
                    <span className="block text-xs font-mono font-bold text-[#DCB8FE] uppercase tracking-wider">
                      ✨ Elige el vibe de Trino para acompañarte:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMascotMood("general")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          mascotMood === "general"
                            ? "bg-[#C2FF01] text-[#1B1D21] scale-105"
                            : "bg-[#23272F] text-slate-300 hover:text-white"
                        }`}
                      >
                        👋 Explorador
                      </button>
                      <button
                        onClick={() => setMascotMood("music")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          mascotMood === "music"
                            ? "bg-[#0044FD] text-white scale-105"
                            : "bg-[#23272F] text-slate-300 hover:text-white"
                        }`}
                      >
                        🎵 Música
                      </button>
                      <button
                        onClick={() => setMascotMood("cinema")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          mascotMood === "cinema"
                            ? "bg-[#FE4502] text-white scale-105"
                            : "bg-[#23272F] text-slate-300 hover:text-white"
                        }`}
                      >
                        🍿 Cine
                      </button>
                      <button
                        onClick={() => setMascotMood("theater")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          mascotMood === "theater"
                            ? "bg-[#DCB8FE] text-[#1B1D21] scale-105"
                            : "bg-[#23272F] text-slate-300 hover:text-white"
                        }`}
                      >
                        💀 Teatro
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <button 
                      onClick={() => setActiveTab("cms")} 
                      className="flex items-center space-x-2 bg-[#C2FF01] hover:bg-white text-[#1B1D21] font-bold px-6 py-3 rounded-2xl transition duration-300 text-xs sm:text-sm shadow-xl shadow-[#C2FF01]/10"
                    >
                      <span>Abrir Consola CMS</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab("manuals")} 
                      className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 px-5 py-3 rounded-2xl transition duration-300 text-xs sm:text-sm"
                    >
                      <span>Ver Esquemas Sanity</span>
                    </button>
                  </div>
                </div>

                {/* Right side: Interactive Mascot Visualizer & Speech Bubble */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                  {/* Comic speech bubble with dynamic quotes */}
                  <div className="relative bg-slate-900 border border-slate-800 p-4 rounded-2xl max-w-sm text-center shadow-2xl animate-fade-in">
                    <p className="text-xs sm:text-sm font-medium text-slate-200">
                      {mascotMood === "general" && "¡Hola! Soy Trino. ¿Sabías que este portafolio es 100% autogestionable con Sanity.io? Explora mis mundos."}
                      {mascotMood === "music" && "¡Ritmo, cultura y creatividad! La música es el alma de Trino. ¡Haz clic en los videos de abajo para sentir el beat!"}
                      {mascotMood === "cinema" && "¡Luces, cámara, palomitas! Disfruto de la dirección cinematográfica y el montaje visual premium."}
                      {mascotMood === "theater" && "¡Ser o no ser autogestionado, esa es la cuestión! El teatro y la cultura guían nuestros diseños espaciales."}
                    </p>
                    {/* Speech bubble arrow */}
                    <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-slate-800 rotate-45"></div>
                  </div>

                  {/* Character Illustration framed in a beautiful circular submark container */}
                  <div className="relative w-64 h-64 flex items-center justify-center bg-slate-900/50 rounded-full border-2 border-dashed border-[#C2FF01]/30">
                    <TrinoMascot mood={mascotMood} size={220} />
                    
                    {/* Tiny decorative elements */}
                    <span className="absolute top-4 left-4 text-xs font-mono text-slate-600">TRINO 10</span>
                    <span className="absolute bottom-4 right-4 text-xs font-mono text-[#C2FF01]">BRAND EL 09</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Catálogo de Proyectos</h2>
                <p className="text-xs text-slate-500 mt-1 font-mono">Filtrando por secciones del gestor de archivos</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-[#C2FF01] text-[#1B1D21] shadow-lg shadow-[#C2FF01]/10 font-black scale-105"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                    }`}
                  >
                    {category === "Todos" ? "🔍 Ver Todo" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Render items based on chosen category */}
            {selectedCategory === "Todos" ? (
              // When "Todos" is selected, render section by section
              <div className="space-y-16">
                {categories.filter((cat) => cat !== "Todos").map((catName) => {
                  const catItems = items.filter((item) => item.category === catName);
                  if (catItems.length === 0) return null;
                  
                  // Determine layout (majority layout or first layout of section)
                  const isCarousel = catItems.some(i => i.layout === "carousel") || catName.toLowerCase().includes("carrusel");

                  // Determine border color based on category
                  const getBorderColor = (name: string) => {
                    const normalized = name.toLowerCase();
                    if (normalized.includes("video")) return "border-[#C2FF01]";
                    if (normalized.includes("foto")) return "border-[#DCB8FE]";
                    if (normalized.includes("proyecto a")) return "border-[#FE4502]";
                    return "border-[#00BBFC]";
                  };

                  return (
                    <div key={catName} className="space-y-6">
                      <div className={`flex items-center justify-between border-l-4 ${getBorderColor(catName)} pl-4`}>
                        <div>
                          <h3 className="text-2xl font-black font-display text-white uppercase tracking-tight">{catName}</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            {catItems.length} {catItems.length === 1 ? 'elemento' : 'elementos'} • formato {isCarousel ? 'Carrusel deslizable' : 'Galería bento'}
                          </p>
                        </div>
                        {isCarousel && catItems.length > 1 && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCarouselPrev(catName, catItems.length)}
                              className="bg-slate-900 hover:bg-[#C2FF01] text-white hover:text-[#1B1D21] p-2.5 rounded-xl transition border border-slate-800"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCarouselNext(catName, catItems.length)}
                              className="bg-slate-900 hover:bg-[#C2FF01] text-white hover:text-[#1B1D21] p-2.5 rounded-xl transition border border-slate-800"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isCarousel ? (
                        /* Carousel Component */
                        <div className="relative overflow-hidden rounded-2xl bg-slate-950/40 p-4 border border-slate-800/50">
                          <div className="flex transition-transform duration-500 ease-in-out"
                               style={{ transform: `translateX(-${(carouselIndices[catName] || 0) * 100}%)` }}>
                            {catItems.map((item) => (
                              <div key={item.id} className="min-w-full px-2 md:px-4 flex flex-col md:flex-row gap-6 items-center">
                                {/* Media Container */}
                                <div className="w-full md:w-3/5 aspect-video bg-slate-900 rounded-xl overflow-hidden relative group shadow-2xl">
                                  {item.type === "video" ? (
                                    <video
                                      src={item.url}
                                      className="w-full h-full object-cover"
                                      controls
                                      muted
                                      loop
                                      playsInline
                                    />
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt={item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center space-x-1.5 text-xs">
                                    {item.type === "video" ? <VideoIcon className="h-3 w-3 text-red-400" /> : <ImageIcon className="h-3 w-3 text-[#00BBFC]" />}
                                    <span className="text-slate-300 capitalize font-mono">{item.type}</span>
                                  </div>
                                  <button
                                    onClick={() => setActiveLightbox(item)}
                                    className="absolute bottom-3 right-3 bg-slate-950/90 text-white p-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 text-xs font-mono"
                                  >
                                    <Play className="h-3.5 w-3.5 text-[#C2FF01] fill-[#C2FF01]" />
                                    <span>Expandir</span>
                                  </button>
                                </div>
                                {/* Info Container */}
                                <div className="w-full md:w-2/5 space-y-4">
                                  <div className="inline-block bg-slate-900 border border-slate-800 text-[#DCB8FE] px-3 py-1 rounded-xl text-xs font-mono font-semibold">
                                    Categoría: {item.category}
                                  </div>
                                  <h4 className="text-xl font-bold text-white font-display leading-snug">{item.title}</h4>
                                  <p className="text-slate-400 text-sm leading-relaxed">{item.description || "Sin descripción proporcionada. Agrega una desde el CMS."}</p>
                                  <div className="text-xs text-slate-500 font-mono">
                                    Publicado: {new Date(item.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Indicator dots */}
                          <div className="flex justify-center space-x-2 mt-4">
                            {catItems.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCarouselIndices(prev => ({ ...prev, [catName]: idx }))}
                                className={`h-2 w-2 rounded-full transition-all ${
                                  (carouselIndices[catName] || 0) === idx ? "bg-[#C2FF01] w-4" : "bg-slate-700 hover:bg-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Grid Gallery Component */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                           {catItems.map((item) => (
                            <div
                              key={item.id}
                              className="group bg-slate-950/40 border border-slate-850 rounded-[1.5rem] overflow-hidden hover:border-[#C2FF01]/30 transition-all duration-300 flex flex-col h-full shadow-lg"
                            >
                              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                {item.type === "video" ? (
                                  <div className="w-full h-full relative">
                                    <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center group-hover:bg-slate-950/10 transition-colors">
                                      <div className="bg-slate-950/80 backdrop-blur-md p-3 rounded-full text-white border border-slate-800 group-hover:scale-110 transition-transform">
                                        <Play className="h-5 w-5 text-[#C2FF01] fill-[#C2FF01]" />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-800 flex items-center space-x-1 text-[10px] font-mono">
                                  {item.type === "video" ? <VideoIcon className="h-3 w-3 text-red-400" /> : <ImageIcon className="h-3 w-3 text-[#00BBFC]" />}
                                  <span className="text-slate-300 capitalize">{item.type}</span>
                                </div>
                                <button
                                  onClick={() => setActiveLightbox(item)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  title="Ver pantalla completa"
                                />
                              </div>
                              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                                <div className="space-y-1">
                                  <h4 className="font-bold text-slate-100 text-sm group-hover:text-[#C2FF01] transition-colors line-clamp-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.description || "Sin descripción."}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                  <button
                                    onClick={() => setActiveLightbox(item)}
                                    className="text-[#C2FF01] hover:underline flex items-center space-x-0.5 font-semibold"
                                  >
                                    <span>Ver</span>
                                    <ArrowRight className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Single Category Filtered View
              <div className="space-y-6 animate-fade-in">
                {(() => {
                  const catItems = items.filter((item) => item.category === selectedCategory);
                  if (catItems.length === 0) {
                    return (
                      <div className="text-center py-16 bg-slate-950/40 border border-slate-800 rounded-3xl space-y-3">
                        <Info className="h-10 w-10 text-slate-500 mx-auto" />
                        <h4 className="text-lg font-bold">Esta categoría no tiene archivos todavía</h4>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                          Ve al <strong>Gestor CMS</strong> arriba para subir o enlazar tus primeros archivos multimedia bajo esta sección.
                        </p>
                      </div>
                    );
                  }

                  const isCarousel = catItems.some(i => i.layout === "carousel") || selectedCategory.toLowerCase().includes("carrusel");

                  return (
                    <div className="space-y-6">
                      <div className="border-l-4 border-[#C2FF01] pl-4">
                        <h3 className="text-2xl font-black font-display text-white uppercase tracking-tight">{selectedCategory}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-mono">
                          Mostrando {catItems.length} archivos en visualización de tipo {isCarousel ? "Carrusel" : "Mosaico"}
                        </p>
                      </div>

                      {isCarousel ? (
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 bg-slate-950/30 p-6 rounded-3xl border border-slate-800">
                          {catItems.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-8 items-center bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
                              <div className="w-full md:w-1/2 aspect-video bg-slate-900 rounded-xl overflow-hidden relative group">
                                {item.type === "video" ? (
                                  <video src={item.url} className="w-full h-full object-cover" controls muted loop playsInline />
                                ) : (
                                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                )}
                                <button
                                  onClick={() => setActiveLightbox(item)}
                                  className="absolute bottom-3 right-3 bg-slate-950/90 text-[#C2FF01] font-bold p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-xs border border-slate-800"
                                >
                                  Ampliar Pantalla
                                </button>
                              </div>
                              <div className="w-full md:w-1/2 space-y-4">
                                <h4 className="text-2xl font-bold text-white font-display">{item.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                                <div className="text-xs text-slate-500 font-mono flex justify-between pt-4 border-t border-slate-900">
                                  <span>TIPO: <strong className="text-[#00BBFC] capitalize">{item.type}</strong></span>
                                  <span>FECHA: {new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {catItems.map((item) => (
                            <div key={item.id} className="group bg-slate-950/40 border border-slate-800 rounded-[1.5rem] overflow-hidden hover:border-[#C2FF01]/30 transition-all">
                              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                {item.type === "video" ? (
                                  <div className="w-full h-full relative">
                                    <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                                      <Play className="h-8 w-8 text-[#C2FF01] fill-[#C2FF01]" />
                                    </div>
                                  </div>
                                ) : (
                                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                )}
                                <button
                                  onClick={() => setActiveLightbox(item)}
                                  className="absolute inset-0 cursor-pointer opacity-0 w-full h-full"
                                />
                              </div>
                              <div className="p-4 space-y-2">
                                <h4 className="font-bold text-white text-base group-hover:text-[#C2FF01] transition-colors line-clamp-1">{item.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{item.description}</p>
                                <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900 flex justify-between">
                                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                  <span className="capitalize text-[#DCB8FE] font-bold">{item.type}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTEGRATED CMS PANEL (ADMIN CLIENT VIEW) */}
        {activeTab === "cms" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Real Sanity Configuration Hub */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Settings className="h-32 w-32" />
              </div>
              <div className="relative space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                      <Database className="h-5 w-5 text-emerald-400" />
                      Sanity.io Hub & Almacenamiento
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configura la conexión oficial con tu base de datos de Sanity o juega con almacenamiento simulado inmediato.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start">
                    <button
                      onClick={() => {
                        const newConfig = { ...sanityConfig, useRealSanity: false };
                        setSanityConfig(newConfig);
                        localStorage.setItem("trino_sanity_config", JSON.stringify(newConfig));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        !sanityConfig.useRealSanity
                          ? "bg-indigo-500 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      ☁️ Simulado (Local)
                    </button>
                    <button
                      onClick={() => {
                        const newConfig = { ...sanityConfig, useRealSanity: true };
                        setSanityConfig(newConfig);
                        localStorage.setItem("trino_sanity_config", JSON.stringify(newConfig));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        sanityConfig.useRealSanity
                          ? "bg-indigo-500 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      ⚡ Sanity.io Real
                    </button>
                  </div>
                </div>

                {sanityConfig.useRealSanity ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 animate-fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5">SANITY PROJECT ID</label>
                      <input
                        type="text"
                        value={sanityConfig.projectId}
                        onChange={(e) => {
                          const conf = { ...sanityConfig, projectId: e.target.value };
                          setSanityConfig(conf);
                          localStorage.setItem("trino_sanity_config", JSON.stringify(conf));
                        }}
                        placeholder="ej: x89s2kla"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5">DATASET</label>
                      <input
                        type="text"
                        value={sanityConfig.dataset}
                        onChange={(e) => {
                          const conf = { ...sanityConfig, dataset: e.target.value };
                          setSanityConfig(conf);
                          localStorage.setItem("trino_sanity_config", JSON.stringify(conf));
                        }}
                        placeholder="ej: production"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5">API READ TOKEN (OPCIONAL)</label>
                      <input
                        type="password"
                        value={sanityConfig.token}
                        onChange={(e) => {
                          const conf = { ...sanityConfig, token: e.target.value };
                          setSanityConfig(conf);
                          localStorage.setItem("trino_sanity_config", JSON.stringify(conf));
                        }}
                        placeholder="Token de lectura segura"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 font-mono"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-3 pt-2 text-[11px] text-emerald-400 flex items-center space-x-1.5">
                      <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span>Modo Sanity.io activado. Los manuales adjuntos en la pestaña "Manuales" te guiarán para sincronizar este código en segundos.</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                    <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Almacenamiento Local Inteligente Activo</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Todo archivo que agregues, modifiques o elimines se guardará instantáneamente en tu navegador actual. El cliente puede probar el funcionamiento completo del portafolio (subir fotos, videos, reordenar y generar copys) antes de dar el paso final a Sanity.io.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form & List columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Form Editor (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">
                        {isEditing ? "📝 Modificar Elemento" : "➕ Subir Nuevo Archivo"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Define las características de la foto o video</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={resetForm}
                        className="text-xs bg-slate-900 text-slate-400 hover:text-white px-2 py-1 rounded-md border border-slate-800"
                      >
                        Cancelar Edición
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveItem} className="space-y-4">
                    
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono">Título del Proyecto / Archivo</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ej: Fachada Principal - Residencia Alto"
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none placeholder-slate-600 text-white"
                      />
                    </div>

                    {/* Media Type & Layout Format */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono font-medium">Tipo de Archivo</label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value as "image" | "video")}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none text-slate-200"
                        >
                          <option value="image">🖼️ Imagen</option>
                          <option value="video">🎥 Video</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono">Formato Visual</label>
                        <select
                          value={formLayout}
                          onChange={(e) => setFormLayout(e.target.value as "carousel" | "gallery")}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none text-slate-200"
                        >
                          <option value="carousel">🎠 Carrusel Deslizable</option>
                          <option value="gallery">🖼️ Galería en Cuadrícula</option>
                        </select>
                      </div>
                    </div>

                    {/* Classification / Category Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-400 uppercase font-mono">Clasificación / Categoría</label>
                        <button
                          type="button"
                          onClick={() => setIsCustomCategory(!isCustomCategory)}
                          className="text-[10px] text-indigo-400 hover:underline font-semibold"
                        >
                          {isCustomCategory ? "Seleccionar Existente" : "+ Crear Nueva Sección"}
                        </button>
                      </div>

                      {isCustomCategory ? (
                        <input
                          type="text"
                          required
                          value={customCategoryName}
                          onChange={(e) => setCustomCategoryName(e.target.value)}
                          placeholder="Ej: Proyecto Hotel, Proyecto C..."
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none text-white placeholder-slate-600"
                        />
                      ) : (
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none text-slate-200"
                        >
                          {categories.filter(c => c !== "Todos").map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                          {categories.length <= 1 && (
                            <>
                              <option value="Videos carrusel">Videos carrusel</option>
                              <option value="Fotos carrusel">Fotos carrusel</option>
                              <option value="Proyecto A">Proyecto A</option>
                            </>
                          )}
                        </select>
                      )}
                      <p className="text-[10px] text-slate-500 mt-1">
                        Escribe el mismo nombre para agrupar múltiples fotos/videos bajo un mismo proyecto.
                      </p>
                    </div>

                    {/* Source selection */}
                    <div className="border-t border-slate-900 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase font-mono">Archivo de Origen</label>
                        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850 text-[10px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setMediaSource("url")}
                            className={`px-2 py-1 rounded-md ${mediaSource === "url" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"}`}
                          >
                            <LinkIcon className="h-3 w-3 inline mr-1" />
                            URL Externa
                          </button>
                          <button
                            type="button"
                            onClick={() => setMediaSource("upload")}
                            className={`px-2 py-1 rounded-md ${mediaSource === "upload" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"}`}
                          >
                            <Upload className="h-3 w-3 inline mr-1" />
                            Subir Local
                          </button>
                        </div>
                      </div>

                      {mediaSource === "url" ? (
                        <input
                          type="url"
                          required={mediaSource === "url"}
                          value={formUrl}
                          onChange={(e) => setFormUrl(e.target.value)}
                          placeholder="Introduce el enlace HTTPS del archivo (ej: Unsplash, Pexels o CDN)"
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none placeholder-slate-600 text-white font-mono"
                        />
                      ) : (
                        <div className="space-y-2">
                          <div
                            onClick={triggerFileUpload}
                            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 cursor-pointer rounded-2xl p-6 text-center bg-slate-900/50 hover:bg-slate-900 transition-colors space-y-2"
                          >
                            <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                            <p className="text-xs text-slate-300 font-medium">Arrastra tu foto/video aquí o haz clic para subir</p>
                            <p className="text-[10px] text-slate-500">Soporta JPG, PNG, GIF, MP4, MOV</p>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*,video/*"
                              className="hidden"
                            />
                          </div>
                          {uploadFileName && (
                            <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-2.5 px-4 flex items-center justify-between">
                              <div className="flex items-center space-x-2 truncate">
                                {formType === "video" ? <VideoIcon className="h-4 w-4 text-red-400 flex-shrink-0" /> : <ImageIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />}
                                <span className="text-xs text-slate-300 truncate font-mono">{uploadFileName}</span>
                              </div>
                              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-md">Listo</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* AI Copywriting tool Section */}
                    <div className="border-t border-slate-900 pt-4 space-y-2.5 bg-indigo-950/10 p-4 rounded-2xl border border-indigo-950/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 font-mono">
                          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                          <span>Redactor AI integrado (Gemini)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleGenerateAiCopy}
                          disabled={isGeneratingAi}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-lg shadow-indigo-950/20"
                        >
                          {isGeneratingAi ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          <span>Redactar Descripción</span>
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        value={aiKeywords}
                        onChange={(e) => setAiKeywords(e.target.value)}
                        placeholder="Palabras clave opcionales (ej: cemento, moderno, luz cálida)"
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none placeholder-slate-600 text-white"
                      />
                      
                      {aiStatus && (
                        <p className="text-[10px] text-indigo-300 animate-pulse font-mono">
                          {aiStatus}
                        </p>
                      )}
                    </div>

                    {/* Description text area */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono">Descripción del Trabajo</label>
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Cuéntanos más detalles sobre este proyecto (ej: autoría, año, concepto)..."
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none placeholder-slate-600 text-white"
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 text-sm shadow-md"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isEditing ? "Guardar Modificaciones" : "Agregar a mi Portafolio"}</span>
                    </button>

                  </form>
                </div>
              </div>

              {/* Right Column: List of items (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">Archivos Publicados ({items.length})</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Maneja, modifica o elimina tus contenidos rápidamente</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleExportData}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white p-2 rounded-xl text-xs flex items-center space-x-1 font-semibold transition"
                        title="Exportar base de datos a archivo JSON"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Exportar JSON</span>
                      </button>
                      <button
                        onClick={handleResetData}
                        className="bg-slate-900 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/30 text-red-400 p-2 rounded-xl text-xs flex items-center space-x-1 font-semibold transition"
                        title="Restablecer base de datos inicial"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Reiniciar</span>
                      </button>
                    </div>
                  </div>

                  {/* Table List of entries */}
                  <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/40 border border-slate-850 p-3.5 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-700/50 transition-all group"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          {/* Mini Preview Box */}
                          <div className="h-14 w-14 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800 relative">
                            {item.type === "video" ? (
                              <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                                <video src={item.url} className="w-full h-full object-cover opacity-80" muted playsInline />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                                </div>
                              </div>
                            ) : (
                              <img src={item.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            )}
                          </div>
                          
                          {/* File Details */}
                          <div className="truncate space-y-1">
                            <h4 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                              {item.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                              <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-850">
                                {item.category}
                              </span>
                              <span className="bg-slate-950 px-2 py-0.5 rounded-md text-slate-500 capitalize">
                                {item.type}
                              </span>
                              <span className="bg-indigo-950/40 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-950/50 capitalize">
                                {item.layout}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 bg-slate-950 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 rounded-lg border border-slate-850 hover:border-indigo-500/20 transition-all"
                            title="Editar este elemento"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg border border-slate-850 hover:border-red-500/20 transition-all"
                            title="Eliminar este elemento"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="text-center py-12 text-slate-500 space-y-2">
                        <Database className="h-8 w-8 mx-auto" />
                        <p className="text-xs">No hay elementos en tu catálogo local. Haz clic en "Reiniciar" para recargar la base preestablecida o agrega archivos nuevos.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: SPANISH MANUALS FOR CLIENT AND DEVELOPER */}
        {activeTab === "manuals" && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            {/* Header info */}
            <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl space-y-2">
              <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-400" />
                Guías y Manuales de Configuración
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hemos preparado dos manuales explicativos muy detallados para que esta solución autogestionada sea un éxito absoluto. Selecciona tu perfil a continuación para leer las instrucciones completas.
              </p>
            </div>

            {/* Inner manual navigation */}
            <div className="flex border-b border-slate-800 bg-slate-950/30 p-1.5 rounded-2xl border">
              <button
                onClick={() => setManualTab("client")}
                className={`flex-1 py-3 text-center rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                  manualTab === "client"
                    ? "bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Manual para el CLIENTE (Subir contenido)</span>
              </button>
              <button
                onClick={() => setManualTab("developer")}
                className={`flex-1 py-3 text-center rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                  manualTab === "developer"
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Manual para el DESARROLLADOR (Instalación)</span>
              </button>
            </div>

            {/* Render manuals body */}
            <div className="bg-slate-950/30 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              
              {manualTab === "client" ? (
                // CLIENT MANUAL
                <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
                  <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/20 px-4 py-2 rounded-xl border border-emerald-900/30">
                    <Info className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider font-mono">Manual de Administración - No requiere programación</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white font-display">📸 Guía de Administración del Portafolio</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    ¡Felicidades! Tu portafolio web cuenta con un sistema autogestionado de archivos que te permitirá subir y clasificar fotos y videos espectaculares de tus proyectos sin necesidad de escribir código.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-white font-bold text-sm flex items-center gap-1.5 font-display">
                        <span className="text-emerald-400 font-bold">1.</span> Categoría: "Videos carrusel"
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Coloca un video o animación de dron que se deslice de forma fluida en la cabecera principal. Ideal para tomas cinemáticas impactantes.
                      </p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-white font-bold text-sm flex items-center gap-1.5 font-display">
                        <span className="text-indigo-400 font-bold">2.</span> Categoría: "Fotos carrusel"
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Genera un carrusel interactivo horizontal exclusivo para tus mejores tomas fotográficas de arquitectura o producto terminado.
                      </p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-white font-bold text-sm flex items-center gap-1.5 font-display">
                        <span className="text-purple-400 font-bold">3.</span> Nombre del Proyecto (ej: "Proyecto A")
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Agrupa múltiples fotos del mismo proyecto en una cuadrícula moderna (Bento Grid) con apertura de imagen gigante (Lightbox).
                      </p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-white font-bold text-sm flex items-center gap-1.5 font-display">
                        <span className="text-emerald-400 font-bold">4.</span> Redactor Inteligente
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        ¿No sabes qué escribir de descripción? Introduce tu título, unas palabras clave, y haz clic en "Redactar" para que la Inteligencia Artificial de Gemini escriba textos creativos por ti.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl space-y-4">
                    <h4 className="text-white font-bold font-display text-base">Pasos para subir contenido a Sanity.io:</h4>
                    <ol className="list-decimal list-inside space-y-3 text-sm text-slate-300">
                      <li>Accede a tu plataforma de Sanity Studio e inicia sesión.</li>
                      <li>Selecciona <strong>"Item de Portafolio"</strong> en el panel izquierdo y haz clic en el botón de creación (esquina superior derecha).</li>
                      <li>Completa el <strong>Título</strong>, elige si es <strong>Imagen</strong> o <strong>Video</strong> y escribe la categoría exacta donde deseas que aparezca.</li>
                      <li>Sube tu archivo (imagen JPG/PNG comprimida o video MP4 ligero).</li>
                      <li>Elige si quieres mostrarlo en formato <strong>Carrusel Horizontal</strong> o <strong>Galería Bento en Cuadrícula</strong>.</li>
                      <li>Haz clic en el botón verde <strong>"Publish"</strong> en la parte inferior derecha. ¡Y listo! Tu web se actualiza al instante.</li>
                    </ol>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => handleCopyToClipboard(clientManualMarkdown, "client_manual")}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center space-x-1.5 transition"
                    >
                      {copiedSection === "client_manual" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>Copiar Manual del Cliente Completo (Markdown)</span>
                    </button>
                    {copiedSection === "client_manual" && <span className="text-xs text-emerald-400 font-mono animate-pulse">¡Copiado al portapapeles!</span>}
                  </div>
                </div>
              ) : (
                // DEVELOPER MANUAL
                <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
                  <div className="flex items-center space-x-2 text-indigo-400 bg-indigo-950/20 px-4 py-2 rounded-xl border border-indigo-900/30">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider font-mono">Guía del Desarrollador - Código de Sincronización</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white font-display">🛠️ Integración del Cliente de Sanity.io</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Sigue esta guía técnica para configurar el backend sin servidor de Sanity.io, desplegar el esquema y mapear las URLs del archivo directamente en tu aplicación React.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Esquema recomendado para Sanity.io:</h4>
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs font-mono overflow-x-auto relative group">
                      <button
                        onClick={() => handleCopyToClipboard(`import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'portfolioItem',
  title: 'Item de Portafolio',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text' }),
    defineField({ name: 'type', title: 'Tipo', type: 'string', options: { list: ['image', 'video'] } }),
    defineField({ name: 'category', title: 'Categoría', type: 'string' }),
    defineField({ name: 'mediaFile', title: 'Archivo', type: 'file', options: { accept: 'image/*,video/*' } }),
    defineField({ name: 'externalUrl', title: 'URL Externa', type: 'url' }),
    defineField({ name: 'layout', title: 'Layout', type: 'string', options: { list: ['carousel', 'gallery'] } }),
    defineField({ name: 'createdAt', title: 'Fecha', type: 'datetime', initialValue: () => new Date().toISOString() })
  ]
})`, "schema_code")}
                        className="absolute top-2.5 right-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white p-1.5 rounded-md transition text-[10px] flex items-center space-x-1"
                      >
                        {copiedSection === "schema_code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>Copiar Esquema</span>
                      </button>
                      <pre className="text-slate-300">
{`import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'portfolioItem',
  title: 'Item de Portafolio',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text' }),
    defineField({ name: 'type', title: 'Tipo', type: 'string', options: { list: ['image', 'video'] } }),
    defineField({ name: 'category', title: 'Categoría', type: 'string' }),
    defineField({ name: 'mediaFile', title: 'Archivo', type: 'file', options: { accept: 'image/*,video/*' } }),
    defineField({ name: 'externalUrl', title: 'URL Externa', type: 'url' }),
    defineField({ name: 'layout', title: 'Layout', type: 'string', options: { list: ['carousel', 'gallery'] } }),
    defineField({ name: 'createdAt', title: 'Fecha', type: 'datetime', initialValue: () => new Date().toISOString() })
  ]
})`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">GROQ Query para React:</h4>
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs font-mono overflow-x-auto relative group">
                      <button
                        onClick={() => handleCopyToClipboard(`const query = \`*[_type == "portfolioItem"] | order(createdAt desc) {
  "id": _id,
  title,
  description,
  type,
  category,
  layout,
  createdAt,
  "url": coalesce(mediaFile.asset->url, externalUrl)
}\``, "groq_code")}
                        className="absolute top-2.5 right-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white p-1.5 rounded-md transition text-[10px] flex items-center space-x-1"
                      >
                        {copiedSection === "groq_code" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>Copiar GROQ</span>
                      </button>
                      <pre className="text-slate-300">
{`const query = \`*[_type == "portfolioItem"] | order(createdAt desc) {
  "id": _id,
  title,
  description,
  type,
  category,
  layout,
  createdAt,
  "url": coalesce(mediaFile.asset->url, externalUrl)
}\``}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => handleCopyToClipboard(developerManualMarkdown, "dev_manual")}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center space-x-1.5 transition"
                    >
                      {copiedSection === "dev_manual" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>Copiar Manual Técnico del Programador (Markdown)</span>
                    </button>
                    {copiedSection === "dev_manual" && <span className="text-xs text-emerald-400 font-mono animate-pulse">¡Copiado al portapapeles!</span>}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* LIGHTBOX / FULL SCREEN VIEWER OVERLAY */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 md:p-8 animate-fade-in">
          <button
            onClick={() => setActiveLightbox(null)}
            className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white p-3 rounded-full transition z-10"
            title="Cerrar pantalla completa"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col items-center justify-center space-y-4">
            
            {/* Aspect box container */}
            <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-850 shadow-2xl">
              {activeLightbox.type === "video" ? (
                <video
                  src={activeLightbox.url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={activeLightbox.url}
                  alt={activeLightbox.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Info details */}
            <div className="text-center space-y-2 max-w-2xl px-4">
              <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-3 py-1 rounded-full text-xs font-mono font-medium">
                Sección: {activeLightbox.category}
              </span>
              <h3 className="text-2xl font-bold text-white font-display mt-2 leading-snug">
                {activeLightbox.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {activeLightbox.description || "Este archivo multimedia no tiene una descripción detallada cargada."}
              </p>
              <p className="text-[10px] text-slate-500 font-mono pt-1">
                Registrado el: {new Date(activeLightbox.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 mt-16 text-center text-slate-500 text-xs font-mono space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm font-sans">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-white font-display tracking-wider">ESTUDIO TRINO</span>
          </div>
          <div>
            <span>Desarrollado con React 19, Express & Google Gemini AI API</span>
          </div>
          <div className="flex space-x-4 text-xs font-mono text-slate-500">
            <button onClick={() => setActiveTab("manuals")} className="hover:text-emerald-400 transition">Guía de Sanity</button>
            <span>•</span>
            <button onClick={() => setActiveTab("cms")} className="hover:text-emerald-400 transition">Consola CMS</button>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 pt-4">
          &copy; {new Date().getFullYear()} Estudio Trino. Todos los derechos reservados. Las imágenes del catálogo inicial son propiedad de Unsplash y Mixkit.
        </p>
      </footer>
    </div>
  );
}
