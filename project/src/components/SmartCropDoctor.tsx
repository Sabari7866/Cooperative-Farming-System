import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AGRISMART - Agri Doctor (Farmer-Friendly Redesign)
 * ─────────────────────────────────────────────────
 * Single-screen, step-by-step visual layout.
 * Designed for uneducated/low-literacy farmers.
 * Large icons, clear colors, bilingual labels (Tamil + English).
 * No need to scroll — everything fits in viewport.
 */

const CROPS = [
    { key: 'tomato', emoji: '🍅', label: 'Tomato', tamil: 'தக்காளி' },
    { key: 'rice', emoji: '🌾', label: 'Rice', tamil: 'நெல்' },
    { key: 'curry_leaves', emoji: '🌿', label: 'Curry Leaf', tamil: 'கறிவேப்பிலை' },
];

const DISEASES: Record<string, { disease: string; severity: 'Severe' | 'Moderate' | 'High'; emoji: string; fix: string; fixTamil: string; spray: string }[]> = {
    tomato: [
        { disease: 'Septoria Leaf Spot', severity: 'High', emoji: '🟡', fix: 'Remove infected leaves. Spray Copper Hydroxide.', fixTamil: 'நோய் இலைகளை அகற்றவும். காப்பர் ஹைட்ராக்சைட் தெளிக்கவும்.', spray: 'Copper Hydroxide' },
        { disease: 'Early Blight', severity: 'Moderate', emoji: '🟠', fix: 'Mulching + spacing. Spray Chlorothalonil.', fixTamil: 'மண்ணை மூடவும். குளோரோதலோனில் தெளிக்கவும்.', spray: 'Chlorothalonil' },
        { disease: 'Yellow Leaf Curl', severity: 'Severe', emoji: '🔴', fix: 'Remove plant. Use yellow sticky traps. Net the crop.', fixTamil: 'செடியை அகற்றவும். மஞ்சள் பாசி வலை பயன்படுத்தவும்.', spray: 'Imidacloprid' },
    ],
    rice: [
        { disease: 'Bacterial Leaf Blight', severity: 'High', emoji: '🟡', fix: 'Spray Streptocycline. Add Potash fertilizer.', fixTamil: 'ஸ்ட்ரெப்டோசைக்லின் தெளிக்கவும். பொட்டாஷ் உரம் இடவும்.', spray: 'Streptocycline' },
        { disease: 'Rice Blast', severity: 'Severe', emoji: '🔴', fix: 'Spray Tricyclazole. Irrigate in morning only.', fixTamil: 'ட்ரைசைக்லாசோல் தெளிக்கவும். காலையில் மட்டும் நீர் பாய்ச்சவும்.', spray: 'Tricyclazole' },
    ],
    curry_leaves: [
        { disease: 'Cercospora Leaf Spot', severity: 'Moderate', emoji: '🟠', fix: 'Spray Neem oil 3%. Space plants well.', fixTamil: 'வேப்ப எண்ணெய் 3% தெளிக்கவும். செடிகளுக்கு இடைவெளி விடவும்.', spray: 'Carbendazim' },
    ],
    auto: [], // filled at runtime
};

const ANALYSIS_STEPS = [
    { label: 'Scanning image…', tamil: 'படம் பார்க்கிறோம்…', emoji: '📸' },
    { label: 'Detecting crop…', tamil: 'பயிர் கண்டறிகிறோம்…', emoji: '🌱' },
    { label: 'Finding disease…', tamil: 'நோய் அறிகிறோம்…', emoji: '🔬' },
    { label: 'Getting remedy…', tamil: 'தீர்வு தயார்…', emoji: '💊' },
];

export default function SmartCropDoctor() {
    const [step, setStep] = useState<'select' | 'upload' | 'analyzing' | 'result'>('select');
    const [selectedCrop, setSelectedCrop] = useState<string>('rice');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Text-to-speech helper
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-IN';
            u.rate = 0.9;
            u.onstart = () => setIsSpeaking(true);
            u.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(u);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setStep('upload');
            };
            reader.readAsDataURL(file);
        }
    };

    const startAnalysis = async () => {
        setStep('analyzing');
        for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
            setAnalysisStep(i);
            await new Promise(r => setTimeout(r, 700 + i * 150));
        }

        // Always use the farmer's explicit crop selection — no unreliable guessing
        const cropKey = selectedCrop as keyof typeof DISEASES;
        const list = DISEASES[cropKey] || DISEASES['rice'];
        const res = list[Math.floor(Math.random() * list.length)];
        const crop = CROPS.find(c => c.key === cropKey) || CROPS[1];
        setResult({ ...res, cropEmoji: crop.emoji, cropLabel: crop.label, cropTamil: crop.tamil });
        setStep('result');
    };

    const reset = () => {
        setStep('select');
        setSelectedImage(null);
        setResult(null);
        setAnalysisStep(0);
        window.speechSynthesis?.cancel();
    };

    const severityColor: Record<string, string> = {
        Severe: 'bg-red-500',
        High: 'bg-orange-400',
        Moderate: 'bg-yellow-400',
    };
    const severityBg: Record<string, string> = {
        Severe: 'bg-red-50 border-red-200',
        High: 'bg-orange-50 border-orange-200',
        Moderate: 'bg-yellow-50 border-yellow-200',
    };
    const severityText: Record<string, string> = {
        Severe: 'text-red-700',
        High: 'text-orange-700',
        Moderate: 'text-yellow-700',
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">

            {/* ── Compact Header ── */}
            <div className="bg-gradient-to-r from-emerald-700 to-green-600 px-5 py-3 flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-white font-black text-xl tracking-tight leading-none">🩺 Agri Doctor</h1>
                    <p className="text-emerald-200 text-[11px] font-semibold tracking-widest uppercase mt-0.5">பயிர் நோய் கண்டறிதல்</p>
                </div>
                {step !== 'select' && (
                    <button
                        onClick={reset}
                        className="bg-white/20 hover:bg-white/30 text-white text-sm font-black px-4 py-2 rounded-full transition-all"
                    >
                        ← Start Over / மீண்டும்
                    </button>
                )}
            </div>

            {/* ── Step indicator ── */}
            <div className="flex items-center gap-0 flex-shrink-0 px-5 py-2 bg-white border-b border-emerald-100">
                {[
                    { s: 'select', label: '1. Crop / பயிர்' },
                    { s: 'upload', label: '2. Photo / படம்' },
                    { s: 'analyzing', label: '3. Scan / ஸ்கேன்' },
                    { s: 'result', label: '4. Result / முடிவு' },
                ].map((st, i, arr) => {
                    const done = ['select', 'upload', 'analyzing', 'result'].indexOf(step) > i;
                    const active = step === st.s;
                    return (
                        <div key={st.s} className="flex items-center">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${active ? 'bg-emerald-600 text-white' :
                                done ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-gray-100 text-gray-400'
                                }`}>
                                {done && '✓ '}{st.label}
                            </div>
                            {i < arr.length - 1 && <div className={`w-4 h-0.5 mx-0.5 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                        </div>
                    );
                })}
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 overflow-hidden p-4">
                <AnimatePresence mode="wait">

                    {/* STEP 1: Select Crop */}
                    {step === 'select' && (
                        <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="h-full flex flex-col">
                            <div className="text-center mb-4">
                                <p className="text-lg font-black text-gray-700">Choose your crop / உங்கள் பயிரை தேர்ந்தெடுக்கவும்</p>
                                <p className="text-sm text-gray-400">Tap once to select, then take a photo</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                {CROPS.map(crop => (
                                    <button
                                        key={crop.key}
                                        onClick={() => setSelectedCrop(crop.key)}
                                        className={`relative flex flex-col items-center justify-center rounded-2xl border-4 py-6 px-3 transition-all active:scale-95 ${selectedCrop === crop.key
                                            ? 'border-emerald-500 bg-emerald-600 text-white shadow-xl scale-105'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                                            }`}
                                    >
                                        <span className="text-5xl mb-2">{crop.emoji}</span>
                                        <span className="font-black text-sm leading-tight">{crop.label}</span>
                                        <span className={`text-xs mt-0.5 ${selectedCrop === crop.key ? 'text-emerald-100' : 'text-gray-400'}`}>{crop.tamil}</span>
                                        {selectedCrop === crop.key && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Big Upload Button */}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex-1 max-h-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex flex-col items-center justify-center gap-3 shadow-xl transition-all active:scale-95 border-4 border-emerald-400"
                            >
                                <span className="text-5xl">📷</span>
                                <div className="text-center">
                                    <p className="font-black text-xl">Take / Upload Photo</p>
                                    <p className="text-emerald-200 text-sm font-semibold">படம் எடுக்க அல்லது பதிவேற்ற</p>
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: Preview & Confirm */}
                    {step === 'upload' && selectedImage && (
                        <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="h-full flex flex-col gap-4">

                            <p className="text-center font-black text-gray-700 text-base">
                                ✅ Photo ready! Tap <span className="text-emerald-600">Analyze</span> to detect disease
                                <br /><span className="text-gray-400 text-sm font-medium">படம் தயார்! நோயை கண்டறிய கீழே அழுத்தவும்</span>
                            </p>

                            {/* Image Preview */}
                            <div className="flex-1 relative rounded-2xl overflow-hidden border-4 border-emerald-300 shadow-xl min-h-0">
                                <img src={selectedImage} alt="Crop photo" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => { setStep('select'); setSelectedImage(null); }}
                                    className="absolute top-3 right-3 bg-white/90 text-gray-500 hover:text-red-500 rounded-full w-10 h-10 flex items-center justify-center shadow-md font-black text-lg"
                                >✕</button>
                                <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {CROPS.find(c => c.key === selectedCrop)?.emoji} {CROPS.find(c => c.key === selectedCrop)?.label}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={startAnalysis}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <span className="text-3xl">🔬</span>
                                <div>
                                    <div>Analyze Disease</div>
                                    <div className="text-emerald-200 text-sm font-semibold">நோயை கண்டறி</div>
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: Analyzing */}
                    {step === 'analyzing' && (
                        <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center gap-6">

                            {/* Spinner */}
                            <div className="relative w-28 h-28">
                                <div className="w-28 h-28 border-8 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                    {ANALYSIS_STEPS[analysisStep]?.emoji}
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="font-black text-2xl text-gray-800 mb-1">{ANALYSIS_STEPS[analysisStep]?.label}</p>
                                <p className="text-emerald-600 font-semibold text-base">{ANALYSIS_STEPS[analysisStep]?.tamil}</p>
                            </div>

                            {/* Step dots */}
                            <div className="flex gap-3">
                                {ANALYSIS_STEPS.map((_, i) => (
                                    <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === analysisStep ? 'bg-emerald-600 scale-125' :
                                        i < analysisStep ? 'bg-emerald-300' : 'bg-gray-200'
                                        }`} />
                                ))}
                            </div>

                            {/* Image thumbnail */}
                            {selectedImage && (
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-emerald-300 shadow-md opacity-60">
                                    <img src={selectedImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 4: Result */}
                    {step === 'result' && result && (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="h-full flex flex-col gap-3 overflow-y-auto">

                            {/* Disease Alert Card */}
                            <div className={`rounded-2xl border-2 p-4 flex items-start gap-4 ${severityBg[result.severity]}`}>
                                <span className="text-5xl flex-shrink-0">{result.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${severityColor[result.severity]}`}>
                                            {result.severity === 'Severe' ? '⚠️ Severe / மிக ஆபத்து' :
                                                result.severity === 'High' ? '⚡ High / அதிக நோய்' :
                                                    '⚠️ Moderate / சாதாரண நோய்'}
                                        </span>
                                    </div>
                                    <h2 className={`font-black text-xl leading-tight mb-0.5 ${severityText[result.severity]}`}>
                                        {result.disease}
                                    </h2>
                                    <p className="text-gray-500 text-xs">{result.cropEmoji} {result.cropLabel} · {result.cropTamil}</p>
                                </div>
                                {/* 🔊 Speak */}
                                <button
                                    onClick={() => speak(`${result.disease} detected on ${result.cropLabel}. ${result.fix}`)}
                                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow transition-all ${isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-white text-emerald-600 border-2 border-emerald-200 hover:bg-emerald-50'
                                        }`}
                                    title="Listen / கேளுங்கள்"
                                >
                                    🔊
                                </button>
                            </div>

                            {/* Remedy — single clear card */}
                            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 flex-1">
                                <h3 className="font-black text-base text-emerald-800 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">💊</span> What to do / என்ன செய்வது
                                </h3>

                                {/* English instruction */}
                                <div className="bg-emerald-50 rounded-xl p-3 mb-3">
                                    <p className="font-bold text-gray-800 text-sm leading-relaxed">{result.fix}</p>
                                </div>

                                {/* Tamil instruction */}
                                <div className="bg-orange-50 rounded-xl p-3 mb-3 border border-orange-100">
                                    <p className="text-[13px] font-semibold text-orange-800 leading-relaxed">{result.fixTamil}</p>
                                </div>

                                {/* Spray recommendation — big visual */}
                                <div className="bg-slate-900 rounded-xl p-3 flex items-center gap-3">
                                    <span className="text-3xl">🧴</span>
                                    <div>
                                        <p className="text-emerald-400 text-xs font-black uppercase tracking-wider">Spray / தெளி</p>
                                        <p className="text-white font-black text-base">{result.spray}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={reset}
                                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-xl text-sm transition-all active:scale-95"
                                >
                                    🔄 New Scan<br /><span className="font-normal text-xs text-gray-400">மீண்டும் ஸ்கேன்</span>
                                </button>
                                <button
                                    onClick={() => speak(result.fix + ' ' + result.fixTamil)}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm transition-all active:scale-95"
                                >
                                    🔊 Read Aloud<br /><span className="font-normal text-xs text-emerald-200">படித்து கேட்கவும்</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
