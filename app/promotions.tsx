import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, ShoppingCart, Clock, Zap } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface PromotionProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  rating: number;
  reviews: number;
  store: string;
  timeLeft: string;
  limitedQuantity?: number;
  freeShipping: boolean;
}

const promotionProducts: PromotionProduct[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'iPhone 15 Pro Max 256GB Titânio Natural',
    price: 7999.99,
    originalPrice: 9999.99,
    discount: 20,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 1247,
    store: 'Apple Store Oficial',
    timeLeft: '2h 15m',
    limitedQuantity: 5,
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'MacBook Air M2 13" 256GB Space Gray',
    price: 6499.99,
    originalPrice: 7999.99,
    discount: 19,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 892,
    store: 'Apple Store Oficial',
    timeLeft: '1h 45m',
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Samsung Galaxy S24 Ultra 512GB Preto',
    price: 5799.99,
    originalPrice: 7499.99,
    discount: 23,
    image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 1834,
    store: 'Samsung Oficial',
    timeLeft: '3h 30m',
    limitedQuantity: 12,
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'AirPods Pro 2ª Geração com Case MagSafe',
    price: 1599.99,
    originalPrice: 2199.99,
    discount: 27,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 2156,
    store: 'Apple Store Oficial',
    timeLeft: '4h 20m',
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Monitor Gamer ASUS 27" 144Hz IPS',
    price: 999.99,
    originalPrice: 1599.99,
    discount: 38,
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 567,
    store: 'ASUS Store',
    timeLeft: '5h 10m',
    limitedQuantity: 8,
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440019',
    name: 'Notebook Dell Inspiron 15 i5 16GB SSD 512GB',
    price: 2799.99,
    originalPrice: 3999.99,
    discount: 30,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 892,
    store: 'Dell Oficial',
    timeLeft: '6h 45m',
    freeShipping: true,
  },
];

export default function PromotionsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const handleAddToCart = (product: PromotionProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      store: product.store
    });
  };

  const renderPromotionProduct = ({ item }: { item: PromotionProduct }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        {/* Badge de Desconto */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
        
        {/* Badge de Tempo Limitado */}
        <View style={styles.timeBadge}>
          <Clock size={12} color="#FFFFFF" />
          <Text style={styles.timeText}>{item.timeLeft}</Text>
        </View>
        
        {/* Badge de Quantidade Limitada */}
        {item.limitedQuantity && (
          <View style={styles.quantityBadge}>
            <Zap size={12} color="#FFFFFF" />
            <Text style={styles.quantityText}>Restam {item.limitedQuantity}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{item.store}</Text>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
          <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
            R$ {item.originalPrice.toFixed(2)}
          </Text>
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
          <Text style={styles.savings}>
            Economize R$ {(item.originalPrice - item.price).toFixed(2)}
          </Text>
        </View>
        
        {item.freeShipping && (
          <View style={styles.shippingContainer}>
            <Text style={styles.freeShipping}>Frete grátis</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={() => handleAddToCart(item)}
        >
          <ShoppingCart size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promoções Exclusivas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Banner de Destaque */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerGradient}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>🔥 Ofertas Relâmpago</Text>
            <Text style={styles.bannerSubtitle}>Descontos de até 70% OFF</Text>
            <Text style={styles.bannerDescription}>Por tempo limitado!</Text>
          </View>
        </View>
      </View>

      {/* Lista de Produtos em Promoção */}
      <FlatList
        data={promotionProducts}
        renderItem={renderPromotionProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#5B21B6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerGradient: {
    backgroundColor: '#EF4444',
    padding: 20,
    alignItems: 'center',
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bannerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  timeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 2,
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 2,
  },
  productInfo: {
    padding: 12,
  },
  storeName: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 16,
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
  },
  reviews: {
    marginLeft: 3,
    fontSize: 11,
  },
  priceContainer: {
    marginBottom: 6,
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  savings: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
  },
  shippingContainer: {
    marginBottom: 10,
  },
  freeShipping: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
});