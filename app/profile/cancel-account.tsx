import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, TriangleAlert as AlertTriangle, Mail, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface CancellationReason {
  id: string;
  title: string;
  description: string;
}

const cancellationReasons: CancellationReason[] = [
  {
    id: 'not-using',
    title: 'Não uso mais o aplicativo',
    description: 'Não tenho mais interesse em usar o serviço',
  },
  {
    id: 'privacy-concerns',
    title: 'Preocupações com privacidade',
    description: 'Não me sinto confortável com o uso dos meus dados',
  },
  {
    id: 'poor-experience',
    title: 'Experiência ruim',
    description: 'Tive problemas com produtos, entregas ou atendimento',
  },
  {
    id: 'found-alternative',
    title: 'Encontrei uma alternativa melhor',
    description: 'Prefiro usar outro aplicativo ou serviço',
  },
  {
    id: 'technical-issues',
    title: 'Problemas técnicos',
    description: 'O aplicativo não funciona bem no meu dispositivo',
  },
  {
    id: 'other',
    title: 'Outro motivo',
    description: 'Motivo não listado acima',
  },
];

export default function CancelAccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelAccount = () => {
    if (!selectedReason) {
      Alert.alert('Erro', 'Por favor, selecione um motivo para o cancelamento');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmCancellation = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      // Simular envio do e-mail de confirmação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível processar sua solicitação. Tente novamente.');
    }
  };

  const handleBackToApp = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)');
  };

  const renderReason = (reason: CancellationReason) => (
    <TouchableOpacity
      key={reason.id}
      style={[
        styles.reasonOption,
        { backgroundColor: colors.surface, borderColor: colors.border },
        selectedReason === reason.id && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
      ]}
      onPress={() => setSelectedReason(reason.id)}
    >
      <View style={styles.reasonContent}>
        <View style={styles.reasonHeader}>
          <Text style={[
            styles.reasonTitle,
            { color: colors.text },
            selectedReason === reason.id && { color: colors.primary }
          ]}>
            {reason.title}
          </Text>
          <View style={[
            styles.radioButton,
            { borderColor: selectedReason === reason.id ? colors.primary : colors.border }
          ]}>
            {selectedReason === reason.id && (
              <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </View>
        <Text style={[styles.reasonDescription, { color: colors.textSecondary }]}>
          {reason.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancelar Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Warning Section */}
        <View style={[styles.warningSection, { backgroundColor: colors.surface }]}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={24} color="#EF4444" />
            <Text style={[styles.warningTitle, { color: colors.text }]}>
              Atenção: Esta ação é irreversível
            </Text>
          </View>
          
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            Ao cancelar sua conta, você perderá permanentemente:
          </Text>
          
          <View style={styles.warningList}>
            <Text style={[styles.warningItem, { color: colors.textSecondary }]}>
              • Histórico de compras e pedidos
            </Text>
            <Text style={[styles.warningItem, { color: colors.textSecondary }]}>
              • Avaliações e comentários
            </Text>
            <Text style={[styles.warningItem, { color: colors.textSecondary }]}>
              • Endereços e cartões salvos
            </Text>
            <Text style={[styles.warningItem, { color: colors.textSecondary }]}>
              • Favoritos e listas de desejos
            </Text>
            <Text style={[styles.warningItem, { color: colors.textSecondary }]}>
              • Cupons e benefícios acumulados
            </Text>
          </View>
        </View>

        {/* Reason Selection */}
        <View style={[styles.reasonSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Por que você quer cancelar sua conta?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Sua opinião nos ajuda a melhorar nossos serviços
          </Text>
          
          <View style={styles.reasonsList}>
            {cancellationReasons.map(renderReason)}
          </View>
        </View>

        {/* Additional Comments */}
        <View style={[styles.commentsSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Comentários adicionais (opcional)
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Conte-nos mais sobre sua experiência
          </Text>
          
          <TextInput
            style={[styles.commentsInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="Descreva sua experiência ou sugestões de melhoria..."
            value={additionalComments}
            onChangeText={setAdditionalComments}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Alternative Options */}
        <View style={[styles.alternativeSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Antes de cancelar, que tal tentar:
          </Text>
          
          <TouchableOpacity 
            style={[styles.alternativeOption, { borderColor: colors.border }]}
            onPress={() => router.push('/help')}
          >
            <Text style={[styles.alternativeTitle, { color: colors.primary }]}>
              📞 Falar com nosso suporte
            </Text>
            <Text style={[styles.alternativeDescription, { color: colors.textSecondary }]}>
              Nossa equipe pode ajudar a resolver problemas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.alternativeOption, { borderColor: colors.border }]}
            onPress={() => router.push('/privacy')}
          >
            <Text style={[styles.alternativeTitle, { color: colors.primary }]}>
              🔒 Revisar configurações de privacidade
            </Text>
            <Text style={[styles.alternativeDescription, { color: colors.textSecondary }]}>
              Ajuste como seus dados são utilizados
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.alternativeOption, { borderColor: colors.border }]}
            onPress={() => router.push('/profile/communications')}
          >
            <Text style={[styles.alternativeTitle, { color: colors.primary }]}>
              🔕 Desativar notificações
            </Text>
            <Text style={[styles.alternativeDescription, { color: colors.textSecondary }]}>
              Reduza ou pare de receber comunicações
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { backgroundColor: '#EF4444' },
            (!selectedReason || loading) && styles.cancelButtonDisabled
          ]}
          onPress={handleCancelAccount}
          disabled={!selectedReason || loading}
        >
          <Text style={styles.cancelButtonText}>
            {loading ? 'Processando...' : 'Cancelar Minha Conta'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <AlertTriangle size={32} color="#EF4444" />
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Confirmar Cancelamento
              </Text>
            </View>
            
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Tem certeza que deseja cancelar sua conta? Esta ação não pode ser desfeita.
              
              {'\n\n'}Um e-mail de confirmação será enviado para:
              {'\n'}📧 joao.silva@email.com
              
              {'\n\n'}Você terá 24 horas para confirmar o cancelamento através do link no e-mail.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
                  Voltar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmCancellation}
              >
                <Text style={styles.modalConfirmText}>Enviar E-mail</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <CheckCircle size={32} color="#10B981" />
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                E-mail Enviado
              </Text>
            </View>
            
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Enviamos um e-mail de confirmação para:
              {'\n'}📧 joao.silva@email.com
              
              {'\n\n'}Clique no link do e-mail para confirmar o cancelamento da sua conta.
              
              {'\n\n'}⏰ O link expira em 24 horas.
              
              {'\n\n'}Se não receber o e-mail, verifique sua caixa de spam.
            </Text>
            
            <TouchableOpacity
              style={[styles.modalOkButton, { backgroundColor: colors.primary }]}
              onPress={handleBackToApp}
            >
              <Text style={styles.modalOkText}>Entendi</Text>
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
  warningSection: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  warningText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  warningList: {
    marginLeft: 8,
  },
  warningItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  reasonSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  reasonsList: {
    gap: 12,
  },
  reasonOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  reasonContent: {
    flex: 1,
  },
  reasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reasonDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  commentsInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  alternativeSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  alternativeOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderStyle: 'dashed',
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alternativeDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOkButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalOkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});