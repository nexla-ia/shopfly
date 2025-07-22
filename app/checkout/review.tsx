import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, MapPin, CreditCard, User, CreditCard as Edit } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import OrderSuccessModal from '@/components/OrderSuccessModal';

export default function ReviewScreen() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  const deliveryFee = 5.99;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  // Mock data
  const billingData = {
    name: 'João Silva',
    document: '123.456.789-00',
  };

  const deliveryData = {
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    method: 'Entrega em até 60 minutos',
  };

  const paymentData = {
    method: 'Visa •••• 8383',
    subtitle: 'Banco do Brasil',
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const newOrderId = `order_${Date.now()}`;
      setOrderId(newOrderId);
      
      clearCart();
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar seu pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)');
  };

  const handleTrackOrder = () => {
    setShowSuccessModal(false);
    router.replace(`/order/${orderId}`);
  };
  const getCategoryCount = () => {
    return cartItems.length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revise e confirme</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Modal de Sucesso */}
      <OrderSuccessModal
        visible={showSuccessModal}
        orderId={orderId}
        estimatedTime="30-45 minutos"
        paymentMethod={paymentData.method}
        onContinueShopping={handleContinueShopping}
        onTrackOrder={handleTrackOrder}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo de Itens */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Resumo do pedido</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Produtos ({getCategoryCount()})</Text>
            <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Entrega</Text>
            <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Dados de Faturamento */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <User size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Dados de faturamento</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.detailText}>{billingData.name}</Text>
          <Text style={styles.detailSubtext}>CPF: {billingData.document}</Text>
          
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Modificar dados de faturamento</Text>
          </TouchableOpacity>
        </View>

        {/* Detalhes de Entrega */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MapPin size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Detalhes de entrega</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.detailText}>{deliveryData.address}</Text>
          <Text style={styles.detailSubtext}>{deliveryData.method}</Text>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/checkout/delivery')}
          >
            <Text style={styles.linkText}>Alterar forma de entrega</Text>
          </TouchableOpacity>
        </View>

        {/* Detalhes de Pagamento */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <CreditCard size={20} color="#6366F1" />
              <Text style={styles.cardTitle}>Detalhes de pagamento</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.detailText}>{paymentData.method}</Text>
          <Text style={styles.detailSubtext}>{paymentData.subtitle}</Text>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/checkout/payment')}
          >
            <Text style={styles.linkText}>Alterar forma de pagamento</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Produtos */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardTitle}>Itens do pedido</Text>
          {cartItems.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão CTA */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmOrder}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Processando...' : 'Confirmar a compra'}
          </Text>
        </TouchableOpacity>
      </View>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  editButton: {
    padding: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  detailText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});