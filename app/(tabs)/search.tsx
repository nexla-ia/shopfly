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

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  store: string;
  originalPrice?: number;
}

const mockProducts: Product[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Smartphone Samsung Galaxy A54',
    price: 1299.99,
    originalPrice: 1599.99,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    category: 'Eletrônicos',
    store: 'Loja de Eletrônicos Tech'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Notebook Dell Inspiron 15',
    price: 2799.99,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    category: 'Eletrônicos',
    store: 'Loja de Eletrônicos Tech'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Arroz Integral Tio João 1kg',
    price: 8.99,
    image: 'https://images.pexels.com/photos/33239/rice-grain-food-raw.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    category: 'Supermercado',
    store: 'Supermercado Central'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Feijão Preto Camil 1kg',
    price: 7.49,
    image: 'https://images.pexels.com/photos/4198564/pexels-photo-4198564.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    category: 'Supermercado',
    store: 'Supermercado Central'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440017',
    name: 'Dipirona 500mg - 20 comprimidos',
    price: 12.99,
    image: 'https://images.pexels.com/photos/3683080/pexels-photo-3683080.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    category: 'Farmácia',
    store: 'Farmácia Saúde+'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440018',
    name: 'Vitamina C 500mg - 30 cápsulas',
    price: 24.99,
    image: 'https://images.pexels.com/photos/3683070/pexels-photo-3683070.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    category: 'Farmácia',
    store: 'Farmácia Saúde+'
  },
  // Produtos de Casa
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Sofá 3 Lugares Cinza Moderno',
    price: 1299.99,
    originalPrice: 1599.99,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    category: 'Casa',
    store: 'Casa & Decoração'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Mesa de Jantar 6 Lugares Madeira',
    price: 899.99,
    originalPrice: 1199.99,
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    category: 'Casa',
    store: 'Casa & Decoração'
  },
  // Produtos de Moda
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Vestido Floral Verão Feminino',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    category: 'Moda',
    store: 'Moda & Estilo'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Tênis Esportivo Masculino Preto',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    category: 'Moda',
    store: 'Moda & Estilo'
  },
  // Produtos de Beleza
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Kit Skincare Facial Completo',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    category: 'Beleza',
    store: 'Beleza Natural'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Perfume Feminino Floral 100ml',
    price: 89.99,
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    category: 'Beleza',
    store: 'Beleza Natural'
  },
  // Produtos de Esportes
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Bicicleta Mountain Bike Aro 29',
    price: 1599.99,
    originalPrice: 1999.99,
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    category: 'Esportes',
    store: 'Esportes Total'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'Kit Halteres 20kg Musculação',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    category: 'Esportes',
    store: 'Esportes Total'
  }
];

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
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory]);

  // Definir categoria inicial baseada no parâmetro da URL
  useEffect(() => {
    if (params.category && typeof params.category === 'string') {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

  const filterProducts = () => {
    let filtered = mockProducts;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      // Mapear IDs das categorias para os valores usados nos produtos
      const categoryMap: { [key: string]: string } = {
        'supermarket': 'Supermercado',
        'home': 'Casa',
        'fashion': 'Moda',
        'beauty': 'Beleza',
        'electronics': 'Eletrônicos',
        'sports': 'Esportes',
      };
      
      const categoryName = categoryMap[selectedCategory];
      if (categoryName) {
        filtered = filtered.filter(product => product.category === categoryName);
      }
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      store: product.store
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.originalPrice && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
          </Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{item.store}</Text>
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFC107" fill="#FFC107" />
          <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
        </View>
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>R$ {item.originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
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
          {filteredProducts.length} produtos encontrados
        </Text>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
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
});