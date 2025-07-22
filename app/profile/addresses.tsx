import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Plus, X, CreditCard as Edit } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Address {
  id: string;
  street: string;
  number: string;
  zipCode: string;
  city: string;
  state: string;
  neighborhood: string;
  name: string;
  lastName: string;
  phone: string;
  complement?: string;
  additionalInfo?: string;
  type: 'casa' | 'trabalho';
  isDefault?: boolean;
}


export default function AddressesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    state: '',
    complement: '',
    additionalInfo: '',
    type: 'casa' as 'casa' | 'trabalho',
    contactName: '',
    contactLastName: '',
    contactPhone: '',
  });

  // Carregar endereços do usuário
  React.useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading addresses:', error);
        Alert.alert('Erro', 'Não foi possível carregar os endereços');
        return;
      }

      const formattedAddresses: Address[] = data.map(addr => ({
        id: addr.id,
        street: addr.street,
        number: addr.number,
        zipCode: addr.zip_code,
        city: addr.city,
        state: addr.state,
        neighborhood: addr.neighborhood,
        name: addr.name,
        lastName: addr.last_name,
        phone: addr.phone,
        complement: addr.complement,
        additionalInfo: addr.additional_info,
        type: addr.type,
        isDefault: addr.is_default,
      }));

      setAddresses(formattedAddresses);
      
      // Se não há endereço selecionado, selecionar o padrão
      if (!selectedAddressId && formattedAddresses.length > 0) {
        const defaultAddress = formattedAddresses.find(addr => addr.isDefault) || formattedAddresses[0];
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Erro', 'Não foi possível carregar os endereços');
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      state: '',
      complement: '',
      additionalInfo: '',
      type: 'casa',
      contactName: '',
      contactLastName: '',
      contactPhone: '',
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      cep: address.zipCode,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      state: address.state,
      complement: address.complement ?? '',
      additionalInfo: address.additionalInfo ?? '',
      type: address.type,
      contactName: address.name,
      contactLastName: address.lastName,
      contactPhone: address.phone,
    });
    setShowModal(true);
  };

  const handleSaveAddress = async () => {
    if (!formData.street || !formData.number || !formData.neighborhood || !formData.city || !formData.state || !formData.contactName || !formData.contactLastName || !formData.contactPhone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);

      const addressData = {
        user_id: user.id,
        name: formData.contactName,
        last_name: formData.contactLastName,
        phone: formData.contactPhone,
        street: formData.street,
        number: formData.number,
        complement: formData.complement || null,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zip_code: formData.cep || null,
        additional_info: formData.additionalInfo || null,
        type: formData.type,
        is_default: addresses.length === 0, // Primeiro endereço é padrão
      };

      let error;

      if (editingAddress) {
        // Atualizar endereço existente
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update(addressData)
          .eq('id', editingAddress.id);
        error = updateError;
      } else {
        // Criar novo endereço
        const { error: insertError } = await supabase
          .from('user_addresses')
          .insert(addressData);
        error = insertError;
      }

      if (error) {
        console.error('Error saving address:', error);
        Alert.alert('Erro', 'Não foi possível salvar o endereço');
        return;
      }

      // Recarregar endereços
      await loadAddresses();
      
      setShowModal(false);
      resetForm();
      Alert.alert('Sucesso', editingAddress ? 'Endereço atualizado!' : 'Endereço adicionado!');
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Erro', 'Não foi possível salvar o endereço');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (addressId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Primeiro, remover o padrão de todos os endereços
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Depois, definir o endereço selecionado como padrão
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) {
        console.error('Error setting default address:', error);
        Alert.alert('Erro', 'Não foi possível definir o endereço padrão');
        return;
      }

      setSelectedAddressId(addressId);
      await loadAddresses();
      Alert.alert('Sucesso', 'Endereço de entrega atualizado!');
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Erro', 'Não foi possível definir o endereço padrão');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;

    Alert.alert(
      'Excluir Endereço',
      'Tem certeza que deseja excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from('user_addresses')
                .delete()
                .eq('id', addressId);

              if (error) {
                console.error('Error deleting address:', error);
                Alert.alert('Erro', 'Não foi possível excluir o endereço');
                return;
              }

              await loadAddresses();
              Alert.alert('Sucesso', 'Endereço excluído com sucesso!');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Erro', 'Não foi possível excluir o endereço');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderAddress = (address: Address) => (
    <TouchableOpacity 
      key={address.id} 
      style={[
        styles.addressItem,
        selectedAddressId === address.id && styles.selectedAddressItem
      ]}
      onPress={() => handleSelectAddress(address.id)}
    >
      <View style={styles.addressLeft}>
        <View style={[
          styles.radioButton,
          selectedAddressId === address.id && styles.radioButtonSelected
        ]}>
          {selectedAddressId === address.id && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
        <View style={styles.iconContainer}>
          <MapPin size={20} color="#6366F1" />
        </View>
        <View style={styles.addressInfo}>
          <Text style={styles.addressStreet}>
            {address.street}, {address.number} - {address.neighborhood}
          </Text>
          <Text style={styles.addressDetails}>
            {address.city} - {address.state} {address.zipCode && `- ${address.zipCode}`}
          </Text>
          <Text style={styles.addressContact}>
            {address.name} {address.lastName} - {address.phone}
          </Text>
          <Text style={styles.addressType}>
            {address.type === 'casa' ? '🏠 Casa' : '🏢 Trabalho'}
            {selectedAddressId === address.id && ' • Selecionado para entrega'}
          </Text>
        </View>
      </View>
      <View style={styles.addressActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditAddress(address)}
        >
          <Edit size={18} color="#6366F1" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <X size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Meus dados</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Lista de Endereços */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>📍 Endereços de Entrega</Text>
          <Text style={styles.instructionText}>
            Toque em um endereço para selecioná-lo como padrão para suas entregas
          </Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando endereços...</Text>
          </View>
        ) : (
          <View style={styles.addressesList}>
            {addresses.length > 0 ? (
              addresses.map(renderAddress)
            ) : (
              <View style={styles.emptyState}>
                <MapPin size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
                <Text style={styles.emptyText}>Adicione um endereço para facilitar suas compras</Text>
              </View>
            )}
          </View>
        )}

        {/* Link Adicionar Dados */}
        <TouchableOpacity style={styles.addDataLink}>
          <Text style={styles.addDataText}>Adicionar dados e horários do lugar</Text>
        </TouchableOpacity>

        {/* Botão Adicionar Endereço */}
        <TouchableOpacity 
          style={styles.addAddressButton}
          onPress={handleAddAddress}
          disabled={loading}
        >
          <Plus size={20} color="#6366F1" />
          <Text style={styles.addAddressText}>
            {loading ? 'Carregando...' : 'Adicionar endereço'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Adicionar/Editar Endereço */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header do Modal */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? 'Editar Endereço' : 'Adicionar Endereço'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Formulário */}
              <View style={styles.form}>
                {/* CEP */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CEP *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="00000-000"
                    value={formData.cep}
                    onChangeText={(value) => updateFormData('cep', value)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Rua/Avenida */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Rua/Avenida *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome da rua ou avenida"
                    value={formData.street}
                    onChangeText={(value) => updateFormData('street', value)}
                  />
                </View>

                {/* Número */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Número *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={formData.number}
                    onChangeText={(value) => updateFormData('number', value)}
                    keyboardType="numeric"
                  />
                </View>
                {/* Bairro */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bairro *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome do bairro"
                    value={formData.neighborhood}
                    onChangeText={(value) => updateFormData('neighborhood', value)}
                  />
                </View>

                {/* Cidade */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cidade *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome da cidade"
                    value={formData.city}
                    onChangeText={(value) => updateFormData('city', value)}
                  />
                </View>

                {/* Estado */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Estado *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="SP"
                    value={formData.state}
                    onChangeText={(value) => updateFormData('state', value)}
                    maxLength={2}
                  />
                </View>

                {/* Complemento */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Complemento</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Apto, bloco, etc. (opcional)"
                    value={formData.complement}
                    onChangeText={(value) => updateFormData('complement', value)}
                  />
                </View>

                {/* Informações Adicionais */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Informações Adicionais</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Ponto de referência, observações... (opcional)"
                    value={formData.additionalInfo}
                    onChangeText={(value) => updateFormData('additionalInfo', value)}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Tipo de Endereço */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tipo de Endereço</Text>
                  <View style={styles.typeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'casa' && styles.typeButtonActive
                      ]}
                      onPress={() => updateFormData('type', 'casa')}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        formData.type === 'casa' && styles.typeButtonTextActive
                      ]}>
                        🏠 Casa
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.type === 'trabalho' && styles.typeButtonActive
                      ]}
                      onPress={() => updateFormData('type', 'trabalho')}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        formData.type === 'trabalho' && styles.typeButtonTextActive
                      ]}>
                        🏢 Trabalho
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Dados de Contato */}
                <Text style={styles.sectionTitle}>Dados de Contato</Text>

                {/* Nome */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome"
                    value={formData.contactName}
                    onChangeText={(value) => updateFormData('contactName', value)}
                  />
                </View>

                {/* Sobrenome */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Sobrenome *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Seu sobrenome"
                    value={formData.contactLastName}
                    onChangeText={(value) => updateFormData('contactLastName', value)}
                  />
                </View>

                {/* Telefone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Telefone de Contato *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(11) 99999-9999"
                    value={formData.contactPhone}
                    onChangeText={(value) => updateFormData('contactPhone', value)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Botões de Ação */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowModal(false)}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                  onPress={handleSaveAddress}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Salvando...' : (editingAddress ? 'Atualizar' : 'Salvar')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  instructionContainer: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#3730A3',
    lineHeight: 18,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  addressesList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedAddressItem: {
    backgroundColor: '#EFF6FF',
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressInfo: {
    flex: 1,
  },
  addressStreet: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  addressContact: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  addressType: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  addDataLink: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  addDataText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EFF6FF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#6366F1',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});