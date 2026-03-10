import React from 'react';
import { useI18n } from '../utils/i18n';
import Icon from './Icon';

type AIChatProps = {
  initialContext?: string;
  onClose?: () => void;
};

// Local fallback responder with richer, structured replies
function localResponder(question: string, locale: string = 'en') {
  const q = question.toLowerCase();
  const isTa = locale === 'ta';

  if (/fertilizer|npk|urea|fertiliser|fertilizer/i.test(q)) {
    if (isTa) {
      return `அரிசிக்கு பரிந்துரைக்கப்படும் உர பயன்பாட்டு திட்டம் (சுருக்கமாக):\n\n- ஆதாரமாகப் போடுதல்: நடப்பு களத்தில் தொழில்நுட்ப பரிந்துரைப்படி பெரும்பாலும் 50–60 kg N/ha சமமளவு பரிந்துரைக்கப்படுகிறது; சொல்லப்பட்ட அளவுகளுக்கு 20–30 kg P2O5/ha மற்றும் 20–30 kg K2O/ha. சுமார் 2–4 t/ha வரையிலான நன்கு உரிய கரிம உரத்தை பயன்படுத்தவும்.\n\n- N-ஐ பிரித்து மாற்றி முயற்சி: 1/3 ஆதாரமாக, 1/3 அதிகமாக தழைக்கும் காலத்தில் (20–30 நாட்கள்) மற்றும் 1/3 மூட்டிக்காலத்தில் பயன்படுத்தவும். நீம்சிங்களுடன் கொண்ட யூரியா பயன்படுத்துவது நைத்திறனில் உதவும்.\n\n- மைக்ரோநியமங்கள்: மண்ணின் பரிசோதனையைப் பின்பற்றவும்; ஜிங்கள் குறைபாடு இருந்தால் 25 kg ZnSO4/ha அளவில் நீர் அல்லது இலைப் பூசுதல் செய்யலாம்.\n\n- காலநிலை & நேரம்: கனமழைக்கு முன் பெரிய உரங்களை தவிர்க்கவும்; 24–48 மணி நேரம் உலர் இடைவெளியைத் தேர்ந்தெடுக்கவும்.\n\n- பாதுகாப்பு: концент்ரேட் உரங்களை கையாளும் போது பாதுகாப்பு சாதனங்களை அணியவும்.`;
    }
    return `Recommended fertilizer strategy for rice (concise, actionable):\n\n- Basal application: Apply 50–60 kg N/ha equivalent, 20–30 kg P2O5/ha and 20–30 kg K2O/ha at or before transplanting. Use well-decomposed organic manure (2–4 t/ha) where available.\n\n- Split N application: 1/3 as basal, 1/3 at maximum tillering (20–30 days after transplanting), 1/3 at panicle initiation. Use urea for quick N uplift; consider neem-coated urea to reduce volatilization.\n\n- Micronutrients: Test soil; if zinc deficiency is common, apply 25 kg ZnSO4/ha as soil or foliar zinc sulfate (0.5%) at tillering. Apply boron carefully only if deficiency is confirmed.\n\n- Timing & weather: Avoid major top-dressings before heavy rain; schedule applications when a dry window of 24–48 hrs exists. Avoid fertilizer application during water stress or flooding events.\n\n- Rates: Adjust N rates based on variety yield target (e.g., for high-yielding varieties, total N may be 120–150 kg/ha split). Always follow local extension recommendations.\n\n- Safety: Wear PPE for concentrated fertilizers; ensure correct storage and handling.`;
  }

  if (/irrigation|water|drip|flood/i.test(q)) {
    if (isTa) {
      return `அரிசி சஞ்சிகை நீர் மேலாண்மை (சுருக்கமாக):\n\n- பொதுவான நடைமுறை: தளர்ந்த வகை அரிசியில் வளர்ச்சி மற்றும் மலர்ச்சிக் கட்டங்களில் 2–3 செமி நிற்மல நீரை பராமரிக்கவும்.\n\n- விதைப்பது/நீட்டிப்பு: விதை இடங்கள் ஈரமாக இருக்க வேண்டும்; தழுவும் முன் மண் சரிவாதம் நடத்தை நல்லது.\n\n- முக்கிய கட்டங்கள்: மூட்டிக்காலம் மற்றும் மலர்ச்சி நேரத்தில் நீர் பாழ்ச்சி தவிர்க்கவும்; அறுவடைக்குக் 10–14 நாட்கள் முன் நீரை இறக்கு.\n\n- நவீன முறைகள்: AWD போன்ற முறைகள் நீரை சேமிக்க உதவும் — 15 cm வரை நீர் நிலையை இறக்கி பின்னர் மீண்டும் நீரிட்டு பயன்பாட்டு வழிமுறை.`;
    }
    return `Irrigation guidance for rice: \n\n- Typical practice: Maintain 2–3 cm standing water during vegetative and reproductive stages for transplanted lowland rice. For aerobic or upland rice, schedule frequent light irrigations to keep field moisture near field capacity.\n\n- Sowing/transplanting: Ensure seedbeds are moist; puddling prior to transplanting improves establishment for lowland rice.\n\n- Critical stages: Panicle initiation and flowering are sensitive — avoid water stress during these stages. Drain fields 10–14 days before harvest.\n\n- Modern methods: Alternate Wetting and Drying (AWD) can save water and reduce methane emissions — allow water level to drop to 15 cm below soil surface before re-irrigating, only if not stressed.\n\n- Monitoring: Use tensiometers or simple gravimetric checks; soil moisture sensors help schedule efficient irrigations.\n\n- Practical tip: Coordinate irrigation timing with fertilizer applications (apply N after re-flooding only if recommended).`;
  }

  if (/pest|disease|insect|bollworm|hopper|blast|mildew/i.test(q)) {
    if (isTa) {
      return `புக்களை & நோய்களின் மேலாண்மை (பயனுள்ள வழிமுறைகள்):\n\n- கண்காணிப்பு: வாரம் ஒரு முறை முக்கிய கட்டங்களில் 20 மாதிரியில் புல் ஆய்வு செய்யவும். ஆரம்ப அறிகுறிகளை கவனிக்கவும்.\n\n- பண்பாட்டு கட்டுப்பாடுகள்: பறவை எதிர்ப்பு வகைகள், பயிர் மாறுதல், பாதிக்கப்பட்ட சீதியை அகற்றுதல் மற்றும் நீரை சரியாக நிர்வகிக்குதல்.\n\n- உயிரிணு மற்றும் குறைந்த விஷம் வாய்ந்த விருப்பங்கள்: நீம எண்ணெய் (2–5 ml/L), டிரிக்கோகிராமா, Bacillus thuringiensis (Bt) போன்றவை சில பூச்சிகளுக்கு பயனாகும்.\n\n- இரசாயனக் கட்டுப்பாடு: தேவையான அளவுக்கு மட்டுமே பயன்படுத்தவும்; லேபிள் அளவுகளை பின்பற்றவும்.`;
    }
    return `Pest & disease guidance (practical):\n\n- Monitoring: Scout 20 random hills per field weekly during critical stages. Look for early symptoms (leaf spots, hopper presence, discolored tillers).\n\n- Cultural controls: Use resistant varieties, rotate crops, remove infected residues, and manage water to reduce disease incidence.\n\n- Biologicals & low-toxicity options: Use neem oil (2–5 ml/L) for many minor pests; Trichogramma for lepidopteran pests; apply Bacillus thuringiensis (Bt) products for caterpillars where suitable.\n\n- Chemical control: Reserve synthetic pesticides for threshold exceedance. Follow label rates and pre-harvest intervals. Rotate modes of action to avoid resistance.\n\n- Post-harvest: Dry grain to <14% moisture and store in clean, sealed containers; monitor storage pests every 2–4 weeks.`;
  }

  // Generic enhanced reply
  if (isTa) {
    return `நான் படிநிலைக் குறிப்புகள், நேரம் மற்றும் நடைமுறை ஆலோசனைகளை வழங்க முடியும். தயவுசெய்து தெளிவாக கேளுங்கள் (எடுத்துக்காட்டாக: "1 ஹெக்டாருக்கு 5 டன்/ஹா இலக்கு கொண்ட அரிசிக்கு உர திட்டம்" அல்லது "மலர்ச்சி காலத்தில் ப்ரவ் ஹாப்பர் போர்க்கு எப்படி எதிர்ப்பு செய்யுவது?").`;
  }

  return `I can provide step-by-step plans, timing windows, and practical tips. Please ask specifically (for example: "Fertilizer schedule for 1 ha rice aiming 5 t/ha", or "How to manage brown plant hopper during flowering").`;
}

export default function AIChat({ initialContext = '', onClose }: AIChatProps) {
  const { t, locale } = useI18n();
  const [messages, setMessages] = React.useState<
    Array<{ role: 'user' | 'assistant' | 'system'; text: string }>
  >([
    {
      role: 'assistant',
      text: 'Hello! I can answer questions about irrigation, fertilizer, pests, and resource logistics. Tip: provide details (area, crop variety, soil test) for tailored advice.',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);

  // Speech Recognition Setup
  const handleVoiceStart = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = locale === 'ta' ? 'ta-IN' : locale === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Optional: Auto-send after voice
      // setTimeout(() => send(transcript), 500);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };


  const send = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim()) return;

    setMessages((m) => [...m, { role: 'user', text: textToSend }]);
    setInput('');
    setLoading(true);

    // Prefer local proxy at /api/ai (recommended: run server/index.js and set server/.env)
    const proxyUrl = import.meta.env.VITE_AI_PROXY_URL || '/api/ai';
    try {
      const r = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, context: initialContext, messages, locale }),
      });

      if (r.ok) {
        const j = await r.json();
        const reply = j?.reply || (typeof j === 'string' ? j : JSON.stringify(j));

        // Safety check: if backend returns error message as text (e.g. from older server instance)
        if (typeof reply === 'string' && (reply.includes('API Key not found') || reply.includes('AI service error'))) {
          throw new Error('Backend API Key missing or invalid');
        }

        setMessages((prev) => [...prev, { role: 'assistant', text: reply }] as any);
        setLoading(false);
        return;
      }
    } catch (err) {
      // proxy failed, fall through to other options
      console.warn('AI proxy request failed, falling back to OpenAI/local responder', err);
    }

    // If no proxy or proxy failed, fall back to OpenAI client-side if key exists
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    if (openaiKey) {
      try {
        const languageName = locale === 'ta' ? 'Tamil' : locale === 'hi' ? 'Hindi' : 'English';
        const chatMessages = [
          {
            role: 'system',
            content: `You are an expert agronomist and agricultural advisor. Answer concisely and provide practical, region-agnostic guidance. If context is provided, incorporate it. Be safe and conservative. Respond in ${languageName} unless otherwise requested.`,
          },
          { role: 'system', content: `Context: ${initialContext}` },
          ...messages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
          { role: 'user', content: textToSend },
        ];

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({ model, messages: chatMessages }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'OpenAI request failed');
        }

        const data = await res.json();

        // Try multiple ways to extract the reply
        let reply = '';

        // Method 1: Standard OpenAI format
        if (data?.choices?.[0]?.message?.content) {
          reply = data.choices[0].message.content;
        }
        // Method 2: Direct content field
        else if (data?.content) {
          reply = data.content;
        }
        // Method 3: Text field
        else if (data?.text) {
          reply = data.text;
        }
        // Method 4: Reply field (from proxy)
        else if (data?.reply) {
          reply = data.reply;
        }
        // Method 5: If data is a string
        else if (typeof data === 'string') {
          reply = data;
        }

        // If still no reply, log the response and use local responder
        if (!reply || reply.trim() === '') {
          console.warn('OpenAI API returned unexpected format:', JSON.stringify(data).substring(0, 200));
          reply = localResponder(textToSend, locale);
        }

        setMessages((prev) => [...prev, { role: 'assistant', text: reply }] as any);
      } catch (e: any) {
        console.error('OpenAI API Error:', e);
        const fallback = `AI service temporarily unavailable. Using local knowledge base.`;
        setMessages((prev) => [...prev, { role: 'assistant', text: fallback }] as any);
        // Use local responder as fallback
        const reply = localResponder(textToSend, locale);
        setMessages((prev) => [...prev, { role: 'assistant', text: reply }] as any);
      } finally {
        setLoading(false);
      }
    } else {
      // No API key — use improved local responder
      const reply = localResponder(textToSend, locale);
      // small delay to simulate thinking
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', text: reply }] as any);
        setLoading(false);
      }, 300);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-96 font-sans">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="font-bold text-green-700 flex items-center gap-2">
          <Icon name="Brain" className="h-5 w-5" />
          AI Agri-Advisor
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="X" className="h-5 w-5" />
        </button>
      </div>

      <div className="h-64 overflow-y-auto border border-gray-100 rounded-xl p-3 mb-3 bg-gray-50/50 shadow-inner">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col mb-3 ${m.role === 'assistant' ? 'items-start' : 'items-end'}`}
          >
            <span className={`text-[10px] text-gray-400 mb-1 px-1`}>{m.role === 'assistant' ? 'AI Assistant' : 'You'}</span>
            <div className={`p-3 rounded-2xl max-w-[90%] text-sm leading-relaxed shadow-sm ${m.role === 'assistant'
              ? 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
              : 'bg-green-600 text-white rounded-tr-none'
              }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs p-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150" />
            Thinking...
          </div>
        )}
      </div>

      <div className="flex space-x-2 items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-all">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          placeholder={
            isListening ? "Listening..." : (t('chat_placeholder') || 'Ask about crops...')
          }
          className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm min-w-0"
          disabled={loading || isListening}
        />

        {/* Voice Button */}
        <button
          onClick={handleVoiceStart}
          className={`p-2 rounded-lg transition-all duration-200 ${isListening
            ? 'bg-red-100 text-red-600 animate-pulse'
            : 'text-gray-400 hover:bg-gray-100'
            }`}
          title="Speak"
        >
          <Icon name="Mic" className="h-5 w-5" />
        </button>

        <button
          onClick={() => send()}
          disabled={loading || (!input.trim() && !isListening)}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
        >
          <Icon name="ArrowRight" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
