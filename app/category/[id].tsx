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

interface Product {
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
  sales: number;
}

const categoryNames: { [key: string]: string } = {
  'supermarket': 'Supermercado',
  'home': 'Casa',
  'fashion': 'Moda',
  'beauty': 'Beleza',
  'electronics': 'Eletrônicos',
  'sports': 'Esportes',
};

const mockProducts: Product[] = [
  // Eletrônicos
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'iPhone 15 Pro Max 256GB',
    price: 8999.99,
    originalPrice: 9999.99,
    discount: 10,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 1247,
    store: 'Apple Store Oficial',
    freeShipping: true,
    installments: 'em 12x R$ 749,99',
    sales: 2500
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'MacBook Air M2 13" 256GB',
    price: 7299.99,
    originalPrice: 7999.99,
    discount: 9,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 892,
    store: 'Apple Store Oficial',
    freeShipping: true,
    installments: 'em 12x R$ 608,33',
    sales: 1800
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
    store: 'Apple Store Oficial',
    freeShipping: true,
    installments: 'em 10x R$ 189,99',
    sales: 3200
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Samsung Galaxy S24 Ultra',
    price: 6799.99,
    originalPrice: 7499.99,
    discount: 9,
    image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 1834,
    store: 'Samsung Oficial',
    freeShipping: true,
    installments: 'em 12x R$ 566,66',
    sales: 1500
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Monitor Gamer ASUS 27" 144Hz',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 567,
    store: 'ASUS Store',
    freeShipping: true,
    installments: 'em 12x R$ 108,33',
    sales: 890
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Teclado Mecânico Logitech',
    price: 599.99,
    originalPrice: 699.99,
    discount: 14,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 892,
    store: 'Logitech Store',
    freeShipping: true,
    installments: 'em 6x R$ 99,99',
    sales: 650
  },
  // Supermercado
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Arroz Integral Tio João 1kg',
    price: 8.99,
    image: 'https://images.pexels.com/photos/33239/rice-grain-food-raw.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 234,
    store: 'Supermercado Central',
    freeShipping: true,
    sales: 1200
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Feijão Preto Camil 1kg',
    price: 7.49,
    image: 'https://images.pexels.com/photos/4198564/pexels-photo-4198564.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 189,
    store: 'Supermercado Central',
    freeShipping: true,
    sales: 980
  },
  // Casa
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Sofá 3 Lugares Cinza Moderno',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 156,
    store: 'Casa & Decoração',
    freeShipping: true,
    installments: 'em 12x R$ 108,33',
    sales: 340
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Mesa de Jantar 6 Lugares Madeira',
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 98,
    store: 'Casa & Decoração',
    freeShipping: true,
    installments: 'em 10x R$ 89,99',
    sales: 210
  },
  // Moda
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Vestido Floral Verão Feminino',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 267,
    store: 'Moda & Estilo',
    freeShipping: true,
    installments: 'em 3x R$ 29,99',
    sales: 780
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Tênis Esportivo Masculino Preto',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 445,
    store: 'Moda & Estilo',
    freeShipping: true,
    installments: 'em 4x R$ 49,99',
    sales: 1100
  },
  // Beleza
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Kit Skincare Facial Completo',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 523,
    store: 'Beleza Natural',
    freeShipping: true,
    installments: 'em 5x R$ 29,99',
    sales: 890
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Perfume Feminino Floral 100ml',
    price: 89.99,
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 312,
    store: 'Beleza Natural',
    freeShipping: true,
    installments: 'em 3x R$ 29,99',
    sales: 650
  },
  // Esportes
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Bicicleta Mountain Bike Aro 29',
    price: 1599.99,
    originalPrice: 1999.99,
    discount: 20,
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 178,
    store: 'Esportes Total',
    freeShipping: true,
    installments: 'em 12x R$ 133,33',
    sales: 290
  }
];

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
  const [showSortModal, setShowSortModal] = useState(false);

  const categoryName = categoryNames[id as string] || 'Categoria';

  useEffect(() => {
    sortProducts(sortBy);
  }, [sortBy]);

  const sortProducts = (option: SortOption) => {
    const sorted = [...mockProducts].sort((a, b) => {
      switch (option) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'sales':
          return b.sales - a.sales;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setProducts(sorted);
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
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{item.store}</Text>
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
        
        {item.installments && (
          <Text style={[styles.installments, { color: colors.textSecondary }]}>
            {item.installments}
          </Text>
        )}
        
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
          <Text style={styles.addToCartText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          {products.length} produtos encontrados
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
    alignItems: 'center',
  },
});