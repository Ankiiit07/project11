import React, { useState, useEffect } from 'react';
import { Truck, Clock, MapPin, CheckCircle, AlertCircle, Package } from 'lucide-react';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  price: number;
  available: boolean;
  icon: React.ReactNode;
}

interface DeliveryOptionsProps {
  address: string;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ address }) => {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressDetails, setAddressDetails] = useState<any>(null);

  useEffect(() => {
    if (address && address.length > 10) {
      fetchDeliveryOptions(address);
    }
  }, [address]);

  const fetchDeliveryOptions = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate Google Places API call
      const geocodeResponse = await mockGoogleGeocode(address);
      
      if (geocodeResponse.results.length > 0) {
        const location = geocodeResponse.results[0];
        setAddressDetails(location);
        
        // Generate delivery options based on location
        const options = generateDeliveryOptions(location);
        setDeliveryOptions(options);
      } else {
        setError('Address not found. Please provide a more specific address.');
      }
    } catch (err) {
      setError('Unable to fetch delivery options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock Google Geocoding API response
  const mockGoogleGeocode = async (address: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on common Indian cities
    const cityKeywords = {
      'mumbai': { lat: 19.0760, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra' },
      'delhi': { lat: 28.7041, lng: 77.1025, city: 'Delhi', state: 'Delhi' },
      'bangalore': { lat: 12.9716, lng: 77.5946, city: 'Bangalore', state: 'Karnataka' },
      'pune': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
      'hyderabad': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
      'chennai': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
      'kolkata': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
    };

    const addressLower = address.toLowerCase();
    let locationData = null;

    for (const [keyword, data] of Object.entries(cityKeywords)) {
      if (addressLower.includes(keyword)) {
        locationData = data;
        break;
      }
    }

    if (!locationData) {
      // Default to Mumbai if no city found
      locationData = cityKeywords.mumbai;
    }

    return {
      results: [{
        formatted_address: `${address}, ${locationData.city}, ${locationData.state}, India`,
        geometry: {
          location: {
            lat: locationData.lat,
            lng: locationData.lng
          }
        },
        address_components: [
          { long_name: locationData.city, types: ['locality'] },
          { long_name: locationData.state, types: ['administrative_area_level_1'] },
          { long_name: 'India', types: ['country'] }
        ]
      }]
    };
  };

  const generateDeliveryOptions = (location: any): DeliveryOption[] => {
    const city = location.address_components.find((comp: any) => 
      comp.types.includes('locality')
    )?.long_name || 'Unknown';

    const isMetroCity = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'].includes(city);
    
    const baseOptions: DeliveryOption[] = [
      {
        id: 'standard',
        name: 'Standard Delivery',
        description: 'Regular delivery to your doorstep',
        estimatedTime: isMetroCity ? '2-3 business days' : '3-5 business days',
        price: 0,
        available: true,
        icon: <Package className="h-5 w-5" />
      },
      {
        id: 'express',
        name: 'Express Delivery',
        description: 'Faster delivery for urgent orders',
        estimatedTime: isMetroCity ? '1-2 business days' : '2-3 business days',
        price: 50,
        available: isMetroCity,
        icon: <Truck className="h-5 w-5" />
      },
      {
        id: 'same-day',
        name: 'Same Day Delivery',
        description: 'Get your order today (order before 2 PM)',
        estimatedTime: 'Same day (4-8 hours)',
        price: 150,
        available: ['Mumbai', 'Delhi', 'Bangalore', 'Pune'].includes(city),
        icon: <Clock className="h-5 w-5" />
      }
    ];

    return baseOptions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
        <span className="text-gray-600">Checking delivery options...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (deliveryOptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {addressDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium text-sm">Delivery Address</span>
          </div>
          <p className="text-blue-600 text-sm">{addressDetails.formatted_address}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {deliveryOptions.map((option) => (
          <div
            key={option.id}
            className={`border rounded-lg p-4 transition-all duration-300 ${
              option.available
                ? 'border-green-200 bg-green-50 hover:shadow-md'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  option.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${
                      option.available ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {option.name}
                    </h4>
                    {option.available && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    option.available ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {option.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-sm font-medium ${
                      option.available ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {option.estimatedTime}
                    </span>
                    <span className={`text-sm font-bold ${
                      option.available ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {option.price === 0 ? 'Free' : `₹${option.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {!option.available && (
              <div className="mt-3 text-xs text-gray-500">
                Not available in your area
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <div className="flex items-center space-x-2 text-yellow-700 mb-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium text-sm">Delivery Information</span>
        </div>
        <ul className="text-yellow-600 text-xs space-y-1">
          <li>• Free delivery on orders above ₹1000</li>
          <li>• COD available with ₹25 additional charges</li>
          <li>• Delivery times may vary during festivals and peak seasons</li>
          <li>• Same day delivery available only for orders placed before 2 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryOptions;