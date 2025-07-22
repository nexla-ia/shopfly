import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: 'all', name: 'Todas', icon: '📋' },
  { id: 'purchases', name: 'Compras', icon: '🛒' },
  { id: 'returns', name: 'Devoluções', icon: '↩️' },
  { id: 'cancellations', name: 'Cancelamentos', icon: '❌' },
  { id: 'reviews', name: 'Avaliações', icon: '⭐' },
  { id: 'rights', name: 'Direitos', icon: '⚖️' },
  { id: 'payments', name: 'Pagamentos', icon: '💳' },
  { id: 'delivery', name: 'Entrega', icon: '🚚' },
  { id: 'account', name: 'Conta', icon: '👤' },
];

const faqs: FAQ[] = [
  // Compras
  {
    id: '1',
    question: 'Como faço para rastrear meu pedido?',
    answer: 'Na tela "Meus Pedidos", selecione o pedido desejado e toque em "Acompanhar pedido" para ver o status em tempo real.',
    category: 'purchases'
  },
  {
    id: '2',
    question: 'Posso comprar sem criar conta?',
    answer: 'Não. É necessário estar logado para finalizar compras e rastrear pedidos.',
    category: 'purchases'
  },
  {
    id: '3',
    question: 'Como adicionar produtos ao carrinho?',
    answer: 'Na página do produto, escolha a quantidade desejada e toque em "Adicionar ao Carrinho". O produto será salvo até você finalizar a compra.',
    category: 'purchases'
  },
  {
    id: '4',
    question: 'Posso alterar a quantidade de itens no carrinho?',
    answer: 'Sim! No carrinho, use os botões + e - ao lado de cada produto para ajustar a quantidade.',
    category: 'purchases'
  },
  
  // Devoluções
  {
    id: '5',
    question: 'Qual é o prazo para devolver um produto?',
    answer: 'Você tem até 7 dias corridos, a partir da data de entrega, para solicitar devolução conforme o Código de Defesa do Consumidor.',
    category: 'returns'
  },
  {
    id: '6',
    question: 'Como iniciar uma devolução?',
    answer: 'Acesse "Meus Pedidos", selecione o pedido e toque em "Devolver produto", siga as instruções e imprima a etiqueta de retorno.',
    category: 'returns'
  },
  {
    id: '7',
    question: 'Quais produtos posso devolver?',
    answer: 'Produtos em perfeito estado, na embalagem original, sem sinais de uso. Produtos personalizados ou perecíveis não podem ser devolvidos.',
    category: 'returns'
  },
  {
    id: '8',
    question: 'Quem paga o frete da devolução?',
    answer: 'Se o produto apresentar defeito ou divergência, o frete é por nossa conta. Em caso de arrependimento, o frete fica por conta do cliente.',
    category: 'returns'
  },

  // Cancelamentos
  {
    id: '9',
    question: 'Posso cancelar um pedido depois de confirmado?',
    answer: 'Sim, desde que não tenha saído para entrega. Vá em "Meus Pedidos", selecione o pedido e toque em "Cancelar pedido".',
    category: 'cancellations'
  },
  {
    id: '10',
    question: 'O valor pago será estornado?',
    answer: 'Sim. Após confirmação do cancelamento, o estorno será processado em até 5 dias úteis na forma de pagamento original.',
    category: 'cancellations'
  },
  {
    id: '11',
    question: 'Posso cancelar apenas um item do pedido?',
    answer: 'Sim, é possível cancelar itens individuais desde que o pedido ainda não tenha sido enviado.',
    category: 'cancellations'
  },

  // Avaliações
  {
    id: '12',
    question: 'Como avalio um produto?',
    answer: 'Na página do produto, role até "Avaliações" e toque em "Escrever avaliação". Escolha a nota, escreva seu comentário e envie.',
    category: 'reviews'
  },
  {
    id: '13',
    question: 'Posso editar minha avaliação?',
    answer: 'Sim, até 24 horas após a publicação. Basta abrir sua avaliação e tocar em "Editar".',
    category: 'reviews'
  },
  {
    id: '14',
    question: 'Posso anexar fotos na avaliação?',
    answer: 'Sim! Durante a avaliação, toque em "Adicionar fotos" para incluir até 5 imagens do produto.',
    category: 'reviews'
  },

  // Direitos
  {
    id: '15',
    question: 'O que é o direito de arrependimento?',
    answer: 'Permite desistir da compra em até 7 dias corridos após o recebimento, sem precisar justificar.',
    category: 'rights'
  },
  {
    id: '16',
    question: 'Como exerço esse direito?',
    answer: 'Solicite a devolução via "Meus Pedidos" > "Devolver produto" dentro do prazo legal.',
    category: 'rights'
  },
  {
    id: '17',
    question: 'Tenho garantia nos produtos?',
    answer: 'Sim! Todos os produtos têm garantia legal de 30 dias (não duráveis) ou 90 dias (duráveis), além da garantia do fabricante.',
    category: 'rights'
  },

  // Pagamentos
  {
    id: '18',
    question: 'Quais formas de pagamento aceitas?',
    answer: 'Aceitamos cartões de crédito (Visa, Mastercard, Elo), PIX e boleto bancário.',
    category: 'payments'
  },
  {
    id: '19',
    question: 'Posso parcelar minha compra?',
    answer: 'Sim! Oferecemos parcelamento em até 12x sem juros no cartão de crédito para compras acima de R$ 100.',
    category: 'payments'
  },
  {
    id: '20',
    question: 'Meus dados de pagamento estão seguros?',
    answer: 'Sim! Utilizamos criptografia SSL e não armazenamos dados completos do cartão. Seus dados estão protegidos.',
    category: 'payments'
  },
  {
    id: '21',
    question: 'Posso salvar meu cartão para próximas compras?',
    answer: 'Sim! Durante o checkout, marque "Salvar cartão" para facilitar futuras compras.',
    category: 'payments'
  },

  // Entrega
  {
    id: '22',
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo varia conforme a loja e sua localização, geralmente entre 30 minutos a 2 horas para produtos locais.',
    category: 'delivery'
  },
  {
    id: '23',
    question: 'Posso alterar o endereço de entrega?',
    answer: 'Sim, até o momento em que o pedido sair para entrega. Acesse "Meus Pedidos" e toque em "Alterar endereço".',
    category: 'delivery'
  },
  {
    id: '24',
    question: 'Como funciona o frete grátis?',
    answer: 'Oferecemos frete grátis para compras acima de R$ 99 na mesma loja ou em lojas participantes da promoção.',
    category: 'delivery'
  },
  {
    id: '25',
    question: 'Posso agendar a entrega?',
    answer: 'Algumas lojas oferecem agendamento. Durante o checkout, verifique se a opção está disponível.',
    category: 'delivery'
  },

  // Conta
  {
    id: '26',
    question: 'Como altero meus dados pessoais?',
    answer: 'Vá em "Perfil" > "Dados da sua conta" e edite as informações desejadas.',
    category: 'account'
  },
  {
    id: '27',
    question: 'Esqueci minha senha, como recuperar?',
    answer: 'Na tela de login, toque em "Esqueci a senha" e siga as instruções enviadas por e-mail.',
    category: 'account'
  },
  {
    id: '28',
    question: 'Como excluir minha conta?',
    answer: 'Acesse "Perfil" > "Privacidade" > "Cancelar conta" e siga as instruções. Esta ação é irreversível.',
    category: 'account'
  },
  {
    id: '29',
    question: 'Posso ter mais de uma conta?',
    answer: 'Não é recomendado. Uma conta por CPF garante melhor experiência e histórico de compras.',
    category: 'account'
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);

  React.useEffect(() => {
    filterFAQs();
  }, [searchQuery, selectedCategory]);

  const filterFAQs = () => {
    let filtered = faqs;

    if (searchQuery) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    setFilteredFAQs(filtered);
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { backgroundColor: colors.background },
        selectedCategory === item.id && { backgroundColor: colors.primary }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryEmoji}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        { color: colors.textSecondary },
        selectedCategory === item.id && { color: '#FFFFFF' }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFAQ = (faq: FAQ) => {
    const isExpanded = expandedFAQ === faq.id;
    
    return (
      <TouchableOpacity
        key={faq.id}
        style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => toggleFAQ(faq.id)}
      >
        <View style={styles.faqHeader}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
          {isExpanded ? (
            <ChevronUp size={20} color={colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={colors.textSecondary} />
          )}
        </View>
        {isExpanded && (
          <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Central de Ajuda</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar dúvidas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={[styles.categoriesContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((category) => (
              <View key={category.id}>
                {renderCategory({ item: category })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <View style={[styles.resultsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'dúvida encontrada' : 'dúvidas encontradas'}
          </Text>
        </View>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {filteredFAQs.map(renderFAQ)}
        </View>

        {/* Contact Support */}
        <View style={[styles.supportContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.supportTitle, { color: colors.text }]}>Não encontrou sua dúvida?</Text>
          <Text style={[styles.supportSubtitle, { color: colors.textSecondary }]}>
            Entre em contato conosco através dos canais abaixo:
          </Text>
          
          <View style={styles.contactOptions}>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.primary }]}>
              <MessageCircle size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Chat Online</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#25D366' }]}>
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#EA4335' }]}>
              <Mail size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>E-mail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Horário de atendimento: Segunda a Sexta, 8h às 18h
          </Text>
        </View>
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  faqItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  supportContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  supportSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});