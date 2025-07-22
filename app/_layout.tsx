import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <FavoritesProvider>
            <CartProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="splash" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="store" />
                <Stack.Screen name="product" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="order" />
                <Stack.Screen name="promotions" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </CartProvider>
          </FavoritesProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}