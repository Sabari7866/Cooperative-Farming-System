import React, { useState, useRef } from 'react';
import Icon from './Icon';
import { useI18n } from '../utils/i18n';

// Mock analysis results for demo purposes
// In a real app, this would come from the Gemini Vision API
const MOCK_DIAGNOSIS = {
    disease: 'Rice Brown Spot',
    confidence: 94,
    severity: 'Moderate',
    symptoms: [
        'Circular brown lesions on leaves',
        'Yellow halo around spots',
        'Deformed grains'
    ],
    causes: [
        'Fungal pathogen (Bipolaris oryzae)',
        'High humidity',
        'Nutrient deficiency (Potassium)'
    ],
    treatment: [
        'Remedy 1: Spray Carbendazim 50 WP @ 1g/liter',
        'Remedy 2: Apply Potash fertilizer',
        'Organic: Spray Neem oil solution'
    ]
};

const SmartCropDoctor: React.FC = () => {
    // const { t } = useI18n(); // reserved for future translations
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [diagnosis, setDiagnosis] = useState<typeof MOCK_DIAGNOSIS | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setDiagnosis(null); // Reset diagnosis
            };
            reader.readAsDataURL(file);
        }
    };

    const startAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate API delay
        setTimeout(() => {
            setIsAnalyzing(false);
            setDiagnosis(MOCK_DIAGNOSIS);
        }, 2500);
    };

    const reset = () => {
        setSelectedImage(null);
        setDiagnosis(null);
        setIsAnalyzing(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Icon name="Search" className="h-8 w-8 text-green-600" />
                    Visual AI Crop Doctor
                </h1>
                <p className="text-gray-600 mt-2">
                    Upload a photo of your crop. Our AI detects diseases, pests, and nutrient deficiencies instantly.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Upload Area */}
                <div className="space-y-6">
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all bg-gray-50 h-96 ${selectedImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                            }`}
                    >
                        {selectedImage ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={selectedImage}
                                    alt="Crop preview"
                                    className="w-full h-full object-contain rounded-lg shadow-sm"
                                />
                                <button
                                    onClick={reset}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <Icon name="X" className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer space-y-4"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <Icon name="Camera" className="h-10 w-10 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">Click to Upload Photo</p>
                                    <p className="text-sm text-gray-500">or drag and drop here</p>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {selectedImage && !diagnosis && (
                        <button
                            onClick={startAnalysis}
                            disabled={isAnalyzing}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-wait relative overflow-hidden"
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Icon name="Loader2" className="h-6 w-6 animate-spin" />
                                    Analyzing with Vision AI...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Icon name="Brain" className="h-6 w-6" />
                                    Diagnose Now
                                </span>
                            )}
                        </button>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="space-y-6">
                    {isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse-slow">
                            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-800">Scanning leaf patterns...</h3>
                            <p className="text-gray-500 mt-2">Checking against 50,000+ plant diseases Database</p>
                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-6 overflow-hidden">
                                <div className="bg-green-600 h-2 rounded-full animate-slide-right w-full origin-left transform scale-x-0 transition-transform duration-[2000ms]"></div>
                            </div>
                        </div>
                    )}

                    {!isAnalyzing && !diagnosis && !selectedImage && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                            <Icon name="Activity" className="h-16 w-16 mb-4 opacity-20" />
                            <p>Analysis results will appear here</p>
                        </div>
                    )}

                    {diagnosis && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                            <div className="bg-red-50 p-6 border-b border-red-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        Issue Detected
                                    </span>
                                    <span className="text-green-700 font-bold flex items-center gap-1">
                                        <Icon name="Check" className="h-4 w-4" />
                                        {diagnosis.confidence}% Match
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{diagnosis.disease}</h2>
                                <p className="text-red-600 font-medium mt-1">Severity: {diagnosis.severity}</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                        <Icon name="AlertCircle" className="h-5 w-5 text-gray-500" />
                                        Detected Symptoms
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-1">
                                        {diagnosis.symptoms.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                        <Icon name="Shield" className="h-5 w-5 text-green-600" />
                                        Recommended Treatment
                                    </h4>
                                    <div className="bg-green-50 rounded-xl p-4 space-y-3">
                                        {diagnosis.treatment.map((t, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-800 text-xs font-bold">
                                                    {i + 1}
                                                </div>
                                                <p className="text-gray-800 text-sm">{t}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex gap-3">
                                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                                        Save Report
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                        Consult Expert
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartCropDoctor;
