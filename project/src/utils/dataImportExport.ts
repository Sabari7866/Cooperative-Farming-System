import toast from 'react-hot-toast';

export interface BackupData {
  products: any[];
  jobs: any[];
  crops: any[];
  resources: any[];
  resourceRequests: any[];
  user: any;
  exportDate: string;
  version: string;
}

export const dataImportExport = {
  /**
   * Export all localStorage data as JSON file
   */
  exportData: () => {
    try {
      const data: BackupData = {
        products: JSON.parse(localStorage.getItem('products') || '[]'),
        jobs: JSON.parse(localStorage.getItem('jobs') || '[]'),
        crops: JSON.parse(localStorage.getItem('crops') || '[]'),
        resources: JSON.parse(localStorage.getItem('resources') || '[]'),
        resourceRequests: JSON.parse(localStorage.getItem('resourceRequests') || '[]'),
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `agrismart-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
      return true;
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
      return false;
    }
  },

  /**
   * Import data from JSON file
   */
  importData: (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data: BackupData = JSON.parse(content);

          // Validate data structure
          if (!data.exportDate || !data.version) {
            toast.error('Invalid backup file format');
            resolve(false);
            return;
          }

          // Confirm before overwriting
          const confirmed = window.confirm(
            `This will restore data from ${new Date(data.exportDate).toLocaleString()}. Current data will be overwritten. Continue?`,
          );

          if (!confirmed) {
            toast('Import cancelled');
            resolve(false);
            return;
          }

          // Import data
          localStorage.setItem('products', JSON.stringify(data.products || []));
          localStorage.setItem('jobs', JSON.stringify(data.jobs || []));
          localStorage.setItem('crops', JSON.stringify(data.crops || []));
          localStorage.setItem('resources', JSON.stringify(data.resources || []));
          localStorage.setItem('resourceRequests', JSON.stringify(data.resourceRequests || []));
          if (data.user && Object.keys(data.user).length > 0) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          toast.success('Data imported successfully! Refreshing...');

          // Reload page to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);

          resolve(true);
        } catch (error) {
          console.error('Import error:', error);
          toast.error('Failed to import data. Please check the file format.');
          resolve(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
        resolve(false);
      };

      reader.readAsText(file);
    });
  },

  /**
   * Clear all data (with confirmation)
   */
  clearAllData: (): boolean => {
    const confirmed = window.confirm(
      'WARNING: This will delete ALL your data permanently. This action cannot be undone. Are you sure?',
    );

    if (!confirmed) {
      toast('Data preserved');
      return false;
    }

    const doubleConfirm = window.confirm('Are you absolutely sure? Type YES to confirm.');

    if (!doubleConfirm) {
      toast('Data preserved');
      return false;
    }

    try {
      localStorage.removeItem('products');
      localStorage.removeItem('jobs');
      localStorage.removeItem('crops');
      localStorage.removeItem('resources');
      localStorage.removeItem('resourceRequests');

      toast.success('All data cleared');

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return true;
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Failed to clear data');
      return false;
    }
  },

  /**
   * Get storage usage statistics
   */
  getStorageStats: () => {
    try {
      const products = localStorage.getItem('products') || '[]';
      const jobs = localStorage.getItem('jobs') || '[]';
      const crops = localStorage.getItem('crops') || '[]';
      const resources = localStorage.getItem('resources') || '[]';

      const totalSize = new Blob([products, jobs, crops, resources]).size;

      return {
        products: JSON.parse(products).length,
        jobs: JSON.parse(jobs).length,
        crops: JSON.parse(crops).length,
        resources: JSON.parse(resources).length,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      };
    } catch (error) {
      console.error('Stats error:', error);
      return null;
    }
  },
};
