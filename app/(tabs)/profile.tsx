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
import { 
  ArrowLeft, 
  User, 
  Shield, 
  CreditCard, 
  MapPin, 
  Lock, 
  Bell, 
  ChevronRight 
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  onPress: () => void;
  badge?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const profileOptions: ProfileOption[] = [
    {
      id: 'info',
      title: 'Suas informações',
      description: 'Nome, telefone e outros dados pessoais',
      icon: User,
      onPress: () => router.push('/profile/info'),
    },
    {
      id: 'account',
      title: 'Dados da sua conta',
      description: 'E-mail, senha e configurações de login',
      icon: User,
      onPress: () => router.push('/profile/account'),
    },
    {
      id: 'cards',
      title: 'Cartões',
      description: 'Métodos de pagamento salvos',
      icon: CreditCard,
      onPress: () => router.push('/profile/cards'),
    },
    {
      id: 'addresses',
      title: 'Endereços',
      description: 'Locais de entrega cadastrados',
      icon: MapPin,
      onPress: () => router.push('/profile/addresses'),
    },
    {
      id: 'communications',
      title: 'Comunicações',
      description: 'Notificações e preferências de contato',
      icon: Bell,
      onPress: () => router.push('/profile/communications'),
      badge: '2',
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={option.onPress}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <option.icon size={20} color="#374151" />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
      </View>
      <View style={styles.optionRight}>
        {option.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{option.badge}</Text>
          </View>
        )}
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleSignOut}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Meu perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Seção de Identificação do Usuário */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
          <Text style={styles.userName}>
            {profile?.full_name || 'Usuário'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'email@exemplo.com'}
          </Text>
        </View>

        {/* Lista de Itens de Configuração */}
        <View style={styles.optionsContainer}>
          {profileOptions.map(renderProfileOption)}
        </View>

        {/* Link de Ação Secundária */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity 
            style={styles.cancelAccountButton}
            onPress={() => router.push('/profile/cancel-account')}
          >
            <Text style={styles.cancelAccountText}>Cancelar sua conta</Text>
          </TouchableOpacity>
        </View>

        {/* Status do Perfil */}
        <View style={styles.profileStatus}>
          <View style={styles.activeIndicator} />
          <Text style={styles.profileStatusText}>Perfil ativo</Text>
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
    width: 34, // Same width as back button for centering
  },
  userSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: {
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
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryActions: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  cancelAccountButton: {
    paddingVertical: 10,
  },
  cancelAccountText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    marginBottom: 20,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  profileStatusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});