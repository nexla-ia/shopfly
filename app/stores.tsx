import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Star, Clock, MapPin, Filter } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  deliveryTime: string;
  address: string;
  isOpen: boolean;
}

const storeCategories = [
  { id: 'all', name: 'Todas' },
  { id: 'supermarket', name: 'Supermercado' },
  { id: 'electronics', name: 'Eletrônicos' },
  { id: 'pharmacy', name: 'Farmácia' },
  { id: 'fashion', name: 'Moda' },
  { id: 'home', name: 'Casa' },
  { id: 'beauty', name: 'Beleza' },
  { id: 'sports', name: 'Esportes' },
  { id: 'food', name: 'Alimentação' },
];

const allStores: Store[] = [
  {
    id: '1',
    name: 'TechStore Oficial',
    description: 'Sua loja de eletrônicos de confiança',
    image: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 2847,
    category: 'electronics',
    deliveryTime: '30-45 min',
    address: 'Rua das Tecnologias, 123 - Centro',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Supermercado Central',
    description: 'Produtos frescos todos os dias',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 1892,
    category: 'supermarket',
    deliveryTime: '20-30 min',
    address: 'Av. Principal, 456 - Centro',
    isOpen: true,
  },
  {
    id: '3',
    name: 'Farmácia Saúde+',
    description: 'Cuidando da sua saúde 24h',
    image: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 3421,
    category: 'pharmacy',
    deliveryTime: '15-25 min',
    address: 'Rua da Saúde, 789 - Centro',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Moda & Estilo',
    description: 'As últimas tendências da moda',
    image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 1567,
    category: 'fashion',
    deliveryTime: '45-60 min',
    address: 'Shopping Center, Loja 45',
    isOpen: true,
  },
  {
    id: '5',
    name: 'Casa & Decoração',
    description: 'Transforme seu lar',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 892,
    category: 'home',
    deliveryTime: '60-90 min',
    address: 'Rua dos Móveis, 321 - Industrial',
    isOpen: false,
  },
  {
    id: '6',
    name: 'Beleza Natural',
    description: 'Produtos de beleza e cuidados',
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 2134,
    category: 'beauty',
    deliveryTime: '35-50 min',
    address: 'Galeria Comercial, Sala 12',
    isOpen: true,
  },
  {
    id: '7',
    name: 'Esportes Total',
    description: 'Tudo para seu esporte favorito',
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 1245,
    category: 'sports',
    deliveryTime: '40-55 min',
    address: 'Av. dos Esportes, 654 - Zona Norte',
    isOpen: true,
  },
  {
    id: '8',
    name: 'Restaurante Sabor & Arte',
    description: 'Comida caseira com sabor especial',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 3876,
    category: 'food',
    deliveryTime: '25-40 min',
    address: 'Praça da Alimentação, 98',
    isOpen: true,
  },
  {
    id: '9',
    name: 'Mega Supermercado',
    description: 'Variedade e preços baixos',
    image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviews: 5432,
    category: 'supermarket',
    deliveryTime: '30-45 min',
    address: 'Rodovia Principal, Km 5',
    isOpen: true,
  },
  {
    id: '10',
    name: 'Eletrônica Express',
    description: 'Tecnologia com entrega rápida',
    image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 1876,
    category: 'electronics',
    deliveryTime: '20-35 min',
    address: 'Centro Comercial, Bloco B',
    isOpen: true,
  },
];

export default function StoresScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredStores, setFilteredStores] = useState(allStores);

  React.useEffect(() => {
    filterStores();
  }, [searchQuery, selectedCategory]);

  const filterStores = () => {
    let filtered = allStores;

    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(store => store.category === selectedCategory);
    }

    setFilteredStores(filtered);
  };

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { backgroundColor: colors.background },
        selectedCategory === item.id && { backgroundColor: colors.primary }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryChipText,
        { color: colors.textSecondary },
        selectedCategory === item.id && { color: '#FFFFFF' }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderStore = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={[styles.storeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/store/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.storeImage} />
      
      <View style={styles.storeInfo}>
        <View style={styles.storeHeader}>
          <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.isOpen ? '#10B981' : '#EF4444' }
          ]}>
            <Text style={styles.statusText}>
              {item.isOpen ? 'Aberto' : 'Fechado'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.storeDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.storeDetails}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
            <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews})</Text>
          </View>
          
          <View style={styles.deliveryContainer}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.deliveryTime, { color: colors.textSecondary }]}>
              {item.deliveryTime}
            </Text>
          </View>
        </View>
        
        <View style={styles.addressContainer}>
          <MapPin size={12} color={colors.textSecondary} />
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todas as Lojas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar lojas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <FlatList
          data={storeCategories}
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
          {filteredStores.length} lojas encontradas
        </Text>
      </View>

      {/* Stores List */}
      <FlatList
        data={filteredStores}
        renderItem={renderStore}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.storesList}
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
  categoriesContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
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
  storesList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  storeCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  storeImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  storeInfo: {
    flex: 1,
    padding: 15,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  storeDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
  },
  storeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 12,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTime: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginLeft: 4,
    fontSize: 12,
    flex: 1,
  },
});