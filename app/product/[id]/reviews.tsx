import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Filter, ThumbsUp, MessageCircle, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
  verified: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

const mockReviews: Review[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    userName: 'João Silva',
    rating: 5,
    comment: 'Produto excelente! Superou minhas expectativas. A qualidade da câmera é incrível e a bateria dura o dia todo. Recomendo muito!',
    date: '15/01/2024',
    helpful: 23,
    images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200'],
    verified: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    userName: 'Maria Santos',
    rating: 4,
    comment: 'Muito bom produto, recomendo! Apenas o preço que está um pouco alto, mas a qualidade compensa.',
    date: '12/01/2024',
    helpful: 15,
    verified: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    userName: 'Pedro Costa',
    rating: 5,
    comment: 'Perfeito! Exatamente como descrito. Entrega rápida e produto bem embalado. Já é meu segundo iPhone e não me decepciona.',
    date: '10/01/2024',
    helpful: 31,
    verified: false,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    userName: 'Ana Oliveira',
    rating: 3,
    comment: 'Produto bom, mas esperava mais pela fama. A bateria não dura tanto quanto prometido.',
    date: '08/01/2024',
    helpful: 8,
    verified: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    userName: 'Carlos Ferreira',
    rating: 5,
    comment: 'Simplesmente incrível! A qualidade das fotos é surreal. Vale cada centavo investido.',
    date: '05/01/2024',
    helpful: 42,
    images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200'],
    verified: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    userName: 'Lucia Mendes',
    rating: 4,
    comment: 'Muito satisfeita com a compra. O produto chegou rapidinho e funciona perfeitamente.',
    date: '03/01/2024',
    helpful: 19,
    verified: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440107',
    userName: 'Roberto Silva',
    rating: 2,
    comment: 'Produto veio com defeito na tela. Tive que trocar na garantia.',
    date: '01/01/2024',
    helpful: 5,
    verified: true,
  },
];

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'Todas', count: 1247 },
  { id: '5', label: '5 estrelas', count: 856 },
  { id: '4', label: '4 estrelas', count: 249 },
  { id: '3', label: '3 estrelas', count: 87 },
  { id: '2', label: '2 estrelas', count: 31 },
  { id: '1', label: '1 estrela', count: 24 },
  { id: 'photos', label: 'Com fotos', count: 156 },
  { id: 'verified', label: 'Compra verificada', count: 1089 },
];

export default function ProductReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);

  React.useEffect(() => {
    filterReviews();
  }, [selectedFilter]);

  const filterReviews = () => {
    let filtered = mockReviews;

    switch (selectedFilter) {
      case '5':
      case '4':
      case '3':
      case '2':
      case '1':
        filtered = mockReviews.filter(review => review.rating === parseInt(selectedFilter));
        break;
      case 'photos':
        filtered = mockReviews.filter(review => review.images && review.images.length > 0);
        break;
      case 'verified':
        filtered = mockReviews.filter(review => review.verified);
        break;
      default:
        filtered = mockReviews;
    }

    setFilteredReviews(filtered);
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
    router.push(`/product/${id}/write-review`);
  };

  const renderStars = (rating: number) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          color={star <= rating ? '#FFD700' : '#E5E7EB'}
          fill={star <= rating ? '#FFD700' : 'transparent'}
        />
      ))}
    </View>
  );

  const renderFilterOption = (option: FilterOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.filterOption,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
        selectedFilter === option.id && { backgroundColor: colors.primary + '20' }
      ]}
      onPress={() => {
        setSelectedFilter(option.id);
        setShowFilterModal(false);
      }}
    >
      <Text style={[
        styles.filterText,
        { color: colors.text },
        selectedFilter === option.id && { color: colors.primary, fontWeight: '700' }
      ]}>
        {option.label} ({option.count})
      </Text>
      {selectedFilter === option.id && (
        <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.userInitial}>{item.userName.charAt(0)}</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>{item.userName}</Text>
              {item.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verificado</Text>
                </View>
              )}
            </View>
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {renderStars(item.rating)}
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
        <TouchableOpacity 
          style={[
            styles.likeButton,
            { backgroundColor: colors.background },
            likedReviews.includes(item.id) && { backgroundColor: colors.primary + '20' }
          ]}
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

  const currentFilter = filterOptions.find(opt => opt.id === selectedFilter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliações</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Info */}
      <View style={[styles.filterInfo, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.filterInfoText, { color: colors.textSecondary }]}>
          Mostrando {filteredReviews.length} avaliações • {currentFilter?.label}
        </Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Text style={[styles.changeFilterText, { color: colors.primary }]}>Alterar filtro</Text>
        </TouchableOpacity>
      </View>

      {/* Write Review Button */}
      <View style={[styles.writeReviewContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.writeReviewButton, { backgroundColor: colors.primary }]}
          onPress={handleWriteReview}
        >
          <MessageCircle size={16} color="#FFFFFF" />
          <Text style={styles.writeReviewText}>Escrever minha avaliação</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reviewsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Star size={80} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhuma avaliação encontrada
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tente alterar o filtro para ver mais avaliações
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowFilterModal(false)}
          />
          <View style={[styles.filterModal, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filtrar avaliações</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {filterOptions.map(renderFilterOption)}
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
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterInfoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  changeFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  writeReviewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsList: {
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewRating: {
    marginLeft: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
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
    justifyContent: 'flex-start',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  likeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
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
  modalBackground: {
    flex: 1,
  },
  filterModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
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
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterText: {
    fontSize: 16,
    flex: 1,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});