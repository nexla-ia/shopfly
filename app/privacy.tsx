import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Cookie, Shield, Mail, X, Info } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  functional: boolean;
}

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [locationPermission, setLocationPermission] = useState(true);
  const [emailVerification, setEmailVerification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    essential: true, // Sempre habilitado
    analytics: false,
    performance: true,
    functional: true,
  });

  const handleLocationToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Desabilitar Localização',
        'Ao desabilitar, você não receberá ofertas personalizadas da sua região e o rastreamento de entregas pode ser limitado.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Desabilitar', onPress: () => setLocationPermission(false) },
        ]
      );
    } else {
      setLocationPermission(true);
    }
  };

  const handleEmailVerificationToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Ativar Verificação por E-mail',
        'Um código será enviado para seu e-mail sempre que houver alterações sensíveis na conta.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ativar', onPress: () => setEmailVerification(true) },
        ]
      );
    } else {
      setEmailVerification(false);
    }
  };

  const handleCookieToggle = (type: keyof CookieSettings, value: boolean) => {
    if (type === 'essential') {
      Alert.alert(
        'Cookies Essenciais',
        'Estes cookies são necessários para o funcionamento básico do aplicativo e não podem ser desabilitados.'
      );
      return;
    }

    setCookieSettings(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const showInfoModal = (type: 'privacy' | 'cookies') => {
    const content = {
      privacy: {
        title: 'Política de Privacidade',
        content: `Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais:

📊 Coleta de Dados:
• Informações de conta (nome, e-mail, telefone)
• Dados de navegação e preferências
• Histórico de compras e avaliações
• Localização (quando autorizada)

🔒 Uso dos Dados:
• Processar pedidos e entregas
• Personalizar ofertas e recomendações
• Melhorar nossos serviços
• Comunicação sobre pedidos

🛡️ Proteção:
• Criptografia SSL em todas as transações
• Servidores seguros e certificados
• Acesso restrito aos dados
• Conformidade com LGPD

👤 Seus Direitos:
• Acessar seus dados
• Corrigir informações
• Excluir conta
• Portabilidade de dados`
      },
      cookies: {
        title: 'Como Funcionam os Cookies',
        content: `Os cookies são pequenos arquivos que melhoram sua experiência no app:

🍪 Tipos de Cookies:

🔧 Essenciais (Obrigatórios):
• Login e autenticação
• Carrinho de compras
• Preferências básicas
• Segurança da sessão

📊 Analíticos (Opcionais):
• Páginas mais visitadas
• Tempo de navegação
• Produtos mais buscados
• Relatórios de uso

⚡ Desempenho (Opcionais):
• Carregamento mais rápido
• Cache de imagens
• Otimização de busca
• Redução de dados

🎯 Funcionais (Opcionais):
• Recomendações personalizadas
• Histórico de navegação
• Preferências salvas
• Localização de lojas

🔄 Gerenciamento:
• Você controla quais aceitar
• Pode alterar a qualquer momento
• Essenciais não podem ser desabilitados
• Dados anônimos e seguros`
      }
    };
    
    setModalContent(content[type]);
    setShowModal(true);
  };

  const cookieOptions = [
    {
      key: 'essential' as keyof CookieSettings,
      title: 'Essenciais',
      description: 'Necessários ao funcionamento do app',
      required: true,
    },
    {
      key: 'analytics' as keyof CookieSettings,
      title: 'Analíticos',
      description: 'Ajudam a melhorar nossos serviços',
      required: false,
    },
    {
      key: 'performance' as keyof CookieSettings,
      title: 'Desempenho',
      description: 'Otimizam algumas funções do app',
      required: false,
    },
    {
      key: 'functional' as keyof CookieSettings,
      title: 'Funcionais',
      description: 'Mantêm o bom funcionamento e personalização',
      required: false,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados e Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Permissões de Localização */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Permissões de Localização
            </Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Permita ou negue o uso de dados de localização do dispositivo para acesso a ofertas na sua região e rastreamento de entregas.
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Usar localização
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {locationPermission ? 'Ativado - Ofertas personalizadas habilitadas' : 'Desativado - Funcionalidades limitadas'}
              </Text>
            </View>
            <Switch
              value={locationPermission}
              onValueChange={handleLocationToggle}
              trackColor={{ false: '#E5E7EB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Configurar Cookies */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Cookie size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Configurar Cookies
            </Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Escolha quais tipos de cookies deseja autorizar:
          </Text>
          
          {cookieOptions.map((option) => (
            <View key={option.key} style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingTitleRow}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  {option.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Obrigatório</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              <Switch
                value={cookieSettings[option.key]}
                onValueChange={(value) => handleCookieToggle(option.key, value)}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor="#FFFFFF"
                disabled={option.required}
              />
            </View>
          ))}
        </View>

        {/* Verificação de Conta */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Verificação de Conta
            </Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Solicite o envio de um código único para seu e-mail cadastrado sempre que for necessária validação de alterações sensíveis.
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Verificação por E-mail
              </Text>
              <View style={styles.emailInfo}>
                <Mail size={16} color={colors.textSecondary} />
                <Text style={[styles.emailText, { color: colors.textSecondary }]}>
                  joao.silva@email.com
                </Text>
              </View>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {emailVerification 
                  ? 'Códigos serão enviados para validar alterações' 
                  : 'Verificação adicional desabilitada'
                }
              </Text>
            </View>
            <Switch
              value={emailVerification}
              onValueChange={handleEmailVerificationToggle}
              trackColor={{ false: '#E5E7EB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            📋 Informações Importantes
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Suas configurações de privacidade são salvas automaticamente{'\n'}
            • Cookies essenciais não podem ser desabilitados{'\n'}
            • A localização é usada apenas para melhorar sua experiência{'\n'}
            • Você pode alterar essas configurações a qualquer momento
          </Text>
        </View>

        {/* Links Úteis */}
        <View style={[styles.linksSection, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => showInfoModal('privacy')}
          >
            <Info size={16} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Política de Privacidade Completa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => showInfoModal('cookies')}
          >
            <Cookie size={16} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Saiba mais sobre Cookies
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Informativo */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {modalContent.title}
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                {modalContent.content}
              </Text>
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  requiredBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  emailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  emailText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  infoSection: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  linksSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 16,
    padding: 20,
  },
  linkButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalCloseButton: {
    margin: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});