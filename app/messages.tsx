import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function MessagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('chats')
      .select(`
        id,
        last_message,
        last_message_at,
        unread_count,
        stores (
          id,
          name,
          image_url
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar chats:', error);
      setChats([]);
    } else {
      setChats(data || []);
    }
    
    setLoading(false);
  };

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.chatLeft}>
        <View style={styles.storeImageContainer}>
          <Image source={{ uri: item.stores?.image_url || '' }} style={styles.storeImage} />
          <View style={styles.onlineIndicator} />
        </View>
        
        <View style={styles.chatInfo}>
          <Text style={[styles.storeName, { color: colors.text }]}>{item.stores?.name || 'Loja'}</Text>
          <Text 
            style={[
              styles.lastMessage, 
              { color: (item.unread_count || 0) > 0 ? colors.text : colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {item.last_message || 'Sem mensagens'}
          </Text>
        </View>
      </View>
      
      <View style={styles.chatRight}>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {item.last_message_at ? new Date(item.last_message_at).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : ''}
        </Text>
        {(item.unread_count || 0) > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.unreadText}>
              {(item.unread_count || 0) > 99 ? '99+' : (item.unread_count || 0)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyChats = () => (
    <View style={styles.emptyChats}>
      <MessageCircle size={80} color={colors.border} />
      <Text style={[styles.emptyChatsTitle, { color: colors.text }]}>
        Nenhuma conversa ainda
      </Text>
      <Text style={[styles.emptyChatsText, { color: colors.textSecondary }]}>
        Quando você conversar com uma loja, as mensagens aparecerão aqui
      </Text>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/search')}
      >
        <Text style={styles.shopButtonText}>Explorar lojas</Text>
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
        <Text style={styles.headerTitle}>Mensagens</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Chat List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando conversas...</Text>
        </View>
      ) : chats.length === 0 ? (
        renderEmptyChats()
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.chatList}
        />
      )}
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  chatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
  chatRight: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 4,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyChats: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyChatsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyChatsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  shopButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
});