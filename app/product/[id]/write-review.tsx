import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Camera, Send, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'iPhone 15 Pro Max 256GB Titânio Natural',
  image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
  store: 'Apple Store Oficial',
};

export default function WriteReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma nota de 1 a 5 estrelas');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Erro', 'Por favor, escreva um comentário sobre o produto');
      return;
    }

    setLoading(true);
    
    try {
      // Simular envio da avaliação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sucesso!',
        'Sua avaliação foi enviada com sucesso e será analisada em breve.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = () => {
    // Simular adição de foto
    const newImage = 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=200';
    if (images.length < 5) {
      setImages(prev => [...prev, newImage]);
    } else {
      Alert.alert('Limite atingido', 'Você pode adicionar no máximo 5 fotos');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderStars = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Star
            size={40}
            color={star <= rating ? '#FFD700' : '#E5E7EB'}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Muito ruim';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'Selecione uma nota';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escrever Avaliação</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Info */}
        <View style={[styles.productInfo, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Image source={{ uri: mockProduct.image }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={[styles.productName, { color: colors.text }]}>{mockProduct.name}</Text>
            <Text style={[styles.storeName, { color: colors.textSecondary }]}>{mockProduct.store}</Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Como você avalia este produto?</Text>
          
          {renderStars()}
          
          <Text style={[styles.ratingText, { color: colors.primary }]}>
            {getRatingText()}
          </Text>
        </View>

        {/* Comment Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Conte sua experiência</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Ajude outros compradores com sua opinião sincera
          </Text>
          
          <TextInput
            style={[styles.commentInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="Escreva aqui sua avaliação sobre o produto..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
            {comment.length}/500 caracteres
          </Text>
        </View>

        {/* Photos Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Adicionar fotos (opcional)</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Mostre o produto para outros compradores (máximo 5 fotos)
          </Text>
          
          <View style={styles.photosContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: image }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <TouchableOpacity
                style={[styles.addPhotoButton, { borderColor: colors.primary }]}
                onPress={handleAddPhoto}
              >
                <Camera size={24} color={colors.primary} />
                <Text style={[styles.addPhotoText, { color: colors.primary }]}>
                  Adicionar foto
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Guidelines */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Diretrizes para avaliações</Text>
          <View style={styles.guidelinesList}>
            <Text style={[styles.guidelineItem, { color: colors.textSecondary }]}>
              • Seja honesto e específico sobre sua experiência
            </Text>
            <Text style={[styles.guidelineItem, { color: colors.textSecondary }]}>
              • Foque no produto, não na entrega ou atendimento
            </Text>
            <Text style={[styles.guidelineItem, { color: colors.textSecondary }]}>
              • Evite linguagem ofensiva ou inadequada
            </Text>
            <Text style={[styles.guidelineItem, { color: colors.textSecondary }]}>
              • Suas fotos devem mostrar o produto real
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            (rating === 0 || !comment.trim() || loading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitReview}
          disabled={rating === 0 || !comment.trim() || loading}
        >
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </Text>
        </TouchableOpacity>
      </View>
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
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 14,
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    position: 'relative',
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});