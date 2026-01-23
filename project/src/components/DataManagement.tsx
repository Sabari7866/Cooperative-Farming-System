import { useState, useRef } from 'react';
import { Download, Upload, Trash2, Database, HardDrive, AlertTriangle } from 'lucide-react';
import { dataImportExport } from '../utils/dataImportExport';
import toast from 'react-hot-toast';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState(dataImportExport.getStorageStats());

  const handleExport = () => {
    dataImportExport.exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please select a JSON file');
      return;
    }

    await dataImportExport.importData(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    dataImportExport.clearAllData();
  };

  const refreshStats = () => {
    setStats(dataImportExport.getStorageStats());
    toast.success('Stats refreshed');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Backup, restore, and manage your application data
        </p>
      </div>

      {/* Storage Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Statistics
          </h2>
          <button
            onClick={refreshStats}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.products}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Jobs</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.jobs}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Crops</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.crops}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Resources</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.resources}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Unable to load statistics</p>
        )}

        {stats && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Storage Used: <span className="font-semibold">{stats.totalSizeKB} KB</span> (
              {stats.totalSizeMB} MB)
            </p>
          </div>
        )}
      </div>

      {/* Backup & Restore */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Database className="w-5 h-5" />
          Backup & Restore
        </h2>

        <div className="space-y-4">
          {/* Export Button */}
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Download className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Download all your data as a JSON file for backup
              </p>
              <button
                onClick={handleExport}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Import Button */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Import Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Restore your data from a previously exported JSON file
              </p>
              <button
                onClick={handleImportClick}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Data
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Clear Data Button */}
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Clear All Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Permanently delete all data from the application
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                ⚠️ Warning: This action cannot be undone!
              </p>
              <button
                onClick={handleClearData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💡 Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Export your data regularly to prevent data loss</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Keep backup files in a safe location (cloud storage, USB drive)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Import data will overwrite current data - export first if needed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>
              Data is stored locally in your browser - clearing browser data will delete it
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
