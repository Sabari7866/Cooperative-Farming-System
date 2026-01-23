/**
 * Browser Notification Utility (without backend)
 * Uses Web Notifications API for local notifications
 */

export const notificationService = {
  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  /**
   * Send a notification
   */
  send(title: string, options?: NotificationOptions): void {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options,
    });
  },

  /**
   * Check for upcoming harvests and notify
   */
  checkHarvestReminders(): void {
    const crops = JSON.parse(localStorage.getItem('crops') || '[]');
    const now = new Date();

    crops.forEach((crop: any) => {
      if (!crop.expected_harvest && !crop.expectedHarvest) return;

      const harvestDate = new Date(crop.expected_harvest || crop.expectedHarvest);
      const daysUntil = Math.ceil((harvestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Notify 3 days before harvest
      if (daysUntil === 3) {
        this.send('Harvest Reminder', {
          body: `${crop.crop_name || crop.name} will be ready to harvest in 3 days!`,
          tag: `harvest-${crop.id}`,
          requireInteraction: true,
        });
      }

      // Notify on harvest day
      if (daysUntil === 0) {
        this.send('Harvest Ready!', {
          body: `${crop.crop_name || crop.name} is ready to harvest today!`,
          tag: `harvest-today-${crop.id}`,
          requireInteraction: true,
        });
      }
    });
  },

  /**
   * Setup daily notification check
   */
  setupDailyCheck(): void {
    // Check immediately
    this.checkHarvestReminders();

    // Check every 24 hours
    setInterval(
      () => {
        this.checkHarvestReminders();
      },
      24 * 60 * 60 * 1000,
    );
  },

  /**
   * Notify when new job posted
   */
  notifyNewJob(jobTitle: string): void {
    this.send('New Job Available', {
      body: `Check out: ${jobTitle}`,
      tag: 'new-job',
    });
  },

  /**
   * Notify when product sold
   */
  notifyProductSold(productName: string): void {
    this.send('Product Update', {
      body: `${productName} has been marked as sold`,
      tag: 'product-sold',
    });
  },
};
