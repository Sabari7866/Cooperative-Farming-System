import Icon from './Icon';
import { useToast } from './Toast';

export default function DataBackup() {
    const { addToast } = useToast();

    const exportData = () => {
        try {
            const data: Record<string, any> = {};

            // Collect all localStorage data
            const keys = [
                'agrismart_products',
                'agrismart_jobs',
                'agrismart_resources',
                'agrismart_expenses',
                'agrismart_inventory',
                'agrismart_activity',
                'agrismart_user',
            ];

            keys.forEach((key) => {
                const value = localStorage.getItem(key);
                if (value) {
                    data[key] = JSON.parse(value);
                }
            });

            // Create blob and download
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `agrismart-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addToast({
                type: 'success',
                title: 'Backup Created',
                message: 'All your data has been exported successfully',
            });
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Export Failed',
                message: 'Failed to export data. Please try again.',
            });
        }
    };

    const importData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event: any) => {
                try {
                    const data = JSON.parse(event.target.result);

                    // Restore all data
                    Object.keys(data).forEach((key) => {
                        localStorage.setItem(key, JSON.stringify(data[key]));
                    });

                    addToast({
                        type: 'success',
                        title: 'Data Restored',
                        message: 'Your backup has been restored. Please refresh the page.',
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    addToast({
                        type: 'error',
                        title: 'Import Failed',
                        message: 'Invalid backup file. Please check and try again.',
                    });
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const clearAllData = () => {
        if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            localStorage.clear();
            addToast({
                type: 'success',
                title: 'Data Cleared',
                message: 'All data has been cleared. Refreshing...',
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Icon name="Database" className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Data Management</h3>
            </div>

            <div className="space-y-4">
                {/* Export */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-white mb-1">Export All Data</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Download a backup of all your farm data
                            </div>
                        </div>
                        <button
                            onClick={exportData}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <Icon name="Download" className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Import */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-white mb-1">Import Data</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Restore data from a backup file</div>
                        </div>
                        <button
                            onClick={importData}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <Icon name="Upload" className="w-4 h-4" />
                            <span>Import</span>
                        </button>
                    </div>
                </div>

                {/* Clear */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-white mb-1">Clear All Data</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Remove all data (Cannot be undone!)
                            </div>
                        </div>
                        <button
                            onClick={clearAllData}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                            <Icon name="Trash2" className="w-4 h-4" />
                            <span>Clear</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start space-x-2">
                    <Icon name="Info" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Tip:</strong> Regular backups ensure your data is safe. Export your data before clearing or
                        updating the app.
                    </div>
                </div>
            </div>
        </div>
    );
}
