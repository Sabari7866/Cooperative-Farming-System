import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useI18n } from '../utils/i18n';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export default function FloatingChatbot() {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I'm your AgriSmart AI Assistant. I can help you with agriculture, farming, and dashboard features. Ask me about crops, irrigation, fertilizers, pests, or how to use the dashboard!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    // Prefer local proxy at /api/ai
    const proxyUrl = import.meta.env.VITE_AI_PROXY_URL || '/api/ai';
    try {
      const r = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, messages, locale }),
      });

      if (r.ok) {
        const j = await r.json();
        const reply = j?.reply || (typeof j === 'string' ? j : JSON.stringify(j));
        setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('AI proxy request failed, using fallback', err);
    }

    // Fallback to local responder
    const reply = getLocalResponse(text, locale);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 group"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AgriSmart AI</h3>
                <p className="text-xs text-green-100">Agriculture & Dashboard Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    m.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about farming, crops, or dashboard..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              AI answers agriculture & dashboard questions only
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Local fallback responder with agriculture/dashboard focus
function getLocalResponse(question: string, locale: string = 'en'): string {
  const q = question.toLowerCase();
  const isTa = locale === 'ta';
  const isHi = locale === 'hi';

  // Check if question is agriculture/dashboard related
  const agriKeywords = [
    'crop',
    'farm',
    'soil',
    'fertilizer',
    'irrigation',
    'pest',
    'disease',
    'harvest',
    'plant',
    'seed',
    'rice',
    'wheat',
    'water',
    'land',
    'dashboard',
    'profile',
    'worker',
    'resource',
  ];
  const isRelated = agriKeywords.some((keyword) => q.includes(keyword));

  if (!isRelated) {
    if (isTa) {
      return 'மன்னிக்கவும், நான் விவசாயம், பண்ணை மேலாண்மை மற்றும் டாஷ்போர்டு அம்சங்கள் தொடர்பான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும். தயவுசெய்து பயிர்கள், நீர்ப்பாசனம், உரங்கள், பூச்சிகள் அல்லது டாஷ்போர்டு பயன்பாடு பற்றி கேளுங்கள்.';
    } else if (isHi) {
      return 'क्षमा करें, मैं केवल कृषि, खेती और डैशबोर्ड सुविधाओं से संबंधित प्रश्नों का उत्तर दे सकता हूं। कृपया फसलों, सिंचाई, उर्वरकों, कीटों या डैशबोर्ड उपयोग के बारे में पूछें।';
    }
    return "I'm sorry, but I can only answer questions related to agriculture, farming, and dashboard features. Please ask me about crops, irrigation, fertilizers, pests, farm management, or how to use the dashboard features.";
  }

  // Agriculture-specific responses
  if (/fertilizer|npk|urea|fertiliser/i.test(q)) {
    if (isTa) {
      return 'அரிசிக்கு பரிந்துரைக்கப்படும் உர பயன்பாட்டு திட்டம்:\n\n- ஆதாரமாகப் போடுதல்: 50-60 kg N/ha, 20-30 kg P2O5/ha, 20-30 kg K2O/ha\n- N-ஐ பிரித்து: 1/3 ஆதாரமாக, 1/3 தழைக்கும் காலத்தில், 1/3 மூட்டிக்காலத்தில்\n- மைக்ரோநியமங்கள்: மண் பரிசோதனையைப் பின்பற்றவும்';
    } else if (isHi) {
      return 'चावल के लिए अनुशंसित उर्वरक योजना:\n\n- बेसल: 50-60 kg N/ha, 20-30 kg P2O5/ha, 20-30 kg K2O/ha\n- N को विभाजित करें: 1/3 बेसल, 1/3 टिलरिंग पर, 1/3 पैनिकल पर\n- सूक्ष्म पोषक तत्व: मिट्टी परीक्षण का पालन करें';
    }
    return 'Recommended fertilizer for rice:\n\n- Basal: 50-60 kg N/ha, 20-30 kg P2O5/ha, 20-30 kg K2O/ha\n- Split N: 1/3 basal, 1/3 at tillering, 1/3 at panicle initiation\n- Micronutrients: Follow soil test recommendations';
  }

  if (/irrigation|water|drip/i.test(q)) {
    if (isTa) {
      return 'அரிசி நீர் மேலாண்மை:\n\n- 2-3 செமி நிற்மல நீரை பராமரிக்கவும்\n- மூட்டிக்காலம் மற்றும் மலர்ச்சி நேரத்தில் நீர் பாழ்ச்சி தவிர்க்கவும்\n- அறுவடைக்கு 10-14 நாட்கள் முன் நீரை இறக்கு';
    } else if (isHi) {
      return 'चावल जल प्रबंधन:\n\n- 2-3 सेमी खड़े पानी बनाए रखें\n- पैनिकल और फूल के दौरान पानी की कमी से बचें\n- कटाई से 10-14 दिन पहले पानी निकालें';
    }
    return 'Rice irrigation:\n\n- Maintain 2-3 cm standing water\n- Avoid water stress during panicle initiation and flowering\n- Drain fields 10-14 days before harvest';
  }

  if (/pest|disease|insect/i.test(q)) {
    if (isTa) {
      return 'பூச்சி மேலாண்மை:\n\n- வாரம் ஒரு முறை கண்காணிப்பு\n- பறவை எதிர்ப்பு வகைகள் பயன்படுத்தவும்\n- நீம எண்ணெய் (2-5 ml/L) பயன்படுத்தவும்';
    } else if (isHi) {
      return 'कीट प्रबंधन:\n\n- साप्ताहिक निगरानी करें\n- प्रतिरोधी किस्मों का उपयोग करें\n- नीम तेल (2-5 ml/L) का उपयोग करें';
    }
    return 'Pest management:\n\n- Scout weekly during critical stages\n- Use resistant varieties\n- Apply neem oil (2-5 ml/L) for minor pests';
  }

  if (/dashboard|profile|worker|resource/i.test(q)) {
    if (isTa) {
      return 'டாஷ்போர்டு உதவி:\n\n- உங்கள் நிலங்கள், பயிர்கள் மற்றும் தொழிலாளர்களை நிர்வகிக்கவும்\n- வளங்களைப் பகிரவும்\n- AI ஆலோசகரைப் பயன்படுத்தவும்\n- அறிக்கைகளை CSV ஆக ஏற்றுமதி செய்யவும்';
    } else if (isHi) {
      return 'डैशबोर्ड सहायता:\n\n- अपनी भूमि, फसलें और कर्मचारियों को प्रबंधित करें\n- संसाधन साझा करें\n- AI सलाहकार का उपयोग करें\n- रिपोर्ट को CSV में निर्यात करें';
    }
    return 'Dashboard help:\n\n- Manage your lands, crops, and workers\n- Share resources with other farmers\n- Use AI advisor for crop guidance\n- Export reports as CSV';
  }

  // Generic response
  if (isTa) {
    return 'நான் விவசாயம் மற்றும் டாஷ்போர்டு அம்சங்கள் பற்றி உதவ முடியும். தயவுசெய்து தெளிவாக கேளுங்கள்.';
  } else if (isHi) {
    return 'मैं कृषि और डैशबोर्ड सुविधाओं के बारे में मदद कर सकता हूं। कृपया स्पष्ट रूप से पूछें।';
  }
  return 'I can help with agriculture and dashboard features. Please ask specifically about crops, irrigation, fertilizers, pests, or dashboard usage.';
}
