import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, Room } from '../types';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { supabase } from '../lib/supabase';
import { Building2, MapPin, Phone, Mail, DoorClosed, Bed, Bath, Wifi, Fan, Loader2 } from 'lucide-react';

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPropertyDetails();
  }, [id]);

  const loadPropertyDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData);

      // Load available rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('property_id', id)
        .eq('status', 'vacant')
        .order('price');

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);
    } catch (err) {
      console.error('Error loading property details:', err);
      setError('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} />;
      case 'ac':
        return <Fan size={16} />;
      case 'bathroom':
        return <Bath size={16} />;
      default:
        return <DoorClosed size={16} />;
    }
  };

  const handleContactClick = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="mt-2 text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Building2 size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
        <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            ← Back to Marketplace
          </Button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 sm:h-96">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>
              
              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin size={20} className="mt-1" />
                <p>{property.address}, {property.city}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone size={20} className="text-gray-400" />
                      <span className="text-gray-600">{property.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={20} className="text-gray-400" />
                      <span className="text-gray-600">{property.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rooms</h2>
                  <div className="space-y-2">
                    {rooms.length > 0 ? (
                      rooms.map(room => (
                        <div 
                          key={room.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">Room {room.name}</p>
                            <p className="text-sm text-gray-500">
                              Floor {room.floor} • {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{formatCurrency(room.price)}</p>
                            <p className="text-sm text-gray-500">per month</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No rooms available at the moment</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleContactClick}
                >
                  Contact Property Owner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;