import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface OrderSuccessModalProps {
  visible: boolean;
  orderId: string;
  estimatedTime: string;
  paymentMethod: string;
  onContinueShopping: () => void;
  onTrackOrder: () => void;
}

export default function OrderSuccessModal({
  visible,
  orderId,
  estimatedTime,
  paymentMethod,
  onContinueShopping,
  onTrackOrder,
}: OrderSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <BlurView intensity={20} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.modal}>
            {/* Ícone de Sucesso */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <CheckCircle size={48} color="#10B981" fill="#10B981" />
              </View>
            </View>

            {/* Título */}
            <Text style={styles.title}>Pedido realizado!</Text>
            
            {/* Descrição */}
            <Text style={styles.description}>
              Seu pedido foi processado com sucesso e estará a caminho em breve. 
              Você pode acompanhar o status em tempo real.
            </Text>

            {/* Resumo Rápido */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tempo estimado:</Text>
                <Text style={styles.summaryValue}>{estimatedTime}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pagamento:</Text>
                <Text style={styles.summaryValue}>{paymentMethod}</Text>
              </View>
            </View>

            {/* Ações */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={onContinueShopping}
              >
                <Text style={styles.secondaryButtonText}>Continuar comprando</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={onTrackOrder}
              >
                <Text style={styles.primaryButtonText}>Acompanhar pedido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  summaryContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});