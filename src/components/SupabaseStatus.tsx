import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SupabaseStatusProps {
  className?: string;
}

const SupabaseStatus: React.FC<SupabaseStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('products').select('count').limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
      } else {
        setIsConnected(true);
      }
      
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Supabase connection failed:', error);
      setIsConnected(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className={`fixed bottom-4 left-4 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm shadow-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          <span>Checking Supabase...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 left-4 px-3 py-2 rounded-lg text-sm shadow-lg transition-all duration-300 ${
      isConnected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    } ${className}`}>
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
        <span className="font-medium">
          {isConnected ? 'Supabase Connected' : 'Supabase Disconnected'}
        </span>
      </div>
      {lastChecked && (
        <div className="text-xs mt-1 opacity-75">
          Last checked: {lastChecked}
        </div>
      )}
    </div>
  );
};

export default SupabaseStatus; 