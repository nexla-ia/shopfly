import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart, Star } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';


export default function FavoritesScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { favoriteItems, removeFromFavorites, loading } = useFavorites();
  const { user } = useAuth();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      store: 'Loja Oficial'
    });
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
      )}
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>R$ {item.originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFC107" fill="#FFC107" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        
        {item.installments && (
          <Text style={styles.installments}>{item.installments}</Text>
        )}
        
        {item.freeShipping && (
          <View style={styles.freeShippingContainer}>
            <Text style={styles.freeShipping}>Frete grátis</Text>
            <Text style={styles.fullBadge}>⚡ FULL</Text>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <ShoppingCart size={16} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Adicionar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => removeFromFavorites(item.id)}
          >
            <Heart size={20} color="#FF6B35" fill="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyFavorites = () => (
    <View style={styles.emptyFavorites}>
      <Heart size={80} color="#E5E5E5" />
      <Text style={styles.emptyFavoritesTitle}>
        {!user ? 'Faça login para ver favoritos' : 'Nenhum favorito ainda'}
      </Text>
      <Text style={styles.emptyFavoritesText}>
        {!user ? 'Entre na sua conta para salvar produtos favoritos' : 'Adicione produtos aos favoritos para vê-los aqui'}
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => !user ? router.push('/auth/welcome') : router.push('/search')}
      >
        <Text style={styles.shopButtonText}>
          {!user ? 'Fazer login' : 'Explorar produtos'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.itemCount}>
          {loading ? 'Carregando...' : `${favoriteItems.length} ${favoriteItems.length === 1 ? 'item' : 'itens'}`}
        </Text>
      </View>

      {!user || favoriteItems.length === 0 ? (
        renderEmptyFavorites()
      ) : (
        <FlatList
          data={favoriteItems}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.favoritesList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6366F1',
    borderBottomWidth: 1,
    borderBottomColor: '#5B21B6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemCount: {
    fontSize: 14,
    color: '#E0E7FF',
    fontWeight: '500',
  },
  favoritesList: {
    padding: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00A650',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    flex: 1,
    padding: 15,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 3,
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  priceContainer: {
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
  },
  installments: {
    fontSize: 12,
    color: '#00A650',
    marginBottom: 8,
  },
  freeShippingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  freeShipping: {
    fontSize: 12,
    color: '#00A650',
    fontWeight: '600',
    marginRight: 5,
  },
  fullBadge: {
    fontSize: 10,
    color: '#00A650',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3483FA',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyFavoritesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyFavoritesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#3483FA',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});