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
import { ArrowLeft, ChevronRight } from 'lucide-react-native';

export default function PrivacyScreen() {
  const router = useRouter();

  const privacyItems = [
    {
      id: 'permissions',
      title: 'Administrar permissões',
      onPress: () => {},
    },
    {
      id: 'data-report',
      title: 'Conhecer relatório de dados',
      onPress: () => {},
    },
    {
      id: 'cookies',
      title: 'Configurar cookies',
      onPress: () => {},
    },
    {
      id: 'cancel-account',
      title: 'Cancelar conta',
      isDestructive: true,
      onPress: () => {},
    },
  ];

  const renderPrivacyItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.privacyItem}
      onPress={item.onPress}
    >
      <Text style={[
        styles.itemTitle,
        item.isDestructive && styles.destructiveText
      ]}>
        {item.title}
      </Text>
      <ChevronRight 
        size={20} 
        color={item.isDestructive ? '#DC2626' : '#9CA3AF'} 
      />
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
        <Text style={styles.appBarTitle}>Privacidade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Título da Seção */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gerencie a privacidade da sua conta</Text>
        </View>

        {/* Lista de Itens de Privacidade */}
        <View style={styles.privacyList}>
          {privacyItems.map(renderPrivacyItem)}
        </View>

        {/* Link do Rodapé */}
        <TouchableOpacity style={styles.footerLink}>
          <Text style={styles.footerText}>
            Saiba mais sobre como cuidamos da sua privacidade.
          </Text>
        </TouchableOpacity>
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
  privacyList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  destructiveText: {
    color: '#DC2626',
  },
  footerLink: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6366F1',
    textAlign: 'center',
    lineHeight: 20,
  },
});