import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  BookOpen,
} from 'lucide-react';


interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'copilot';
  text: string;
  citations?: string[];
  actions?: string[];
}

export const AnalyticsCopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'copilot',
      text: 'Hello! I am CarbonX AI Copilot. Ask me anything about CO₂ purity standards, freight tariffs, pathway compatibility, or ISO 14064 calculations.',
      citations: ['CarbonX Platform Knowledge Base v1.4'],
      actions: ['Explore Stream Discovery', 'Run Match Engine'],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let replyText =
        'CarbonX deterministic engines calculate net carbon avoidance using ISO 14064 standards. Higher purity (98%+) reduces pre-treatment energy consumption by up to 35%.';
      let citations = ['ASTM C494 CO2 Curing Standard', 'Gujarat Logistics Matrix 2026'];
      let actions = ['Calculate Landed Cost', 'View Mineralization Pathways'];

      if (userMsg.toLowerCase().includes('purity') || userMsg.toLowerCase().includes('concrete')) {
        replyText =
          'For concrete mineralization, a minimum CO₂ purity of 90.0% is required. Higher purity (98%+) reduces pre-treatment energy consumption by up to 35% and increases compressive strength gain.';
      } else if (userMsg.toLowerCase().includes('cost') || userMsg.toLowerCase().includes('freight')) {
        replyText =
          'Regional cryogenic tanker freight tariffs average ₹3.5 / ton-km within Gujarat industrial corridors. For distances under 50 km, transport adds less than ₹300/ton to base CO₂ reserve pricing.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'copilot', text: replyText, citations, actions },
      ]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    CarbonX AI Copilot
                  </h2>
                  <p className="text-[10px] text-slate-500">Grounded Ground-Truth CCUS Intelligence</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Conversation Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'copilot' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.citations && (
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center space-x-1 rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            <BookOpen className="h-2.5 w-2.5" />
                            <span>{c}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Bot className="h-4 w-4 animate-bounce text-emerald-600" />
                  <span>Consulting CCUS deterministic engines...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts & Input Bar */}
            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <div className="mb-2 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setQuery('What is the purity requirement for concrete mineralization?')}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  Concrete Purity?
                </button>
                <button
                  onClick={() => setQuery('What are regional freight tariffs per ton-km?')}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  Freight Tariffs?
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Copilot about stream matching, tariffs..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-2 rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
