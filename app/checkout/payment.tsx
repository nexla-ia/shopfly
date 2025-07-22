import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Smartphone, Plus, Receipt, Tag } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';

interface PaymentMethod {
  id: string;
  type: 'card' | 'pix' | 'boleto';
  name: string;
  subtitle?: string;
  icon: any;
  recommended?: boolean;
  lastFour?: string;
  brand?: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const { getCartTotal } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('card1');
  const [useMultiplePayments, setUseMultiplePayments] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const deliveryFee = 5.99;
  const total = getCartTotal() + deliveryFee;

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card1',
      type: 'card',
      name: 'Visa',
      lastFour: '8383',
      brand: 'Banco do Brasil',
      icon: CreditCard,
      recommended: true,
    },
    {
      id: 'pix',
      type: 'pix',
      name: 'PIX',
      subtitle: 'Aprovação imediata',
      icon: Smartphone,
    },
    {
      id: 'boleto',
      type: 'boleto',
      name: 'Boleto',
      subtitle: '1-2 dias úteis',
      icon: Receipt,
    },
  ];

  const handleContinueToReview = () => {
    router.push('/checkout/review');
  };

  const handleAddCard = () => {
    // Aqui abriria a tela de adicionar cartão
    console.log('Adicionar cartão');
  };

  const handleApplyCoupon = () => {
    // Lógica para aplicar cupom
    console.log('Aplicar cupom:', couponCode);
    setShowCouponModal(false);
    setCouponCode('');
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPayment === method.id && styles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPayment(method.id)}
    >
      <View style={styles.paymentMethodLeft}>
        <method.icon size={24} color="#374151" />
        <View style={styles.paymentMethodInfo}>
          <View style={styles.paymentMethodHeader}>
            <Text style={styles.paymentMethodName}>
              {method.name}
              {method.lastFour && ` •••• ${method.lastFour}`}
            </Text>
            {method.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recomendado</Text>
              </View>
            )}
          </View>
          {method.subtitle && (
            <Text style={styles.paymentMethodSubtitle}>{method.subtitle}</Text>
          )}
          {method.brand && (
            <Text style={styles.paymentMethodBrand}>{method.brand}</Text>
          )}
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPayment === method.id && styles.radioButtonSelected
      ]}>
        {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolha como pagar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Switch Multi-meios */}
        <View style={styles.multiPaymentContainer}>
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => setUseMultiplePayments(!useMultiplePayments)}
          >
            <View style={[
              styles.switch,
              useMultiplePayments && styles.switchActive
            ]}>
              <View style={[
                styles.switchThumb,
                useMultiplePayments && styles.switchThumbActive
              ]} />
            </View>
            <Text style={styles.switchLabel}>Usar mais de uma forma de pagamento</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Métodos */}
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map(renderPaymentMethod)}
          
          {/* Adicionar Cartão */}
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={handleAddCard}
          >
            <Plus size={24} color="#6366F1" />
            <Text style={styles.addCardText}>Adicionar cartão</Text>
          </TouchableOpacity>
        </View>

        {/* Link Cupom */}
        <TouchableOpacity
          style={styles.couponButton}
          onPress={() => setShowCouponModal(true)}
        >
          <Tag size={20} color="#6366F1" />
          <Text style={styles.couponText}>Inserir código do cupom</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Resumo Rápido */}
      <View style={styles.bottomContainer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Você pagará</Text>
          <Text style={styles.summaryValue}>R$ {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.reviewButton,
            !selectedPayment && styles.reviewButtonDisabled
          ]}
          onPress={handleContinueToReview}
          disabled={!selectedPayment}
        >
          <Text style={styles.reviewButtonText}>Revisar pedido</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Cupom */}
      <Modal
        visible={showCouponModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCouponModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Inserir cupom</Text>
            <TextInput
              style={styles.couponInput}
              placeholder="Digite o código do cupom"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCouponModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={handleApplyCoupon}
              >
                <Text style={styles.modalApplyText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 20,
    backgroundColor: '#6366F1',
    borderBottomWidth: 1,
    borderBottomColor: '#5B21B6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  multiPaymentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    padding: 2,
    marginRight: 12,
  },
  switchActive: {
    backgroundColor: '#6366F1',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  switchLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  paymentMethodsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedPaymentMethod: {
    backgroundColor: '#EFF6FF',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodInfo: {
    marginLeft: 15,
    flex: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  recommendedBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recommendedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  paymentMethodBrand: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#6366F1',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  addCardText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
    marginLeft: 15,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  couponText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
    marginLeft: 12,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    color: '#059669',
    fontWeight: '700',
  },
  reviewButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  reviewButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  reviewButtonText: {
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  couponInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalApplyButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalApplyText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});