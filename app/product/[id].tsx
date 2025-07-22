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
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

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
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const { addToFavorites, removeFromFavorites, isFavorite: isProductFavorite, loading: favoritesLoading } = useFavorites();
  
  React.useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
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
        description,
        specifications,
        stock_quantity,
        free_shipping,
        installments,
        stores ( name )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar produto:', error);
      setProduct(null);
    } else {
      setProduct(data);
    }
    
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        helpful_count,
        images,
        created_at,
        user_profiles ( full_name )
      `)
      .eq('product_id', id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar reviews:', error);
      setReviews([]);
    } else {
      setReviews(data || []);
    }
  };


  const toggleFavorite = async () => {
    if (favoritesLoading || !product) return;

    if (isProductFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      const productPrice = Number(product.price);
      const originalPrice = product.original_price ? Number(product.original_price) : undefined;
      const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
      
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: productPrice,
        originalPrice: originalPrice,
        image: productImage,
        discount: originalPrice ? Math.round((1 - productPrice / originalPrice) * 100) : undefined,
        rating: product.rating,
        reviews: product.reviews_count || 0,
        store: product.stores?.name || 'Loja',
        freeShipping: product.free_shipping,
        installments: product.installments,
      };
      await addToFavorites(favoriteItem);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const productImage = product.images && product.images.length > 0 ? product.images[0] : '';
    
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: productImage,
      quantity,
      store: product.stores?.name || 'Loja'
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
    router.push(`/product/${product.id}/write-review`);
  };

  const handleViewAllReviews = () => {
    router.push(`/product/${product.id}/reviews`);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
      <Image source={{ uri: item }} style={styles.galleryImage} />
    </TouchableOpacity>
  );

  const renderReview = ({ item }: { item: any }) => (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.userInitial}>
              {item.user_profiles?.full_name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.user_profiles?.full_name || 'Usuário'}
            </Text>
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </Text>
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
    return { text: 'Em estoque', color: '#10B981' };
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando produto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Produto não encontrado</Text>
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

  const productImages = product.images || [];
  const productPrice = Number(product.price);
  const originalPrice = product.original_price ? Number(product.original_price) : undefined;
  const discount = originalPrice ? Math.round((1 - productPrice / originalPrice) * 100) : undefined;
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
            source={{ uri: productImages[selectedImageIndex] || productImages[0] || '' }} 
            style={styles.mainImage} 
          />
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
          
          {productImages.length > 1 && (
            <FlatList
              data={productImages}
              renderItem={renderImage}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            />
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.productInfo, { backgroundColor: colors.surface }]}>
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <Text style={[styles.storeName, { color: colors.textSecondary }]}>{product.stores?.name || 'Loja'}</Text>
          
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.rating, { color: colors.text }]}>{product.rating || 0}</Text>
              <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({product.reviews_count || 0} avaliações)
              </Text>
            </View>
            
            <View style={[styles.availabilityBadge, { backgroundColor: availabilityInfo.color + '20' }]}>
              <Text style={[styles.availabilityText, { color: availabilityInfo.color }]}>
                {availabilityInfo.text}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            {originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                R$ {originalPrice.toFixed(2)}
              </Text>
            )}
            <Text style={styles.price}>R$ {productPrice.toFixed(2)}</Text>
            {product.installments && (
              <Text style={[styles.installments, { color: colors.textSecondary }]}>
                {product.installments}
              </Text>
            )}
            {product.free_shipping && (
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
            {product.description || 'Descrição não disponível'}
          </Text>
        </View>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Especificações</Text>
            {Object.entries(product.specifications).map(([key, value]) => (
              <View key={key} style={[styles.specRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.specKey, { color: colors.textSecondary }]}>{key}</Text>
                <Text style={[styles.specValue, { color: colors.text }]}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Avaliações ({product.reviews_count || 0})
            </Text>
            <TouchableOpacity onPress={handleViewAllReviews}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {/* Rating Summary */}
          <View style={styles.ratingSummary}>
            <View style={styles.ratingOverview}>
              <Text style={[styles.ratingNumber, { color: colors.text }]}>{product.rating || 0}</Text>
              <View style={styles.ratingStars}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < Math.floor(product.rating || 0) ? '#FFD700' : '#E5E7EB'}
                    fill={i < Math.floor(product.rating || 0) ? '#FFD700' : 'transparent'}
                  />
                ))}
              </View>
              <Text style={[styles.ratingTotal, { color: colors.textSecondary }]}>
                {product.reviews_count || 0} avaliações
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
};

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