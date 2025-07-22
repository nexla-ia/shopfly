import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from '@/hooks/useLocation';
import LocationPermissionModal from '@/components/LocationPermissionModal';

interface LocationContextType {
  currentCity: string | null;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  requestLocationPermission: () => Promise<void>;
  updateLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const { location, loading, requestPermission, getCurrentLocation } = useLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  const handleShowLocationModal = () => {
    if (hasAskedPermission) return;
    setHasAskedPermission(true);
    setShowLocationModal(true);
  };

  const handleAllowLocation = async () => {
    setShowLocationModal(false);
    const hasPermission = await requestPermission();
    if (hasPermission) {
      await getCurrentLocation();
    }
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
  };

  const handleCloseModal = () => {
    setShowLocationModal(false);
  };

  const requestLocationPermission = handleShowLocationModal;

  const updateLocation = async () => {
    await getCurrentLocation();
  };

  // Solicitar permissão após um pequeno delay quando o app iniciar
  useEffect(() => {
    const timer = setTimeout(() => {
      handleShowLocationModal();
    }, 2000); // 2 segundos após carregar

    return () => clearTimeout(timer);
  }, []);

  const contextValue: LocationContextType = {
    currentCity: location?.city || null,
    userLocation: location ? {
      latitude: location.latitude,
      longitude: location.longitude,
    } : null,
    loading,
    requestLocationPermission: () => {
      setShowLocationModal(true);
    },
    updateLocation,
  };

  return (
    <>
      <LocationContext.Provider value={contextValue}>
        {children}
      </LocationContext.Provider>
      
      <LocationPermissionModal
        visible={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
        onClose={handleCloseModal}
      />
    </>
  );
};