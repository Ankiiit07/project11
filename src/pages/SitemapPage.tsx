import React, { useEffect } from 'react';
import { generateSitemapXML } from '../utils/sitemapGenerator';

const SitemapPage: React.FC = () => {
  useEffect(() => {
    // Set content type to XML
    const xml = generateSitemapXML();
    
    // Create blob and download
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sitemap</h1>
        <p className="text-gray-600">Your sitemap.xml file is being downloaded...</p>
      </div>
    </div>
  );
};

export default SitemapPage; 