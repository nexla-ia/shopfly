import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, Search, Filter, CreditCard as Edit3, Trash2, Camera, Send } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  helpful: number;
  store: string;
  canEdit: boolean;
  images?: string[];
}

interface PendingReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  store: string;
  purchaseDate: string;
}

const mockReviews: Review[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    productId: '550e8400-e29b-41d4-a716-446655440001',
    productName: 'iPhone 15 Pro Max 256GB',
    productImage: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    comment: 'Produto excelente! Superou minhas expectativas. A qualidade da câmera é incrível e a bateria dura o dia todo.',
    date: '15/01/2024',
    status: 'published',
    helpful: 23,
    store: 'Apple Store Oficial',
    canEdit: true,
    images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    productId: '550e8400-e29b-41d4-a716-446655440002',
    productName: 'MacBook Air M2 13"',
    productImage: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    comment: 'Muito bom para trabalho. Rápido e silencioso. Apenas a tela poderia ser um pouco maior.',
    date: '10/01/2024',
    status: 'published',
    helpful: 15,
    store: 'Apple Store Oficial',
    canEdit: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    productId: '550e8400-e29b-41d4-a716-446655440003',
    productName: 'AirPods Pro 2ª Geração',
    productImage: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    comment: 'Som perfeito! O cancelamento de ruído é impressionante.',
    date: '05/01/2024',
    status: 'published',
    helpful: 31,
    store: 'Apple Store Oficial',
    canEdit: false,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    productId: '550e8400-e29b-41d4-a716-446655440005',
    productName: 'Monitor Gamer ASUS 27"',
    productImage: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 3,
    comment: 'Produto chegou com defeito na embalagem.',
    date: '28/12/2023',
    status: 'pending',
    helpful: 0,
    store: 'ASUS Store',
    canEdit: true,
  },
];

const mockPendingReviews: PendingReview[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    productId: '550e8400-e29b-41d4-a716-446655440004',
    productName: 'Samsung Galaxy S24 Ultra',
    productImage: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
    store: 'Samsung Oficial',
    purchaseDate: '20/01/2024',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    productId: '550e8400-e29b-41d4-a716-446655440006',
    productName: 'Teclado Mecânico Logitech',
    productImage: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    store: 'Logitech Store',
    purchaseDate: '18/01/2024',
  },
];

const statusConfig = {
  published: { label: 'Publicada', color: '#10B981', bgColor: '#D1FAE5' },
  pending: { label: 'Pendente', color: '#F59E0B', bgColor: '#FEF3C7' },
  rejected: { label: 'Rejeitada', color: '#EF4444', bgColor: '#FEE2E2' },
};

export default function ReviewsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'published' | 'pending'>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PendingReview | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    images: [] as string[],
  });

  const filteredReviews = mockReviews.filter(review =>
    review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.store.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPendingReviews = mockPendingReviews.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.store.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWriteReview = (product: PendingReview) => {
    setSelectedProduct(product);
    setEditingReview(null);
    setReviewForm({ rating: 0, comment: '', images: [] });
    setShowReviewModal(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setSelectedProduct(null);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
    });
    setShowReviewModal(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      'Excluir Avaliação',
      'Tem certeza que deseja excluir esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
          // Aqui removeria a avaliação
          Alert.alert('Sucesso', 'Avaliação excluída com sucesso!');
        }},
      ]
    );
  };

  const handleSubmitReview = () => {
    if (reviewForm.rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma nota');
      return;
    }
    if (!reviewForm.comment.trim()) {
      Alert.alert('Erro', 'Por favor, escreva um comentário');
      return;
    }

    // Simular envio da avaliação
    Alert.alert(
      'Sucesso',
      editingReview ? 'Avaliação atualizada com sucesso!' : 'Avaliação enviada com sucesso!',
      [{ text: 'OK', onPress: () => setShowReviewModal(false) }]
    );
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onPress?.(star)}
          disabled={!onPress}
        >
          <Star
            size={onPress ? 32 : 16}
            color={star <= rating ? '#FFD700' : '#E5E7EB'}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderReview = ({ item }: { item: Review }) => {
    const status = statusConfig[item.status];
    
    return (
      <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.reviewHeader}>
          <Image source={{ uri: item.productImage }} style={styles.productImage} />
          <View style={styles.reviewInfo}>
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {item.productName}
            </Text>
            <Text style={[styles.storeName, { color: colors.textSecondary }]}>{item.store}</Text>
            <View style={styles.reviewMeta}>
              {renderStars(item.rating)}
              <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{item.date}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <Text style={[styles.reviewComment, { color: colors.text }]}>{item.comment}</Text>

        {item.images && item.images.length > 0 && (
          <View style={styles.reviewImages}>
            {item.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
            ))}
          </View>
        )}

        <View style={styles.reviewFooter}>
          <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
            👍 {item.helpful} pessoas acharam útil
          </Text>
          
          {item.canEdit && (
            <View style={styles.reviewActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditReview(item)}
              >
                <Edit3 size={16} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteReview(item.id)}
              >
                <Trash2 size={16} color="#EF4444" />
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPendingReview = ({ item }: { item: PendingReview }) => (
    <View style={[styles.pendingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={{ uri: item.productImage }} style={styles.productImage} />
      <View style={styles.pendingInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={[styles.storeName, { color: colors.textSecondary }]}>{item.store}</Text>
        <Text style={[styles.purchaseDate, { color: colors.textSecondary }]}>
          Comprado em {item.purchaseDate}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.writeReviewButton, { backgroundColor: colors.primary }]}
        onPress={() => handleWriteReview(item)}
      >
        <Text style={styles.writeReviewText}>Avaliar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Opiniões</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar produtos avaliados..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'published' && { borderBottomColor: colors.primary }
          ]}
          onPress={() => setActiveTab('published')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'published' ? colors.primary : colors.textSecondary }
          ]}>
            Publicadas ({filteredReviews.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'pending' && { borderBottomColor: colors.primary }
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'pending' ? colors.primary : colors.textSecondary }
          ]}>
            Pendentes ({filteredPendingReviews.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'published' ? (
        <FlatList
          data={filteredReviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Star size={80} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Nenhuma avaliação ainda
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Suas avaliações aparecerão aqui após serem publicadas
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredPendingReviews}
          renderItem={renderPendingReview}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Star size={80} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Nenhum produto para avaliar
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Compre produtos para poder avaliá-los
              </Text>
            </View>
          }
        />
      )}

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingReview ? 'Editar Avaliação' : 'Escrever Avaliação'}
              </Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {(selectedProduct || editingReview) && (
              <View style={styles.productInfo}>
                <Image 
                  source={{ uri: selectedProduct?.productImage || editingReview?.productImage }} 
                  style={styles.modalProductImage} 
                />
                <View>
                  <Text style={[styles.modalProductName, { color: colors.text }]}>
                    {selectedProduct?.productName || editingReview?.productName}
                  </Text>
                  <Text style={[styles.modalStoreName, { color: colors.textSecondary }]}>
                    {selectedProduct?.store || editingReview?.store}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.ratingSection}>
              <Text style={[styles.ratingLabel, { color: colors.text }]}>Sua nota:</Text>
              {renderStars(reviewForm.rating, (rating) => 
                setReviewForm(prev => ({ ...prev, rating }))
              )}
            </View>

            <View style={styles.commentSection}>
              <Text style={[styles.commentLabel, { color: colors.text }]}>Seu comentário:</Text>
              <TextInput
                style={[styles.commentInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Conte sua experiência com o produto..."
                value={reviewForm.comment}
                onChangeText={(comment) => setReviewForm(prev => ({ ...prev, comment }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.addPhotosButton}>
              <Camera size={20} color={colors.primary} />
              <Text style={[styles.addPhotosText, { color: colors.primary }]}>
                Adicionar fotos (opcional)
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmitReview}
              >
                <Send size={16} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  {editingReview ? 'Atualizar' : 'Enviar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 12,
    marginBottom: 8,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewDate: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    height: 'fit-content',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImages: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  pendingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  purchaseDate: {
    fontSize: 12,
    marginTop: 4,
  },
  writeReviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  modalProductImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalStoreName: {
    fontSize: 14,
  },
  ratingSection: {
    padding: 20,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentSection: {
    padding: 20,
    paddingTop: 0,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  addPhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 12,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addPhotosText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});