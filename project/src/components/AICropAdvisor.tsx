import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Icon from './Icon';
import { fetchLiveWeather } from '../utils/weather';
import { useLands } from '../hooks/useApi';
import { useI18n } from '../utils/i18n';
import { useToast } from './Toast';
import AIChatLauncher from './AIChatLauncher';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AICropAdvisorProps {
  embeddedMode?: boolean;
}

const AICropAdvisor = ({ embeddedMode = false }: AICropAdvisorProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedCrop, setSelectedCrop] = useState<CropId>('rice');
  const [selectedStage, setSelectedStage] = useState<StageId>('growing');

  const currentUserId = localStorage.getItem("currentUserId") || undefined;
  const { data: rawLands } = useLands(currentUserId);
  const lands = (rawLands || []).filter((l: any) => l.userId === currentUserId);

  const [selectedLandIndex, setSelectedLandIndex] = useState<number>(0);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);
  const [currentLandLocation, setCurrentLandLocation] = useState<{ lat: number; lon: number } | null>(null);

  const crops = [
    { id: 'rice', name: 'Rice', icon: '🌾', season: 'Kharif', color: 'green' },
    { id: 'cotton', name: 'Cotton', icon: '🌱', season: 'Kharif', color: 'blue' },
    { id: 'wheat', name: 'Wheat', icon: '🌾', season: 'Rabi', color: 'yellow' },
    { id: 'corn', name: 'Corn', icon: '🌽', season: 'Kharif', color: 'orange' },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🎋', season: 'Annual', color: 'purple' },
    { id: 'soybean', name: 'Soybean', icon: '🌿', season: 'Kharif', color: 'emerald' },
  ] as const;

  const stages = [
    { id: 'sowing', name: 'Sowing', description: 'Seed preparation and planting', icon: '🌱' },
    { id: 'growing', name: 'Growing', description: 'Vegetative growth phase', icon: '🌿' },
    { id: 'flowering', name: 'Flowering', description: 'Reproductive phase', icon: '🌸' },
    { id: 'harvest', name: 'Harvest', description: 'Maturity and harvesting', icon: '🌾' },
  ] as const;

  const cropAdvice = {
    rice: {
      sowing: {
        irrigation:
          'Prepare puddled field with 2-3 cm standing water. Maintain consistent moisture for seed germination.',
        fertilizer:
          'Apply basal dose: 60 kg N, 30 kg P2O5, 30 kg K2O per hectare. Add organic matter 2-3 weeks before sowing.',
        pestControl:
          'Treat seeds with Carbendazim (2g/kg seed) to prevent fungal diseases. Monitor for cutworms.',
        bestPractices:
          'Use certified seeds, maintain plant spacing of 20x15 cm, ensure proper drainage channels.',
        weatherAdvice: 'Ideal temperature: 20-25°C. Avoid sowing during heavy rainfall periods.',
        priority: 'high',
      },
      growing: {
        irrigation: 'Maintain 2-3 inches of standing water. Drain field 10 days before harvest.',
        fertilizer: 'Apply 1st top dressing of Urea (30 kg/ha) at 20-25 days after transplanting.',
        pestControl:
          'Monitor for brown plant hopper and stem borer. Use neem oil spray (5ml/liter) weekly.',
        bestPractices:
          'Weed management crucial. Hand weeding at 20 and 40 days after transplanting.',
        weatherAdvice:
          'Ensure adequate sunlight. If monsoon delayed, provide supplementary irrigation.',
        priority: 'medium',
      },
      flowering: {
        irrigation: 'Critical stage - maintain continuous shallow flooding. Avoid water stress.',
        fertilizer: 'Apply 2nd top dressing of Urea (30 kg/ha) at panicle initiation stage.',
        pestControl:
          'Monitor for blast disease. Spray Tricyclazole (0.6g/liter) if symptoms appear.',
        bestPractices:
          'Avoid walking in field during flowering. Monitor for lodging in heavy winds.',
        weatherAdvice: 'Protect from strong winds. Ideal temperature: 25-30°C during flowering.',
        priority: 'high',
      },
      harvest: {
        irrigation: 'Drain field completely 10-15 days before harvest for easy harvesting.',
        fertilizer: 'No fertilizer application needed. Focus on post-harvest soil management.',
        pestControl: 'Monitor stored grain for pests. Use proper storage techniques.',
        bestPractices: 'Harvest when 80% grains are golden yellow. Dry to 12-14% moisture content.',
        weatherAdvice:
          'Avoid harvesting during rainy weather. Ensure proper drying before storage.',
        priority: 'high',
      },
    },
    cotton: {
      sowing: {
        irrigation:
          'Pre-sowing irrigation 1-2 weeks before planting. Maintain soil moisture at 60-70%.',
        fertilizer: 'Apply 50 kg N, 25 kg P2O5, 25 kg K2O per hectare as basal dose.',
        pestControl: 'Treat seeds with Imidacloprid (5g/kg seed) for thrips protection.',
        bestPractices:
          'Plant spacing: 90x30 cm. Ensure soil temperature above 18°C for germination.',
        weatherAdvice: 'Optimal temperature: 20-25°C. Avoid sowing during cold weather.',
        priority: 'medium',
      },
      growing: {
        irrigation: 'Deep irrigation every 15-20 days. Maintain soil moisture at 70-80%.',
        fertilizer: 'Apply 1st top dressing of Urea (50 kg/ha) at 30-35 days after sowing.',
        pestControl: 'Monitor for aphids and whiteflies. Use yellow sticky traps for monitoring.',
        bestPractices: 'Regular weeding essential. Earthing up at 60 days after sowing.',
        weatherAdvice: 'Requires warm weather (25-30°C). Protect from cold winds.',
        priority: 'medium',
      },
      flowering: {
        irrigation: 'Critical water requirement. Irrigate every 10-12 days during flowering.',
        fertilizer: 'Apply 2nd top dressing of Urea (50 kg/ha) at square formation stage.',
        pestControl: 'Monitor for bollworm. Use pheromone traps for early detection.',
        bestPractices: 'Avoid stress conditions. Monitor for flower and boll drop.',
        weatherAdvice: 'Avoid high humidity. Ideal temperature: 25-30°C during flowering.',
        priority: 'high',
      },
      harvest: {
        irrigation: 'Reduce irrigation frequency. Last irrigation 3-4 weeks before harvest.',
        fertilizer: 'No fertilizer needed. Focus on potassium-rich foliar spray if needed.',
        pestControl: 'Monitor for pink bollworm in mature bolls. Use biological control agents.',
        bestPractices: 'Harvest when bolls are fully opened. Pick during dry weather.',
        weatherAdvice: 'Avoid harvesting during dewy mornings. Ensure proper drying.',
        priority: 'high',
      },
    },
    wheat: {
      sowing: {
        irrigation: 'Pre-sowing irrigation (rauni) 3-4 weeks before sowing for timely variety.',
        fertilizer: 'Apply 60 kg N, 30 kg P2O5, 20 kg K2O per hectare as basal dose.',
        pestControl: 'Treat seeds with Vitavax (2.5g/kg seed) to prevent loose smut.',
        bestPractices:
          'Seed rate: 100-125 kg/ha. Row spacing: 20-22.5 cm. Optimum sowing depth: 4-5 cm.',
        weatherAdvice: 'Optimal temperature: 15-20°C. Sow after monsoon retreat.',
        priority: 'high',
      },
      growing: {
        irrigation:
          'First irrigation at Crown Root Initiation (CRI) stage, 20-25 days after sowing.',
        fertilizer: 'Apply 1st top dressing of Urea (65 kg/ha) at CRI stage with first irrigation.',
        pestControl: 'Monitor for aphids and termites. Use integrated pest management.',
        bestPractices: 'Weed control crucial in first 40 days. Use herbicides if needed.',
        weatherAdvice: 'Requires cool, dry weather. Protect from frost in plains.',
        priority: 'medium',
      },
      flowering: {
        irrigation: 'Second irrigation at late jointing stage, 40-45 days after sowing.',
        fertilizer: 'Apply 2nd top dressing of Urea (65 kg/ha) at late jointing stage.',
        pestControl: 'Monitor for rust diseases. Spray Propiconazole if symptoms appear.',
        bestPractices: 'Avoid stress during flowering. Monitor for lodging in tall varieties.',
        weatherAdvice: 'Ideal temperature: 15-20°C. Avoid hot, dry winds during flowering.',
        priority: 'high',
      },
      harvest: {
        irrigation: 'Last irrigation at milk stage. Avoid late irrigation to prevent lodging.',
        fertilizer: 'No fertilizer application. Focus on post-harvest soil management.',
        pestControl: 'Monitor for storage pests. Use proper storage techniques.',
        bestPractices: 'Harvest when grains are hard and golden. Moisture content: 20-22%.',
        weatherAdvice: 'Harvest during dry weather. Avoid delays to prevent shattering.',
        priority: 'high',
      },
    },
    corn: {
      sowing: {
        irrigation:
          'Pre-sowing irrigation 2-3 weeks before planting. Maintain soil moisture at 60-70% for germination.',
        fertilizer:
          'Apply 40 kg N, 20 kg P2O5, 20 kg K2O per hectare as basal dose. Add zinc sulfate (25 kg/ha).',
        pestControl:
          'Treat seeds with Thiram (3g/kg seed) to prevent soil-borne diseases. Monitor for cutworms.',
        bestPractices:
          'Plant spacing: 60x20 cm. Seed depth: 5-7 cm. Ensure soil temperature above 10°C.',
        weatherAdvice: 'Optimal temperature: 18-23°C. Avoid sowing during high rainfall periods.',
        priority: 'high',
      },
      growing: {
        irrigation:
          'Light irrigation every 7-10 days. Critical at V6-V8 stage. Maintain adequate soil moisture.',
        fertilizer:
          'Apply 1st top dressing of Urea (60 kg/ha) at knee-high stage (30-35 days after sowing).',
        pestControl:
          'Monitor for fall armyworm and stem borer. Use pheromone traps and neem-based sprays.',
        bestPractices:
          'Weed control critical in first 45 days. Earthing up at 30-35 days after sowing.',
        weatherAdvice:
          'Requires warm weather (25-30°C). Ensure good drainage if heavy rains expected.',
        priority: 'medium',
      },
      flowering: {
        irrigation:
          'Critical water requirement during tasseling and silking. Irrigate every 5-7 days.',
        fertilizer:
          'Apply 2nd top dressing of Urea (60 kg/ha) at tasseling stage for grain filling.',
        pestControl:
          'Monitor for corn borer and aphids. Spray Chlorpyrifos (2ml/liter) if infestation occurs.',
        bestPractices: 'Avoid water stress during pollination. Monitor for lodging in high winds.',
        weatherAdvice: 'Protect from hot dry winds. Ideal temperature: 20-27°C during flowering.',
        priority: 'high',
      },
      harvest: {
        irrigation: 'Stop irrigation 15-20 days before harvest to facilitate field operations.',
        fertilizer: 'No fertilizer application needed. Focus on post-harvest nutrient management.',
        pestControl:
          'Monitor stored grain for weevils. Use proper ventilation and storage techniques.',
        bestPractices: 'Harvest when grain moisture is 20-25%. Dry to 12-14% before storage.',
        weatherAdvice:
          'Harvest during dry weather. Avoid delays to prevent bird damage and lodging.',
        priority: 'high',
      },
    },
    sugarcane: {
      sowing: {
        irrigation:
          'Heavy pre-planting irrigation. Keep furrows filled for 3-4 days after planting.',
        fertilizer: 'Apply 100 kg N, 50 kg P2O5, 60 kg K2O per hectare. Add FYM (25 tons/ha).',
        pestControl:
          'Treat setts with Carbendazim (0.1%) for 10 minutes before planting. Monitor for termites.',
        bestPractices:
          'Use 3-budded setts. Plant spacing: 90cm row spacing. Cover setts with 5-8 cm soil.',
        weatherAdvice:
          'Optimal temperature: 20-26°C. Plant during onset of monsoon or with assured irrigation.',
        priority: 'high',
      },
      growing: {
        irrigation:
          'Irrigate every 7-10 days during tillering and grand growth phase. Avoid water logging.',
        fertilizer:
          'Apply 1st top dressing (40% N) at 30-45 days. 2nd dressing (30% N) at 90-120 days.',
        pestControl:
          'Monitor for early shoot borer and whitefly. Use biological control agents like Trichogramma.',
        bestPractices: 'Propping and earthing up at 120 days. Trash mulching to conserve moisture.',
        weatherAdvice:
          'Requires warm, sunny weather (28-35°C) for maximum growth. Protect from frost.',
        priority: 'medium',
      },
      flowering: {
        irrigation:
          'Moderate irrigation during grand growth phase. Reduce frequency during maturity.',
        fertilizer: 'Apply final top dressing (30% N) at 150-180 days for higher sucrose content.',
        pestControl:
          'Monitor for top borer and red rot disease. Remove affected canes immediately.',
        bestPractices:
          'Detrashing to improve air circulation. Monitor for lodging in tall varieties.',
        weatherAdvice: 'Cool nights (12-14°C) and sunny days enhance sugar accumulation.',
        priority: 'medium',
      },
      harvest: {
        irrigation:
          'Stop irrigation 3-4 weeks before harvest to improve sugar content and recovery.',
        fertilizer: 'No fertilizer needed. Apply potash-rich spray if required for ratoon crop.',
        pestControl: 'Protect harvested cane from red rot. Harvest and crush within 24-48 hours.',
        bestPractices:
          'Harvest at physiological maturity (12-15 months). Cut close to ground level.',
        weatherAdvice: 'Harvest during dry season. Cool weather improves sucrose content.',
        priority: 'high',
      },
    },
    soybean: {
      sowing: {
        irrigation: 'Pre-sowing irrigation if soil moisture inadequate. Avoid water stagnation.',
        fertilizer:
          'Apply 20 kg N, 60 kg P2O5, 40 kg K2O per hectare. Add Rhizobium culture to seeds.',
        pestControl:
          'Treat seeds with Thiram (3g/kg) + Rhizobium culture. Monitor for white grubs.',
        bestPractices: 'Plant spacing: 45x5 cm. Seed rate: 75-80 kg/ha. Seed depth: 3-4 cm.',
        weatherAdvice: 'Optimal temperature: 20-25°C. Sow with onset of monsoon for rain-fed crop.',
        priority: 'high',
      },
      growing: {
        irrigation: 'Supplementary irrigation if dry spell exceeds 10 days. Critical at flowering.',
        fertilizer:
          'Usually no nitrogen top dressing needed due to biological fixation. Monitor deficiency symptoms.',
        pestControl:
          'Monitor for semilooper, leaf miner, and girdle beetle. Use neem oil (5ml/liter).',
        bestPractices:
          'Weed-free first 45 days crucial. Intercultivation at 20 and 40 days after sowing.',
        weatherAdvice:
          'Requires warm weather (25-30°C) with adequate moisture. Ensure good drainage.',
        priority: 'medium',
      },
      flowering: {
        irrigation:
          'Critical water requirement during flowering and pod formation. Irrigate every 7-10 days.',
        fertilizer: 'Foliar spray of DAP (2%) at flowering for better pod setting if needed.',
        pestControl:
          'Monitor for pod borer and whitefly. Use pheromone traps and biological control.',
        bestPractices: 'Avoid water stress during flowering. Monitor for flower and pod drop.',
        weatherAdvice:
          'Moderate temperature (22-28°C) ideal. Avoid high humidity to prevent diseases.',
        priority: 'high',
      },
      harvest: {
        irrigation:
          'Stop irrigation 2-3 weeks before harvest. Ensure field is dry for mechanical harvesting.',
        fertilizer: 'No fertilizer application. Incorporate residue for soil health.',
        pestControl: 'Monitor stored grain for storage pests. Use hermetic storage if possible.',
        bestPractices: 'Harvest when 95% pods turn brown. Grain moisture: 12-14% for safe storage.',
        weatherAdvice: 'Harvest during dry weather. Avoid shattering by timely harvesting.',
        priority: 'high',
      },
    },
  } as const;

  type CropId = keyof typeof cropAdvice;
  type StageId = keyof (typeof cropAdvice)['rice'];
  type Priority = 'high' | 'medium' | 'low';

  const [liveWeather, setLiveWeather] = useState<{
    temp: string;
    humidity: string;
    wind: string;
    forecast: string;
    moisture: string;
    daily: any[];
  }>({
    temp: '—',
    humidity: '—',
    wind: '—',
    forecast: '—',
    moisture: '—',
    daily: [],
  });

  // Manual Soil Data State
  const [adviceMode, setAdviceMode] = useState<'iot' | 'manual'>('iot');
  const [manualMetrics, setManualMetrics] = useState({
    nitrogen: '140',
    phosphorus: '45',
    potassium: '180',
    ph: '6.5',
    moisture: '40'
  });

  useEffect(() => {
    // Auto-detect from user's lands: use the selected land and part
    if (lands && lands.length > 0 && selectedLandIndex < lands.length) {
      const selectedLand = lands[selectedLandIndex] as any;
      const stageMap: Record<string, StageId> = {
        preparation: 'sowing',
        sowing: 'sowing',
        growing: 'growing',
        flowering: 'flowering',
        harvest: 'harvest',
      };

      if (selectedLand.latitude && selectedLand.longitude) {
        setCurrentLandLocation({
          lat: parseFloat(selectedLand.latitude),
          lon: parseFloat(selectedLand.longitude),
        });
      }

      const landParts = selectedLand.parts || [];
      if (landParts.length > 0) {
        const activePart = landParts[selectedPartIndex] || landParts[0];
        const cropId = (activePart.crop || '').toLowerCase();
        if (['rice', 'cotton', 'wheat', 'corn', 'sugarcane', 'soybean'].includes(cropId)) {
          setSelectedCrop(cropId as CropId);
        }
        const mapped = stageMap[(activePart.stage || '').toLowerCase()] || 'growing';
        setSelectedStage(mapped);
      } else {
        const cropId = (selectedLand.crop || '').toLowerCase();
        if (['rice', 'cotton', 'wheat', 'corn', 'sugarcane', 'soybean'].includes(cropId)) {
          setSelectedCrop(cropId as CropId);
        }
        const mapped = stageMap[(selectedLand.status || selectedLand.stage || '').toLowerCase()] || 'growing';
        setSelectedStage(mapped);
      }
    }
  }, [lands, selectedLandIndex, selectedPartIndex]);

  useEffect(() => {
    const getForecast = async (lat: number, lon: number) => {
      try {
        const w = await fetchLiveWeather(lat, lon);
        setLiveWeather({
          temp: `${w.temperatureC}°C`,
          humidity: `${w.humidity}%`,
          wind: `${w.windKph} km/h`,
          forecast: `${w.daily[0]?.rainfallMm || 0}mm today, POP ${(w.daily[0]?.pop || 0) * 100}%`,
          moisture:
            w.soilMoistureVolumetric !== null
              ? `${Math.round(w.soilMoistureVolumetric * 100)}%`
              : '—',
          daily: w.daily,
        });
      } catch (e) { }
    };

    if (currentLandLocation) {
      getForecast(currentLandLocation.lat, currentLandLocation.lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => getForecast(pos.coords.latitude, pos.coords.longitude),
        () => getForecast(28.6139, 77.209),
      );
    } else {
      getForecast(28.6139, 77.209);
    }
  }, [currentLandLocation]);

  const [dynamicAdvice, setDynamicAdvice] = useState<any>(null);

  useEffect(() => {
    const fetchDynamicAdvice = async () => {
      setDynamicAdvice(null);
      try {
        const metricsText = adviceMode === 'manual' 
          ? `Manual Soil Test Results: Nitrogen ${manualMetrics.nitrogen}mg/kg, Phosphorus ${manualMetrics.phosphorus}mg/kg, Potassium ${manualMetrics.potassium}mg/kg, pH ${manualMetrics.ph}, Moisture ${manualMetrics.moisture}%`
          : `Simulated Sensor Data: Soil Moisture ${liveWeather.moisture}, Temp ${liveWeather.temp}`;

        const prompt = `Act as an expert agronomist. Provide practical farming advice for ${selectedCrop} at the ${selectedStage} growth stage. 
        Soil Data: ${metricsText}. 
        Atmospheric Data: Temp ${liveWeather.temp}, humidity ${liveWeather.humidity}. 
        
        IMPORTANT: Use these specific numbers to give precise chemical/organic recommendations. 
        If the data matches 'Simulated Sensor Data', explicitly add a note at the end of every recommendation field: "(Verified via manual test recommended)".
        
        Output ONLY a JSON object (no markdown, no extra text) with EXACTLY these string keys: "irrigation", "fertilizer", "pestControl", "bestPractices", "weatherAdvice". Keep values concise and actionable.`;

        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, locale: 'en' })
        });

        const data = await response.json();
        if (data && data.reply) {
          const rawText = data.reply;
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            setDynamicAdvice({
              irrigation: parsed.irrigation || 'Data unavailable',
              fertilizer: parsed.fertilizer || 'Data unavailable',
              pestControl: parsed.pestControl || 'Data unavailable',
              bestPractices: parsed.bestPractices || 'Data unavailable',
              weatherAdvice: parsed.weatherAdvice || 'Data unavailable',
              priority: 'medium' as Priority
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic AI advice", err);
      }
    };

    fetchDynamicAdvice();
  }, [selectedCrop, selectedStage, liveWeather.temp, adviceMode, manualMetrics]);

  const getCurrentAdvice = () => {
    if (dynamicAdvice) return dynamicAdvice;

    const cropData = cropAdvice[selectedCrop as keyof typeof cropAdvice];
    if (!cropData) {
      return {
        irrigation: 'Crop-specific advice not available.',
        fertilizer: 'Crop-specific advice not available.',
        pestControl: 'Crop-specific advice not available.',
        bestPractices: 'Crop-specific advice not available.',
        weatherAdvice: 'Crop-specific advice not available.',
        priority: 'medium' as Priority,
      };
    }
    const stageData = cropData[selectedStage];
    if (!stageData) {
      return {
        irrigation: 'Stage-specific advice not available.',
        fertilizer: 'Stage-specific advice not available.',
        pestControl: 'Stage-specific advice not available.',
        bestPractices: 'Stage-specific advice not available.',
        weatherAdvice: 'Stage-specific advice not available.',
        priority: 'medium' as Priority,
      };
    }
    return stageData;
  };

  const generatePDF = React.useCallback(() => {
    const cropName = crops.find((c) => c.id === selectedCrop)?.name || 'Crop';
    const stageName = stages.find((s) => s.id === selectedStage)?.name || 'Stage';
    const advice = getCurrentAdvice();

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('உழவன் X', 15, 20);

    doc.setFontSize(10);
    doc.text('AI Crop Advisor Report', 15, 28);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 15, 34);

    doc.setFillColor(240, 240, 240);
    doc.rect(15, 50, pageWidth - 30, 25, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Crop: ${cropName}`, 20, 60);
    doc.text(`Stage: ${stageName}`, 20, 68);

    autoTable(doc, {
      startY: 90,
      head: [['Parameter', 'Value']],
      body: [
        ['Temperature', liveWeather.temp],
        ['Humidity', liveWeather.humidity],
        ['Wind', liveWeather.wind],
        ['Soil Moisture', liveWeather.moisture],
      ],
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });

    let y = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Recommendations', 15, y); y += 8;
    doc.setFontSize(9);
    doc.text(`Irrigation: ${advice.irrigation}`, 15, y); y += 10;
    doc.text(`Fertilizer: ${advice.fertilizer}`, 15, y); y += 10;
    doc.text(`Pest Control: ${advice.pestControl}`, 15, y);

    doc.save(`Uzhavan_X_${cropName}_${Date.now()}.pdf`);
  }, [selectedCrop, selectedStage, liveWeather]);

  const { addToast } = useToast();

  const saveCurrentAdvice = React.useCallback(() => {
    try {
      const advice = getCurrentAdvice();
      const entry = {
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        crop: selectedCrop,
        stage: selectedStage,
        advice,
      };
      const existing = JSON.parse(localStorage.getItem('savedAdvice') || '[]');
      existing.unshift(entry);
      localStorage.setItem('savedAdvice', JSON.stringify(existing.slice(0, 50)));
      addToast({
        type: 'success',
        title: 'Advice saved',
        message: `${selectedCrop} - ${selectedStage} advice saved.`,
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Save failed', message: 'Could not save advice' });
    }
  }, [selectedCrop, selectedStage, addToast]);

  const [showSavedModal, setShowSavedModal] = React.useState(false);
  const [savedItems, setSavedItems] = React.useState<any[]>([]);

  const refreshSaved = React.useCallback(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('savedAdvice') || '[]');
      setSavedItems(arr);
    } catch (e) {
      setSavedItems([]);
    }
  }, []);

  React.useEffect(() => {
    if (showSavedModal) refreshSaved();
  }, [showSavedModal, refreshSaved]);

  return (
    <div className={embeddedMode ? "flex w-full h-full overflow-hidden bg-slate-50" : "flex h-screen w-screen overflow-hidden bg-slate-50"}>
      {!embeddedMode && (
        <div className="hidden lg:flex flex-col w-80 bg-white shadow-premium border-r border-emerald-50 h-screen shrink-0">
          <div className="p-8 border-b border-emerald-50">
            <h1 className="text-3xl font-black tracking-tighter">
              <span className="text-slate-900">உழவன்</span>
              <span className="text-emerald-600"> X</span>
            </h1>
          </div>
          <nav className="p-6 space-y-3">
             {[
              { id: 'dashboard', icon: 'Home', label: 'Main Dashboard' },
              { id: 'advice', icon: 'Zap', label: 'AGRI INTELLIGENCE', active: true },
             ].map(item => (
               <button key={item.id} onClick={() => navigate('/farm-owner')} className={`w-full flex items-center space-x-4 px-6 py-5 rounded-[2rem] font-black uppercase text-xs ${item.active ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
                 <Icon name={item.icon as any} className="h-6 w-6" />
                 <span>{item.label}</span>
               </button>
             ))}
          </nav>
        </div>
      )}

      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-3xl border-b border-emerald-50 shadow-sm px-10 py-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400">
              <Icon name="BrainCircuit" className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">AI Advisor</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200">
              <button 
                onClick={() => setAdviceMode('iot')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${adviceMode === 'iot' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
              >
                📡 IoT Sensors
              </button>
              <button 
                onClick={() => setAdviceMode('manual')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${adviceMode === 'manual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}
              >
                🧪 Manual Test
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={generatePDF} className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 hover:bg-black transition-all">
                <Icon name="Download" className="h-4 w-4" />
                <span className="font-black text-[10px] uppercase">Report</span>
              </button>
              <button onClick={saveCurrentAdvice} className="bg-white border border-emerald-600 text-emerald-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-50">
                Sync Data
              </button>
              <button onClick={() => setShowSavedModal(true)} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900">
                <Icon name="History" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {adviceMode === 'iot' && (
          <div className="mx-10 mt-6 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-4">
             <Icon name="AlertTriangle" className="h-6 w-6 text-amber-500 animate-pulse" />
             <div>
               <p className="text-[11px] font-black text-amber-900 uppercase tracking-widest">⚠️ Demo Mode Alert</p>
               <p className="text-xs text-amber-800 font-medium">Using simulated hardware metrics for demonstration. Please perform a physical soil test or connect real IoT sensors for accurate decisions.</p>
             </div>
             <button onClick={() => setAdviceMode('manual')} className="ml-auto bg-amber-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600">
               Verify Manually
             </button>
          </div>
        )}

        {adviceMode === 'manual' && (
          <div className="mx-10 mt-6 p-8 rounded-[2.5rem] bg-blue-50/50 border border-blue-100">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight">Manual Soil Geochemistry Analysis</h3>
               <div className="bg-blue-600 text-white p-3 rounded-2xl">
                 <Icon name="FlaskConical" className="h-6 w-6" />
               </div>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
               {[
                 { id: 'nitrogen', label: 'Nitrogen (mg/kg)' },
                 { id: 'phosphorus', label: 'Phosphorus (mg/kg)' },
                 { id: 'potassium', label: 'Potassium (mg/kg)' },
                 { id: 'ph', label: 'pH Level' },
                 { id: 'moisture', label: 'Moisture (%)' }
               ].map(field => (
                 <div key={field.id} className="space-y-2">
                   <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">{field.label}</label>
                   <input 
                     type="text"
                     value={(manualMetrics as any)[field.id]}
                     onChange={(e) => setManualMetrics({...manualMetrics, [field.id]: e.target.value})}
                     className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-blue-100 focus:border-blue-500 outline-none font-bold text-slate-700 shadow-sm"
                     placeholder="Val..."
                   />
                 </div>
               ))}
             </div>
          </div>
        )}

        <div className="p-10 space-y-10 max-w-7xl mx-auto">
          {lands && lands.length > 0 && (
            <div className="bg-slate-900 rounded-[3.5rem] p-12 relative overflow-hidden text-white shadow-premium">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center">
                    <Icon name="MapPin" className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-black uppercase">Land Sector</h2>
                </div>
                <select
                  value={selectedLandIndex}
                  onChange={(e) => { setSelectedLandIndex(parseInt(e.target.value)); setSelectedPartIndex(0); }}
                  className="bg-slate-800 text-white px-6 py-3 rounded-[1.5rem] border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xs uppercase"
                >
                  {lands.map((land: any, index: number) => (
                    <option key={index} value={index}>{(land.name || land.location || `Sector ${index + 1}`).split(' - ')[0]}</option>
                  ))}
                </select>
              </div>

              {(lands[selectedLandIndex]?.parts?.length ?? 0) > 1 && (
                <div className="flex gap-4 mb-8">
                  {lands[selectedLandIndex]?.parts?.map((p: any, i: number) => (
                    <button key={i} onClick={() => setSelectedPartIndex(i)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPartIndex === i ? 'bg-emerald-600 text-white' : 'bg-white/5 text-emerald-100/60 hover:bg-white/10'}`}>
                      Segment {i + 1} ({p.crop})
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Crop', val: lands[selectedLandIndex]?.parts?.[selectedPartIndex]?.crop || lands[selectedLandIndex]?.crop || 'Null', icon: 'Sprout' },
                  { label: 'Stage', val: lands[selectedLandIndex]?.parts?.[selectedPartIndex]?.stage || lands[selectedLandIndex]?.stage || 'Growing', icon: 'RefreshCcw' },
                  { label: 'Acreage', val: `${lands[selectedLandIndex]?.parts?.[selectedPartIndex]?.area || lands[selectedLandIndex]?.acreage || 'N/A'} AC`, icon: 'Maximize' },
                  { label: 'Soil Type', val: lands[selectedLandIndex]?.soilType || 'UNSPECIFIED', icon: 'FlaskConical' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                       <Icon name={item.icon as any} className="h-3 w-3 text-emerald-500" />
                       <p className="text-emerald-100/40 text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                    </div>
                    <p className="font-black text-lg uppercase truncate">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-premium p-8 border border-slate-50">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 italic">Meteorological Intel</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Temp', val: liveWeather.temp, icon: 'Thermometer', color: 'text-rose-500' },
                  { label: 'Humidity', val: liveWeather.humidity, icon: 'Droplets', color: 'text-blue-500' },
                  { label: 'Forecase', val: liveWeather.forecast.split(' ')[0], icon: 'CloudRain', color: 'text-slate-500' },
                  { label: 'Wind', val: liveWeather.wind, icon: 'Wind', color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 rounded-[2.5rem] p-6 text-center">
                    <Icon name={stat.icon as any} className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
                    <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50">
               <h2 className="text-2xl font-black text-slate-900 uppercase mb-8 tracking-tighter">Select Stage</h2>
               <div className="space-y-4">
                 {stages.map(stage => (
                   <button key={stage.id} onClick={() => setSelectedStage(stage.id)} className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-6 transition-all ${selectedStage === stage.id ? 'border-emerald-600 bg-emerald-50 translate-x-2 shadow-lg' : 'border-slate-50 bg-slate-50/50 hover:bg-white'}`}>
                     <span className="text-3xl">{stage.icon}</span>
                     <div>
                       <h3 className={`font-black uppercase text-sm ${selectedStage === stage.id ? 'text-emerald-900' : 'text-slate-700'}`}>{stage.name}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">{stage.description}</p>
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-8">
            {(() => {
              const advice = getCurrentAdvice();
              const crop = crops.find(c => c.id === selectedCrop);
              const stage = stages.find(s => s.id === selectedStage);
              return (
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-[2rem] p-8 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{crop?.icon}</span>
                    <span className="font-black text-lg uppercase">{crop?.name}</span>
                    <span className="text-white/50">·</span>
                    <span className="text-sm font-bold opacity-80">{stage?.name} Stage</span>
                  </div>
                  <h3 className="font-black text-xl mb-1 leading-snug underline decoration-emerald-300 decoration-2 underline-offset-4 mb-4">📋 Today's Action Plan</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">{advice.bestPractices}</p>
                </div>
              );
            })()}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                const advice = getCurrentAdvice();
                return (
                  <>
                    {[
                      { title: 'Hydration', val: advice.irrigation, icon: 'Droplet', color: 'text-blue-600', bg: 'bg-blue-50' },
                      { title: 'Nutrients', val: advice.fertilizer, icon: 'Leaf', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { title: 'Bio-Guard', val: advice.pestControl, icon: 'ShieldAlert', color: 'text-amber-600', bg: 'bg-amber-50' }
                    ].map((card, i) => (
                      <div key={i} className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50">
                        <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-8`}>
                          <Icon name={card.icon as any} className={`h-8 w-8 ${card.color}`} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-6">{card.title}</h3>
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic">"{card.val}"</p>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 right-10 z-50">
        <AIChatLauncher initialContext={`Crop=${selectedCrop}, Stage=${selectedStage}`} positionClassName="relative" />
      </div>

      <AnimatePresence>
        {showSavedModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3.5rem] p-12 max-w-3xl w-full shadow-supreme border border-white">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase ">Saved AI Insights</h3>
                <button onClick={() => setShowSavedModal(false)} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900">
                  <Icon name="X" className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {savedItems.length === 0 ? (
                  <p className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">No saved insights yet</p>
                ) : (
                  savedItems.map((item) => (
                    <div key={item.id} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                      <h4 className="font-black text-slate-900 uppercase text-lg tracking-tight mb-1">{item.crop}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">{new Date(item.savedAt).toLocaleDateString()} · {item.stage}</p>
                      <p className="text-slate-600 font-medium italic opacity-80 border-t pt-4">"{item.advice?.irrigation.substring(0, 100)}..."</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICropAdvisor;
