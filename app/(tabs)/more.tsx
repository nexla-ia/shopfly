import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Package, CreditCard, MapPin, Bell, Shield, CircleHelp as HelpCircle, Settings, LogOut, ChevronRight, Star, Gift, Truck, MessageSquare, Search, Play } from 'lucide-react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  color: string;
  onPress: () => void;
  badge?: string;
}

export default function MoreScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userSection: MenuItem[] = [
    {
      id: 'profile',
      title: 'Minha conta',
      icon: User,
      color: '#3483FA',
      onPress: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'orders',
      title: 'Compras',
      icon: Package,
      color: '#00A650',
      onPress: () => router.push('/(tabs)/orders'),
    },
    {
      id: 'payments',
      title: 'Cartões e contas',
      icon: CreditCard,
      color: '#FF6B35',
      onPress: () => router.push('/profile/cards'),
    },
    {
      id: 'addresses',
      title: 'Endereços',
      icon: MapPin,
      color: '#8B5CF6',
      onPress: () => router.push('/profile/addresses'),
    },
  ];

  const servicesSection: MenuItem[] = [
    {
      id: 'search',
      title: 'Buscar Produtos',
      icon: Search as any,
      color: '#3B82F6',
      onPress: () => router.push('/(tabs)/search'),
    },
    {
      id: 'orders',
      title: 'Meus Pedidos',
      icon: Package,
      color: '#10B981',
      onPress: () => router.push('/orders'),
    },
    {
      id: 'reviews',
      title: 'Opiniões',
      icon: Star,
      color: '#F59E0B',
      onPress: () => router.push('/reviews'),
    },
    {
      id: 'messages',
      title: 'Mensagens',
      icon: MessageSquare,
      color: '#6366F1',
      onPress: () => router.push('/messages'),
      badge: '2',
    },
  ];

  const supportSection: MenuItem[] = [
    {
      id: 'notifications',
      title: 'Notificações',
      icon: Bell,
      color: '#EF4444',
      onPress: () => router.push('/profile/communications/notifications'),
    },
    {
      id: 'security',
      title: 'Dados e privacidade',
      icon: Shield,
      color: '#059669',
      onPress: () => router.push('/privacy'),
    },
    {
      id: 'help',
      title: 'Ajuda',
      icon: HelpCircle,
      color: '#0EA5E9',
      onPress: () => router.push('/help'),
    },
    {
      id: 'theme',
      title: 'Tema do aplicativo',
      icon: theme === 'light' ? Sun : Moon,
      color: '#F59E0B',
      onPress: toggleTheme,
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <item.icon size={20} color={item.color} />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <ChevronRight size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mais opções</Text>
        </View>

        {/* User Profile Card */}
        <TouchableOpacity 
          style={[styles.profileCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {profile?.full_name || 'Usuário'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || 'Fazer login'}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Menu Sections */}
        {renderSection('Minha conta', userSection)}
        {renderSection('Serviços', servicesSection)}
        {renderSection('Configurações e ajuda', supportSection)}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={user ? handleSignOut : () => router.push('/auth/welcome')}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>{user ? 'Sair' : 'Entrar'}</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>ShopFly v1.0.0</Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Termos e condições • Política de privacidade</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3483FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5,
  },
});