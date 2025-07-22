import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, Heart, Share, MessageCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ClipsScreen() {
  const router = useRouter();
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Por enquanto, deixar vazio já que não temos dados reais de clips
    setClips([]);
  }, []);

  const renderClip = (clip: any) => (
    <TouchableOpacity
      key={clip.id}
      style={styles.clipCard}
      onPress={() => router.push(`/clip/${clip.id}`)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: clip.thumbnail }} style={styles.thumbnail} />
        <View style={styles.playButton}>
          <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{clip.duration}</Text>
        </View>
      </View>
      
      <View style={styles.clipInfo}>
        <Text style={styles.clipTitle} numberOfLines={2}>{clip.title}</Text>
        <Text style={styles.sellerName}>{clip.seller}</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{clip.views} visualizações</Text>
          <Text style={styles.statsText}>•</Text>
          <Text style={styles.statsText}>{clip.likes} curtidas</Text>
        </View>
        
        <View style={styles.productContainer}>
          <Text style={styles.productName} numberOfLines={1}>{clip.product}</Text>
          <Text style={styles.productPrice}>R$ {clip.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyClips = () => (
    <View style={styles.emptyClips}>
      <Play size={80} color="#E5E7EB" />
      <Text style={styles.emptyClipsTitle}>Nenhum clip disponível</Text>
      <Text style={styles.emptyClipsText}>
        Os clips de produtos aparecerão aqui em breve
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clips</Text>
        <Text style={styles.headerSubtitle}>Descubra produtos através de vídeos</Text>
      </View>

      {clips.length === 0 ? (
        renderEmptyClips()
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.clipsContainer}>
            {clips.map(renderClip)}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6366F1',
    borderBottomWidth: 1,
    borderBottomColor: '#5B21B6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  clipsContainer: {
    padding: 16,
  },
  clipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  clipInfo: {
    padding: 16,
  },
  clipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  sellerName: {
    fontSize: 14,
    color: '#3483FA',
    fontWeight: '500',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  productContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00A650',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  buyButton: {
    backgroundColor: '#3483FA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyClips: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyClipsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyClipsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});