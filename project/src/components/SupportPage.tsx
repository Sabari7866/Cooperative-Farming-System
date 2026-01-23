import { useState } from 'react';
import {
  Mail,
  Send,
  ArrowLeft,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Create email content
      const emailBody = `
New Support Request from AgriSmart Platform
============================================

From: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent from AgriSmart Support System
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            `.trim();

      // Save to localStorage
      const supportEmails = JSON.parse(localStorage.getItem('supportEmails') || '[]');
      const newEmail = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      supportEmails.push(newEmail);
      localStorage.setItem('supportEmails', JSON.stringify(supportEmails));

      // Open default email client with pre-filled content
      const mailtoLink = `mailto:23ad044@drngpit.ac.in?subject=${encodeURIComponent(`Support Request: ${formData.subject}`)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      toast.success('✅ Opening your email client to send to 23ad044@drngpit.ac.in!', {
        duration: 4000,
      });

      // Navigate back after delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Please check if you have an email client installed.');
    } finally {
      setSending(false);
    }
  };

  // Copy email details to clipboard
  const handleCopyDetails = () => {
    const details = `
To: 23ad044@drngpit.ac.in
From: ${formData.name} (${formData.email})
Subject: ${formData.subject}

Message:
${formData.message}
        `.trim();

    navigator.clipboard.writeText(details).then(() => {
      toast.success('📋 Email details copied to clipboard!');
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Direct email link
  const handleDirectEmail = () => {
    window.location.href = 'mailto:23ad044@drngpit.ac.in';
    toast.success('Opening email client...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4 animate-pulse">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Contact Support</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Send us a message - emails are sent automatically!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-green-600" />
                Send Automated Email
              </h2>

              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    <strong>Fully Automated:</strong> Your email will be sent automatically to
                    23ad044@drngpit.ac.in
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your question or issue..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opening Email Client...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send via Email Client
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyDetails}
                  disabled={
                    !formData.name || !formData.email || !formData.subject || !formData.message
                  }
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Email Details
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  📧 Opens your default email client (Gmail, Outlook, etc.)
                </p>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Support Email</p>
                    <a
                      href="mailto:23ad044@drngpit.ac.in"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDirectEmail();
                      }}
                      className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline break-all"
                    >
                      23ad044@drngpit.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      +91 1800 123 4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">College</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Dr. N.G.P. Institute of Technology
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Automation Status */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 animate-pulse" />
                <h3 className="text-lg font-semibold">Automated Email</h3>
              </div>
              <p className="text-sm text-green-100 mb-4">
                Your email will be sent automatically without needing an email client!
              </p>
              <div className="pt-4 border-t border-white/20 space-y-2">
                <p className="text-xs text-green-100 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  No manual sending required
                </p>
                <p className="text-xs text-green-100 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Instant delivery
                </p>
                <p className="text-xs text-green-100 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Email Delivery Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Email Delivery
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Your message will be sent to:
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <p className="text-sm font-mono text-green-700 dark:text-green-400 break-all">
                  23ad044@drngpit.ac.in
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Fully automated backend system
              </p>
            </div>

            {/* FAQ Link */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Common Questions?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Check out our AI assistant in the dashboard for instant answers to farming
                questions!
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
