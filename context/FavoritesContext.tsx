import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  rating: number;
  reviews: number;
  store: string;
  freeShipping: boolean;
  installments?: string;
}

interface FavoritesContextType {
  favoriteItems: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  getFavoritesCount: () => number;
  clearFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Carregar favoritos do banco quando o usuário estiver logado
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavoriteItems([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            name,
            price,
            original_price,
            images,
            rating,
            reviews_count,
            specifications,
            free_shipping,
            installments,
            stores (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      const formattedFavorites: FavoriteItem[] = data
        .filter(item => item.products) // Filtrar apenas itens com produtos válidos
        .map(item => {
          const product = item.products as any;
          const store = product.stores as any;
          
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            image: product.images?.[0] || '',
            discount: product.original_price ? 
              Math.round((1 - product.price / product.original_price) * 100) : undefined,
            rating: product.rating || 0,
            reviews: product.reviews_count || 0,
            store: store?.name || 'Loja',
            freeShipping: product.free_shipping || false,
            installments: product.installments,
          };
        });

      setFavoriteItems(formattedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (newItem: FavoriteItem) => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para adicionar produtos aos favoritos');
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se já existe nos favoritos
      const { data: existingFavorite } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', newItem.id)
        .maybeSingle();

      if (existingFavorite) {
        console.log('Item já está nos favoritos');
        return;
      }

      // Adicionar aos favoritos no banco
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          product_id: newItem.id,
        });

      if (error) {
        console.error('Error adding to favorites:', error);
        Alert.alert('Erro', 'Não foi possível adicionar aos favoritos');
        return;
      }

      console.log('Item adicionado aos favoritos com sucesso');
      
      // Atualizar estado local
      setFavoriteItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newItem.id);
        if (!existingItem) {
          return [...prevItems, newItem];
        }
        return prevItems;
      });

    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Remover do banco
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', itemId);

      if (error) {
        console.error('Error removing from favorites:', error);
        Alert.alert('Erro', 'Não foi possível remover dos favoritos');
        return;
      }

      console.log('Item removido dos favoritos com sucesso');
      
      // Atualizar estado local
      setFavoriteItems(prevItems => prevItems.filter(item => item.id !== itemId));

    } catch (error) {
      console.error('Error removing from favorites:', error);
      Alert.alert('Erro', 'Não foi possível remover dos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (itemId: string) => {
    return favoriteItems.some(item => item.id === itemId);
  };

  const getFavoritesCount = () => {
    return favoriteItems.length;
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
  };

  const contextValue: FavoritesContextType = {
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount,
    clearFavorites,
    loading,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};