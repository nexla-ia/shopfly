import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, CircleCheck as CheckCircle, Package, Truck, Calendar, ArrowLeft } from 'lucide-react-native';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  store: string;
  deliveryTime: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      {
        id: '1',
        name: 'Smartphone Samsung Galaxy A54',
        quantity: 1,
        price: 1299.99,
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 1305.98,
    store: 'Loja de Eletrônicos Tech',
    deliveryTime: '30-45 min'
  },
  {
    id: '2',
    date: '2024-01-14',
    status: 'preparing',
    items: [
      {
        id: '3',
        name: 'Arroz Integral Tio João 1kg',
        quantity: 2,
        price: 8.99,
        image: 'https://images.pexels.com/photos/33239/rice-grain-food-raw.jpg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '4',
        name: 'Feijão Preto Camil 1kg',
        quantity: 1,
        price: 7.49,
        image: 'https://images.pexels.com/photos/4198564/pexels-photo-4198564.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 31.46,
    store: 'Supermercado Central',
    deliveryTime: '20-30 min'
  },
  {
    id: '3',
    date: '2024-01-13',
    status: 'ready',
    items: [
      {
        id: '5',
        name: 'Dipirona 500mg',
        quantity: 1,
        price: 12.99,
        image: 'https://images.pexels.com/photos/3683080/pexels-photo-3683080.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    total: 18.98,
    store: 'Farmácia Saúde+',
    deliveryTime: '15-25 min'
  },
];

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: '#F59E0B',
    icon: Clock,
    bgColor: '#FEF3C7',
  },
  preparing: {
    label: 'Em Preparo',
    color: '#3B82F6',
    icon: Package,
    bgColor: '#DBEAFE',
  },
  ready: {
    label: 'Pronto',
    color: '#10B981',
    icon: CheckCircle,
    bgColor: '#D1FAE5',
  },
  delivered: {
    label: 'Entregue',
    color: '#059669',
    icon: Truck,
    bgColor: '#A7F3D0',
  },
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders] = useState(mockOrders);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const status = statusConfig[item.status];
    const StatusIcon = status.icon;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/order/${item.id}`)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <StatusIcon size={16} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={styles.storeName}>{item.store}</Text>
        <Text style={styles.deliveryTime}>Entrega em {item.deliveryTime}</Text>

        <View style={styles.itemsContainer}>
          {item.items.slice(0, 2).map((product, index) => (
            <View key={product.id} style={styles.orderItemRow}>
              <Image source={{ uri: product.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.itemQuantity}>
                  {product.quantity}x R$ {product.price.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          {item.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{item.items.length - 2} outros itens
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {item.total.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyOrders = () => (
    <View style={styles.emptyOrders}>
      <Package size={80} color="#E5E7EB" />
      <Text style={styles.emptyOrdersTitle}>Nenhum pedido ainda</Text>
      <Text style={styles.emptyOrdersText}>
        Quando você fizer um pedido, ele aparecerá aqui
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push('/search')}
      >
        <Text style={styles.shopButtonText}>Começar a comprar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        renderEmptyOrders()
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ordersList}
        />
      )}
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 15,
  },
  itemsContainer: {
    marginBottom: 15,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreItems: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  emptyOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyOrdersTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyOrdersText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});