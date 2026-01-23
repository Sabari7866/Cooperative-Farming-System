import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, updateSession } from '../utils/auth';
import Icon from './Icon';

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const session = getSession();
  const [loading, setLoading] = useState(false);

  // Worker-specific fields
  const [maxTravelKm, setMaxTravelKm] = useState('');
  const [phone, setPhone] = useState(session?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  // Buyer-specific fields
  const [buyerName, setBuyerName] = useState(session?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [buyerPhone, setBuyerPhone] = useState(session?.phone || '');

  // Renter-specific fields
  const [renterPhone, setRenterPhone] = useState(session?.phone || '');
  const [equipment, setEquipment] = useState<string[]>([]);

  const availableSkills = [
    'Harvesting',
    'Sowing/Planting',
    'Irrigation Management',
    'Pest Control',
    'Fertilizer Application',
    'Equipment Operation',
    'Pruning/Trimming',
    'Weeding',
    'Land Preparation',
    'Post-Harvest Processing',
  ];

  const availableEquipment = [
    'Tractor',
    'Harvester',
    'Plough',
    'Seed Drill',
    'Sprayer',
    'Cultivator',
    'Rotavator',
    'Thresher',
    'Water Pump',
    'Trailer',
  ];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const toggleEquipment = (equip: string) => {
    if (equipment.includes(equip)) {
      setEquipment(equipment.filter((e) => e !== equip));
    } else {
      setEquipment([...equipment, equip]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (session?.role === 'worker') {
      // Save worker profile
      updateSession({
        maxTravelKm: parseInt(maxTravelKm) || 0,
        phone,
        alternatePhone,
        skills: skills.join(', '),
        profileCompleted: true,
      });
      navigate('/farm-worker');
    } else if (session?.role === 'buyer') {
      // Save buyer profile
      updateSession({
        name: buyerName,
        buyerAddressLine1: address,
        buyerCity: city,
        buyerState: state,
        buyerPincode: pincode,
        phone: buyerPhone,
        profileCompleted: true,
      });
      navigate('/buyer');
    } else if (session?.role === 'renter') {
      // Save renter profile
      updateSession({
        phone: renterPhone,
        equipment: equipment.join(', '),
        profileCompleted: true,
      });
      navigate('/renter');
    }

    setLoading(false);
  };

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-white/20 rounded-full p-3">
              <Icon name="UserCircle" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Complete Your Profile</h1>
              <p className="text-green-100 text-sm">
                {session.role === 'worker' && 'Tell us about your skills and availability'}
                {session.role === 'buyer' && 'Provide your contact and delivery details'}
                {session.role === 'renter' && 'Tell us about your equipment for rent'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {session.role === 'worker' && (
            <>
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="Phone" className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="Phone" className="h-4 w-4 inline mr-1" />
                  Alternate Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="Alternate contact number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  pattern="[0-9]{10}"
                />
              </div>

              {/* Max Travel Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="MapPin" className="h-4 w-4 inline mr-1" />
                  Maximum Travel Distance (in km) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="200"
                  value={maxTravelKm}
                  onChange={(e) => setMaxTravelKm(e.target.value)}
                  placeholder="How far can you travel for work?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps farmers find workers in their area
                </p>
              </div>

              {/* Skills Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Icon name="Wrench" className="h-4 w-4 inline mr-1" />
                  Select Your Farming Skills * (Choose all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        skills.includes(skill)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      <Icon
                        name={skills.includes(skill) ? 'CheckCircle' : 'Circle'}
                        className="h-4 w-4 inline mr-2"
                      />
                      {skill}
                    </button>
                  ))}
                </div>
                {skills.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">Please select at least one skill</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {skills.length} skill{skills.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}

          {session.role === 'buyer' && (
            <>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="User" className="h-4 w-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="Phone" className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="Home" className="h-4 w-4 inline mr-1" />
                  Delivery Address *
                </label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Street, Landmark"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </>
          )}

          {session.role === 'renter' && (
            <>
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon name="Phone" className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={renterPhone}
                  onChange={(e) => setRenterPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>

              {/* Equipment Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Icon name="Wrench" className="h-4 w-4 inline mr-1" />
                  Equipment Available for Rent * (Choose all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableEquipment.map((equip) => (
                    <button
                      key={equip}
                      type="button"
                      onClick={() => toggleEquipment(equip)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        equipment.includes(equip)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      <Icon
                        name={equipment.includes(equip) ? 'CheckCircle' : 'Circle'}
                        className="h-4 w-4 inline mr-2"
                      />
                      {equip}
                    </button>
                  ))}
                </div>
                {equipment.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">Please select at least one equipment</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {equipment.length} equipment{equipment.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
            >
              Back to Login
            </button>
            <button
              type="submit"
              disabled={loading || (session.role === 'worker' && skills.length === 0)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {loading && <Icon name="Loader2" className="h-5 w-5 animate-spin" />}
              <span>Complete Profile & Continue</span>
              <Icon name="ArrowRight" className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
