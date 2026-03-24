import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Star, 
  Trophy, 
  Smile, 
  Frown, 
  AlertCircle, 
  Sun, 
  ArrowLeft, 
  CheckCircle2, 
  Play,
  Lock,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { cn } from './lib/utils';
import { WorldId, Level, GameState } from './types';

// --- Components ---

const StartScreen = ({ onStart }: { onStart: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    className="flex flex-col items-center text-center max-w-2xl px-6 relative z-10"
  >
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="mb-8"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-400 blur-3xl opacity-20 rounded-full animate-pulse" />
        <Heart className="w-32 h-32 text-indigo-600 relative z-10" fill="currentColor" />
      </div>
    </motion.div>
    
    <h1 className="text-6xl font-black text-indigo-900 mb-4 drop-shadow-sm">رحلة المشاعر</h1>
    <p className="text-2xl text-slate-600 mb-8 font-semibold">
      استكشف عوالم المشاعر وتعلم كيف تتعامل معها بذكاء!
    </p>
    
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl mb-12 border border-indigo-100">
      <p className="text-lg text-indigo-800 font-bold">بإشراف المعلمة: اشيرة قرابصة</p>
    </div>

    <button 
      onClick={onStart}
      className="group relative flex items-center gap-3 px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-3xl shadow-[0_10px_0_0_rgba(49,46,129,1)] hover:shadow-[0_5px_0_0_rgba(49,46,129,1)] hover:translate-y-1 active:translate-y-2 transition-all cursor-pointer"
    >
      ابدأ الرحلة
      <Play className="w-8 h-8 fill-current" />
    </button>
  </motion.div>
);

const WorldMap = ({ 
  levels, 
  onSelectWorld, 
  stars 
}: { 
  levels: Level[], 
  onSelectWorld: (id: WorldId) => void,
  stars: number,
  key?: string
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full max-w-5xl px-6 relative z-10"
  >
    <div className="flex justify-between items-center mb-12">
      <h2 className="text-4xl font-black text-slate-800">خارطة المشاعر</h2>
      <div className="flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-2xl border-2 border-yellow-400">
        <Star className="w-8 h-8 text-yellow-500 fill-current" />
        <span className="text-3xl font-black text-yellow-700">{stars}</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {levels.map((level, idx) => (
        <motion.button
          key={level.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          disabled={!level.unlocked}
          onClick={() => onSelectWorld(level.id)}
          className={cn(
            "relative group flex flex-col items-center p-8 rounded-[2.5rem] transition-all duration-300",
            level.unlocked 
              ? "bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-b-8" 
              : "bg-slate-200 opacity-70 grayscale cursor-not-allowed border-b-8 border-slate-300",
            level.unlocked && level.color === 'yellow' && "border-yellow-500",
            level.unlocked && level.color === 'blue' && "border-blue-500",
            level.unlocked && level.color === 'red' && "border-red-500",
            level.unlocked && level.color === 'green' && "border-green-500",
          )}
        >
          <div className={cn(
            "w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
            level.color === 'yellow' && "bg-yellow-100 text-yellow-600",
            level.color === 'blue' && "bg-blue-100 text-blue-600",
            level.color === 'red' && "bg-red-100 text-red-600",
            level.color === 'green' && "bg-green-100 text-green-600",
          )}>
            {level.id === 'happiness' && <Smile className="w-14 h-14" />}
            {level.id === 'fear' && <AlertCircle className="w-14 h-14" />}
            {level.id === 'anger' && <Frown className="w-14 h-14" />}
            {level.id === 'hope' && <Sun className="w-14 h-14" />}
          </div>
          
          <h3 className="text-2xl font-black mb-2">{level.title}</h3>
          <p className="text-sm font-bold text-slate-500 text-center leading-relaxed">
            {level.description}
          </p>

          {level.completed && (
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          
          {!level.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 rounded-[2.5rem]">
              <Lock className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// --- Game Worlds ---

const HappinessWorld = ({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) => {
  const [matches, setMatches] = useState<number>(0);
  const total = 4;
  
  const items = [
    { id: 1, emoji: "😊", label: "سعيد" },
    { id: 2, emoji: "🥳", label: "متحمس" },
    { id: 3, emoji: "😌", label: "مرتاح" },
    { id: 4, emoji: "🥰", label: "محب" },
  ];

  const handleMatch = () => {
    if (matches + 1 === total) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(onComplete, 1500);
    }
    setMatches(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
      <div className="flex justify-between items-center w-full mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md hover:bg-slate-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-black text-yellow-600">عالم السعادة</h2>
        <div className="w-12" />
      </div>

      <div className="card w-full text-center mb-8">
        <p className="text-2xl font-bold mb-8">طابق كل شعور باسمه الصحيح!</p>
        <div className="grid grid-cols-2 gap-6">
          {items.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMatch}
              className="p-8 bg-yellow-50 border-2 border-yellow-200 rounded-3xl flex flex-col items-center gap-4 hover:bg-yellow-100 transition-colors cursor-pointer"
            >
              <span className="text-6xl">{item.emoji}</span>
              <span className="text-2xl font-black text-yellow-800">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
        <motion.div 
          className="bg-yellow-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${(matches / total) * 100}%` }}
        />
      </div>
    </div>
  );
};

const FearWorld = ({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0);
  const scenarios = [
    {
      q: "عندما تشعر بالخوف من امتحان قادم، ماذا تفعل؟",
      options: [
        { t: "أهرب من الدراسة وألعب", c: false },
        { t: "أتنفس بعمق وأضع خطة للدراسة", c: true },
        { t: "أبكي وأستسلم", c: false }
      ]
    },
    {
      q: "إذا شعرت بالخوف من الظلام، ما هو التصرف الشجاع؟",
      options: [
        { t: "أطلب من والديّ ترك ضوء خفيف", c: true },
        { t: "أصرخ بصوت عالٍ", c: false },
        { t: "أبقى مستيقظاً طوال الليل", c: false }
      ]
    }
  ];

  const handleChoice = (correct: boolean) => {
    if (correct) {
      if (step + 1 === scenarios.length) {
        confetti({ particleCount: 100, colors: ['#3b82f6'] });
        setTimeout(onComplete, 1500);
      } else {
        setStep(s => s + 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
      <div className="flex justify-between items-center w-full mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md hover:bg-slate-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-black text-blue-600">عالم الخوف</h2>
        <div className="w-12" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="card w-full"
        >
          <p className="text-3xl font-black mb-10 text-center leading-relaxed">
            {scenarios[step].q}
          </p>
          <div className="flex flex-col gap-4">
            {scenarios[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt.c)}
                className="p-6 text-xl font-bold bg-blue-50 border-2 border-blue-100 rounded-2xl hover:bg-blue-100 hover:border-blue-300 transition-all text-right flex items-center justify-between cursor-pointer"
              >
                <span>{opt.t}</span>
                <div className="w-6 h-6 rounded-full border-2 border-blue-300" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const AngerWorld = ({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const strategies = [
    { id: 1, t: "العد حتى عشرة", good: true },
    { id: 2, t: "الصراخ في وجه الآخرين", good: false },
    { id: 3, t: "التنفس ببطء", good: true },
    { id: 4, t: "ضرب الأشياء", good: false },
    { id: 5, t: "الرسم أو الكتابة", good: true },
    { id: 6, t: "الاعتزال قليلاً حتى أهدأ", good: true },
  ];

  const handleSelect = (id: number, good: boolean) => {
    if (!good) return;
    if (selected.includes(id)) return;
    
    const newSelected = [...selected, id];
    setSelected(newSelected);
    
    if (newSelected.length === strategies.filter(s => s.good).length) {
      confetti({ particleCount: 150, colors: ['#ef4444'] });
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
      <div className="flex justify-between items-center w-full mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md hover:bg-slate-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-black text-red-600">عالم الغضب</h2>
        <div className="w-12" />
      </div>

      <div className="card w-full">
        <p className="text-2xl font-bold mb-8 text-center">اختر الطرق الصحيحة للتعامل مع الغضب:</p>
        <div className="grid grid-cols-2 gap-4">
          {strategies.map(s => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id, s.good)}
              className={cn(
                "p-6 text-lg font-black rounded-2xl border-2 transition-all cursor-pointer",
                selected.includes(s.id) 
                  ? "bg-green-500 border-green-600 text-white" 
                  : "bg-red-50 border-red-100 hover:border-red-300 text-red-900"
              )}
            >
              {s.t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HopeWorld = ({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0);
  const questions = [
    { q: "الأمل يعني أن نثق بأن القادم أفضل.", a: true },
    { q: "الفشل هو نهاية الطريق ولا يمكننا المحاولة مرة أخرى.", a: false },
    { q: "يمكننا دائماً تعلم أشياء جديدة حتى لو كانت صعبة.", a: true }
  ];

  const handleAnswer = (ans: boolean) => {
    if (ans === questions[step].a) {
      if (step + 1 === questions.length) {
        confetti({ particleCount: 200, colors: ['#10b981', '#fbbf24'] });
        setTimeout(onComplete, 1500);
      } else {
        setStep(s => s + 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
      <div className="flex justify-between items-center w-full mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md hover:bg-slate-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-black text-green-600">عالم الأمل</h2>
        <div className="w-12" />
      </div>

      <div className="card w-full text-center">
        <div className="mb-10">
          <Sparkles className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-3xl font-black leading-relaxed">{questions[step].q}</p>
        </div>
        
        <div className="flex gap-6 justify-center">
          <button 
            onClick={() => handleAnswer(true)}
            className="flex-1 py-6 bg-green-500 text-white rounded-3xl font-black text-2xl shadow-[0_8px_0_0_rgba(21,128,61,1)] hover:translate-y-1 active:translate-y-2 transition-all cursor-pointer"
          >
            صح
          </button>
          <button 
            onClick={() => handleAnswer(false)}
            className="flex-1 py-6 bg-red-500 text-white rounded-3xl font-black text-2xl shadow-[0_8px_0_0_rgba(185,28,28,1)] hover:translate-y-1 active:translate-y-2 transition-all cursor-pointer"
          >
            خطأ
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryScreen = ({ score, onRestart }: { score: number, onRestart: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="card flex flex-col items-center text-center max-w-xl w-full mx-6 relative z-10"
  >
    <Trophy className="w-24 h-24 text-yellow-500 mb-6" />
    <h2 className="text-5xl font-black text-indigo-900 mb-4">أحسنت يا بطل!</h2>
    <p className="text-2xl font-bold text-slate-600 mb-8">لقد أكملت رحلة المشاعر بنجاح.</p>
    
    <div className="bg-indigo-50 w-full p-8 rounded-3xl mb-8">
      <p className="text-lg font-bold text-indigo-800 mb-2">نقاطك الإجمالية</p>
      <p className="text-6xl font-black text-indigo-600">{score}</p>
    </div>

    <div className="text-right w-full mb-10 space-y-4">
      <h3 className="text-xl font-black text-slate-800">تذكر دائماً:</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-slate-600 font-bold">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>كل المشاعر طبيعية ومهمة.</span>
        </li>
        <li className="flex items-center gap-2 text-slate-600 font-bold">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>التحدث عن مشاعرك يجعلك أقوى.</span>
        </li>
        <li className="flex items-center gap-2 text-slate-600 font-bold">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>أنت تملك القدرة على التحكم في ردود أفعالك.</span>
        </li>
      </ul>
    </div>

    <p className="italic text-indigo-600 font-bold mb-8">
      "ماذا تعلمت عن مشاعرك اليوم؟"
    </p>

    <button 
      onClick={onRestart}
      className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-2xl shadow-lg hover:bg-indigo-700 transition-all cursor-pointer"
    >
      العب مرة أخرى
      <RefreshCcw className="w-6 h-6" />
    </button>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'start' | 'map' | 'game' | 'summary'>('start');
  const [gameState, setGameState] = useState<GameState>({
    currentWorld: null,
    score: 0,
    stars: 0,
    completedWorlds: [],
    isGameOver: false
  });

  const [levels, setLevels] = useState<Level[]>([
    { id: 'happiness', title: 'عالم السعادة', description: 'تعرف على مسببات الفرح', color: 'yellow', icon: 'smile', unlocked: true, completed: false },
    { id: 'fear', title: 'عالم الخوف', description: 'واجه مخاوفك بشجاعة', color: 'blue', icon: 'alert', unlocked: false, completed: false },
    { id: 'anger', title: 'عالم الغضب', description: 'تحكم في هدوئك', color: 'red', icon: 'frown', unlocked: false, completed: false },
    { id: 'hope', title: 'عالم الأمل', description: 'انظر للمستقبل بتفاؤل', color: 'green', icon: 'sun', unlocked: false, completed: false },
  ]);

  useEffect(() => {
    console.log("App mounted. Screen:", screen);
  }, [screen]);

  const handleStart = () => {
    console.log("Starting game...");
    setScreen('map');
  };

  const selectWorld = (id: WorldId) => {
    console.log("Selecting world:", id);
    setGameState(prev => ({ ...prev, currentWorld: id }));
    setScreen('game');
  };

  const completeWorld = () => {
    const currentId = gameState.currentWorld!;
    console.log("Completing world:", currentId);
    
    setGameState(prev => {
      const newCompleted = [...prev.completedWorlds, currentId];
      const isLast = newCompleted.length === levels.length;
      
      return {
        ...prev,
        score: prev.score + 100,
        stars: prev.stars + 1,
        completedWorlds: newCompleted,
        currentWorld: null,
        isGameOver: isLast
      };
    });

    setLevels(prev => {
      const updated = prev.map(l => l.id === currentId ? { ...l, completed: true } : l);
      const nextIdx = updated.findIndex(l => l.id === currentId) + 1;
      if (nextIdx < updated.length) {
        updated[nextIdx].unlocked = true;
      }
      return updated;
    });

    setScreen('map');
  };

  useEffect(() => {
    if (gameState.isGameOver) {
      console.log("Game over! Showing summary.");
      setTimeout(() => setScreen('summary'), 1000);
    }
  }, [gameState.isGameOver]);

  const restart = () => {
    console.log("Restarting game...");
    setGameState({
      currentWorld: null,
      score: 0,
      stars: 0,
      completedWorlds: [],
      isGameOver: false
    });
    setLevels(prev => prev.map((l, i) => ({ ...l, completed: false, unlocked: i === 0 })));
    setScreen('start');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center overflow-x-hidden relative" style={{ direction: 'rtl' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-indigo-100/30 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-yellow-100/30 rounded-full blur-3xl" 
        />
      </div>

      <AnimatePresence mode="wait">
        {screen === 'start' && <StartScreen key="start" onStart={handleStart} />}
        
        {screen === 'map' && (
          <WorldMap 
            key="map" 
            levels={levels} 
            onSelectWorld={selectWorld} 
            stars={gameState.stars}
          />
        )}

        {screen === 'game' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex justify-center px-6 relative z-10"
          >
            {gameState.currentWorld === 'happiness' && (
              <HappinessWorld onComplete={completeWorld} onBack={() => setScreen('map')} />
            )}
            {gameState.currentWorld === 'fear' && (
              <FearWorld onComplete={completeWorld} onBack={() => setScreen('map')} />
            )}
            {gameState.currentWorld === 'anger' && (
              <AngerWorld onComplete={completeWorld} onBack={() => setScreen('map')} />
            )}
            {gameState.currentWorld === 'hope' && (
              <HopeWorld onComplete={completeWorld} onBack={() => setScreen('map')} />
            )}
          </motion.div>
        )}

        {screen === 'summary' && (
          <SummaryScreen 
            key="summary" 
            score={gameState.score} 
            onRestart={restart} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 mb-6 text-slate-400 font-bold text-sm relative z-10">
        بإشراف المعلمة اشيرة قرابصة &copy; 2026
      </div>
    </div>
  );
}
