import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Languages, 
  MessageCircle, 
  GraduationCap, 
  Gamepad2, 
  LayoutGrid, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw,
  Trophy,
  Search,
  Menu,
  X,
  Home,
  User as UserIcon,
  LogOut,
  LogIn,
  Send,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { auth, db, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { 
  vocabularyData, 
  kanjiData, 
  grammarData, 
  readingData, 
  conversationData,
  Vocabulary,
  Kanji,
  Grammar,
  Reading,
  Conversation
} from './data';

type Section = 'home' | 'vocabulary' | 'kanji' | 'grammar' | 'reading' | 'conversation' | 'flashcards' | 'quiz' | 'profile' | 'chat';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  highScore: number;
  completedN5: boolean;
  completedN4: boolean;
  savedWords: string[];
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [levelFilter, setLevelFilter] = useState<'Semua' | 'N5' | 'N4'>('Semua');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        const unsubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: u.uid,
              displayName: u.displayName || 'Pelajar Jouzu',
              email: u.email || '',
              photoURL: u.photoURL || '',
              highScore: 0,
              completedN5: false,
              completedN4: false,
              savedWords: [],
            };
            setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredVocab = useMemo(() => 
    levelFilter === 'Semua' ? vocabularyData : vocabularyData.filter(v => v.level === levelFilter),
  [levelFilter]);

  const filteredKanji = useMemo(() => 
    levelFilter === 'Semua' ? kanjiData : kanjiData.filter(k => k.level === levelFilter),
  [levelFilter]);

  const filteredGrammar = useMemo(() => 
    levelFilter === 'Semua' ? grammarData : grammarData.filter(g => g.level === levelFilter),
  [levelFilter]);

  const filteredReading = useMemo(() => 
    levelFilter === 'Semua' ? readingData : readingData.filter(r => r.level === levelFilter),
  [levelFilter]);

  const filteredConversation = useMemo(() => 
    levelFilter === 'Semua' ? conversationData : conversationData.filter(c => c.level === levelFilter),
  [levelFilter]);

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <HomeSection onNavigate={setActiveSection} />;
      case 'vocabulary': return <VocabularySection data={filteredVocab} profile={profile} />;
      case 'kanji': return <KanjiSection data={filteredKanji} />;
      case 'grammar': return <GrammarSection data={filteredGrammar} />;
      case 'reading': return <ReadingSection data={filteredReading} />;
      case 'conversation': return <ConversationSection data={filteredConversation} />;
      case 'flashcards': return <FlashcardsSection data={filteredVocab} />;
      case 'quiz': return <QuizSection vocab={vocabularyData} kanji={kanjiData} profile={profile} />;
      case 'profile': return <ProfileSection profile={profile} onNavigate={setActiveSection} />;
      case 'chat': return <GeminiChat />;
      default: return <HomeSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#5A5A40]/10 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveSection('home')}
          >
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
              <span className="text-xl font-bold">上手</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#5A5A40]">Jouzu</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavButton active={activeSection === 'vocabulary'} onClick={() => setActiveSection('vocabulary')} icon={<LayoutGrid size={18} />} label="Kotoba" />
            <NavButton active={activeSection === 'kanji'} onClick={() => setActiveSection('kanji')} icon={<Languages size={18} />} label="Kanji" />
            <NavButton active={activeSection === 'grammar'} onClick={() => setActiveSection('grammar')} icon={<BookOpen size={18} />} label="Bunpo" />
            <NavButton active={activeSection === 'reading'} onClick={() => setActiveSection('reading')} icon={<GraduationCap size={18} />} label="Dokkai" />
            <NavButton active={activeSection === 'conversation'} onClick={() => setActiveSection('conversation')} icon={<MessageCircle size={18} />} label="Kaiwa" />
            <NavButton active={activeSection === 'flashcards'} onClick={() => setActiveSection('flashcards')} icon={<RotateCcw size={18} />} label="Flashcards" />
            <NavButton active={activeSection === 'quiz'} onClick={() => setActiveSection('quiz')} icon={<Gamepad2 size={18} />} label="Quiz" />
            <NavButton active={activeSection === 'chat'} onClick={() => setActiveSection('chat')} icon={<Sparkles size={18} />} label="AI Chat" />
            
            <div className="flex bg-[#f0f0e8] p-1 rounded-full ml-4">
              {['Semua', 'N5', 'N4'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    levelFilter === lvl ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#5A5A40]/60 hover:text-[#5A5A40]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {user ? (
              <button 
                onClick={() => setActiveSection('profile')}
                className="flex items-center gap-2 ml-4 p-1 pr-3 bg-[#5A5A40]/5 rounded-full hover:bg-[#5A5A40]/10 transition-all"
              >
                <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-[#5A5A40]/20" />
                <span className="text-xs font-bold text-[#5A5A40]">{user.displayName?.split(' ')[0]}</span>
              </button>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 ml-4 px-4 py-2 bg-[#5A5A40] text-white rounded-full text-xs font-bold hover:shadow-lg transition-all"
              >
                <LogIn size={14} />
                Masuk
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-[#5A5A40]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <MobileNavButton onClick={() => { setActiveSection('vocabulary'); setIsMenuOpen(false); }} label="Vocabulary (Kotoba)" />
              <MobileNavButton onClick={() => { setActiveSection('kanji'); setIsMenuOpen(false); }} label="Kanji" />
              <MobileNavButton onClick={() => { setActiveSection('grammar'); setIsMenuOpen(false); }} label="Grammar (Bunpo)" />
              <MobileNavButton onClick={() => { setActiveSection('reading'); setIsMenuOpen(false); }} label="Reading (Dokkai)" />
              <MobileNavButton onClick={() => { setActiveSection('conversation'); setIsMenuOpen(false); }} label="Conversation (Kaiwa)" />
              <MobileNavButton onClick={() => { setActiveSection('flashcards'); setIsMenuOpen(false); }} label="Flashcards" />
              <MobileNavButton onClick={() => { setActiveSection('quiz'); setIsMenuOpen(false); }} label="Quiz Game" />
              
              <div className="mt-8 pt-8 border-t border-[#5A5A40]/10">
                <p className="text-xs uppercase tracking-widest text-[#5A5A40]/40 mb-4">Level Filter</p>
                <div className="flex gap-2">
                  {['All', 'N5', 'N4'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl as any)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                        levelFilter === lvl ? 'bg-[#5A5A40] text-white' : 'bg-[#f0f0e8] text-[#5A5A40]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection + levelFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#5A5A40]/10 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
              <span className="text-sm font-bold">上手</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#5A5A40]">Jouzu</h2>
          </div>
          <p className="text-[#5A5A40]/60 text-sm max-w-md mx-auto italic">
            "Jouzu" means "skillful" or "proficient". Our mission is to help you become jouzu in Japanese.
          </p>
          <div className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[#5A5A40]/40">
            © 2026 Jouzu Learning Platform • N5-N4 Curriculum
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        active ? 'text-[#5A5A40] bg-[#5A5A40]/5 font-semibold' : 'text-[#5A5A40]/60 hover:text-[#5A5A40] hover:bg-[#5A5A40]/5'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function MobileNavButton({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left py-4 text-xl font-medium text-[#5A5A40] border-b border-[#5A5A40]/5 flex justify-between items-center"
    >
      {label}
      <ChevronRight size={20} className="opacity-40" />
    </button>
  );
}

// --- Sections ---

function HomeSection({ onNavigate }: { onNavigate: (s: Section) => void }) {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative h-[500px] rounded-[40px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" 
          alt="Kuil Jepang" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1 bg-[#5A5A40] text-white text-xs font-bold rounded-full mb-4 tracking-widest uppercase">
              Selamat Datang di Jouzu
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Kuasai Bahasa Jepang <br /> <span className="italic font-light">Langkah demi Langkah.</span>
            </h2>
            <p className="text-white/80 text-lg max-w-xl mb-8 font-sans">
              Materi pembelajaran lengkap untuk JLPT N5 dan N4. Dari kosakata dasar hingga tata bahasa kompleks, kami siap membantu Anda.
            </p>
            <button 
              onClick={() => onNavigate('vocabulary')}
              className="bg-white text-[#1a1a1a] px-8 py-4 rounded-full font-bold hover:bg-[#5A5A40] hover:text-white transition-all flex items-center gap-2 group"
            >
              Mulai Belajar Sekarang
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<LayoutGrid className="text-[#5A5A40]" size={32} />}
          title="Kosakata"
          desc="Pelajari 1000+ kata penting dengan ilustrasi visual dan arti yang jelas."
          onClick={() => onNavigate('vocabulary')}
        />
        <FeatureCard 
          icon={<BookOpen className="text-[#5A5A40]" size={32} />}
          title="Tata Bahasa"
          desc="Kuasai pola kalimat N5-N4 dengan penjelasan detail dan contoh nyata."
          onClick={() => onNavigate('grammar')}
        />
        <FeatureCard 
          icon={<Gamepad2 className="text-[#5A5A40]" size={32} />}
          title="Game Kuis"
          desc="Uji pengetahuan Anda dengan kuis interaktif dan pantau kemajuan Anda."
          onClick={() => onNavigate('quiz')}
        />
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-[40px] p-12 flex flex-col md:flex-row justify-around items-center gap-12 border border-[#5A5A40]/5">
        <StatItem value="100+" label="Poin Tata Bahasa" />
        <StatItem value="800+" label="Kosakata" />
        <StatItem value="200+" label="Kanji" />
        <StatItem value="50+" label="Bacaan Dokkai" />
      </section>
    </div>
  );
}

function ProfileSection({ profile, onNavigate }: { profile: UserProfile | null, onNavigate: (s: Section) => void }) {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-[#5A5A40]/10 rounded-full flex items-center justify-center text-[#5A5A40] mb-6">
          <UserIcon size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Silakan Masuk</h2>
        <p className="text-[#5A5A40]/60 mb-8 max-w-md">Masuk dengan akun Google Anda untuk menyimpan kemajuan belajar dan melihat profil pribadi Anda.</p>
        <button 
          onClick={signInWithGoogle}
          className="px-8 py-3 bg-[#5A5A40] text-white rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <LogIn size={18} />
          Masuk dengan Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-[#5A5A40]/5 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <img src={profile.photoURL} alt="" className="w-32 h-32 rounded-full border-4 border-[#5A5A40]/10" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-2">{profile.displayName}</h2>
          <p className="text-[#5A5A40]/60 mb-6">{profile.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="px-4 py-2 bg-[#f5f5f0] rounded-2xl flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              <span className="text-sm font-bold">Skor Tertinggi: {profile.highScore}</span>
            </div>
            <button 
              onClick={() => logout()}
              className="px-4 py-2 border border-red-100 text-red-500 rounded-2xl flex items-center gap-2 hover:bg-red-50 transition-all text-sm font-bold"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#5A5A40]" />
            Kemajuan Belajar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#f5f5f0] rounded-2xl">
              <span className="font-bold">Level N5</span>
              {profile.completedN5 ? (
                <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">Selesai</span>
              ) : (
                <span className="px-3 py-1 bg-[#5A5A40]/10 text-[#5A5A40]/40 text-[10px] font-bold rounded-full uppercase">Belum</span>
              )}
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f5f5f0] rounded-2xl">
              <span className="font-bold">Level N4</span>
              {profile.completedN4 ? (
                <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">Selesai</span>
              ) : (
                <span className="px-3 py-1 bg-[#5A5A40]/10 text-[#5A5A40]/40 text-[10px] font-bold rounded-full uppercase">Belum</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Bookmark size={20} className="text-[#5A5A40]" />
            Kosakata Disimpan
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.savedWords.length > 0 ? (
              profile.savedWords.map((word, i) => (
                <span key={i} className="px-3 py-1 bg-[#f5f5f0] text-[#5A5A40] rounded-lg text-sm font-medium">{word}</span>
              ))
            ) : (
              <p className="text-[#5A5A40]/40 text-sm italic">Belum ada kosakata yang disimpan.</p>
            )}
          </div>
          <button 
            onClick={() => onNavigate('vocabulary')}
            className="mt-6 text-sm font-bold text-[#5A5A40] hover:underline"
          >
            Cari kosakata baru →
          </button>
        </div>
      </div>
    </div>
  );
}

function GeminiChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Halo! Saya asisten AI Jouzu. Ada yang bisa saya bantu dalam belajar bahasa Jepang hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Anda adalah asisten guru bahasa Jepang yang membantu pengguna belajar mandiri. Jawab dalam bahasa Indonesia. Bantu jelaskan kosakata, tata bahasa N5-N4, atau berikan contoh percakapan. Tetap ramah dan edukatif."
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini." }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-[40px] border border-[#5A5A40]/5 shadow-sm overflow-hidden">
      <div className="p-6 bg-[#5A5A40] text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="font-bold">Asisten AI Jouzu</h2>
          <p className="text-xs text-white/60">Tanyakan apa saja tentang bahasa Jepang!</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfcfb]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${
              msg.role === 'user' 
                ? 'bg-[#5A5A40] text-white rounded-br-none' 
                : 'bg-[#f5f5f0] text-[#1a1a1a] rounded-bl-none border border-[#5A5A40]/5'
            }`}>
              <div className="prose prose-sm prose-stone">
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f5f5f0] p-4 rounded-3xl rounded-bl-none border border-[#5A5A40]/5 flex gap-2">
              <span className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[#5A5A40]/10 bg-white">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan tentang bunpo, kanji, atau kosakata..." 
            className="flex-1 px-6 py-3 bg-[#f5f5f0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none font-sans"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="p-4 bg-[#5A5A40] text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="mb-6 p-4 bg-[#f5f5f0] w-fit rounded-2xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-[#5A5A40]/60 leading-relaxed font-sans">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-[#5A5A40] mb-2">{value}</div>
      <div className="text-xs uppercase tracking-widest text-[#5A5A40]/40 font-bold">{label}</div>
    </div>
  );
}

function VocabularySection({ data, profile }: { data: Vocabulary[], profile: UserProfile | null }) {
  const [search, setSearch] = useState('');
  
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return data.filter(v => 
      v.word.toLowerCase().includes(s) || 
      v.reading.toLowerCase().includes(s) || 
      v.meaning.toLowerCase().includes(s)
    );
  }, [data, search]);

  const toggleSave = async (word: string) => {
    if (!profile) return;
    const isSaved = profile.savedWords.includes(word);
    const userRef = doc(db, 'users', profile.uid);
    try {
      await updateDoc(userRef, {
        savedWords: isSaved ? arrayRemove(word) : arrayUnion(word)
      });
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Daftar Kosakata</h2>
          <p className="text-[#5A5A40]/60">Cari berdasarkan kata, bacaan, atau arti.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/40" size={20} />
          <input 
            type="text" 
            placeholder="Cari kosakata..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#5A5A40]/10 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl overflow-hidden border border-[#5A5A40]/5 hover:shadow-xl transition-all group"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={`https://picsum.photos/seed/${v.imageSeed}/400/300`} 
                alt={v.word} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#5A5A40] text-[10px] font-bold rounded-full uppercase shadow-sm">
                  {v.level}
                </span>
                {profile && (
                  <button 
                    onClick={() => toggleSave(v.word)}
                    className={`p-2 rounded-full shadow-sm transition-all ${
                      profile.savedWords.includes(v.word) 
                        ? 'bg-[#5A5A40] text-white' 
                        : 'bg-white/90 text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white'
                    }`}
                  >
                    <Bookmark size={14} fill={profile.savedWords.includes(v.word) ? "currentColor" : "none"} />
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-2xl font-bold text-[#1a1a1a]">{v.word}</h3>
                <span className="text-[#5A5A40]/60 text-sm font-medium">({v.reading})</span>
              </div>
              <p className="text-[#5A5A40] font-medium">{v.meaning}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-[#5A5A40]/20">
          <p className="text-[#5A5A40]/40 italic">Tidak ada kosakata yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}

function KanjiSection({ data }: { data: Kanji[] }) {
  const [search, setSearch] = useState('');
  const [minStrokes, setMinStrokes] = useState<number | ''>('');
  const [maxStrokes, setMaxStrokes] = useState<number | ''>('');

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return data.filter(k => {
      const matchesSearch = k.character.includes(s) || 
                            k.meaning.toLowerCase().includes(s) || 
                            k.onyomi.toLowerCase().includes(s) || 
                            k.kunyomi.toLowerCase().includes(s) ||
                            (k.radical && k.radical.includes(s));
      
      const matchesMin = minStrokes === '' || k.strokes >= minStrokes;
      const matchesMax = maxStrokes === '' || k.strokes <= maxStrokes;
      
      return matchesSearch && matchesMin && matchesMax;
    });
  }, [data, search, minStrokes, maxStrokes]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Daftar Kanji</h2>
          <p className="text-[#5A5A40]/60">Cari berdasarkan karakter, arti, bacaan, radikal, atau jumlah goresan.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/40" size={18} />
            <input 
              type="text" 
              placeholder="Cari kanji/arti/radikal..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#5A5A40]/10 rounded-xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              value={minStrokes}
              onChange={(e) => setMinStrokes(e.target.value ? parseInt(e.target.value) : '')}
              className="w-16 px-2 py-2 bg-white border border-[#5A5A40]/10 rounded-xl text-sm outline-none"
            />
            <span className="text-[#5A5A40]/40">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxStrokes}
              onChange={(e) => setMaxStrokes(e.target.value ? parseInt(e.target.value) : '')}
              className="w-16 px-2 py-2 bg-white border border-[#5A5A40]/10 rounded-xl text-sm outline-none"
            />
            <span className="text-xs text-[#5A5A40]/60 font-medium">Goresan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-[#5A5A40]/5 flex gap-6 items-center">
            <div className="w-20 h-20 bg-[#f5f5f0] rounded-2xl flex items-center justify-center text-4xl font-bold text-[#5A5A40]">
              {item.character}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{item.meaning}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#5A5A40]/10 rounded text-[#5A5A40]">{item.level}</span>
              </div>
              <div className="text-sm">
                <span className="text-[#5A5A40]/40 font-bold mr-2 uppercase text-[10px]">On:</span>
                <span className="font-sans text-[#5A5A40]">{item.onyomi}</span>
              </div>
              <div className="text-sm">
                <span className="text-[#5A5A40]/40 font-bold mr-2 uppercase text-[10px]">Kun:</span>
                <span className="font-sans text-[#5A5A40]">{item.kunyomi}</span>
              </div>
              <div className="text-xs pt-1 border-t border-[#5A5A40]/5 flex gap-3">
                <p><span className="text-[#5A5A40]/40 font-bold">Goresan:</span> {item.strokes}</p>
                {item.radical && <p><span className="text-[#5A5A40]/40 font-bold">Radikal:</span> {item.radical}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarSection({ data }: { data: Grammar[] }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return data.filter(g => 
      g.pattern.toLowerCase().includes(s) || 
      g.explanation.toLowerCase().includes(s) || 
      g.example.toLowerCase().includes(s) ||
      g.exampleTranslation.toLowerCase().includes(s)
    );
  }, [data, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tata Bahasa (Bunpo)</h2>
          <p className="text-[#5A5A40]/60">Pelajari pola kalimat dengan penjelasan dan contoh.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/40" size={20} />
          <input 
            type="text" 
            placeholder="Cari pola atau contoh..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#5A5A40]/10 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-bold text-[#5A5A40]">{item.pattern}</h3>
              <span className="px-3 py-1 bg-[#5A5A40] text-white text-xs font-bold rounded-full">{item.level}</span>
            </div>
            <p className="text-lg mb-6 font-sans text-[#5A5A40]/80">{item.explanation}</p>
            <div className="bg-[#f5f5f0] p-6 rounded-2xl border-l-4 border-[#5A5A40]">
              <div className="text-xl font-bold mb-2">{item.example}</div>
              <div className="text-[#5A5A40]/60 italic font-sans">{item.exampleTranslation}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadingSection({ data }: { data: Reading[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2">Reading (Dokkai)</h2>
        <p className="text-[#5A5A40]/60 italic">Improve your comprehension with short stories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            className={`bg-white p-8 rounded-[40px] border transition-all cursor-pointer ${
              selected === idx ? 'border-[#5A5A40] ring-4 ring-[#5A5A40]/5' : 'border-[#5A5A40]/5 hover:border-[#5A5A40]/20'
            }`}
            onClick={() => setSelected(selected === idx ? null : idx)}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <span className="text-xs font-bold px-3 py-1 bg-[#f5f5f0] rounded-full text-[#5A5A40]">{item.level}</span>
            </div>
            <p className="text-xl leading-relaxed mb-8 text-[#1a1a1a]">{item.content}</p>
            
            <AnimatePresence>
              {selected === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-[#5A5A40]/10">
                    <p className="text-[#5A5A40]/60 italic font-sans leading-relaxed">
                      {item.translation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-4 text-xs text-[#5A5A40]/40 font-bold uppercase tracking-widest">
              {selected === idx ? 'Click to hide translation' : 'Click to show translation'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversationSection({ data }: { data: Conversation[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold mb-2">Conversation (Kaiwa)</h2>
        <p className="text-[#5A5A40]/60 italic">Real-life scenarios and dialogues.</p>
      </div>

      <div className="space-y-12">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[40px] border border-[#5A5A40]/5 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-bold">{item.title}</h3>
              <span className="px-4 py-1 bg-[#5A5A40] text-white text-xs font-bold rounded-full">{item.level}</span>
            </div>
            
            <div className="space-y-8">
              {item.dialogue.map((line, lIdx) => (
                <div key={lIdx} className={`flex flex-col ${lIdx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                  <div className={`max-w-[80%] p-6 rounded-3xl ${
                    lIdx % 2 === 0 
                      ? 'bg-[#f5f5f0] rounded-bl-none border-l-4 border-[#5A5A40]' 
                      : 'bg-[#5A5A40] text-white rounded-br-none'
                  }`}>
                    <div className={`text-xs font-bold mb-2 uppercase tracking-widest ${lIdx % 2 === 0 ? 'text-[#5A5A40]/40' : 'text-white/40'}`}>
                      {line.speaker}
                    </div>
                    <div className="text-lg font-medium mb-2">{line.text}</div>
                    <div className={`text-sm italic font-sans ${lIdx % 2 === 0 ? 'text-[#5A5A40]/60' : 'text-white/60'}`}>
                      {line.translation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashcardsSection({ data }: { data: Vocabulary[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const next = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 150);
  };

  const prev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    }, 150);
  };

  const current = data[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">Flashcards</h2>
        <p className="text-[#5A5A40]/60 italic">Flip to see the meaning.</p>
      </div>

      <div className="relative w-full max-w-md h-96 perspective-1000">
        <motion.div
          className="w-full h-full relative transition-all duration-500 preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] border-2 border-[#5A5A40]/10 shadow-xl flex flex-col items-center justify-center p-12 text-center">
            <div className="text-sm text-[#5A5A40]/40 mb-4 uppercase tracking-widest font-bold">Word</div>
            <div className="text-6xl font-bold text-[#5A5A40] mb-4">{current.word}</div>
            <div className="text-xl text-[#5A5A40]/60">{current.reading}</div>
            <div className="absolute bottom-8 text-[10px] text-[#5A5A40]/20 font-bold uppercase tracking-[0.3em]">Click to Flip</div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-[#5A5A40] rounded-[40px] shadow-xl flex flex-col items-center justify-center p-12 text-center text-white"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="text-sm text-white/40 mb-4 uppercase tracking-widest font-bold">Meaning</div>
            <div className="text-4xl font-bold mb-8">{current.meaning}</div>
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20">
              <img 
                src={`https://picsum.photos/seed/${current.imageSeed}/200/200`} 
                alt="Illustration" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-8 text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">Click to Flip</div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-8">
        <button onClick={prev} className="p-4 bg-white rounded-full border border-[#5A5A40]/10 hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <div className="text-sm font-bold text-[#5A5A40]/40">
          {currentIndex + 1} / {data.length}
        </div>
        <button onClick={next} className="p-4 bg-white rounded-full border border-[#5A5A40]/10 hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

function QuizSection({ vocab, kanji, profile }: { vocab: Vocabulary[], kanji: Kanji[], profile: UserProfile | null }) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestions = () => {
    const allItems = [...vocab.map(v => ({ q: v.word, a: v.meaning, type: 'vocab' })), ...kanji.map(k => ({ q: k.character, a: k.meaning, type: 'kanji' }))];
    const shuffled = [...allItems].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const qs = shuffled.map(item => {
      const distractors = allItems
        .filter(i => i.a !== item.a)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(i => i.a);
      
      return {
        question: item.q,
        answer: item.a,
        options: [item.a, ...distractors].sort(() => Math.random() - 0.5)
      };
    });
    
    setQuestions(qs);
    setScore(0);
    setCurrentQuestion(0);
    setGameState('playing');
  };

  const handleAnswer = async (option: string) => {
    if (feedback) return;

    let newScore = score;
    if (option === questions[currentQuestion].answer) {
      newScore = score + 10;
      setScore(newScore);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(async () => {
      setFeedback(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameState('end');
        if (profile && newScore > profile.highScore) {
          const userRef = doc(db, 'users', profile.uid);
          try {
            await updateDoc(userRef, { highScore: newScore });
          } catch (error) {
            console.error("Error updating high score:", error);
          }
        }
      }
    }, 1000);
  };

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="w-24 h-24 bg-[#5A5A40] rounded-3xl flex items-center justify-center text-white mb-4">
          <Gamepad2 size={48} />
        </div>
        <h2 className="text-5xl font-bold">Japanese Mastery Quiz</h2>
        <p className="text-[#5A5A40]/60 max-w-md mx-auto italic">
          Test your knowledge of N5-N4 vocabulary and kanji. 10 questions, 10 points each. Ready?
        </p>
        <button 
          onClick={generateQuestions}
          className="px-12 py-4 bg-[#5A5A40] text-white rounded-full font-bold text-xl hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <Trophy size={64} />
        </motion.div>
        <div>
          <h2 className="text-5xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-[#5A5A40]/40 font-bold uppercase tracking-widest">Your Final Score</p>
        </div>
        <div className="text-8xl font-bold text-[#5A5A40]">{score}</div>
        <div className="flex gap-4">
          <button 
            onClick={generateQuestions}
            className="px-8 py-3 bg-[#5A5A40] text-white rounded-full font-bold hover:shadow-lg transition-all"
          >
            Play Again
          </button>
          <button 
            onClick={() => setGameState('start')}
            className="px-8 py-3 bg-white border border-[#5A5A40]/10 rounded-full font-bold hover:bg-[#f5f5f0] transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-[#5A5A40]/40 uppercase tracking-widest">
          Question {currentQuestion + 1} / {questions.length}
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" />
          <span className="text-xl font-bold text-[#5A5A40]">{score}</span>
        </div>
      </div>

      <div className="w-full h-2 bg-[#f0f0e8] rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[#5A5A40]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white p-12 rounded-[40px] border border-[#5A5A40]/5 shadow-sm text-center relative overflow-hidden">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm ${
                feedback === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <div className={`text-4xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {feedback === 'correct' ? 'Correct! ✨' : 'Incorrect ❌'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-sm text-[#5A5A40]/40 mb-4 uppercase tracking-widest font-bold">What is the meaning of:</div>
        <div className="text-7xl font-bold text-[#5A5A40] mb-12">{q.question}</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {q.options.map((opt: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback}
              className={`p-6 rounded-2xl border-2 text-lg font-medium transition-all text-left flex justify-between items-center group ${
                feedback && opt === q.answer 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : feedback === 'wrong' && opt !== q.answer 
                    ? 'border-red-100 opacity-50'
                    : 'border-[#5A5A40]/5 hover:border-[#5A5A40] hover:bg-[#5A5A40]/5'
              }`}
            >
              {opt}
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
