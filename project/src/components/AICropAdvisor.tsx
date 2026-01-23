import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { fetchLiveWeather, deriveIrrigationAdvice } from '../utils/weather';
import { useLands } from '../hooks/useApi';
import { useI18n } from '../utils/i18n';
import { useToast } from './Toast';
import ThemeToggle from './ThemeToggle';
import AIChatLauncher from './AIChatLauncher';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AICropAdvisor = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedCrop, setSelectedCrop] = useState<CropId>('rice');
  const [selectedStage, setSelectedStage] = useState<StageId>('growing');
  const { data: lands } = useLands();

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
    // Auto-detect from user's lands: prefer first multi-crop if available, else use land crop
    if (lands && lands.length > 0) {
      const primary = lands[0] as any;
      const stageMap: Record<string, StageId> = {
        preparation: 'sowing',
        sowing: 'sowing',
        growing: 'growing',
        flowering: 'flowering',
        harvest: 'harvest',
      };

      if (Array.isArray(primary.crops) && primary.crops.length > 0) {
        const first = primary.crops[0];
        const cropId = (first.crop || '').toLowerCase();
        if (['rice', 'cotton', 'wheat', 'corn', 'sugarcane', 'soybean'].includes(cropId)) {
          setSelectedCrop(cropId as CropId);
        }
        const mapped = stageMap[(first.stage || '').toLowerCase()] || 'growing';
        setSelectedStage(mapped);
      } else {
        const cropId = (primary.crop || '').toLowerCase();
        if (['rice', 'cotton', 'wheat', 'corn', 'sugarcane', 'soybean'].includes(cropId)) {
          setSelectedCrop(cropId as CropId);
        }
        const mapped = stageMap[(primary.status || primary.stage || '').toLowerCase()] || 'growing';
        setSelectedStage(mapped);
      }
    }

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
      } catch (e) {}
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => getForecast(pos.coords.latitude, pos.coords.longitude),
        () => getForecast(28.6139, 77.209),
      );
    } else {
      getForecast(28.6139, 77.209);
    }
  }, [lands]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/farm-owner');
                  }
                }}
                aria-label={t('back') || 'Back'}
                title={t('back') || 'Back'}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Icon name="ArrowLeft" className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 p-2 rounded-xl">
                  <Icon name="Sprout" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-800">{t('ai_crop_advisor_title')}</h1>
                  <p className="text-sm text-gray-600">{t('ai_crop_advisor_subtitle')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
            <button
              onClick={generatePDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-md"
            >
              <Icon name="Download" className="h-4 w-4" />
              <span>{t('download_report')}</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={saveCurrentAdvice}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Advice
              </button>
              <button
                onClick={() => setShowSavedModal(true)}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Saved
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Weather Dashboard */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Icon name="CloudRain" className="h-5 w-5 text-blue-600" />
              <span>Current Weather Conditions</span>
              <span className="ml-auto text-sm text-gray-500">Updated 5 mins ago</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-red-50 rounded-lg p-4">
                <Icon name="Thermometer" className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{liveWeather.temp}</p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <Icon name="Droplets" className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{liveWeather.humidity}</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-4">
                <Icon name="CloudRain" className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{liveWeather.forecast}</p>
                <p className="text-sm text-gray-600">Rainfall</p>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <Icon name="Wind" className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{liveWeather.wind}</p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-800 font-medium">
                <strong>Soil Moisture (0-7cm):</strong> {liveWeather.moisture}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-blue-700">
                <span>7-day POP/Rainfall integrated below</span>
              </div>
            </div>
          </div>

          {/* Crop Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('select_crop')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id as CropId)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    selectedCrop === crop.id
                      ? `border-${crop.color}-500 bg-${crop.color}-50 shadow-md`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{crop.icon}</div>
                  <p className="font-medium text-gray-800">{crop.name}</p>
                  <p className="text-xs text-gray-600">{crop.season}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Growth Stage Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('select_stage')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id as StageId)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedStage === stage.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{stage.icon}</div>
                  <h3 className="font-medium text-gray-800">{stage.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Alert */}
          {getCurrentAdvice().priority && (
            <div
              className={`rounded-xl p-4 mb-6 border-l-4 ${getPriorityColor(getCurrentAdvice().priority)}`}
            >
              <div className="flex items-center space-x-2">
                {getPriorityIcon(getCurrentAdvice().priority)}
                <span className="font-semibold">
                  {getCurrentAdvice().priority === 'high'
                    ? 'High Priority Actions Required'
                    : getCurrentAdvice().priority === 'medium'
                      ? 'Medium Priority - Monitor Closely'
                      : 'Low Priority - Routine Care'}
                </span>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Irrigation */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Droplets" className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Irrigation Schedule</h3>
                <Icon name="Zap" className="h-4 w-4 text-yellow-500 ml-auto" />
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-blue-800">
                  {(() => {
                    const advice = deriveIrrigationAdvice(
                      {
                        temperatureC: parseFloat((liveWeather.temp || '0').replace('°C', '')) || 0,
                        humidity: parseFloat((liveWeather.humidity || '0').replace('%', '')) || 0,
                        windKph: parseFloat((liveWeather.wind || '0').replace(' km/h', '')) || 0,
                        soilMoistureVolumetric:
                          liveWeather.moisture === '—'
                            ? null
                            : parseFloat(liveWeather.moisture) / 100,
                        daily: liveWeather.daily,
                      } as any,
                      selectedCrop,
                    );
                    return `${advice.action} — ${advice.reason}`;
                  })()}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" className="h-4 w-4" />
                  <span>{t('next_7_days_rain')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Optimal</span>
                </div>
              </div>
            </div>

            {/* Fertilizer */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Sun" className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold">{t('fertilizer_application')}</h3>
                <Icon name="Zap" className="h-4 w-4 text-yellow-500 ml-auto" />
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-yellow-800">{getCurrentAdvice().fertilizer}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" className="h-4 w-4" />
                  <span>{t('optimal_timing')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Ready</span>
                </div>
              </div>
            </div>

            {/* Pest Control */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Bug" className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold">{t('pest_control')}</h3>
                <Icon name="Zap" className="h-4 w-4 text-yellow-500 ml-auto" />
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <p className="text-red-800">{getCurrentAdvice().pestControl}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" className="h-4 w-4" />
                  <span>{t('monitor_regularly')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Eye" className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-600">Watch</span>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="CheckCircle" className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold">{t('best_practices')}</h3>
                <Icon name="Zap" className="h-4 w-4 text-yellow-500 ml-auto" />
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-green-800">{getCurrentAdvice().bestPractices}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon name="Sprout" className="h-4 w-4" />
                  <span>{t('follow_optimal_yield')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Implement</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Launcher (opens on demand) */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('ask_ai')}</h3>
              <p className="text-sm text-gray-500">
                Tap the green AI orb to open the advisor chat.
              </p>
            </div>
            <AIChatLauncher
              initialContext={`Crop=${selectedCrop}, Stage=${selectedStage}, Weather=${liveWeather.temp}`}
              positionClassName="relative"
            />
          </div>

          {/* Weather-Based Advice */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Icon name="CloudRain" className="h-5 w-5 text-blue-600" />
              <span>{t('weather_recommendations')}</span>
              <Icon name="Zap" className="h-4 w-4 text-yellow-500 ml-auto" />
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-blue-800">{getCurrentAdvice().weatherAdvice}</p>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Action Items</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <Icon name="AlertTriangle" className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <span className="text-red-800 font-medium">
                    Check irrigation system - Due today
                  </span>
                  <p className="text-red-600 text-sm">Critical for current growth stage</p>
                </div>
                <span className="text-red-600 text-sm font-medium">High</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <Icon name="Eye" className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <span className="text-yellow-800 font-medium">
                    Monitor pest activity - Routine check
                  </span>
                  <p className="text-yellow-600 text-sm">Weekly monitoring recommended</p>
                </div>
                <span className="text-yellow-600 text-sm font-medium">Medium</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <Icon name="CloudRain" className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <span className="text-blue-800 font-medium">Weather update - Check forecast</span>
                  <p className="text-blue-600 text-sm">Plan activities based on weather</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Saved Advice Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Saved Advice</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    localStorage.removeItem('savedAdvice');
                    refreshSaved();
                    addToast({
                      type: 'success',
                      title: 'Cleared',
                      message: 'Saved advice cleared',
                    });
                  }}
                  className="text-sm text-red-600"
                >
                  Clear All
                </button>
                <button onClick={() => setShowSavedModal(false)} className="text-sm text-gray-600">
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {savedItems.length === 0 && <div className="text-gray-500">No saved advice yet.</div>}
              {savedItems.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.savedAt).toLocaleString()}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-200">
                        {item.crop} — {item.stage}
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => {
                          const arr = savedItems.filter((s) => s.id !== item.id);
                          localStorage.setItem('savedAdvice', JSON.stringify(arr));
                          setSavedItems(arr);
                          addToast({
                            type: 'success',
                            title: 'Removed',
                            message: 'Saved advice removed',
                          });
                        }}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {item.advice?.irrigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICropAdvisor;
