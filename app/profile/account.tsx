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
import { ArrowLeft, Mail, Phone, User } from 'lucide-react-native';

export default function AccountDataScreen() {
  const router = useRouter();

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
        <Text style={styles.appBarTitle}>Dados da sua conta</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card E-mail */}
        <View style={styles.card}>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeError]}>
              <Text style={styles.badgeText}>Não validado</Text>
            </View>
          </View>
          <View style={styles.cardHeader}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>E-mail</Text>
          </View>
          <Text style={styles.cardValue}>joao.silva@email.com</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Validar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Alterar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Celular */}
        <View style={styles.card}>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={[styles.badgeText, styles.badgeTextSuccess]}>Validado</Text>
            </View>
          </View>
          <View style={styles.cardHeader}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>Celular</Text>
          </View>
          <Text style={styles.cardValue}>(11) 99999-9999</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Alterar</Text>
          </TouchableOpacity>
        </View>

        {/* Card Nome de Usuário */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>Nome de usuário</Text>
          </View>
          <Text style={styles.cardValue}>@joaosilva</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Alterar</Text>
          </TouchableOpacity>
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
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  badgeContainer: {
    marginBottom: 15,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeError: {
    backgroundColor: '#FEE2E2',
  },
  badgeSuccess: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  badgeTextSuccess: {
    color: '#059669',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10,
  },
  cardValue: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    marginLeft: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
});