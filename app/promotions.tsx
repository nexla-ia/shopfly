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
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function PromotionsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchPromotionProducts();
  }, []);

  const fetchPromotionProducts = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        original_price,
        images,
        rating,
        reviews_count,
        free_shipping,
        installments,
        stores ( name )
      `)
      .not('original_price', 'is', null)
      .eq('is_active', true)
      .order('sales_count', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Erro ao buscar produtos em promoção:', error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    
    setLoading(false);
  };

  const handleAddToCart = (product: any) => {
    const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: productImage,
      quantity: 1,
      store: product.stores?.name || 'Loja'
    });
  };

  const renderPromotionProduct = ({ item }: { item: any }) => {
    const productImage = item.images && item.images.length > 0 ? item.images[0] : '';
    const productPrice = Number(item.price);
    const originalPrice = Number(item.original_price);
    const discount = Math.round((1 - productPrice / originalPrice) * 100);
    const storeName = item.stores?.name || 'Loja';
    
    return (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: productImage }} style={styles.productImage} />
        
        {/* Badge de Desconto */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}% OFF</Text>
        </View>
        
        {/* Badge de Tempo Limitado */}
        <View style={styles.timeBadge}>
          <Clock size={12} color="#FFFFFF" />
          <Text style={styles.timeText}>Limitado</Text>
        </View>
        
        <View style={styles.quantityBadge}>
          <Zap size={12} color="#FFFFFF" />
          <Text style={styles.quantityText}>Oferta</Text>
        </View>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{storeName}</Text>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.rating, { color: colors.text }]}>{item.rating || 0}</Text>
          <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews_count || 0})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
            R$ {originalPrice.toFixed(2)}
          </Text>
          <Text style={styles.price}>R$ {productPrice.toFixed(2)}</Text>
          <Text style={styles.savings}>
            Economize R$ {(originalPrice - productPrice).toFixed(2)}
          </Text>
        </View>
        
        {item.free_shipping && (
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
  };

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
        data={products}
        renderItem={renderPromotionProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando promoções...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma promoção disponível</Text>
            </View>
          )
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});