import React, { useState } from 'react';
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

interface Chat {
  id: string;
  storeName: string;
  storeImage: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    storeName: 'Loja de Eletrônicos Tech',
    storeImage: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Seu pedido está sendo preparado!',
    timestamp: '14:30',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    storeName: 'Supermercado Central',
    storeImage: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Obrigado pela compra! Avalie nosso atendimento.',
    timestamp: '12:15',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    storeName: 'Farmácia Saúde+',
    storeImage: 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Temos o medicamento em estoque.',
    timestamp: 'Ontem',
    unreadCount: 1,
    isOnline: true,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [chats] = useState(mockChats);

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.chatLeft}>
        <View style={styles.storeImageContainer}>
          <Image source={{ uri: item.storeImage }} style={styles.storeImage} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatInfo}>
          <Text style={[styles.storeName, { color: colors.text }]}>{item.storeName}</Text>
          <Text 
            style={[
              styles.lastMessage, 
              { color: item.unreadCount > 0 ? colors.text : colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
      </View>
      
      <View style={styles.chatRight}>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {item.timestamp}
        </Text>
        {item.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.unreadText}>
              {item.unreadCount > 99 ? '99+' : item.unreadCount}
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
      {chats.length === 0 ? (
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
});