import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, Filter, Star, ShoppingCart, ArrowLeft } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'supermarket', name: 'Supermercado' },
  { id: 'home', name: 'Casa' },
  { id: 'fashion', name: 'Moda' },
  { id: 'beauty', name: 'Beleza' },
  { id: 'electronics', name: 'Eletrônicos' },
  { id: 'sports', name: 'Esportes' },
];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Buscar produtos do Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (params.category && typeof params.category === 'string') {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

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
        category,
        stores ( name )
      `)
      .eq('is_active', true);

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    if (selectedCategory !== 'all') {
      const categoryMap: { [key: string]: string } = {
        'supermarket': 'supermarket',
        'home': 'home',
        'fashion': 'fashion',
        'beauty': 'beauty',
        'electronics': 'electronics',
        'sports': 'sports',
      };
      
      const categoryName = categoryMap[selectedCategory];
      if (categoryName) {
        query = query.eq('category', categoryName);
      }
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
      <Image source={{ uri: productImage }} style={styles.productImage} />
      {discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {discount}% OFF
          </Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{storeName}</Text>
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFC107" fill="#FFC107" />
          <Text style={[styles.rating, { color: colors.text }]}>{item.rating || 0}</Text>
          <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews_count || 0})</Text>
        </View>
        <View style={styles.priceContainer}>
          {originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>R$ {originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.price}>R$ {productPrice.toFixed(2)}</Text>
        </View>
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

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { backgroundColor: colors.background },
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryChipText,
        { color: colors.textSecondary },
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#6d4cff" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Search size={20} color="##6d4cff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos ou lojas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results */}
      <View style={[styles.resultsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {loading ? 'Buscando...' : `${products.length} produtos encontrados`}
        </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#6366F1',
    borderBottomWidth: 1,
    borderBottomColor: '#5B21B6',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 12,
    borderRadius: 12,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    borderRadius: 12,
    margin: 5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: 140,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
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
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    height: 40,
  },
  storeName: {
    fontSize: 12,
    marginBottom: 4,
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
  priceContainer: {
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
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
  reviews: {
    marginLeft: 3,
    fontSize: 11,
  },
});