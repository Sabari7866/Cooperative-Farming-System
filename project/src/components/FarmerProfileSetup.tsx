import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { updateSession, getSession } from '../utils/auth';
import { api } from '../utils/api';
import { useToast, ToastContainer } from './Toast';
import logger from '../utils/logger';

interface CropOption {
  value: string;
  label: string;
}

interface SelectedCrop {
  name: string;
  sowingDate: string;
}

const cropOptions: CropOption[] = [
  { value: 'rice', label: 'Rice' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'corn', label: 'Corn' },
  { value: 'sugarcane', label: 'Sugarcane' },
  { value: 'soybean', label: 'Soybean' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'potato', label: 'Potato' },
  { value: 'onion', label: 'Onion' },
  { value: 'chili', label: 'Chili' },
];

export default function FarmerProfileSetup() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const session = getSession();
  const [formData, setFormData] = useState({
    name: session?.name || '',
    farmAreaAcres: session?.farmAreaAcres?.toString() || '',
    farmLocation: session?.farmLocation || '',
    farmLatitude: session?.farmLatitude || (null as number | null),
    farmLongitude: session?.farmLongitude || (null as number | null),
    currentCrops: [] as SelectedCrop[],
  });

  const [manualCropInput, setManualCropInput] = useState('');
  const [addingCropSowingDate, setAddingCropSowingDate] = useState('');
  const [cropSelectionMode, setCropSelectionMode] = useState<'dropdown' | 'manual'>('dropdown');

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationDetails, setLocationDetails] = useState<{
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  } | null>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddCrop = useCallback(
    (cropName: string) => {
      if (!cropName) return;
      if (!addingCropSowingDate) {
        addToast({ type: 'error', title: 'Date Required', message: 'Please select a sowing date' });
        return;
      }

      if (formData.currentCrops.some((c) => c.name.toLowerCase() === cropName.toLowerCase())) {
        addToast({ type: 'info', title: 'Already Added', message: 'This crop is already in your list' });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        currentCrops: [...prev.currentCrops, { name: cropName, sowingDate: addingCropSowingDate }],
      }));
      setManualCropInput('');
      setAddingCropSowingDate('');
    },
    [addingCropSowingDate, formData.currentCrops, addToast]
  );

  const handleRemoveCrop = useCallback((cropName: string) => {
    setFormData((prev) => ({
      ...prev,
      currentCrops: prev.currentCrops.filter((c) => c.name !== cropName),
    }));
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      addToast({
        type: 'error',
        title: 'Not Supported',
        message: 'Your browser does not support location services',
      });
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);
    setLocationDetails(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const accuracy = position.coords.accuracy || 0;

      // Store coordinates
      setFormData((prev) => ({
        ...prev,
        farmLatitude: latitude,
        farmLongitude: longitude,
      }));

      // Try multiple reverse geocoding APIs for better results
      let locationString = '';
      let details: any = null;

      // Try OpenStreetMap Nominatim first (free, no API key needed)
      try {
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'UzhavanX-FarmApp/1.0',
            },
          },
        );
        const nominatimData = await nominatimResponse.json();

        if (nominatimData && nominatimData.address) {
          const addr = nominatimData.address;
          details = {
            address: nominatimData.display_name || '',
            city: addr.city || addr.town || addr.village || addr.municipality || '',
            state: addr.state || addr.region || '',
            country: addr.country || '',
            pincode: addr.postcode || '',
          };

          locationString = [
            addr.village || addr.town || addr.city || addr.municipality,
            addr.state || addr.region,
            addr.country,
          ]
            .filter(Boolean)
            .join(', ');
        }
      } catch (nominatimError) {
        logger.debug('Nominatim geocoding failed, trying BigDataCloud as fallback', nominatimError);
      }

      // Fallback to coordinates
      if (!locationString) {
        locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }

      setFormData((prev) => ({ ...prev, farmLocation: locationString }));
      setLocationDetails(details);

      addToast({
        type: 'success',
        title: 'Location Captured',
        message: `Location found with ${accuracy < 100 ? 'high' : accuracy < 500 ? 'good' : 'moderate'} accuracy (${Math.round(accuracy)}m)`,
      });
    } catch (error: any) {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to get your location. Please enter manually or try again.';
      setLocationError(errorMessage);
      addToast({
        type: 'error',
        title: 'Location Error',
        message: errorMessage,
      });
    } finally {
      setIsGettingLocation(false);
    }
  }, [addToast]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!formData.name.trim()) {
        addToast({ type: 'error', title: 'Missing Information', message: 'Please enter your name' });
        return;
      }
      if (!formData.farmAreaAcres.trim()) {
        addToast({ type: 'error', title: 'Missing Information', message: 'Please enter your farming area' });
        return;
      }
      if (!formData.farmLocation.trim()) {
        addToast({ type: 'error', title: 'Missing Information', message: 'Please set your farm location' });
        return;
      }
      if (formData.currentCrops.length === 0) {
        addToast({ type: 'error', title: 'Missing Information', message: 'Please select at least one crop and sowing date' });
        return;
      }

      try {
        // 1. Update session (Local Storage)
        updateSession({
          name: formData.name.trim(),
          farmAreaAcres: parseFloat(formData.farmAreaAcres),
          farmLocation: formData.farmLocation.trim(),
          farmLatitude: formData.farmLatitude || undefined,
          farmLongitude: formData.farmLongitude || undefined,
          currentCrops: formData.currentCrops.map(c => c.name), // Store just names in session for compatibility
        });

        // 2. Create Lands in Backend
        const totalAcres = parseFloat(formData.farmAreaAcres);
        const acresPerCrop = parseFloat((totalAcres / formData.currentCrops.length).toFixed(1));

        const localUserId = localStorage.getItem("currentUserId") || session?.id;

        for (const cropData of formData.currentCrops) {
          await api.createLand({
            userId: localUserId,
            name: `${formData.farmLocation} - ${cropData.name}`,
            location: formData.farmLocation,
            crop: cropData.name,
            acreage: acresPerCrop,
            stage: 'growing', // Default stage
            plantedDate: cropData.sowingDate,
            expectedHarvest: new Date(new Date(cropData.sowingDate).setMonth(new Date(cropData.sowingDate).getMonth() + 4)).toISOString().split('T')[0], // Approx 4 months
            soilType: 'loam', // Default
            irrigationType: 'flood', // Default
            status: 'growing',
            coordinates: formData.farmLatitude && formData.farmLongitude ? { lat: formData.farmLatitude, lng: formData.farmLongitude } : undefined,
            notes: `Automatically created during profile setup. Sowing Date: ${cropData.sowingDate}`
          });
        }

        addToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your farmer profile and lands have been set up successfully',
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/farm-owner');
        }, 1500);
      } catch (err: any) {
        console.error("Setup Error", err);
        addToast({
          type: 'error',
          title: 'Error',
          message: err.message || 'Failed to save profile or create lands. Please check connection.',
        });
      }
    },
    [formData, addToast, navigate],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="User" className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Farmer Profile</h1>
          <p className="text-gray-600">Help us provide you with better farming recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farmer's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Farming Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farming Area (Acres) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.farmAreaAcres}
              onChange={(e) => handleInputChange('farmAreaAcres', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter total farming area in acres"
              required
            />
          </div>

          {/* Farm Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location *</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={formData.farmLocation}
                onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter farm location or use GPS to get live location"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
              >
                {isGettingLocation ? (
                  <>
                    <Icon name="Loader2" className="h-5 w-5 animate-spin" />
                    <span className="hidden sm:inline">Getting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="MapPin" className="h-5 w-5" />
                    <span className="hidden sm:inline">Get Live Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Display Coordinates */}
            {formData.farmLatitude !== null && formData.farmLongitude !== null && (
              <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="CheckCircle" className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 mb-1">GPS Coordinates Captured</p>
                    <p className="text-xs text-green-700">{formData.farmLatitude.toFixed(6)}, {formData.farmLongitude.toFixed(6)}</p>
                    {locationDetails && locationDetails.city && (
                      <p className="text-xs text-green-700 mt-1">{locationDetails.city}, {locationDetails.state}, {locationDetails.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {locationError && (
              <p className="mt-1 text-sm text-red-600">{locationError}</p>
            )}
          </div>

          {/* Current Crops */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                What are you planting now? *
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Select Crop</label>
                  {cropSelectionMode === 'dropdown' ? (
                    <select
                      onChange={(e) => {
                        if (e.target.value === 'manual') setCropSelectionMode('manual');
                        else handleAddCrop(e.target.value);
                        e.target.value = '';
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">Choose a crop...</option>
                      {cropOptions
                        .filter((crop) => !formData.currentCrops.some(c => c.name === crop.value))
                        .map((crop) => (
                          <option key={crop.value} value={crop.value}>{crop.label}</option>
                        ))}
                      <option value="manual">+ Type Manually</option>
                    </select>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={manualCropInput}
                        onChange={(e) => setManualCropInput(e.target.value)}
                        placeholder="Crop Name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button type="button" onClick={() => setCropSelectionMode('dropdown')} className="text-gray-500">
                        <Icon name="X" className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Sowing Date</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={addingCropSowingDate}
                      onChange={(e) => setAddingCropSowingDate(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    {cropSelectionMode === 'manual' && (
                      <button
                        type="button"
                        onClick={() => handleAddCrop(manualCropInput)}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg"
                      >Add</button>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">Select a date first, then select the crop from dropdown to add it.</p>

              {/* Selected Crops List */}
              {formData.currentCrops.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.currentCrops.map((crop, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-green-100 shadow-sm">
                      <div>
                        <span className="font-medium text-gray-800 capitalize">{crop.name}</span>
                        <span className="text-xs text-gray-500 block">Sown: {new Date(crop.sowingDate).toLocaleDateString()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCrop(crop.name)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Icon name="Trash2" className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Icon name="Check" className="h-5 w-5" />
            <span>Complete Profile & Setup Farm</span>
          </button>
        </form>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
