import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Heart, Share } from 'lucide-react-native';
import { ThumbsUp, MessageCircle, Filter } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useFavorites } from '@/context/FavoritesContext';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  discount?: number;
  rating: number;
  reviews: number;
  store: string;
  description: string;
  specifications: { [key: string]: string };
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  freeShipping: boolean;
  installments?: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

const mockProduct: Product = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'iPhone 15 Pro Max 256GB Titânio Natural',
  price: 8999.99,
  originalPrice: 9999.99,
  images: [
    'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  discount: 10,
  rating: 4.8,
  reviews: 1247,
  store: 'Apple Store Oficial',
  description: 'O iPhone 15 Pro Max é o smartphone mais avançado da Apple, com chip A17 Pro, sistema de câmeras profissional e design em titânio premium. Experimente a tecnologia mais inovadora em suas mãos.',
  specifications: {
    'Tela': '6.7" Super Retina XDR OLED',
    'Processador': 'Apple A17 Pro',
    'Armazenamento': '256GB',
    'Câmera': 'Tripla 48MP + 12MP + 12MP',
    'Bateria': 'Até 29h de reprodução de vídeo',
    'Sistema': 'iOS 17',
  },
  availability: 'in_stock',
  freeShipping: true,
  installments: 'em 12x R$ 749,99 sem juros',
};

const mockReviews: Review[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    userName: 'João Silva',
    rating: 5,
    comment: 'Produto excelente! Superou minhas expectativas. A qualidade é incrível e chegou muito rápido.',
    date: '15/01/2024',
    helpful: 23,
    images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    userName: 'Maria Santos',
    rating: 4,
    comment: 'Muito bom produto, recomendo! Apenas o preço que está um pouco alto.',
    date: '12/01/2024',
    helpful: 15,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    userName: 'Pedro Costa',
    rating: 5,
    comment: 'Perfeito! Exatamente como descrito. Entrega rápida e produto bem embalado.',
    date: '10/01/2024',
    helpful: 31,
  },
];

const ratingDistribution = [
  { stars: 5, count: 856, percentage: 68.7 },
  { stars: 4, count: 249, percentage: 20.0 },
  { stars: 3, count: 87, percentage: 7.0 },
  { stars: 2, count: 31, percentage: 2.5 },
  { stars: 1, count: 24, percentage: 1.9 },
];

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [product] = useState(mockProduct);
  const [reviews] = useState(mockReviews);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const { addToFavorites, removeFromFavorites, isFavorite: isProductFavorite, loading: favoritesLoading } = useFavorites();

  const toggleFavorite = async () => {
    if (favoritesLoading) return;

    if (isProductFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      store: product.store
    });
  };

  const handleLikeReview = (reviewId: string) => {
    setLikedReviews(prev => {
      if (prev.includes(reviewId)) {
        return prev.filter(id => id !== reviewId);
      } else {
        return [...prev, reviewId];
      }
    });
  };

  const handleWriteReview = () => {
    // Navegar para tela de escrever avaliação
    router.push(`/product/${product.id}/write-review`);
  };

  const handleViewAllReviews = () => {
    // Navegar para tela de todas as avaliações
    router.push(`/product/${product.id}/reviews`);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
      <Image source={{ uri: item }} style={styles.galleryImage} />
    </TouchableOpacity>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.userInitial}>{item.userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>{item.userName}</Text>
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              color={i < item.rating ? '#FFD700' : '#E5E7EB'}
              fill={i < item.rating ? '#FFD700' : 'transparent'}
            />
          ))}
        </View>
      </View>
      
      <Text style={[styles.reviewComment, { color: colors.text }]}>{item.comment}</Text>
      
      {item.images && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewImages}>
          {item.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.reviewImage} />
          ))}
        </ScrollView>
      )}
      
      <View style={styles.helpfulButton}>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => handleLikeReview(item.id)}
        >
          <ThumbsUp 
            size={16} 
            color={likedReviews.includes(item.id) ? colors.primary : colors.textSecondary}
            fill={likedReviews.includes(item.id) ? colors.primary : 'transparent'}
          />
          <Text style={[
            styles.likeText, 
            { color: likedReviews.includes(item.id) ? colors.primary : colors.textSecondary }
          ]}>
            Útil ({item.helpful + (likedReviews.includes(item.id) ? 1 : 0)})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRatingBar = (item: any) => (
    <View key={item.stars} style={styles.ratingBarRow}>
      <Text style={[styles.ratingBarStars, { color: colors.textSecondary }]}>{item.stars}</Text>
      <Star size={12} color="#FFD700" fill="#FFD700" />
      <View style={styles.ratingBarContainer}>
        <View style={[styles.ratingBarBackground, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.ratingBarFill, 
              { width: `${item.percentage}%`, backgroundColor: colors.primary }
            ]} 
          />
        </View>
      </View>
      <Text style={[styles.ratingBarCount, { color: colors.textSecondary }]}>({item.count})</Text>
    </View>
  );

  const getAvailabilityInfo = () => {
    switch (product.availability) {
      case 'in_stock':
        return { text: 'Em estoque', color: '#10B981' };
      case 'low_stock':
        return { text: 'Últimas unidades', color: '#F59E0B' };
      case 'out_of_stock':
        return { text: 'Fora de estoque', color: '#EF4444' };
      default:
        return { text: 'Em estoque', color: '#10B981' };
    }
  };

  const availabilityInfo = getAvailabilityInfo();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleFavorite} disabled={favoritesLoading}>
            <Heart 
              size={24} 
              color={isProductFavorite(product.id) ? '#EF4444' : '#FFFFFF'} 
              fill={isProductFavorite(product.id) ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Share size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: product.images[selectedImageIndex] }} 
            style={styles.mainImage} 
          />
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
          
          <FlatList
            data={product.images}
            renderItem={renderImage}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageGallery}
          />
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, { backgroundColor: colors.surface }]}>
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <Text style={[styles.storeName, { color: colors.textSecondary }]}>{product.store}</Text>
          
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.rating, { color: colors.text }]}>{product.rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({product.reviews} avaliações)
              </Text>
            </View>
            
            <View style={[styles.availabilityBadge, { backgroundColor: availabilityInfo.color + '20' }]}>
              <Text style={[styles.availabilityText, { color: availabilityInfo.color }]}>
                {availabilityInfo.text}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                R$ {product.originalPrice.toFixed(2)}
              </Text>
            )}
            <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
            {product.installments && (
              <Text style={[styles.installments, { color: colors.textSecondary }]}>
                {product.installments}
              </Text>
            )}
            {product.freeShipping && (
              <Text style={styles.freeShipping}>Frete grátis</Text>
            )}
          </View>

          {/* Quantity and Add to Cart */}
          <View style={styles.actionSection}>
            <View style={styles.quantityContainer}>
              <Text style={[styles.quantityLabel, { color: colors.text }]}>Quantidade:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, { borderColor: colors.border }]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={16} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, { borderColor: colors.border }]}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
              onPress={handleAddToCart}
            >
              <ShoppingCart size={20} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Descrição</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description}
          </Text>
        </View>

        {/* Specifications */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Especificações</Text>
          {Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={[styles.specRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.specKey, { color: colors.textSecondary }]}>{key}</Text>
              <Text style={[styles.specValue, { color: colors.text }]}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Avaliações ({product.reviews})
            </Text>
            <TouchableOpacity onPress={handleViewAllReviews}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {/* Rating Summary */}
          <View style={styles.ratingSummary}>
            <View style={styles.ratingOverview}>
              <Text style={[styles.ratingNumber, { color: colors.text }]}>{product.rating}</Text>
              <View style={styles.ratingStars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < Math.floor(product.rating) ? '#FFD700' : '#E5E7EB'}
                    fill={i < Math.floor(product.rating) ? '#FFD700' : 'transparent'}
                  />
                ))}
              </View>
              <Text style={[styles.ratingTotal, { color: colors.textSecondary }]}>
                {product.reviews} avaliações
              </Text>
            </View>
            
            <View style={styles.ratingDistribution}>
              {ratingDistribution.map(renderRatingBar)}
            </View>
          </View>

          {/* Botão Escrever Avaliação */}
          <TouchableOpacity 
            style={[styles.writeReviewButton, { backgroundColor: colors.primary }]}
            onPress={handleWriteReview}
          >
            <MessageCircle size={16} color="#FFFFFF" />
            <Text style={styles.writeReviewText}>Escrever avaliação</Text>
          </TouchableOpacity>

          {/* Reviews List */}
          {reviews.slice(0, 3).map((review) => (
            <View key={review.id}>
              {renderReview({ item: review })}
            </View>
          ))}
        </View>
      </ScrollView>
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
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 15,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  headerAction: {
    // Empty for spacing
  },
  imageSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 15,
  },
  mainImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  imageGallery: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  galleryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    padding: 20,
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCount: {
    marginLeft: 6,
    fontSize: 14,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceSection: {
    marginBottom: 25,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginBottom: 5,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 5,
  },
  installments: {
    fontSize: 14,
    marginBottom: 5,
  },
  freeShipping: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  actionSection: {
    gap: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 10,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  specKey: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingSummary: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 30,
  },
  ratingOverview: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 5,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  ratingTotal: {
    fontSize: 12,
  },
  ratingDistribution: {
    flex: 1,
    gap: 8,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarStars: {
    fontSize: 12,
    width: 10,
  },
  ratingBarContainer: {
    flex: 1,
  },
  ratingBarBackground: {
    height: 8,
    borderRadius: 4,
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 12,
    width: 35,
    textAlign: 'right',
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewImages: {
    marginBottom: 10,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  likeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});