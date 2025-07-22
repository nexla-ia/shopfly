import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Filter, Star, ShoppingCart, SlidersHorizontal } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const categoryNames: { [key: string]: string } = {
  'supermarket': 'Supermercado',
  'home': 'Casa',
  'fashion': 'Moda',
  'beauty': 'Beleza',
  'electronics': 'Eletrônicos',
  'sports': 'Esportes',
};

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'sales' | 'rating';

const sortOptions = [
  { id: 'relevance', name: 'Mais relevantes', icon: '🎯' },
  { id: 'price_low', name: 'Menor preço', icon: '💰' },
  { id: 'price_high', name: 'Maior preço', icon: '💎' },
  { id: 'sales', name: 'Mais vendidos', icon: '🔥' },
  { id: 'rating', name: 'Melhores avaliações', icon: '⭐' },
];

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [products, setProducts] = useState(mockProducts);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [loading, setLoading] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const categoryName = categoryNames[id as string] || 'Categoria';

  useEffect(() => {
    fetchProducts();
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase
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
        sales_count,
        stores ( name )
      `)
      .eq('category', id)
      .eq('is_active', true);

    // Aplicar ordenação
    switch (sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'sales':
          query = query.order('sales_count', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Erro ao buscar produtos:', error);
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

  const renderProduct = ({ item }: { item: any }) => {
    const productImage = item.images && item.images.length > 0 ? item.images[0] : '';
    const productPrice = Number(item.price);
    const originalPrice = item.original_price ? Number(item.original_price) : undefined;
    const discount = originalPrice ? Math.round((1 - productPrice / originalPrice) * 100) : undefined;
    const storeName = item.stores?.name || 'Loja';
    
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
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{storeName}</Text>
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
        
        {item.installments && (
          <Text style={[styles.installments, { color: colors.textSecondary }]}>
            {item.installments}
          </Text>
        )}
        
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
          <Text style={styles.addToCartText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
  };

  const renderSortOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.sortOption,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
        sortBy === option.id && { backgroundColor: colors.primary + '20' }
      ]}
      onPress={() => {
        setSortBy(option.id);
        setShowSortModal(false);
      }}
    >
      <Text style={styles.sortIcon}>{option.icon}</Text>
      <Text style={[
        styles.sortText,
        { color: colors.text },
        sortBy === option.id && { color: colors.primary, fontWeight: '700' }
      ]}>
        {option.name}
      </Text>
      {sortBy === option.id && (
        <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#6d4cff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowSortModal(true)}
        >
          <SlidersHorizontal size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Results Info */}
      <View style={[styles.resultsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {loading ? 'Buscando...' : `${products.length} produtos encontrados`}
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={[styles.sortButtonText, { color: colors.primary }]}>
            {sortOptions.find(opt => opt.id === sortBy)?.name}
          </Text>
          <Filter size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando produtos...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum produto encontrado</Text>
            </View>
          )
        }
      />

      {/* Sort Modal */}
      {showSortModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowSortModal(false)}
          />
          <View style={[styles.sortModal, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ordenar por</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            {sortOptions.map(renderSortOption)}
          </View>
        </View>
      )}
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
  filterButton: {
    padding: 4,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginBottom: 4,
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
  installments: {
    fontSize: 11,
    marginBottom: 8,
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
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
  },
  sortModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 18,
    fontWeight: '600',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    position: 'relative',
  },
  sortIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  sortText: {
    fontSize: 16,
    flex: 1,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
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
    alignItems: 'center',
  },
});