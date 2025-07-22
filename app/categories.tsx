import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2; // 2 colunas com padding

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  { id: '1', name: 'Acessórios para Veículos', icon: '🚗', color: '#EF4444' },
  { id: '2', name: 'Agro', icon: '🌾', color: '#10B981' },
  { id: '3', name: 'Alimentos e Bebidas', icon: '🍕', color: '#F59E0B' },
  { id: '4', name: 'Antiguidades e Coleções', icon: '🏺', color: '#8B5CF6' },
  { id: '5', name: 'Arte, Papelaria e Armarinho', icon: '🎨', color: '#EC4899' },
  { id: '6', name: 'Bebês', icon: '👶', color: '#F472B6' },
  { id: '7', name: 'Beleza e Cuidados', icon: '💄', color: '#EC4899' },
  { id: '8', name: 'Brinquedos e Hobbies', icon: '🧸', color: '#F59E0B' },
  { id: '9', name: 'Calçados, Roupas e Acessórios', icon: '👕', color: '#6366F1' },
  { id: '10', name: 'Carros, Motos e Outros', icon: '🏍️', color: '#EF4444' },
  { id: '11', name: 'Casa, Móveis e Decoração', icon: '🏠', color: '#10B981' },
  { id: '12', name: 'Celulares e Telefones', icon: '📱', color: '#3B82F6' },
  { id: '13', name: 'Eletrônicos, Áudio e Vídeo', icon: '📺', color: '#1F2937' },
  { id: '14', name: 'Esportes e Fitness', icon: '⚽', color: '#059669' },
  { id: '15', name: 'Ferramentas', icon: '🔧', color: '#6B7280' },
  { id: '16', name: 'Festas e Lembrancinhas', icon: '🎉', color: '#F59E0B' },
  { id: '17', name: 'Games', icon: '🎮', color: '#8B5CF6' },
  { id: '18', name: 'Imóveis', icon: '🏢', color: '#059669' },
  { id: '19', name: 'Indústria e Comércio', icon: '🏭', color: '#6B7280' },
  { id: '20', name: 'Informática', icon: '💻', color: '#3B82F6' },
  { id: '21', name: 'Ingressos', icon: '🎫', color: '#EC4899' },
  { id: '22', name: 'Instrumentos Musicais', icon: '🎸', color: '#F59E0B' },
  { id: '23', name: 'Joias e Relógios', icon: '💎', color: '#EF4444' },
  { id: '24', name: 'Livros, Revistas e Papel', icon: '📚', color: '#8B5CF6' },
  { id: '25', name: 'Música, Filmes e Seriados', icon: '🎬', color: '#1F2937' },
  { id: '26', name: 'Pet Shop', icon: '🐕', color: '#F59E0B' },
  { id: '27', name: 'Saúde', icon: '💊', color: '#10B981' },
  { id: '28', name: 'Serviços', icon: '🛠️', color: '#6B7280' },
  // 3 categorias adicionais
  { id: '29', name: 'Viagem e Turismo', icon: '✈️', color: '#3B82F6' },
  { id: '30', name: 'Educação e Cursos', icon: '🎓', color: '#8B5CF6' },
  { id: '31', name: 'Flores e Jardim', icon: '🌸', color: '#EC4899' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCategoryPress = (category: Category) => {
    router.push(`/(tabs)/search?category=${category.id}`);
  };

  const handleRequestCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome da categoria');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Solicitação Enviada!',
        'Sua solicitação de nova categoria foi enviada com sucesso. Analisaremos e retornaremos em breve.',
        [{ text: 'OK', onPress: () => {
          setShowRequestModal(false);
          setCategoryName('');
          setCategoryDescription('');
        }}]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryItem, { backgroundColor: colors.surface }]}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
        <Text style={styles.categoryEmoji}>{category.icon}</Text>
      </View>
      <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRequestCategoryItem = () => (
    <TouchableOpacity
      style={[styles.categoryItem, styles.requestCategoryItem, { backgroundColor: colors.surface, borderColor: colors.primary }]}
      onPress={() => setShowRequestModal(true)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: colors.primary + '20' }]}>
        <Plus size={32} color={colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: colors.primary }]} numberOfLines={2}>
        Solicitar nova categoria
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categorias</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Todas as nossas categorias
        </Text>
      </View>

      {/* Categories Grid */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        <View style={styles.grid}>
          {categories.map(renderCategoryItem)}
          {renderRequestCategoryItem()}
        </View>
      </ScrollView>

      {/* Request Category Modal */}
      <Modal
        visible={showRequestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Solicitar Nova Categoria
              </Text>
              <TouchableOpacity
                onPress={() => setShowRequestModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              Não encontrou a categoria que procura? Solicite uma nova categoria e analisaremos sua sugestão.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Nome da categoria *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Ex: Produtos Sustentáveis"
                value={categoryName}
                onChangeText={setCategoryName}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Justificativa (opcional)
              </Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Descreva por que esta categoria seria útil..."
                value={categoryDescription}
                onChangeText={setCategoryDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }, loading && styles.submitButtonDisabled]}
                onPress={handleRequestCategory}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Enviando...' : 'Enviar Solicitação'}
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
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: itemWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestCategoryItem: {
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
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