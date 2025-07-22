import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Plus } from 'lucide-react-native';

interface Card {
  id: string;
  brand: 'visa' | 'mastercard' | 'elo';
  lastFour: string;
  bank: string;
  expiry: string;
}

const mockCards: Card[] = [
  {
    id: '1',
    brand: 'visa',
    lastFour: '8383',
    bank: 'Banco do Brasil',
    expiry: '12/26',
  },
  {
    id: '2',
    brand: 'mastercard',
    lastFour: '1234',
    bank: 'Itaú',
    expiry: '08/25',
  },
  {
    id: '3',
    brand: 'elo',
    lastFour: '5678',
    bank: 'Bradesco',
    expiry: '03/27',
  },
];

export default function CardsScreen() {
  const router = useRouter();

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳'; // Você pode substituir por ícones reais
      case 'mastercard':
        return '💳';
      case 'elo':
        return '💳';
      default:
        return '💳';
    }
  };

  const renderCard = (card: Card) => (
    <View key={card.id} style={styles.cardItem}>
      <View style={styles.cardLeft}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandEmoji}>{getBrandIcon(card.brand)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNumber}>Terminado em {card.lastFour}</Text>
          <Text style={styles.cardDetails}>{card.bank} • {card.expiry}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.appBarTitle}>Cartões</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Lista de Cartões */}
        <View style={styles.cardsList}>
          {mockCards.map(renderCard)}
        </View>

        {/* Botão Adicionar Cartão */}
        <TouchableOpacity style={styles.addCardButton}>
          <Plus size={20} color="#6366F1" />
          <Text style={styles.addCardText}>Adicionar Cartão</Text>
        </TouchableOpacity>
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
  cardsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  brandEmoji: {
    fontSize: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
});