import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Package, CircleCheck as CheckCircle, Truck, MapPin, CreditCard, X, RotateCcw, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';

interface OrderTrackingData {
  id: string;
  status: OrderStatus;
  estimatedTime: string;
  paymentMethod: string;
  total: number;
  store: string;
  address: string;
  orderDate: string;
  trackingCode?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    id: string;
    image: string;
  }>;
  canCancel: boolean;
  canReturn: boolean;
}

const mockOrderData: OrderTrackingData = {
  id: 'order_17',
  status: 'preparing',
  estimatedTime: '30-45 minutos',
  paymentMethod: 'PIX',
  total: 2605.97,
  store: 'Loja de Eletrônicos Tech',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  orderDate: '15/01/2024 às 14:30',
  trackingCode: 'SF2024011500123',
  items: [
    { 
      id: '1',
      name: 'Smartphone Samsung Galaxy A54', 
      quantity: 1, 
      price: 1299.99,
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '2',
      name: 'Capinha Transparente', 
      quantity: 1, 
      price: 29.99,
      image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '3',
      name: 'Película de Vidro', 
      quantity: 1, 
      price: 19.99,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ],
  canCancel: true,
  canReturn: false
};

const statusSteps = [
  {
    key: 'confirmed',
    title: 'Pedido Confirmado',
    description: 'Seu pedido foi confirmado e está sendo preparado',
    icon: CheckCircle,
    color: '#10B981'
  },
  {
    key: 'preparing',
    title: 'Preparando',
    description: 'A loja está preparando seu pedido',
    icon: Package,
    color: '#3B82F6'
  },
  {
    key: 'ready',
    title: 'Pronto',
    description: 'Pedido pronto e aguardando entregador',
    icon: CheckCircle,
    color: '#8B5CF6'
  },
  {
    key: 'out_for_delivery',
    title: 'Saiu para entrega',
    description: 'Entregador a caminho do endereço',
    icon: Truck,
    color: '#F59E0B'
  },
  {
    key: 'delivered',
    title: 'Entregue',
    description: 'Pedido entregue com sucesso',
    icon: CheckCircle,
    color: '#059669'
  }
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [orderData] = useState(mockOrderData);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(1); // preparing
  const [animatedValue] = useState(new Animated.Value(0));
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [selectedReturnItems, setSelectedReturnItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate order progress
    const interval = setInterval(() => {
      setCurrentStatusIndex(prev => {
        if (prev < statusSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 10000); // Change status every 10 seconds for demo

    // Animate progress
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = () => {
    if (!orderData.canCancel) {
      Alert.alert('Não é possível cancelar', 'Este pedido já saiu para entrega e não pode mais ser cancelado.');
      return;
    }
    setShowCancelModal(true);
  };

  const handleReturnOrder = () => {
    if (!orderData.canReturn) {
      Alert.alert('Devolução não disponível', 'Este pedido ainda não foi entregue ou está fora do prazo de devolução.');
      return;
    }
    setShowReturnModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Erro', 'Por favor, informe o motivo do cancelamento');
      return;
    }

    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Pedido Cancelado',
        'Seu pedido foi cancelado com sucesso. O reembolso será processado em até 5 dias úteis.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/orders') }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
      setShowCancelModal(false);
    }
  };

  const confirmReturnOrder = async () => {
    if (!returnReason.trim()) {
      Alert.alert('Erro', 'Por favor, informe o motivo da devolução');
      return;
    }
    if (selectedReturnItems.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um item para devolução');
      return;
    }

    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Devolução Solicitada',
        'Sua solicitação de devolução foi enviada. Você receberá instruções por e-mail em breve.',
        [{ text: 'OK', onPress: () => setShowReturnModal(false) }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar a devolução. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleReturnItem = (itemId: string) => {
    setSelectedReturnItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const getStatusColor = (index: number) => {
    if (index <= currentStatusIndex) {
      return statusSteps[index].color;
    }
    return '#E5E7EB';
  };

  const isStatusCompleted = (index: number) => index <= currentStatusIndex;
  const isStatusCurrent = (index: number) => index === currentStatusIndex;

  const renderStatusStep = (step: any, index: number) => {
    const Icon = step.icon;
    const isCompleted = isStatusCompleted(index);
    const isCurrent = isStatusCurrent(index);
    const color = getStatusColor(index);

    return (
      <View key={step.key} style={styles.statusStep}>
        <View style={styles.statusLeft}>
          <View style={[
            styles.statusIcon,
            { 
              backgroundColor: isCompleted ? color : '#F3F4F6',
              borderColor: color,
              borderWidth: isCurrent ? 3 : 1
            }
          ]}>
            <Icon 
              size={20} 
              color={isCompleted ? '#FFFFFF' : '#9CA3AF'} 
            />
          </View>
          {index < statusSteps.length - 1 && (
            <View style={[
              styles.statusLine,
              { backgroundColor: index < currentStatusIndex ? color : '#E5E7EB' }
            ]} />
          )}
        </View>
        <View style={styles.statusContent}>
          <Text style={[
            styles.statusTitle,
            { color: isCompleted ? '#111827' : '#6B7280' }
          ]}>
            {step.title}
          </Text>
          <Text style={[
            styles.statusDescription,
            { color: isCompleted ? '#374151' : '#9CA3AF' }
          ]}>
            {step.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acompanhar Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resumo Header */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Pedido #{orderData.id}</Text>
              <Text style={styles.orderStore}>{orderData.store}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatusIndex) + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(currentStatusIndex) }]}>
                {statusSteps[currentStatusIndex].title}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.infoText}>Tempo estimado: {orderData.estimatedTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.infoText}>{orderData.address}</Text>
            </View>
          </View>
        </View>

        {/* Timeline de Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Status do Pedido</Text>
          <View style={styles.statusTimeline}>
            {statusSteps.map((step, index) => renderStatusStep(step, index))}
          </View>
        </View>

        {/* Detalhes do Pedido */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Detalhes do Pedido</Text>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor Total</Text>
              <Text style={styles.detailValue}>R$ {orderData.total.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Forma de Pagamento</Text>
              <View style={styles.paymentMethod}>
                <CreditCard size={16} color="#059669" />
                <Text style={styles.paymentText}>{orderData.paymentMethod}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Endereço de Entrega</Text>
              <Text style={styles.detailValue}>{orderData.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data/Hora do Pedido</Text>
              <Text style={styles.detailValue}>{orderData.orderDate}</Text>
            </View>
            {orderData.trackingCode && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Código de Rastreamento</Text>
                <Text style={styles.trackingCode}>{orderData.trackingCode}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Itens do Pedido */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          <View style={styles.itemsCard}>
            {orderData.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    Quantidade: {item.quantity} • Preço unitário: R$ {item.price.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  R$ {(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {(orderData.canCancel || orderData.canReturn) && (
        <View style={[styles.actionButtons, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {orderData.canCancel && (
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: '#EF4444' }]}
              onPress={handleCancelOrder}
            >
              <X size={16} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
            </TouchableOpacity>
          )}
          
          {orderData.canReturn && (
            <TouchableOpacity 
              style={[styles.returnButton, { borderColor: '#F59E0B' }]}
              onPress={handleReturnOrder}
            >
              <RotateCcw size={16} color="#F59E0B" />
              <Text style={styles.returnButtonText}>Solicitar Devolução</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Footer Persistente */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>Voltar ao início</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push('/(tabs)/orders')}
        >
          <Text style={styles.historyButtonText}>Ver histórico</Text>
        </TouchableOpacity>
      </View>

      {/* Cancel Order Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Cancelar Pedido</Text>
              <TouchableOpacity onPress={() => setShowCancelModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.warningContainer}>
                <AlertTriangle size={20} color="#F59E0B" />
                <Text style={[styles.warningText, { color: colors.text }]}>
                  Ao cancelar, o reembolso será processado em até 5 dias úteis na forma de pagamento original.
                </Text>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>Motivo do cancelamento:</Text>
              <TextInput
                style={[styles.reasonInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Informe o motivo do cancelamento..."
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Voltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalConfirmButton, loading && styles.modalConfirmButtonDisabled]}
                onPress={confirmCancelOrder}
                disabled={loading}
              >
                <Text style={styles.modalConfirmText}>
                  {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Return Order Modal */}
      <Modal
        visible={showReturnModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReturnModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Solicitar Devolução</Text>
              <TouchableOpacity onPress={() => setShowReturnModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.warningContainer}>
                <AlertTriangle size={20} color="#10B981" />
                <Text style={[styles.warningText, { color: colors.text }]}>
                  Você tem até 7 dias após a entrega para solicitar devolução. Produtos devem estar em perfeito estado.
                </Text>
              </View>

              <Text style={[styles.inputLabel, { color: colors.text }]}>Selecione os itens para devolução:</Text>
              {orderData.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.returnItem,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    selectedReturnItems.includes(item.id) && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                  ]}
                  onPress={() => toggleReturnItem(item.id)}
                >
                  <View style={styles.returnItemInfo}>
                    <Text style={[styles.returnItemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.returnItemPrice, { color: colors.textSecondary }]}>
                      {item.quantity}x R$ {item.price.toFixed(2)}
                    </Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    { borderColor: selectedReturnItems.includes(item.id) ? colors.primary : colors.border }
                  ]}>
                    {selectedReturnItems.includes(item.id) && (
                      <View style={[styles.checkboxInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              <Text style={[styles.inputLabel, { color: colors.text }]}>Motivo da devolução:</Text>
              <TextInput
                style={[styles.reasonInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Informe o motivo da devolução..."
                value={returnReason}
                onChangeText={setReturnReason}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { backgroundColor: colors.background }]}
                onPress={() => setShowReturnModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalConfirmButton, loading && styles.modalConfirmButtonDisabled]}
                onPress={confirmReturnOrder}
                disabled={loading}
              >
                <Text style={styles.modalConfirmText}>
                  {loading ? 'Enviando...' : 'Solicitar Devolução'}
                </Text>
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
  orderCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  orderStore: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  statusTimeline: {
    paddingLeft: 10,
  },
  statusStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statusLeft: {
    alignItems: 'center',
    marginRight: 15,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLine: {
    width: 2,
    height: 40,
    marginTop: 5,
  },
  statusContent: {
    flex: 1,
    paddingTop: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  paymentText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  trackingCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    flex: 1,
    textAlign: 'right',
  },
  itemsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  itemInfo: {
    flex: 1,
    marginRight: 15,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 15,
  },
  homeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  historyButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  returnButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  returnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
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
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  returnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  returnItemInfo: {
    flex: 1,
  },
  returnItemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  returnItemPrice: {
    fontSize: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});