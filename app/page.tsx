"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Bot,
  Sun,
  Moon,
  ShieldCheck,
  Code2,
  User,
  Zap,
  Tag,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  X,
  Send,
} from "lucide-react";

// --- MOCK DATA FOR GAMES & APPS ---
interface AppCard {
  id: string;
  title: string;
  developer: string;
  category: "Card Games" | "Puzzle" | "Casual" | "Strategy" | "Trivia";
  rating: number;
  reviewsCount: number;
  price: number; // 0 = Free
  isSponsored?: boolean;
  image: string;
  description: string;
  badge?: string;
}

const MOCK_APPS: AppCard[] = [
  {
    id: "1",
    title: "CyberDeck Solitaire",
    developer: "NeonByte Studios",
    category: "Card Games",
    rating: 4.9,
    reviewsCount: 1240,
    price: 0,
    isSponsored: true,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    description: "Futuristic cyberpunk card solitaire with interactive AI strategy bots.",
    badge: "Editor's Choice",
  },
  {
    id: "2",
    title: "MindForge Trivia AI",
    developer: "Aura Logic",
    category: "Trivia",
    rating: 4.7,
    reviewsCount: 850,
    price: 0,
    isSponsored: false,
    image: "https://images.unsplash.com/photo-1606168094336-48f205276929?w=600&auto=format&fit=crop&q=80",
    description: "Dynamic AI-generated trivia quizzes tailored to your knowledge level.",
  },
  {
    id: "3",
    title: "Kingdom Cards: Tactics",
    developer: "Ironclad Games",
    category: "Strategy",
    rating: 4.8,
    reviewsCount: 3100,
    price: 2.99,
    isSponsored: true,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80",
    description: "Turn-based tactical card battler with online multiplayer leaderboards.",
    badge: "Top Paid",
  },
  {
    id: "4",
    title: "Zenith Memory Match",
    developer: "PixelCraft Lab",
    category: "Casual",
    rating: 4.5,
    reviewsCount: 620,
    price: 0,
    isSponsored: false,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    description: "Relaxing visual tile & card memory matching game with ambient soundscapes.",
  },
  {
    id: "5",
    title: "Rogue Dungeon Cards",
    developer: "Shadow Interactive",
    category: "Card Games",
    rating: 4.6,
    reviewsCount: 1890,
    price: 1.49,
    isSponsored: false,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    description: "Rogue-like card crawler. Build your deck and survive random encounters.",
  },
  {
    id: "6",
    title: "Spatial Puzzle 3D",
    developer: "Vortex Interactive",
    category: "Puzzle",
    rating: 4.3,
    reviewsCount: 410,
    price: 0,
    isSponsored: false,
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&auto=format&fit=crop&q=80",
    description: "Mind-bending 3D spatial reasoning spatial puzzles for logic enthusiasts.",
  },
];

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"User" | "Developer" | "Admin">("User");

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [pricingFilter, setPricingFilter] = useState<"All" | "Free" | "Paid">("All");
  const [sortBy, setSortBy] = useState<"rating-desc" | "rating-asc" | "price-asc" | "price-desc">("rating-desc");

  // Gemini AI Chatbot Drawer State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "gemini"; text: string }>>([
    { sender: "gemini", text: "Hello! I'm VaultAssistant powered by Gemini API 🤖. Looking for game recommendations or need help?" },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedApps = useMemo(() => {
    return MOCK_APPS.filter((app) => {
      // 1. Search by Name
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Filter by Category
      const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;

      // 3. Filter by Pricing
      const matchesPricing =
        pricingFilter === "All" ||
        (pricingFilter === "Free" && app.price === 0) ||
        (pricingFilter === "Paid" && app.price > 0);

      return matchesSearch && matchesCategory && matchesPricing;
    }).sort((a, b) => {
      // Sorting Logic
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, pricingFilter, sortBy]);

  // Handle Send Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMsg("");

    // Simulated Gemini API Response
    setTimeout(() => {
      let botResponse = "I can definitely help you with that! Explore our top card games or check out Zenith Memory Match!";
      if (userText.toLowerCase().includes("free")) {
        botResponse = "We have great free games like CyberDeck Solitaire and MindForge Trivia AI!";
      } else if (userText.toLowerCase().includes("strategy") || userText.toLowerCase().includes("card")) {
        botResponse = "I highly recommend 'Kingdom Cards: Tactics' ($2.99) for deep strategic card combat!";
      }
      setChatMessages((prev) => [...prev, { sender: "gemini", text: botResponse }]);
    }, 800);
  };

  return (
    <div className={isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} style={{ minHeight: "100vh" }}>

      {/* =========================================================================
          1. NAVIGATION BAR (Supports Role Switcher & Better Auth Mocking)
         ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>Play<span className="text-emerald-600 dark:text-emerald-500">Store</span></span>
          </Link>

          {/* Quick Search Bar (Header View) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search games, mini-apps, developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
            />
          </div>

          {/* Role Switcher Badge & Actions */}
          <div className="flex items-center gap-3">

            {/* Demo Role Selector */}
            <div className="hidden sm:flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
              {(["User", "Developer", "Admin"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-2.5 py-1 rounded-md transition-all ${selectedRole === role
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Dashboard / Auth Action based on Role */}
            {selectedRole === "User" && (
              <Link href="/dashboard/user" className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Library</span>
              </Link>
            )}
            {selectedRole === "Developer" && (
              <Link href="/dashboard/developer" className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                <Code2 className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Game</span>
              </Link>
            )}
            {selectedRole === "Admin" && (
              <Link href="/dashboard/admin" className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-800 hover:bg-emerald-600 transition">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. SPONSORED HERO BANNER CAROUSEL
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl border border-slate-800">
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Featured Sponsor
            </span>
          </div>

          <div className="grid md:grid-cols-2 items-center p-6 sm:p-10 gap-8">
            <div className="space-y-4 z-10">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <span>NeonByte Studios</span> • <span>★ 4.9 Rating</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                CyberDeck Solitaire Rawnak
              </h1>
              <p className="text-slate-300 text-sm sm:text-base line-clamp-3">
                Experience the next generation of card gaming. Play against dynamic AI engines, participate in weekly competitive leaderboards, and unlock cyberdeck themes.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/games/1"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  Play Now <ChevronRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400">Free to Play • Web Instant</span>
              </div>
            </div>

            {/* Banner Image Display */}
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-700 shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
                alt="CyberDeck Solitaire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EXPLORE, SEARCH, SORTING & FILTERING SECTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Explore Store Apps & Mini-Games
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Discover card games, puzzles, and trivia submitted by verified developers.
            </p>
          </div>

          {/* Search Bar for Mobile */}
          <div className="md:hidden relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search games by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            />
          </div>
        </div>

        {/* Filter Toolbar: Categories, Pricing Filter & Sorting Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {["All", "Card Games", "Strategy", "Trivia", "Casual", "Puzzle"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                    ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls: Pricing Filter + Sort By Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

            {/* Price Filter (Free vs Paid) */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
              {(["All", "Free", "Paid"] as const).map((pf) => (
                <button
                  key={pf}
                  onClick={() => setPricingFilter(pf)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${pricingFilter === pf
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                      : "text-slate-500 dark:text-slate-400"
                    }`}
                >
                  {pf}
                </button>
              ))}
            </div>

          
          </div>
        </div>

        {/* =========================================================================
            4. STORE APP CARDS GRID (STOREFRONT DESIGN)
           ========================================================================= */}
        {filteredAndSortedApps.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Apps Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query, price filter, or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredAndSortedApps.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Image Banner & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  <Image
                    src={app.image}
                    alt={app.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Sponsor Badge */}
                  {app.isSponsored && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                      Sponsored
                    </span>
                  )}

                  {/* Rating Pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{app.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400">({app.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{app.category}</span>
                      <span>By {app.developer}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                      {app.description}
                    </p>
                  </div>

                  {/* Card Footer: Price & CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Price</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {app.price === 0 ? "FREE" : `$${app.price.toFixed(2)}`}
                      </span>
                    </div>

                    <Link
                      href={`/games/${app.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-600 font-bold text-xs transition flex items-center gap-1"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. GEMINI AI CHATBOT FLOATING WIDGET ("VaultAssistant")
         ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50">

        {/* Trigger Button */}
        {!isAiOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/50 transition-all"
          >
            <Bot className="w-5 h-5 animate-bounce" />
            <span>AI Assistant</span>
          </motion.button>
        )}

        {/* AI Drawer Window */}
        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[450px]"
            >
              {/* Chat Drawer Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">VaultAssistant AI</h4>
                    <p className="text-[10px] text-emerald-400">Powered by Gemini API</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === "user"
                          ? "bg-emerald-600 text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Gemini for game tips..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          6. FOOTER SECTION
         ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">AppVault Portal</span>
            <span>• Full-Stack Assignment Team Project</span>
          </div>
          <div className="flex gap-4">
            <Link href="/explore" className="hover:underline">Explore</Link>
            <Link href="/dashboard/developer" className="hover:underline">Developer Center</Link>
            <Link href="/dashboard/admin" className="hover:underline">Admin Controls</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}