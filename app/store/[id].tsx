import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, MapPin, Phone, MessageCircle, ShoppingCart } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage: string;
  rating: number;
  reviews: number;
  category: string;
  deliveryTime: string;
  address: string;
  phone: string;
  hours: string;
  isOpen: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  rating: number;
  reviews: number;
  freeShipping: boolean;
}

const mockStore: Store = {
  id: '1',
  name: 'TechStore Oficial',
  description: 'Sua loja de eletrônicos de confiança com os melhores produtos e atendimento especializado',
  image: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400',
  coverImage: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
  rating: 4.8,
  reviews: 2847,
  category: 'Eletrônicos',
  deliveryTime: '30-45 min',
  address: 'Rua das Tecnologias, 123 - Centro, São Paulo - SP',
  phone: '(11) 99999-9999',
  hours: 'Seg-Sex: 8h-18h | Sáb: 8h-14h',
  isOpen: true,
};

const mockProducts: Product[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'iPhone 15 Pro Max 256GB',
    price: 8999.99,
    originalPrice: 9999.99,
    discount: 10,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 1247,
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'MacBook Air M2 13"',
    price: 7299.99,
    originalPrice: 7999.99,
    discount: 9,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 892,
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'AirPods Pro 2ª Geração',
    price: 1899.99,
    originalPrice: 2199.99,
    discount: 14,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 2156,
    freeShipping: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Monitor Gamer ASUS 27"',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 567,
    freeShipping: true,
  },
];

export default function StoreScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [store] = useState(mockStore);
  const [products] = useState(mockProducts);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      store: store.name
    });
  };

  const handleChat = () => {
    router.push(`/chat/${store.id}`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
          <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              R$ {item.originalPrice.toFixed(2)}
            </Text>
          )}
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
        </View>
        
        {item.freeShipping && (
          <Text style={styles.freeShipping}>Frete grátis</Text>
        )}
        
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={() => handleAddToCart(item)}
        >
          <ShoppingCart size={14} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Adicionar</Text>
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
        <Text style={styles.headerTitle}>{store.name}</Text>
        <TouchableOpacity onPress={handleChat}>
          <MessageCircle size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Cover */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: store.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay}>
            <View style={styles.storeLogoContainer}>
              <Image source={{ uri: store.image }} style={styles.storeLogo} />
            </View>
          </View>
        </View>

        {/* Store Info */}
        <View style={[styles.storeInfoContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.storeHeader}>
            <View style={styles.storeNameContainer}>
              <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: store.isOpen ? '#10B981' : '#EF4444' }
              ]}>
                <Text style={styles.statusText}>
                  {store.isOpen ? 'Aberto' : 'Fechado'}
                </Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.storeRating, { color: colors.text }]}>{store.rating}</Text>
              <Text style={[styles.storeReviews, { color: colors.textSecondary }]}>
                ({store.reviews} avaliações)
              </Text>
            </View>
          </View>

          <Text style={[styles.storeDescription, { color: colors.textSecondary }]}>
            {store.description}
          </Text>

          {/* Store Details */}
          <View style={styles.storeDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {store.address}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Phone size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {store.phone}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {store.hours}
              </Text>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={[styles.productsSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Produtos da loja
          </Text>
          
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
          />
        </View>
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity
        style={[styles.viewProductsButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push(`/(tabs)/search?store=${store.id}`)}
      >
        <Text style={styles.viewProductsButtonText}>Ver todos os produtos</Text>
      </TouchableOpacity>
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
  coverContainer: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  storeLogoContainer: {
    alignSelf: 'flex-start',
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  storeInfoContainer: {
    padding: 20,
    marginBottom: 10,
  },
  storeHeader: {
    marginBottom: 15,
  },
  storeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeRating: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  storeReviews: {
    marginLeft: 6,
    fontSize: 14,
  },
  storeDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  storeDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  productsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  productsList: {
    gap: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
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
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 16,
  },
  rating: {
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  reviews: {
    marginLeft: 3,
    fontSize: 10,
  },
  priceContainer: {
    marginBottom: 4,
    marginTop: 6,
  },
  originalPrice: {
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  freeShipping: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewProductsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  viewProductsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});