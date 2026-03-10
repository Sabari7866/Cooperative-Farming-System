import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Icon from './Icon';
import { fetchLiveWeather, deriveIrrigationAdvice } from '../utils/weather';
import { useLands } from '../hooks/useApi';
import { useI18n } from '../utils/i18n';
import { useToast } from './Toast';
import ThemeToggle from './ThemeToggle';
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
  const { data: lands } = useLands();
  const [selectedLandIndex, setSelectedLandIndex] = useState<number>(0);
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

  useEffect(() => {
    // Auto-detect from user's lands: use the selected land
    if (lands && lands.length > 0 && selectedLandIndex < lands.length) {
      const selectedLand = lands[selectedLandIndex] as any;
      const stageMap: Record<string, StageId> = {
        preparation: 'sowing',
        sowing: 'sowing',
        growing: 'growing',
        flowering: 'flowering',
        harvest: 'harvest',
      };

      // Set land coordinates for weather
      if (selectedLand.latitude && selectedLand.longitude) {
        setCurrentLandLocation({
          lat: parseFloat(selectedLand.latitude),
          lon: parseFloat(selectedLand.longitude),
        });
      }

      // Auto-select crop and stage from the selected land
      if (Array.isArray(selectedLand.crops) && selectedLand.crops.length > 0) {
        const first = selectedLand.crops[0];
        const cropId = (first.crop || '').toLowerCase();
        if (['rice', 'cotton', 'wheat', 'corn', 'sugarcane', 'soybean'].includes(cropId)) {
          setSelectedCrop(cropId as CropId);
        }
        const mapped = stageMap[(first.stage || '').toLowerCase()] || 'growing';
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
  }, [lands, selectedLandIndex]);

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

    // Use land-specific coordinates if available, otherwise use geolocation
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

  const getCurrentAdvice = () => {
    // Safety check: return default advice if crop data doesn't exist
    const cropData = cropAdvice[selectedCrop as keyof typeof cropAdvice];
    if (!cropData) {
      return {
        irrigation:
          'Crop-specific advice not available. Consult local agricultural extension services.',
        fertilizer:
          'Crop-specific advice not available. Use soil testing for fertilizer recommendations.',
        pestControl:
          'Crop-specific advice not available. Monitor regularly and use integrated pest management.',
        bestPractices:
          'Crop-specific advice not available. Follow general best practices for your region.',
        weatherAdvice: 'Crop-specific advice not available. Monitor weather conditions regularly.',
        priority: 'medium' as Priority,
      };
    }
    const stageData = cropData[selectedStage];
    if (!stageData) {
      return {
        irrigation:
          'Stage-specific advice not available. Consult local agricultural extension services.',
        fertilizer:
          'Stage-specific advice not available. Use soil testing for fertilizer recommendations.',
        pestControl:
          'Stage-specific advice not available. Monitor regularly and use integrated pest management.',
        bestPractices:
          'Stage-specific advice not available. Follow general best practices for your region.',
        weatherAdvice: 'Stage-specific advice not available. Monitor weather conditions regularly.',
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

    // Header with branding
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AgriSmart', 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI Crop Advisor Report', 15, 28);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 15, 34);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CROP REPORT', pageWidth - 15, 25, { align: 'right' });

    // Crop Info Box
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 50, pageWidth - 30, 25, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Crop: ${cropName}`, 20, 60);
    doc.text(`Stage: ${stageName}`, 20, 68);

    // Weather Section
    doc.setFontSize(14);
    doc.text('Weather Conditions', 15, 85);

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

    // Recommendations
    let y = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Recommendations', 15, y);

    y += 8;
    doc.setFontSize(10);
    doc.text('Irrigation:', 15, y);
    y += 5;
    doc.setFontSize(9);
    const irrigText = doc.splitTextToSize(advice.irrigation, pageWidth - 30);
    doc.text(irrigText, 15, y);
    y += irrigText.length * 4 + 6;

    doc.setFontSize(10);
    doc.text('Fertilizer:', 15, y);
    y += 5;
    doc.setFontSize(9);
    const fertText = doc.splitTextToSize(advice.fertilizer, pageWidth - 30);
    doc.text(fertText, 15, y);
    y += fertText.length * 4 + 6;

    doc.setFontSize(10);
    doc.text('Pest Control:', 15, y);
    y += 5;
    doc.setFontSize(9);
    const pestText = doc.splitTextToSize(advice.pestControl, pageWidth - 30);
    doc.text(pestText, 15, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.text('AgriSmart - AI Crop Advisor', pageWidth / 2, footerY, { align: 'center' });

    doc.save(`AgriSmart_${cropName}_${stageName}_${Date.now()}.pdf`);
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-green-500 bg-green-50';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <Icon name="AlertTriangle" className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <Icon name="Eye" className="h-5 w-5 text-yellow-600" />;
      default:
        return <Icon name="CheckCircle" className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className={embeddedMode ? "flex w-full h-full overflow-hidden bg-slate-50" : "flex h-screen w-screen overflow-hidden bg-slate-50"}>
      {/* Agri Elite Sidebar - hidden in embedded mode */}
      <div className={embeddedMode ? "hidden" : "hidden lg:flex flex-col w-80 bg-white/70 backdrop-blur-3xl shadow-premium border-r border-emerald-50 relative overflow-hidden h-screen elite-border-glow shrink-0"}>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-green-400 to-amber-400"></div>

        <div className="p-8 border-b border-emerald-50/50 relative z-10">
          <div className="flex flex-col gap-4">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate('/farm-owner')}
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center border border-emerald-50 group hover:rotate-6 transition-transform">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter leading-none">
                  <span className="text-slate-900">Agri</span>
                  <span className="text-emerald-600">Smart</span>
                </h1>
                <p className="text-[10px] text-emerald-600/60 font-black tracking-[0.1em] uppercase mt-2 italic">The future of farming is smart.</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-6 flex-grow overflow-y-auto space-y-6 custom-scrollbar">
          <ul className="space-y-3">
            {[
              { id: 'dashboard', icon: 'Home', label: 'Main Dashboard' },
              { id: 'doctor', icon: 'Crown', label: 'AGRI DOCTOR', badge: 'v12.0' },
              { id: 'advice', icon: 'Zap', label: 'AGRI INTELLIGENCE', active: true },
              { id: 'land', icon: 'MapPin', label: t('nav_my_land') },
              { id: 'jobs', icon: 'Users', label: t('nav_posted_jobs') },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate('/farm-owner')}
                  className={`w-full flex items-center space-x-4 px-6 py-5 rounded-[2rem] transition-all duration-300 group relative ${item.active
                    ? 'bg-emerald-600 text-white shadow-premium'
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                >
                  <Icon name={item.icon as any} className={`h-6 w-6 transition-transform duration-300 ${item.active ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`} />
                  <span className={`font-black tracking-tight text-sm uppercase ${item.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full font-black text-white bg-amber-500 shadow-sm border border-white/20">
                      {item.badge}
                    </span>
                  )}
                  {item.active && (
                    <div className="absolute left-0 w-1.5 h-8 bg-white/50 rounded-full ml-1" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 bg-emerald-50/30 border-t border-emerald-50/50">
          <div className="flex items-center space-x-4 p-4 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">EA</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate uppercase">Agri Admin</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <p className="text-[9px] text-emerald-800 font-black truncate uppercase">Premium Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={embeddedMode ? "flex-1 relative" : "flex-1 overflow-y-auto custom-scrollbar relative"}>
        {/* Elite Hub Header */}
        <div className={embeddedMode
          ? "bg-white/80 backdrop-blur-3xl border-b border-emerald-50 shadow-sm px-6 py-3"
          : "sticky top-0 z-40 bg-white/80 backdrop-blur-3xl border-b border-emerald-50 shadow-sm px-10 py-8"
        }>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={embeddedMode ? "w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-premium" : "w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-premium"}>
                <Icon name="BrainCircuit" className={embeddedMode ? "h-5 w-5 text-emerald-400" : "h-10 w-10 text-emerald-400"} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className={embeddedMode ? "text-lg font-black text-slate-900 tracking-tighter uppercase" : "text-4xl font-black text-slate-900 tracking-tighter uppercase"}>{t('ai_crop_advisor_title')}</h1>
                  <span className="px-2 py-0.5 bg-emerald-600 text-[9px] font-black text-white rounded-full tracking-[0.2em] shadow-glow">SMART CORE ACTIVE</span>
                </div>
                {!embeddedMode && <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-xs italic">"To a farmer, the land is everything."</p>}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!embeddedMode && (
                <div className="flex flex-col items-end mr-6 pr-6 border-r border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Optimization</span>
                  <span className="text-sm font-black text-emerald-600 uppercase">99.8% Efficient</span>
                </div>
              )}
              <button
                onClick={generatePDF}
                className={embeddedMode
                  ? "group bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-black transition-all shadow-sm"
                  : "group bg-slate-900 text-white px-8 py-4 rounded-[2rem] flex items-center space-x-4 hover:bg-black transition-all hover:scale-[1.02] shadow-premium"
                }
              >
                <Icon name="Download" className={embeddedMode ? "h-4 w-4 text-emerald-400" : "h-5 w-5 text-emerald-400"} />
                <span className="font-black text-xs uppercase tracking-widest leading-none">{t('download_report')}</span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveCurrentAdvice}
                  className={embeddedMode
                    ? "bg-white border border-emerald-100 text-slate-900 px-3 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                    : "bg-white border border-emerald-100 text-slate-900 px-6 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                  }
                >
                  Sync Agri Data
                </button>
                <button
                  onClick={() => setShowSavedModal(true)}
                  className={embeddedMode ? "px-2 py-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-all" : "px-4 py-4 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"}
                >
                  <Icon name="History" className={embeddedMode ? "h-4 w-4" : "h-6 w-6"} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10 max-w-7xl mx-auto">
          {/* Selected Land HUD - Elite Design */}
          {lands && lands.length > 0 && (
            <div className="relative group rounded-[3.5rem] overflow-hidden shadow-premium">
              <div className="absolute inset-0 bg-slate-900 transition-colors duration-1000 group-hover:bg-black"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

              <div className="relative p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                      <Icon name="MapPin" className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Operational Land Sector</h2>
                  </div>
                  {lands.length > 1 && (
                    <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] p-2 flex items-center gap-4 pl-6 border border-white/5 group-hover:border-emerald-500/30 transition-all">
                      <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Relay Sector:</label>
                      <select
                        value={selectedLandIndex}
                        onChange={(e) => setSelectedLandIndex(parseInt(e.target.value))}
                        className="bg-slate-900 text-white px-6 py-3 rounded-[1.5rem] border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xs uppercase"
                      >
                        {lands.map((land: any, index: number) => (
                          <option key={index} value={index}>
                            {land.name || land.location || `Sector ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {(() => {
                  const currentLand = lands[selectedLandIndex] as any;
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                      {[
                        { label: 'Identifier', val: currentLand.name || currentLand.location || 'Unknown', icon: 'Fingerprint' },
                        { label: 'Coordinate', val: currentLand.location || 'LAT/LON SECURE', icon: 'Compass' },
                        { label: 'Cultivar', val: Array.isArray(currentLand.crops) && currentLand.crops.length > 0 ? currentLand.crops[0].crop : currentLand.crop || 'Null', icon: 'Sprout' },
                        { label: 'Dimension', val: `${currentLand.acreage || currentLand.area || 'N/A'} AC`, icon: 'Maximize' },
                        { label: 'Geochemistry', val: currentLand.soilType || 'UNSPECIFIED', icon: 'FlaskConical' },
                        { label: 'Cycle Status', val: Array.isArray(currentLand.crops) && currentLand.crops.length > 0 ? currentLand.crops[0].stage : currentLand.stage || 'ACTIVE', icon: 'RefreshCcw' }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-2 mb-4">
                            <Icon name={item.icon as any} className="h-3 w-3 text-emerald-500" />
                            <p className="text-emerald-100/40 text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                          </div>
                          <p className="font-black text-white text-lg truncate uppercase">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Weather Interface - Elite HUD */}
            <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Icon name="Activity" className="w-40 h-40" />
              </div>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Meteorological Intelligence</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Icon name="Wifi" className="h-3 w-3 text-emerald-500" />
                    Real-time Synchronization: Optimal
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                  LIVE FEED
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'Temperature', val: liveWeather.temp, icon: 'Thermometer', color: 'rose' },
                  { label: 'Atmosphere', val: liveWeather.humidity, icon: 'Droplets', color: 'blue' },
                  { label: 'Precipitation', val: liveWeather.forecast.split(' ')[0], icon: 'CloudRain', color: 'slate' },
                  { label: 'Kinetic Flow', val: liveWeather.wind, icon: 'Wind', color: 'emerald' },
                ].map((stat, i) => (
                  <div key={i} className="relative group/stat bg-slate-50 rounded-[2.5rem] p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-emerald-50">
                    <div className={`bg-${stat.color}-500/10 p-4 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover/stat:rotate-6 transition-transform`}>
                      <Icon name={stat.icon as any} className={`h-8 w-8 text-${stat.color}-500`} />
                    </div>
                    <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.val}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group/alert">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <Icon name="Waves" className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Hydraulic Metric</p>
                      <h3 className="text-2xl font-black text-white">Soil Moisture: <span className="text-emerald-400">{liveWeather.moisture}</span></h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mb-1">Status Protocol</p>
                    <p className="text-white font-bold opacity-80 italic">Predictive Alignment Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Stage Selection - Elite Vertical HUD */}
            <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{t('select_stage')}</h2>
                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center scale-75">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
                </span>
              </div>

              <div className="space-y-4">
                {stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all duration-500 flex items-center gap-6 group relative overflow-hidden ${selectedStage === stage.id
                      ? 'border-emerald-600 bg-emerald-50 shadow-lg translate-x-2'
                      : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-emerald-100'
                      }`}
                  >
                    {selectedStage === stage.id && (
                      <div className="absolute left-0 top-0 w-1.5 h-full bg-emerald-600" />
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 ${selectedStage === stage.id ? 'bg-white shadow-sm rotate-6' : 'bg-white group-hover:scale-110'}`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-black uppercase tracking-tighter text-sm mb-1 ${selectedStage === stage.id ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {stage.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                        {stage.description}
                      </p>
                    </div>
                    {selectedStage === stage.id && (
                      <Icon name="CheckCircle" className="h-6 w-6 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <p className="text-[10px] text-amber-800 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Icon name="Info" className="h-4 w-4 shrink-0" />
                  Neural Auto-Detection Integrated
                </p>
              </div>
            </div>
          </div>

          {/* Action Hub - Elite Cards */}
          <div className="space-y-8">

            {/* ── Today's Action Plan Banner ── */}
            {(() => {
              const advice = getCurrentAdvice();
              const crop = crops.find(c => c.id === selectedCrop);
              const stage = stages.find(s => s.id === selectedStage);
              const priorityConfig = {
                high: { bg: 'from-red-600 to-rose-700', badge: 'bg-red-800/40 text-red-100', label: '🔴 High Priority', tamil: 'அதிக முக்கியம்' },
                medium: { bg: 'from-amber-500 to-orange-600', badge: 'bg-amber-800/40 text-amber-100', label: '🟡 Medium Priority', tamil: 'நடுத்தர முக்கியம்' },
                low: { bg: 'from-emerald-600 to-green-700', badge: 'bg-emerald-800/40 text-emerald-100', label: '🟢 Low Priority', tamil: 'குறைந்த முக்கியம்' },
              };
              const p = priorityConfig[advice.priority as keyof typeof priorityConfig] || priorityConfig.medium;
              return (
                <div className={`bg-gradient-to-r ${p.bg} rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl`}>
                  <div className="absolute right-0 top-0 opacity-10 p-6">
                    <Icon name="ClipboardList" className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-2xl">{crop?.icon}</span>
                      <span className="font-black text-lg uppercase tracking-tight">{crop?.name}</span>
                      <span className="text-white/50">·</span>
                      <span className="text-sm font-bold opacity-80">{stage?.icon} {stage?.name} Stage</span>
                      <span className={`ml-auto px-3 py-1 rounded-full text-xs font-black ${p.badge}`}>{p.label}</span>
                    </div>
                    <h3 className="font-black text-xl mb-1 leading-snug">📋 Today's Action Plan</h3>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">{advice.bestPractices}</p>
                  </div>
                </div>
              );
            })()}

            {/* ── 5 Advice Cards ── */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                const advice = getCurrentAdvice();
                return (
                  <>
                    <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50 relative group hover:-translate-y-2 transition-all duration-500">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Icon name="Droplet" className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-6">Hydration Protocol</h3>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[160px]">
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic">"{advice.irrigation}"</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority Status: Optimal</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50 relative group hover:-translate-y-2 transition-all duration-500">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Icon name="Leaf" className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-6">Nutrient Strategy</h3>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[160px]">
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic">"{advice.fertilizer}"</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chemical Alignment: Verified</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50 relative group hover:-translate-y-2 transition-all duration-500">
                      <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Icon name="ShieldAlert" className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-6">Bio-Guard HUD</h3>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[160px]">
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic">"{advice.pestControl}"</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Threat Vector: Isolated</span>
                      </div>
                    </div>

                    {/* Best Practices Card */}
                    <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50 relative group hover:-translate-y-2 transition-all duration-500">
                      <div className="w-16 h-16 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Icon name="BookOpen" className="h-8 w-8 text-violet-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-6">Best Practices</h3>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[160px]">
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic">"{advice.bestPractices}"</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Field Protocol: Active</span>
                      </div>
                    </div>

                    {/* Weather Advisory Card */}
                    <div className="bg-white rounded-[3rem] shadow-premium p-10 border border-slate-50 relative group hover:-translate-y-2 transition-all duration-500">
                      <div className="w-16 h-16 bg-sky-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Icon name="CloudSun" className="h-8 w-8 text-sky-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-6">Weather Advisory</h3>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[160px]">
                        <p className="text-slate-600 text-lg font-medium leading-relaxed italic">"{advice.weatherAdvice}"</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Forecast: Synced</span>
                      </div>
                    </div>

                    {/* Quick Tips Card */}
                    <div className="bg-slate-900 rounded-[3rem] shadow-premium p-10 border border-slate-800 relative group hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Icon name="Lightbulb" className="w-24 h-24 text-amber-400" />
                      </div>
                      <div className="w-16 h-16 bg-amber-400/20 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Icon name="Zap" className="h-8 w-8 text-amber-400" />
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-6">Quick Tips</h3>
                      <ul className="space-y-4">
                        {[
                          '🌡️ Monitor temperature daily',
                          '💧 Check soil moisture every morning',
                          '🔍 Inspect leaves for pests weekly',
                          '📓 Maintain a crop diary',
                        ].map((tip, i) => (
                          <li key={i} className="text-slate-300 text-sm font-medium leading-relaxed flex items-start gap-2">
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">General Agri Guidelines</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </main>

      {/* AI Bot Launcher */}
      <div className="fixed bottom-10 right-10 z-50">
        <AIChatLauncher
          initialContext={`Crop=${selectedCrop}, Stage=${selectedStage}, Weather=${liveWeather.temp}`}
          positionClassName="relative"
        />
      </div>

      {/* Elite Saved Advice Modal */}
      <AnimatePresence>
        {showSavedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center z-[100] p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] p-12 max-w-3xl w-full shadow-supreme border border-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Icon name="History" className="w-40 h-40" />
              </div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase ">AgriSmart Record Hub</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saved Intelligence Logs</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      localStorage.removeItem('savedAdvice');
                      refreshSaved();
                      toast.success('Neural logs wiped.');
                    }}
                    className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                  >
                    Wipe Logs
                  </button>
                  <button
                    onClick={() => setShowSavedModal(false)}
                    className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-200"
                  >
                    <Icon name="X" className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-4 relative z-10">
                {savedItems.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <Icon name="Database" className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No records found in neural sector</p>
                  </div>
                ) : (
                  savedItems.map((item) => (
                    <div key={item.id} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                            <Icon name="Zap" className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 uppercase text-lg tracking-tight mb-1">{item.crop} <span className="text-emerald-600">Smart Insight</span></h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stage Alignment: {item.stage}</p>
                          </div>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(item.savedAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-slate-600 font-medium italic opacity-80 border-t border-slate-100 pt-4 mt-4">"{item.advice?.irrigation.substring(0, 100)}..."</p>
                      <button
                        onClick={() => {
                          const arr = savedItems.filter((s) => s.id !== item.id);
                          localStorage.setItem('savedAdvice', JSON.stringify(arr));
                          setSavedItems(arr);
                          toast.success('Record purged.');
                        }}
                        className="mt-6 text-[9px] font-black text-rose-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Purge Record
                      </button>
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
