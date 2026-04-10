import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

export const pdfReports = {
  /**
   * Generate Product Inventory Report
   */
  generateProductReport: () => {
    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');

      if (products.length === 0) {
        toast.error('No products to generate report');
        return false;
      }

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // green-600
      doc.text('உழவன் X - Product Inventory Report', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // gray-500
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);

      // Summary
      const totalProducts = products.length;
      const totalValue = products.reduce(
        (sum: number, p: any) => sum + parseFloat(p.price || 0) * parseFloat(p.quantity || 0),
        0,
      );

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Products: ${totalProducts}`, 20, 40);
      doc.text(`Total Estimated Value: ₹${totalValue.toLocaleString()}`, 20, 48);

      // Table
      autoTable(doc, {
        startY: 58,
        head: [['Product Name', 'Category', 'Price (₹)', 'Quantity', 'Unit', 'Total Value (₹)']],
        body: products.map((p: any) => [
          p.name || 'N/A',
          p.category || 'N/A',
          parseFloat(p.price || 0).toFixed(2),
          p.quantity || 0,
          p.unit || 'unit',
          (parseFloat(p.price || 0) * parseFloat(p.quantity || 0)).toFixed(2),
        ]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, // green-600
        margin: { left: 20, right: 20 },
      });

      doc.save(`product-inventory-${Date.now()}.pdf`);
      toast.success('Product report generated!');
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate report');
      return false;
    }
  },

  /**
   * Generate Job Postings Report
   */
  generateJobReport: () => {
    try {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');

      if (jobs.length === 0) {
        toast.error('No jobs to generate report');
        return false;
      }

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246); // blue-600
      doc.text('உழவன் X - Job Postings Report', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);

      // Summary
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Job Postings: ${jobs.length}`, 20, 40);

      // Table
      autoTable(doc, {
        startY: 50,
        head: [['Job Title', 'Location', 'Wage (₹)', 'Duration', 'Status']],
        body: jobs.map((j: any) => [
          j.title || 'N/A',
          j.location || 'N/A',
          parseFloat(j.wage || 0).toFixed(2),
          j.duration || 'N/A',
          j.status || 'Open',
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 },
      });

      doc.save(`job-postings-${Date.now()}.pdf`);
      toast.success('Job report generated!');
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate report');
      return false;
    }
  },

  /**
   * Generate Crop Schedule Report
   */
  generateCropReport: () => {
    try {
      const crops = JSON.parse(localStorage.getItem('crops') || '[]');

      if (crops.length === 0) {
        toast.error('No crops to generate report');
        return false;
      }

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(34, 197, 94); // green-500
      doc.text('உழவன் X - Crop Schedule Report', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);

      // Summary
      const totalArea = crops.reduce((sum: number, c: any) => sum + parseFloat(c.area || 0), 0);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Crops: ${crops.length}`, 20, 40);
      doc.text(`Total Area: ${totalArea.toFixed(2)} hectares`, 20, 48);

      // Table
      autoTable(doc, {
        startY: 58,
        head: [['Crop Name', 'Area (ha)', 'Planting Date', 'Expected Harvest', 'Status']],
        body: crops.map((c: any) => [
          c.crop_name || c.name || 'N/A',
          parseFloat(c.area || 0).toFixed(2),
          c.planting_date || c.plantingDate
            ? new Date(c.planting_date || c.plantingDate).toLocaleDateString()
            : 'N/A',
          c.expected_harvest || c.expectedHarvest
            ? new Date(c.expected_harvest || c.expectedHarvest).toLocaleDateString()
            : 'N/A',
          c.status || 'Growing',
        ]),
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] },
        margin: { left: 20, right: 20 },
      });

      doc.save(`crop-schedule-${Date.now()}.pdf`);
      toast.success('Crop report generated!');
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate report');
      return false;
    }
  },

  /**
   * Generate Complete Summary Report
   */
  generateSummaryReport: () => {
    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const crops = JSON.parse(localStorage.getItem('crops') || '[]');
      const resources = JSON.parse(localStorage.getItem('resources') || '[]');

      const doc = new jsPDF();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129);
      doc.text('உழவன் X - Complete Summary Report', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);

      // Overview Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Overview', 20, 45);

      doc.setFontSize(12);
      const totalRevenue = products.reduce(
        (sum: number, p: any) => sum + parseFloat(p.price || 0) * parseFloat(p.quantity || 0),
        0,
      );
      const totalArea = crops.reduce((sum: number, c: any) => sum + parseFloat(c.area || 0), 0);

      doc.text(`Total Products: ${products.length}`, 30, 55);
      doc.text(`Estimated Revenue: ₹${totalRevenue.toLocaleString()}`, 30, 62);
      doc.text(`Active Jobs: ${jobs.length}`, 30, 69);
      doc.text(`Active Crops: ${crops.length}`, 30, 76);
      doc.text(`Total Crop Area: ${totalArea.toFixed(2)} hectares`, 30, 83);
      doc.text(`Shared Resources: ${resources.length}`, 30, 90);

      // Products Summary
      doc.setFontSize(14);
      doc.text('Top Products', 20, 105);
      autoTable(doc, {
        startY: 110,
        head: [['Product', 'Category', 'Price (₹)', 'Qty']],
        body: products
          .slice(0, 5)
          .map((p: any) => [
            p.name || 'N/A',
            p.category || 'N/A',
            parseFloat(p.price || 0).toFixed(2),
            p.quantity || 0,
          ]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 20, right: 20 },
      });

      // Crops Summary
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(14);
      doc.text('Active Crops', 20, finalY + 10);
      autoTable(doc, {
        startY: finalY + 15,
        head: [['Crop', 'Area (ha)', 'Expected Harvest']],
        body: crops
          .slice(0, 5)
          .map((c: any) => [
            c.crop_name || c.name || 'N/A',
            parseFloat(c.area || 0).toFixed(2),
            c.expected_harvest || c.expectedHarvest
              ? new Date(c.expected_harvest || c.expectedHarvest).toLocaleDateString()
              : 'N/A',
          ]),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        margin: { left: 20, right: 20 },
      });

      doc.save(`uzhavan-x-summary-${Date.now()}.pdf`);
      toast.success('Summary report generated!');
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate report');
      return false;
    }
  },
};
