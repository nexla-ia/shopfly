import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  store: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Carregar carrinho do banco quando o usuário estiver logado
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_cart')
        .select(`
          id,
          quantity,
          created_at,
          products (
            id,
            name,
            price,
            images,
            stores (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      const formattedCartItems: CartItem[] = data
        .filter(item => item.products) // Filtrar apenas itens com produtos válidos
        .map(item => {
          const product = item.products as any;
          const store = product.stores as any;
          
          return {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images?.[0] || '',
            quantity: item.quantity,
            store: store?.name || 'Loja',
          };
        });

      setCartItems(formattedCartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (newItem: CartItem) => {
    if (!user) {
      // Se não estiver logado, adiciona apenas no estado local
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newItem.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          return [...prevItems, newItem];
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se já existe no carrinho
      const { data: existingCartItem } = await supabase
        .from('user_cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', newItem.id)
        .maybeSingle();

      if (existingCartItem) {
        // Atualizar quantidade
        const newQuantity = existingCartItem.quantity + newItem.quantity;
        const { error } = await supabase
          .from('user_cart')
          .update({ quantity: newQuantity })
          .eq('id', existingCartItem.id);

        if (error) {
          console.error('Error updating cart item:', error);
          Alert.alert('Erro', 'Não foi possível atualizar o carrinho');
          return;
        }
      } else {
        // Adicionar novo item
        const { error } = await supabase
          .from('user_cart')
          .insert({
            user_id: user.id,
            product_id: newItem.id,
            quantity: newItem.quantity,
          });

        if (error) {
          console.error('Error adding to cart:', error);
          Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
          return;
        }
      }

      console.log('Item adicionado ao carrinho com sucesso');
      
      // Atualizar estado local
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newItem.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          return [...prevItems, newItem];
        }
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) {
      // Se não estiver logado, remove apenas do estado local
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      return;
    }

    try {
      setLoading(true);
      
      // Remover do banco
      const { error } = await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', itemId);

      if (error) {
        console.error('Error removing from cart:', error);
        Alert.alert('Erro', 'Não foi possível remover do carrinho');
        return;
      }

      console.log('Item removido do carrinho com sucesso');
      
      // Atualizar estado local
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Erro', 'Não foi possível remover do carrinho');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (!user) {
      // Se não estiver logado, atualiza apenas no estado local
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      setLoading(true);
      
      // Atualizar no banco
      const { error } = await supabase
        .from('user_cart')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', itemId);

      if (error) {
        console.error('Error updating cart quantity:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a quantidade');
        return;
      }

      console.log('Quantidade atualizada com sucesso');
      
      // Atualizar estado local
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

    } catch (error) {
      console.error('Error updating cart quantity:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Se não estiver logado, limpa apenas o estado local
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      
      // Limpar do banco
      const { error } = await supabase
        .from('user_cart')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        Alert.alert('Erro', 'Não foi possível limpar o carrinho');
        return;
      }

      console.log('Carrinho limpo com sucesso');
      
      // Limpar estado local
      setCartItems([]);

    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Erro', 'Não foi possível limpar o carrinho');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
    loading,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};