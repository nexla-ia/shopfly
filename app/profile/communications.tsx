import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Mail, MessageSquare, ChevronRight } from 'lucide-react-native';

export default function CommunicationsScreen() {
  const router = useRouter();

  const communicationItems = [
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Configurar push notifications',
      icon: Bell,
      onPress: () => router.push('/profile/communications/notifications'),
    },
    {
      id: 'email',
      title: 'E-mail',
      subtitle: 'Preferências de email',
      icon: Mail,
      onPress: () => router.push('/profile/communications/email'),
    },
    {
      id: 'sms-whatsapp',
      title: 'SMS e WhatsApp',
      subtitle: 'Mensagens de texto',
      icon: MessageSquare,
      onPress: () => router.push('/profile/communications/sms-whatsapp'),
    },
  ];

  const renderCommunicationItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.communicationItem}
      onPress={item.onPress}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <item.icon size={24} color="#374151" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Comunicações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Título da Seção */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Escolha o canal a configurar</Text>
        </View>

        {/* Lista de Itens de Comunicação */}
        <View style={styles.communicationList}>
          {communicationItems.map(renderCommunicationItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#6366F1',
    borderBottomWidth: 1,
    borderBottomColor: '#5B21B6',
  },
  backButton: {
    padding: 5,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 34,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
  },
  communicationList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  communicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});