import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permissão de localização negada');
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Erro ao solicitar permissão de localização');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se já tem permissão
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          setLoading(false);
          return;
        }
      }

      // Obter localização atual
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = locationResult.coords;

      // Obter informações da cidade (geocoding reverso)
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          setLocation({
            latitude,
            longitude,
            city: address.city || address.subregion,
            region: address.region,
            country: address.country,
          });
        } else {
          setLocation({ latitude, longitude });
        }
      } catch (geocodeError) {
        // Se falhar o geocoding, pelo menos salva as coordenadas
        setLocation({ latitude, longitude });
      }
    } catch (err) {
      setError('Erro ao obter localização');
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Solicitar localização automaticamente na primeira vez
  useEffect(() => {
    const initLocation = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      }
    };

    initLocation();
  }, []);

  return {
    location,
    loading,
    error,
    requestPermission,
    getCurrentLocation,
  };
}