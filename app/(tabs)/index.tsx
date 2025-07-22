import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  FlatList,
  TextInput,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Search, Bell, ShoppingCart, Star, Heart, Package, User } from 'lucide-react-native';
import { MessageCircle, ClipboardList } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocationContext } from '@/context/LocationContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  category: string;
  deliveryTime: string;
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
  store: string;
  freeShipping: boolean;
  installments?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  { id: 'all', name: 'Todos', icon: '🏪', color: '#667EEA' },
  { id: 'supermarket', name: 'Supermercado', icon: '🛒', color: '#10B981' },
  { id: 'home', name: 'Casa', icon: '🏠', color: '#3B82F6' },
  { id: 'fashion', name: 'Moda', icon: '👕', color: '#EC4899' },
  { id: 'beauty', name: 'Beleza', icon: '💄', color: '#8B5CF6' },
  { id: 'electronics', name: 'Eletrônicos', icon: '📱', color: '#F59E0B' },
  { id: 'sports', name: 'Esportes', icon: '⚽', color: '#EF4444' },
];

const featuredStores: Store[] = [
  {
    id: '1',
    name: 'TechStore Oficial',
    description: 'Sua loja de eletrônicos de confiança',
    image: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    category: 'Eletrônicos',
    deliveryTime: '30-45 min'
  },
  {
    id: '2',
    name: 'Supermercado Central',
    description: 'Produtos frescos todos os dias',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    category: 'Supermercado',
    deliveryTime: '20-30 min'
  },
  {
    id: '3',
    name: 'Farmácia Saúde+',
    description: 'Cuidando da sua saúde 24h',
    image: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    category: 'Farmácia',
    deliveryTime: '15-25 min'
  },
  {
    id: '4',
    name: 'Moda & Estilo',
    description: 'As últimas tendências da moda',
    image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    category: 'Moda',
    deliveryTime: '45-60 min'
  },
  {
    id: '5',
    name: 'Casa & Decoração',
    description: 'Transforme seu lar',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    category: 'Casa',
    deliveryTime: '60-90 min'
  }
];

const featuredProducts: Product[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'iPhone 15 Pro Max 256GB Titânio Natural',
    price: 8999.99,
    originalPrice: 9999.99,
    discount: 10,
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 1247,
    store: 'Apple Store Oficial',
    freeShipping: true,
    installments: 'em 12x R$ 749,99',
    category: 'electronics'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'MacBook Air M2 13" 256GB Space Gray',
    price: 7299.99,
    originalPrice: 7999.99,
    discount: 9,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 892,
    store: 'Apple Store Oficial',
    freeShipping: true,
    installments: 'em 12x R$ 608,33',
    category: 'electronics'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'AirPods Pro 2ª Geração com Case MagSafe',
    price: 1899.99,
    originalPrice: 2199.99,
    discount: 14,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 2156,
    store: 'Apple Store Oficial',
    freeShipping: true,
    installments: 'em 10x R$ 189,99',
    category: 'electronics'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Samsung Galaxy S24 Ultra 512GB Preto',
    price: 6799.99,
    originalPrice: 7499.99,
    discount: 9,
    image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 1834,
    store: 'Samsung Oficial',
    freeShipping: true,
    installments: 'em 12x R$ 566,66',
    category: 'electronics'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Monitor Gamer ASUS 27" 144Hz IPS',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 567,
    store: 'ASUS Store',
    freeShipping: true,
    installments: 'em 12x R$ 108,33',
    category: 'electronics'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Teclado Mecânico Logitech MX Keys',
    price: 599.99,
    originalPrice: 699.99,
    discount: 14,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 892,
    store: 'Logitech Store',
    freeShipping: true,
    installments: 'em 6x R$ 99,99',
    category: 'electronics'
  },
  // Produtos de Supermercado
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Arroz Integral Tio João 1kg',
    price: 8.99,
    image: 'https://images.pexels.com/photos/33239/rice-grain-food-raw.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 234,
    store: 'Supermercado Central',
    freeShipping: true,
    category: 'supermarket'
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
    category: 'supermarket'
  },
  // Produtos de Casa
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
    category: 'home'
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
    category: 'home'
  },
  // Produtos de Moda
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
    category: 'fashion'
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
    category: 'fashion'
  },
  // Produtos de Beleza
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
    category: 'beauty'
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
    category: 'beauty'
  },
  // Produtos de Esportes
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
    category: 'sports'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'Kit Halteres 20kg Musculação',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 89,
    store: 'Esportes Total',
    freeShipping: true,
    installments: 'em 6x R$ 49,99',
    category: 'sports'
  }
];

export default function HomeScreen() {
  const router = useRouter();
  
  const { getCartItemCount, addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite, loading: favoritesLoading } = useFavorites();
  const { colors } = useTheme();
  const { currentCity, loading: locationLoading, requestLocationPermission } = useLocationContext();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeOrdersCount, setActiveOrdersCount] = useState(2); // Simular pedidos ativos
  const [unreadChatsCount, setUnreadChatsCount] = useState(3); // Simular chats não lidos
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  // Promoções em destaque
  const promotions = [
    {
      id: '1',
      title: 'Mega Promoção',
      subtitle: 'Até 50% OFF',
      description: 'em produtos selecionados',
      image: 'https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: ['#667EEA', '#764BA2'],
    },
    {
      id: '2',
      title: 'Black Friday',
      subtitle: 'Até 70% OFF',
      description: 'em eletrônicos',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: ['#FF6B6B', '#FF8E53'],
    },
    {
      id: '3',
      title: 'Frete Grátis',
      subtitle: 'Em toda loja',
      description: 'para compras acima de R$ 99',
      image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
      gradient: ['#4ECDC4', '#44A08D'],
    },
  ];

  const cartItemCount = getCartItemCount();

  const toggleFavorite = async (productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    if (favoritesLoading) return; // Evitar múltiplos cliques

    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        discount: product.discount,
        rating: product.rating,
        reviews: product.reviews,
        store: product.store,
        freeShipping: product.freeShipping,
        installments: product.installments,
      };
      await addToFavorites(favoriteItem);
    }
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

  // Auto-play do carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex(prev => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderPromotion = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.promotionCard}
      onPress={() => router.push('/promotions')}
    >
      <View style={[styles.promotionGradient, { backgroundColor: item.gradient[0] }]}>
        <View style={styles.promotionContent}>
          <View style={styles.promotionBadge}>
            <Text style={styles.promotionBadgeText}>OFERTA ESPECIAL</Text>
          </View>
          <Text style={styles.promotionTitle}>{item.title}</Text>
          <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
          <Text style={styles.promotionDescription}>{item.description}</Text>
          <TouchableOpacity style={styles.promotionButton}>
            <Text style={styles.promotionButtonText}>Ver ofertas</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: item.image }}
          style={styles.promotionImage}
        />
      </View>
    </TouchableOpacity>
  );

  const renderPromotionDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.promotionDot,
        index === currentPromoIndex && styles.promotionDotActive
      ]}
    />
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart 
            size={18} 
            color={isFavorite(item.id) ? '#FF6B6B' : '#9CA3AF'} 
            fill={isFavorite(item.id) ? '#FF6B6B' : 'transparent'}
          />
        </TouchableOpacity>
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.storeName}>{item.store}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" fill="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>R$ {item.originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
        </View>
        
        {item.installments && (
          <Text style={styles.installments}>{item.installments}</Text>
        )}
        
        {item.freeShipping && (
          <View style={styles.shippingContainer}>
            <Text style={styles.freeShipping}>Frete grátis</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <ShoppingCart size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderStore = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => router.push(`/store/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.storeImage} />
      <View style={styles.storeOverlay}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.storeDescription}>{item.description}</Text>
          <View style={styles.storeDetails}>
            <View style={styles.storeRating}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.storeRatingText}>{item.rating}</Text>
            </View>
            <Text style={styles.storeDeliveryTime}>{item.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => {
        if (item.id === 'all') {
          router.push('/categories');
        } else {
          router.push(`/(tabs)/search?category=${item.id}`);
        }
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.categoryEmoji}>{item.icon}</Text>
      </View>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={[styles.appHeader, { backgroundColor: colors.primary }]}>
          <View style={styles.appHeaderLeft}>
            <Package size={24} color="#FFFFFF" />
            <Text style={styles.appName}>ShopFly</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Chat Icon */}
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => router.push('/messages')}
            >
              <MessageCircle size={24} color="#FFFFFF" />
              {unreadChatsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadChatsCount > 99 ? '99+' : unreadChatsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Orders Icon */}
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <ClipboardList size={24} color="#FFFFFF" />
              {activeOrdersCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {activeOrdersCount > 99 ? '99+' : activeOrdersCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Profile Icon */}
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => user ? router.push('/(tabs)/profile') : router.push('/auth/welcome')}
            >
              <User size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={() => requestLocationPermission()}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar produtos e lojas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
              editable={false}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.locationContainer}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>Entregar em</Text>
            <TouchableOpacity onPress={() => router.push('/profile/addresses')}>
              <Text style={[styles.locationAddress, { color: colors.text }]}>
                {locationLoading ? 'Localizando...' : currentCity || 'Definir localização'}
              </Text>
            </TouchableOpacity>
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

        {/* Promoções Exclusivas - Carousel */}
        <View style={styles.promotionsSection}>
          <Text style={[styles.promotionsSectionTitle, { color: colors.text }]}>
            Promoções Exclusivas
          </Text>
          
          <FlatList
            data={promotions}
            renderItem={renderPromotion}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentPromoIndex(index);
            }}
            style={styles.promotionsCarousel}
          />
          
          <View style={styles.promotionDots}>
            {promotions.map((_, index) => renderPromotionDot(index))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lojas em Destaque</Text>
            <TouchableOpacity onPress={() => router.push('/stores')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredStores}
            renderItem={renderStore}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storesList}
          />
        </View>

        {/* Featured Products */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Produtos em Destaque</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

        {/* Recommendations */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recomendado para você</Text>
          </View>
          
          <FlatList
            data={featuredProducts.slice(0, 4)}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

        {/* Recently Viewed */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Vistos recentemente</Text>
          </View>
          
          <FlatList
            data={featuredProducts.slice(2, 6)}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  appHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerIconButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  locationAddress: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 25,
    paddingVertical: 5,
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#1E293B',
    fontWeight: '700',
  },
  bannerContainer: {
    // Removido - substituído por promotionsSection
  },
  promotionsSection: {
    marginBottom: 20,
  },
  promotionsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  promotionsCarousel: {
    marginBottom: 15,
  },
  promotionCard: {
    width: width - 40,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  promotionGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
  },
  promotionContent: {
    flex: 1,
  },
  promotionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promotionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  promotionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  promotionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  promotionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: '700',
  },
  promotionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 15,
  },
  promotionDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  promotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  promotionDotActive: {
    backgroundColor: '#6366F1',
    width: 24,
  },
  section: {
    marginBottom: 10,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsGrid: {
    paddingHorizontal: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 6,
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
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    color: '#1E293B',
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
    color: '#1E293B',
  },
  reviews: {
    marginLeft: 3,
    fontSize: 11,
    color: '#64748B',
  },
  priceContainer: {
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  installments: {
    fontSize: 11,
    color: '#64748B',
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
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  storesList: {
    paddingHorizontal: 20,
  },
  storeCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  storeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  storeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeRatingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  storeDeliveryTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});