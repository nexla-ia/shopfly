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

export default function StoreScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStore();
      fetchStoreProducts();
    }
  }, [id]);

  const fetchStore = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar loja:', error);
      setStore(null);
    } else {
      setStore(data);
    }
    
    setLoading(false);
  };

  const fetchStoreProducts = async () => {
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
        free_shipping
      `)
      .eq('store_id', id)
      .eq('is_active', true)
      .limit(20);

    if (error) {
      console.error('Erro ao buscar produtos da loja:', error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
  };

  const handleAddToCart = (product: any) => {
    const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: productImage,
      quantity: 1,
      store: store?.name || 'Loja'
    });
  };

  const handleChat = () => {
    router.push(`/chat/${store?.id}`);
  };

  const renderProduct = ({ item }: { item: any }) => {
    const productImage = item.images && item.images.length > 0 ? item.images[0] : '';
    const productPrice = Number(item.price);
    const originalPrice = item.original_price ? Number(item.original_price) : undefined;
    const discount = originalPrice ? Math.round((1 - productPrice / originalPrice) * 100) : undefined;
    
    return (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: productImage }} style={styles.productImage} />
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.rating, { color: colors.text }]}>{item.rating || 0}</Text>
          <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews_count || 0})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          {originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              R$ {originalPrice.toFixed(2)}
            </Text>
          )}
          <Text style={styles.price}>R$ {productPrice.toFixed(2)}</Text>
        </View>
        
        {item.free_shipping && (
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
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando loja...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!store) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Loja não encontrada</Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{store?.name || 'Loja'}</Text>
        <TouchableOpacity onPress={handleChat}>
          <MessageCircle size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Cover */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: store.cover_image_url || store.image_url }} style={styles.coverImage} />
          <View style={styles.coverOverlay}>
            <View style={styles.storeLogoContainer}>
              <Image source={{ uri: store.image_url }} style={styles.storeLogo} />
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
                { backgroundColor: store.is_open ? '#10B981' : '#EF4444' }
              ]}>
                <Text style={styles.statusText}>
                  {store.is_open ? 'Aberto' : 'Fechado'}
                </Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.storeRating, { color: colors.text }]}>{store.rating || 0}</Text>
              <Text style={[styles.storeReviews, { color: colors.textSecondary }]}>
                ({store.reviews_count || 0} avaliações)
              </Text>
            </View>
          </View>

          <Text style={[styles.storeDescription, { color: colors.textSecondary }]}>
            {store.description || 'Loja parceira'}
          </Text>

          {/* Store Details */}
          <View style={styles.storeDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {store.address || 'Endereço não informado'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Phone size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {store.phone || 'Telefone não informado'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {store.hours || 'Horário não informado'}
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
        onPress={() => router.push(`/(tabs)/search?store=${store?.id}`)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});