import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare } from 'lucide-react-native';

interface SMSSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function SMSWhatsAppScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<SMSSetting[]>([
    {
      id: 'transactions',
      title: 'Novidades de transações e entregas',
      description: 'Atualizações sobre status de pedidos e entregas',
      enabled: true,
    },
    {
      id: 'account',
      title: 'Informações de conta',
      description: 'Alterações na conta e questões de segurança',
      enabled: true,
    },
    {
      id: 'personalized-offers',
      title: 'Ofertas e promoções personalizadas',
      description: 'Descontos exclusivos via SMS e WhatsApp',
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const renderSetting = (setting: SMSSetting) => (
    <View key={setting.id} style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      <Switch
        value={setting.enabled}
        onValueChange={() => toggleSetting(setting.id)}
        trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
        thumbColor={setting.enabled ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SMS e WhatsApp</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Descrição */}
        <View style={styles.descriptionContainer}>
          <View style={styles.iconContainer}>
            <MessageSquare size={24} color="#6366F1" />
          </View>
          <Text style={styles.description}>
            Configure quais mensagens você deseja receber via SMS e WhatsApp
          </Text>
        </View>

        {/* Lista de Configurações */}
        <View style={styles.settingsList}>
          {settings.map(renderSetting)}
        </View>

        {/* Informação do Telefone */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Mensagens serão enviadas para: (11) 99999-9999
          </Text>
          <TouchableOpacity style={styles.changePhoneButton}>
            <Text style={styles.changePhoneText}>Alterar telefone</Text>
          </TouchableOpacity>
        </View>

        {/* Aviso sobre Tarifas */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>⚠️ Importante</Text>
          <Text style={styles.warningText}>
            Mensagens SMS podem ser cobradas pela sua operadora. 
            Mensagens WhatsApp utilizam sua conexão de internet.
          </Text>
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
  header: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 34,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  changePhoneButton: {
    paddingVertical: 8,
  },
  changePhoneText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});