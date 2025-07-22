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
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

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

export default function StoresScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchStores();
  }, []);

  React.useEffect(() => {
    fetchStores();
  }, [searchQuery, selectedCategory]);

  const fetchStores = async () => {
    setLoading(true);
    
    let query = supabase
      .from('stores')
      .select('*')
      .eq('is_open', true);

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar lojas:', error);
      setStores([]);
    } else {
      setStores(data || []);
    }
    
    setLoading(false);
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

  const renderStore = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.storeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/store/${item.id}`)}
    >
      <Image source={{ uri: item.image_url }} style={styles.storeImage} />
      
      <View style={styles.storeInfo}>
        <View style={styles.storeHeader}>
          <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.is_open ? '#10B981' : '#EF4444' }
          ]}>
            <Text style={styles.statusText}>
              {item.is_open ? 'Aberto' : 'Fechado'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.storeDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description || 'Loja parceira'}
        </Text>
        
        <View style={styles.storeDetails}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>{item.rating || 0}</Text>
            <Text style={[styles.reviews, { color: colors.textSecondary }]}>({item.reviews_count || 0})</Text>
          </View>
          
          <View style={styles.deliveryContainer}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.deliveryTime, { color: colors.textSecondary }]}>
              {item.delivery_time || '30-60 min'}
            </Text>
          </View>
        </View>
        
        <View style={styles.addressContainer}>
          <MapPin size={12} color={colors.textSecondary} />
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.address || 'Endereço não informado'}
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
          {loading ? 'Buscando...' : `${stores.length} lojas encontradas`}
        </Text>
      </View>

      {/* Stores List */}
      <FlatList
        data={stores}
        renderItem={renderStore}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.storesList}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando lojas...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma loja encontrada</Text>
            </View>
          )
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});