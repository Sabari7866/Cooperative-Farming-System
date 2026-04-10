import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Award,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  documents: Document[];
}

interface Document {
  id: string;
  title: string;
  description: string;
  required: string[];
  issuingAuthority: string;
  validity: string;
  benefit: string;
  howToApply: string[];
}

const farmDocsData: DocumentCategory[] = [
  {
    id: 'government-schemes',
    name: 'Government Schemes',
    icon: '🏛️',
    description: 'Central and state government schemes for farmers',
    documents: [
      {
        id: 'pm-kisan',
        title: 'PM-KISAN Scheme',
        description: 'Financial benefit of ₹6000 per year to all farmer families',
        required: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
        issuingAuthority: 'Ministry of Agriculture & Farmers Welfare',
        validity: 'Continuous (Annual renewal)',
        benefit: '₹2000 in three installments per year',
        howToApply: [
          'Visit PM-KISAN portal (pmkisan.gov.in)',
          'Click on "New Farmer Registration"',
          'Enter Aadhaar number and mobile',
          'Fill land details and bank information',
          'Submit and note registration number',
        ],
      },
      {
        id: 'fasal-bima',
        title: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme against crop loss',
        required: ['Land Records', 'Aadhaar', 'Bank Account', 'Sowing Certificate'],
        issuingAuthority: 'Ministry of Agriculture',
        validity: 'Season-wise (Kharif/Rabi)',
        benefit: 'Compensation for crop damage up to sum insured',
        howToApply: [
          'Visit bank or insurance company',
          'Submit land records and crop details',
          'Pay nominal premium (2% for Kharif, 1.5% for Rabi)',
          'Get insurance certificate',
          'Claim in case of crop loss',
        ],
      },
    ],
  },
  {
    id: 'licenses',
    name: 'Licenses & Certificates',
    icon: '📜',
    description: 'Essential farming licenses and certifications',
    documents: [
      {
        id: 'organic-cert',
        title: 'Organic Certification',
        description: 'Certificate for organic farming practices',
        required: ['Land ownership proof', 'Soil test report', 'Farm inspection'],
        issuingAuthority: 'FSSAI approved certification bodies',
        validity: '1 year (renewable)',
        benefit: 'Premium price for organic produce, export opportunities',
        howToApply: [
          'Contact NPOP certified agency',
          'Submit farm details and cultivation history',
          'Undergo farm inspection',
          'Maintain organic standards for 3 years',
          'Get certification after compliance',
        ],
      },
      {
        id: 'seed-license',
        title: 'Seed Production License',
        description: 'License for commercial seed production',
        required: ['Land documents', 'Technical qualification', 'Infrastructure proof'],
        issuingAuthority: 'State Agriculture Department',
        validity: '3 years',
        benefit: 'Authorized seed production and sale',
        howToApply: [
          'Apply to State Seed Certification Agency',
          'Submit land and facility details',
          'Get inspection done',
          'Pay license fee',
          'Receive license certificate',
        ],
      },
    ],
  },
  {
    id: 'loans',
    name: 'Agricultural Loans',
    icon: '💰',
    description: 'Loan schemes for farming activities',
    documents: [
      {
        id: 'kisan-credit',
        title: 'Kisan Credit Card (KCC)',
        description: 'Credit facility for farming expenses',
        required: ['Land records', 'Aadhaar', 'PAN Card', 'Passport photo'],
        issuingAuthority: 'Nationalized/Commercial Banks',
        validity: '5 years',
        benefit: 'Low interest rate (4% with subsidy), flexible repayment',
        howToApply: [
          'Visit nearest bank branch',
          'Fill KCC application form',
          'Submit land ownership documents',
          'Provide crop cultivation details',
          'Get approval and credit limit',
        ],
      },
      {
        id: 'agri-infra',
        title: 'Agriculture Infrastructure Loan',
        description: 'Loan for farm infrastructure development',
        required: ['Project report', 'Land documents', 'Identity proof', 'Income proof'],
        issuingAuthority: 'NABARD, Commercial Banks',
        validity: 'As per loan tenure',
        benefit: '3% interest subvention, up to ₹2 crore',
        howToApply: [
          'Prepare detailed project report',
          'Approach bank with documents',
          'Get technical evaluation done',
          'Submit collateral documents',
          'Receive loan after approval',
        ],
      },
    ],
  },
  {
    id: 'subsidies',
    name: 'Subsidies & Benefits',
    icon: '🎁',
    description: 'Government subsidies for farmers',
    documents: [
      {
        id: 'drip-subsidy',
        title: 'Drip Irrigation Subsidy',
        description: 'Financial assistance for micro-irrigation systems',
        required: ['Land records', 'Bank account', 'Quotation from supplier'],
        issuingAuthority: 'State Agriculture Department',
        validity: 'One-time benefit',
        benefit: '50-90% subsidy on equipment cost',
        howToApply: [
          'Visit District Agriculture Office',
          'Submit subsidy application',
          'Get technical approval',
          'Install system from approved vendor',
          'Submit bills for subsidy release',
        ],
      },
      {
        id: 'machinery-subsidy',
        title: 'Farm Machinery Subsidy',
        description: 'Subsidy on purchase of agricultural machinery',
        required: ['Aadhaar', 'Land records', 'Bank details', 'Machinery invoice'],
        issuingAuthority: 'Department of Agriculture',
        validity: 'Subject to scheme availability',
        benefit: '40-50% subsidy on machinery cost',
        howToApply: [
          'Check scheme notification',
          'Apply online on state agriculture portal',
          'Purchase from empanelled dealer',
          'Upload purchase invoice',
          'Receive subsidy in bank account',
        ],
      },
    ],
  },
];

export default function FarmDocsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('government-schemes');

  const currentCategory = farmDocsData.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mb-4"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.6)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Farm Documentation Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Essential documents, schemes, and subsidies for farmers
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Important Information
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Always verify schemes on official government websites</li>
                <li>• Keep photocopies of all submitted documents</li>
                <li>• Check eligibility criteria before applying</li>
                <li>• Beware of fake agents - government schemes are free to apply</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {farmDocsData.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl transition-all ${selectedCategory === category.id
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500'
                }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-semibold">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Category Description */}
        {currentCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentCategory.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{currentCategory.description}</p>
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentCategory?.documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Document Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
                    <p className="text-sm text-blue-100">{doc.description}</p>
                  </div>
                  <FileText className="w-8 h-8 opacity-80" />
                </div>
              </div>

              {/* Document Details */}
              <div className="p-6 space-y-4">
                {/* Required Documents */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Required Documents
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {doc.required.map((req, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-blue-600">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Issuing Authority */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Issuing Authority
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{doc.issuingAuthority}</p>
                  </div>
                </div>

                {/* Validity */}
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Validity Period
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{doc.validity}</p>
                  </div>
                </div>

                {/* Benefit */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-1">
                    Key Benefit
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{doc.benefit}</p>
                </div>

                {/* How to Apply */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">How to Apply</h4>
                  </div>
                  <ol className="space-y-2">
                    {doc.howToApply.map((step, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="flex-1 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 group">
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Download Application Form
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Useful Resources */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Useful Agricultural Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">🌐 Official Websites</h4>
              <ul className="text-sm space-y-1 text-blue-100">
                <li>• agricoop.nic.in</li>
                <li>• pmkisan.gov.in</li>
                <li>• nabard.org</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">📞 Helpline Numbers</h4>
              <ul className="text-sm space-y-1 text-blue-100">
                <li>• PM-KISAN: 155261</li>
                <li>• Kisan Call Center: 1800-180-1551</li>
                <li>• Agri Emergency: 1800-180-1111</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">📱 Mobile Apps</h4>
              <ul className="text-sm space-y-1 text-blue-100">
                <li>• Kisan Suvidha</li>
                <li>• AGRI App</li>
                <li>• mKisan Portal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started with உழவன் X
          </button>
        </div>
      </div>
    </div>
  );
}
