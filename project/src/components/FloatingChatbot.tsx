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
      text: "🌾 Hello! I'm your AgriSmart AI Assistant with web search capabilities.\n\nI can help you with:\n✅ Crop management & diseases\n✅ Fertilizers & soil health\n✅ Pest control & IPM\n✅ Irrigation techniques\n✅ Weather-based advice\n✅ Dashboard features\n\nAsk me anything about agriculture! I'll search the web for the latest information when connected to the API.",
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

    // Try backend API with better error handling
    const apiUrl = import.meta.env.VITE_AI_PROXY_URL || 'http://localhost:3001/api/ai';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, messages, locale }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.reply || (typeof data === 'string' ? data : JSON.stringify(data));

        // Add source indicator if available
        let fullReply = reply;
        if (data.source === 'gemini-ai-web-search') {
          fullReply = `${reply}\n\n✨ Powered by AI with web search`;
        } else if (data.source === 'local-knowledge-base') {
          fullReply = `${reply}`;
        }

        setMessages((prev) => [...prev, { role: 'assistant', text: fullReply }]);
        setLoading(false);
        return;
      } else {
        console.warn('API returned non-OK status:', response.status);
      }
    } catch (err) {
      console.warn('Backend API request failed:', err);
    }

    // Fallback to local responder (always available)
    const reply = getLocalResponse(text, locale);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: `${reply}\n\n⚠️ Using offline mode. Connect to backend for web-powered AI.`
      }]);
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
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.role === 'user'
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

// Enhanced local AI responder with intelligent agriculture/dashboard knowledge
function getLocalResponse(question: string, locale: string = 'en'): string {
  const q = question.toLowerCase();
  const isTa = locale === 'ta';
  const isHi = locale === 'hi';

  // Check if question is agriculture/dashboard related
  const agriKeywords = [
    'crop', 'farm', 'soil', 'fertilizer', 'irrigation', 'pest', 'disease',
    'harvest', 'plant', 'seed', 'rice', 'wheat', 'cotton', 'corn', 'sugarcane',
    'soybean', 'water', 'land', 'dashboard', 'profile', 'worker', 'resource',
    'grow', 'yield', 'sowing', 'weather', 'temperature', 'humidity', 'nitrogen',
    'potassium', 'phosphorus', 'organic', 'compost', 'mulch', 'weed'
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

  // ========== CROP-SPECIFIC ADVICE ==========

  // Rice-specific questions
  if (/rice|paddy/i.test(q)) {
    if (/disease|blast|blight/i.test(q)) {
      return 'Rice diseases and management:\n\n🔬 Common Rice Diseases:\n- Blast Disease: Use Tricyclazole (0.6g/L)\n- Bacterial Leaf Blight: Use copper-based sprays\n- Sheath Blight: Apply Validamycin (2ml/L)\n\n✅ Prevention:\n- Use resistant varieties\n- Maintain proper plant spacing\n- Avoid excess nitrogen\n- Ensure good drainage';
    }
    if (/fertilizer|urea|npk/i.test(q)) {
      return 'Rice fertilizer schedule:\n\n🌱 Basal Application (Before Planting):\n- 60 kg N/ha, 30 kg P₂O₅/ha, 30 kg K₂O/ha\n- Add 25 tons FYM/ha 2-3 weeks before\n\n🌿 Top Dressing:\n- 1st: 30 kg Urea/ha at 20-25 days\n- 2nd: 30 kg Urea/ha at panicle initiation\n\n💡 Tip: Split nitrogen application for better efficiency';
    }
    if (/sowing|planting|transplanting/i.test(q)) {
      return 'Rice planting guide:\n\n📅 Timing: Monsoon onset (June-July)\n\n🌱 Seed Treatment:\n- Soak seeds in water for 24 hours\n- Treat with Carbendazim (2g/kg)\n\n🚜 Transplanting:\n- Age: 21-25 day old seedlings\n- Spacing: 20x15 cm\n- Depth: 2-3 cm\n- 2-3 seedlings per hill\n\n💧 Water: Maintain 2-3 cm standing water';
    }
    return 'Rice cultivation basics:\n\n🌾 Growing Season: 120-150 days\n⏰ Best Time: Kharif (June-November)\n💧 Water: Flooded conditions\n🌡️ Temperature: 20-35°C\n🌍 Soil: Clay or clay loam\n\nAsk me about rice diseases, fertilizers, or specific stages!';
  }

  // Wheat-specific questions
  if (/wheat/i.test(q)) {
    if (/disease|rust|smut/i.test(q)) {
      return 'Wheat disease management:\n\n🦠 Common Diseases:\n- Brown Rust: Spray Propiconazole (0.1%)\n- Yellow Rust: Use resistant varieties\n- Loose Smut: Seed treatment with Vitavax (2.5g/kg)\n\n🛡️ Prevention:\n- Use certified disease-free seeds\n- Proper crop rotation\n- Avoid late sowing\n- Remove infected plants';
    }
    if (/fertilizer/i.test(q)) {
      return 'Wheat fertilizer program:\n\n🌱 Basal (At Sowing):\n- 60 kg N/ha, 30 kg P₂O₅/ha, 20 kg K₂O/ha\n- 10 tons FYM/ha (2-3 weeks before)\n\n🌿 Top Dressing:\n- 1st: 65 kg Urea/ha at CRI stage (20-25 days)\n- 2nd: 65 kg Urea/ha at late jointing (40-45 days)\n\n⚠️ Apply with irrigation for best results';
    }
    return 'Wheat cultivation guide:\n\n🌾 Duration: 120-150 days\n⏰ Season: Rabi (Nov-Apr)\n🌡️ Temperature: 15-20°C ideal\n🌍 Soil: Loamy, well-drained\n💧 Irrigation: 4-6 irrigations needed\n🌱 Seed Rate: 100-125 kg/ha\n\nAsk about wheat diseases, fertilizers, or harvesting!';
  }

  // Cotton-specific questions
  if (/cotton/i.test(q)) {
    if (/pest|bollworm|whitefly/i.test(q)) {
      return 'Cotton pest management:\n\n🐛 Major Pests:\n- Pink Bollworm: Use pheromone traps\n- Whitefly: Yellow sticky traps + neem oil\n- Aphids: Spray imidacloprid (0.3ml/L)\n\n🌿 Integrated Management:\n- Install pheromone traps (4-5/acre)\n- Release natural predators (Trichogramma)\n- Neem oil spray (5ml/L) weekly\n- Avoid excess nitrogen';
    }
    return 'Cotton farming essentials:\n\n🌱 Season: Kharif (April-June sowing)\n⏳ Duration: 150-180 days\n🌡️ Temperature: 21-30°C\n💧 Irrigation: Every 15-20 days\n🌍 Soil: Black cotton soil ideal\n\n💡 Key Stages:\n- Squaring (40-50 days)\n- Flowering (60-80 days)\n- Boll formation (80-100 days)';
  }

  // ========== GENERAL AGRICULTURAL TOPICS ==========

  // Fertilizer questions (general)
  if (/fertilizer|npk|urea|dap|nutrient/i.test(q)) {
    if (/organic/i.test(q)) {
      return 'Organic fertilizer options:\n\n🌿 Farm Yard Manure (FYM):\n- Application: 10-25 tons/ha\n- Rich in NPK + micronutrients\n\n🪱 Vermicompost:\n- Application: 5-8 tons/ha\n- Excellent soil conditioner\n\n🌱 Green Manure:\n- Crops: Sunhemp, Dhaincha\n- Plow in at flowering\n\n🦠 Biofertilizers:\n- Rhizobium (legumes)\n- Azotobacter (cereals)\n- PSB (all crops)';
    }
    return 'NPK Fertilizer guide:\n\n🔵 Nitrogen (N):\n- Promotes leaf growth\n- Sources: Urea, Amm. Sulfate\n- Mobile in soil\n\n🟢 Phosphorus (P):\n- Root development\n- Sources: DAP, SSP\n- Less mobile\n\n🟡 Potassium (K):\n- Disease resistance\n- Sources: MOP, SOP\n\n💡 Soil test before application!';
  }

  // Irrigation questions
  if (/irrigation|water|drip|sprinkler/i.test(q)) {
    if (/drip/i.test(q)) {
      return 'Drip irrigation benefits:\n\n💧 Water Saving: 30-70% less water\n⚡ Energy Saving: Lower pumping costs\n🌱 Better Yield: 20-50% increase\n🎯 Precision: Water directly to roots\n\n🔧 Components:\n- Main line\n- Sub-main line\n- Lateral pipes\n- Drippers/Emitters\n\n✅ Best for: Vegetables, orchard crops, cotton';
    }
    return 'Irrigation methods comparison:\n\n🌊 Flood Irrigation:\n- Traditional method\n- Suitable for rice\n- High water use\n\n💦 Sprinkler:\n- 30-40% water saving\n- Good for wheat, vegetables\n- Uniform distribution\n\n💧 Drip:\n- 50-70% water saving\n- Best efficiency\n- Higher initial cost\n\n🎯 Choose based on crop and water availability';
  }

  // Pest and disease management
  if (/pest|disease|insect|fungus|blight/i.test(q)) {
    if (/organic|natural/i.test(q)) {
      return 'Organic pest control methods:\n\n🌿 Neem-based:\n- Neem oil spray (5ml/L)\n- Neem cake in soil\n- Effective against 200+ pests\n\n🐞 Biological Control:\n- Trichogramma (egg parasitoid)\n- Ladybird beetles (aphid predator)\n- Bacillus thuringiensis (caterpillars)\n\n🌾 Cultural Practices:\n- Crop rotation\n- Intercropping\n- Trap crops\n- Proper sanitation';
    }
    return 'Integrated Pest Management (IPM):\n\n👁️ Monitoring:\n- Weekly field scouting\n- Pheromone traps\n- Yellow/blue sticky traps\n\n🌱 Prevention:\n- Use resistant varieties\n- Proper spacing\n- Balanced nutrition\n- Field sanitation\n\n⚗️ Control:\n- Start with organic methods\n- Use chemicals as last resort\n- Rotate pesticides\n- Follow safety precautions';
  }

  // Soil management
  if (/soil|ph|texture|health/i.test(q)) {
    if (/test|testing/i.test(q)) {
      return 'Soil testing guide:\n\n🔬 What to Test:\n- pH level (6-7.5 ideal for most crops)\n- NPK levels\n- Organic matter content\n- Micronutrients\n\n📅 When:\n- Before cropping season\n- Every 2-3 years\n- When yields decline\n\n📍 How:\n- Collect from 10-15 spots\n- Mix thoroughly\n- 500g sample needed\n- Submit to nearest lab';
    }
    return 'Soil health management:\n\n🌱 Organic Matter:\n- Add FYM/compost regularly\n- Green manuring\n- Crop residue incorporation\n\n🔄 Crop Rotation:\n- Legumes → Cereals\n- Prevents nutrient depletion\n- Breaks pest cycles\n\n🌾 Cover Crops:\n- Protect soil erosion\n- Add nitrogen\n- Improve structure\n\n💧 Avoid waterlogging and over-tillage';
  }

  // Weather-related questions
  if (/weather|rain|temperature|climate/i.test(q)) {
    return 'Weather impact on farming:\n\n🌡️ Temperature:\n- Too high: Heat stress, reduced yield\n- Too low: Frost damage\n- Monitor daily forecasts\n\n🌧️ Rainfall:\n- Critical during flowering\n- Excess: Disease spread\n- Deficit: Use irrigation\n\n💨 Wind:\n- Strong winds: Lodging in tall crops\n- Use windbreaks\n\n📱 Use weather apps and AgriSmart dashboard for forecasts!';
  }

  // Dashboard-specific questions
  if (/dashboard|how to use|feature|profile|worker|land/i.test(q)) {
    if (/worker|hire|labor/i.test(q)) {
      return 'Finding Workers on Dashboard:\n\n👷 Steps:\n1. Go to "Find Workers" section\n2. Use filters (skills, location, gender)\n3. View worker profiles\n4. Send job offers\n5. Track responses\n\n✅ Workers show:\n- Skills & experience\n- Ratings & reviews\n- Availability status\n- Contact information';
    }
    if (/land|add|manage/i.test(q)) {
      return 'Managing Lands on Dashboard:\n\n🌾 Add New Land:\n1. Click "Add Land"\n2. Enter location, area\n3. Select soil type\n4. Add current crops\n5. Set growth stage\n\n📊 View Data:\n- Crop schedules\n- Weather for location\n- AI recommendations\n- Yield predictions';
    }
    if (/ai|advisor|recommendation/i.test(q)) {
      return 'Using AI Crop Advisor:\n\n🤖 Features:\n- Crop-specific advice\n- Growth stage recommendations\n- Weather-based insights\n- Fertilizer schedules\n- Pest alerts\n\n📱 Access:\n1. Select your land\n2. Click "AI Crop Advisor"\n3. Auto-detects crop & stage\n4. Get personalized advice\n5. Download PDF reports';
    }
    return 'AgriSmart Dashboard Features:\n\n🌾 Land Management:\n- Track multiple lands\n- Monitor crop stages\n- Weather integration\n\n👷 Worker Management:\n- Find skilled workers\n- Send job offers\n- View ratings\n\n🤖 AI Advisor:\n- Crop recommendations\n- Pest alerts\n- Fertilizer schedules\n\n🛒 Agro Shops:\n- Find nearby shops\n- Compare prices\n- Check availability\n\nAsk me about specific features!';
  }

  // Harvesting questions
  if (/harvest|harvesting|maturity|ready/i.test(q)) {
    return 'Harvesting best practices:\n\n⏰ Right Time:\n- 80-90% physiological maturity\n- Morning hours (less shattering)\n- Avoid rainy days\n\n🌾 Rice:\n- Golden yellow grains\n- 20-25% moisture\n- Dry to 12-14% before storage\n\n🌾 Wheat:\n- Hard grains\n- 20-22% moisture\n- Immediate threshing\n\n💡 Delayed harvesting = grain loss + quality reduction';
  }

  // Sowing/planting questions
  if (/sow|plant|seed|germination/i.test(q)) {
    return 'Seed sowing guidelines:\n\n🌱 Seed Treatment:\n- Fungicide treatment\n- Bioagent coating\n- Priming (soaking)\n\n📏 Spacing:\n- Proper spacing = better yield\n- Use rope/markers\n- Follow crop-specific guides\n\n🕐 Timing:\n- Check soil moisture\n- Follow crop calendar\n- Weather forecast\n\n🌡️ Depth:\n- Small seeds: 1-2 cm\n- Large seeds: 3-5 cm\n- Rice: 2-3 cm';
  }

  // Default helpful response
  if (isTa) {
    return 'நான் விவசாயம் மற்றும் டாஷ்போர்டு அம்சங்கள் பற்றி உதவ முடியும்! பயிர்கள், உரங்கள், பூச்சிகள், நீர்ப்பாசனம், அல்லது டாஷ்போர்டு பயன்பாடு பற்றி குறிப்பிட்டு கேளுங்கள்.';
  } else if (isHi) {
    return 'मैं कृषि और डैशबोर्ड सुविधाओं के बारे में मदद कर सकता हूं! कृपया फसलों, उर्वरकों, कीटों, सिंचाई या डैशबोर्ड उपयोग के बारे में विशेष रूप से पूछें।';
  }

  return '🌾 I\'m your AgriSmart AI Assistant!\n\nI can help with:\n✅ Crop-specific advice (Rice, Wheat, Cotton, etc.)\n✅ Fertilizer recommendations\n✅ Pest & disease management\n✅ Irrigation techniques\n✅ Soil health\n✅ Dashboard features\n\n💡 Ask me specific questions like:\n- "How to manage rice blast disease?"\n- "Fertilizer schedule for wheat?"\n- "How to use drip irrigation?"\n- "How to add land in dashboard?"';
}
