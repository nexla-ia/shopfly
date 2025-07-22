import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Truck } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';

export default function DeliveryScreen() {
  const router = useRouter();
  const { getCartTotal } = useCart();
  const [selectedAddress, setSelectedAddress] = useState({
    id: '1',
    street: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  });

  const deliveryFee = 5.99;
  const deliveryTime = '60 minutos';

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      Alert.alert('Erro', 'Selecione um endereço de entrega');
      return;
    }
    router.push('/checkout/payment');
  };

  const handleChangeAddress = () => {
    // Aqui abriria a lista de endereços salvos
    Alert.alert('Em breve', 'Funcionalidade de alterar endereço em desenvolvimento');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirme sua entrega</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Card de Endereço */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <MapPin size={20} color="#6366F1" />
            <Text style={styles.addressLabel}>Entregar em:</Text>
          </View>
          
          <Text style={styles.addressText}>
            {selectedAddress.street}, {selectedAddress.neighborhood}
          </Text>
          <Text style={styles.addressText}>
            {selectedAddress.city} - {selectedAddress.state}, {selectedAddress.zipCode}
          </Text>
          
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryRow}>
              <Clock size={16} color="#059669" />
              <Text style={styles.deliveryTime}>Entrega em até {deliveryTime}</Text>
            </View>
            
            <View style={styles.deliveryRow}>
              <Truck size={16} color="#6B7280" />
              <Text style={styles.deliveryFee}>Taxa de entrega R$ {deliveryFee.toFixed(2)}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.changeAddressButton}
            onPress={handleChangeAddress}
          >
            <Text style={styles.changeAddressText}>Alterar endereço</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo Rápido */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {getCartTotal().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de entrega</Text>
            <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {(getCartTotal() + deliveryFee).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Botão CTA */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueToPayment}
        >
          <Text style={styles.continueButtonText}>Continuar para pagamento</Text>
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
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 22,
  },
  deliveryInfo: {
    marginTop: 20,
    marginBottom: 15,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 8,
  },
  deliveryFee: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  changeAddressButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  changeAddressText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
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
    marginVertical: 10,
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
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});