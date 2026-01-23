import React, { useState } from 'react';
import Icon from './Icon';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Please fill in all fields',
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: null, message: '' });

    try {
      // Send email using backend API
      const response = await fetch('http://localhost:3001/api/send-support-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '23ad044@drngpit.ac.in',
          from: formData.email,
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: "Your message has been sent successfully! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setStatus({ type: null, message: '' });
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus({
        type: 'error',
        message:
          'Failed to send message. Please try again or contact us directly at 23ad044@drngpit.ac.in',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Icon name="Mail" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Contact Support</h2>
                <p className="text-green-100 text-sm">We're here to help you</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <Icon name="X" className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 mb-6 border border-green-200">
            <div className="flex items-start space-x-3">
              <Icon name="Info" className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-900 font-medium mb-1">Direct Email Support</p>
                <a
                  href="mailto:23ad044@drngpit.ac.in"
                  className="text-green-700 hover:text-green-900 font-semibold flex items-center space-x-1 group"
                >
                  <Icon name="Mail" className="h-4 w-4" />
                  <span>23ad044@drngpit.ac.in</span>
                  <Icon
                    name="ExternalLink"
                    className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
                <p className="text-xs text-green-600 mt-1">Response time: Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status.type && (
            <div
              className={`mb-4 p-4 rounded-xl border ${
                status.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                <Icon
                  name={status.type === 'success' ? 'CheckCircle' : 'AlertCircle'}
                  className={`h-5 w-5 mt-0.5 ${
                    status.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                />
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="What do you need help with?"
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your issue or question in detail..."
                disabled={isSending}
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Need immediate assistance? Call us at{' '}
              <span className="font-semibold text-green-600">+91 98765 43210</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
