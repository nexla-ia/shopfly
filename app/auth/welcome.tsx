import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, User, Phone, MapPin, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const { width, height } = Dimensions.get('window');

type AuthMode = 'login' | 'register' | 'forgot';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signUp, signIn, resetPassword, loading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    const { name, email, phone, city, password, confirmPassword } = formData;

    // Validações básicas
    if (!email) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return;
    }

    if (authMode === 'forgot') {
      handleForgotPassword();
      return;
    }

    if (!password) {
      Alert.alert('Erro', 'Por favor, informe sua senha');
      return;
    }

    if (authMode === 'register') {
      if (!name) {
        Alert.alert('Erro', 'Por favor, informe seu nome');
        return;
      }
      if (!phone) {
        Alert.alert('Erro', 'Por favor, informe seu telefone');
        return;
      }
      if (!city) {
        Alert.alert('Erro', 'Por favor, informe sua cidade');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    try {
      let result;
      
      if (authMode === 'login') {
        result = await signIn(email, password);
      } else if (authMode === 'register') {
        result = await signUp(email, password, {
          fullName: name,
          phone,
          city,
        });
      }
      
      if (result?.error) {
        Alert.alert('Erro', result.error.message || 'Ocorreu um erro. Tente novamente.');
      } else {
        if (authMode === 'login') {
          router.replace('/(tabs)');
        } else {
          // Mostrar modal de confirmação de email
          setRegisteredEmail(email);
          setShowEmailConfirmModal(true);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return;
    }

    try {
      const result = await resetPassword(formData.email);
      
      if (result.error) {
        Alert.alert('Erro', result.error.message || 'Não foi possível enviar o e-mail.');
      } else {
        Alert.alert(
          'E-mail enviado',
          'Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.',
          [{ text: 'OK', onPress: () => setAuthMode('login') }]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const handleGuestContinue = () => {
    router.replace('/(tabs)');
  };

  const handleCloseEmailModal = () => {
    setShowEmailConfirmModal(false);
    setRegisteredEmail('');
    // Resetar formulário e voltar para login
    resetForm();
    setAuthMode('login');
  };

  const handleGoToLogin = () => {
    setShowEmailConfirmModal(false);
    setRegisteredEmail('');
    resetForm();
    setAuthMode('login');
  };
  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login': return 'Bem-vindo de volta!';
      case 'register': return 'Criar nova conta';
      case 'forgot': return 'Recuperar senha';
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processando...';
    switch (authMode) {
      case 'login': return 'Entrar';
      case 'register': return 'Cadastrar';
      case 'forgot': return 'Enviar link';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              {/* Logo Section */}
              <View style={styles.logoSection}>
                <View style={[styles.logoContainer, { backgroundColor: colors.surface + 'E6' }]}>
                  <ShoppingBag size={48} color="#667EEA" />
                </View>
                <Text style={styles.appTitle}>ShopFly</Text>
                <Text style={styles.appSubtitle}>Seu shopping local na palma da mão</Text>
              </View>

              {/* Auth Form */}
              <View style={[styles.authContainer, { backgroundColor: colors.surface + 'F2' }]}>
                <Text style={[styles.welcomeText, { color: colors.text }]}>{getTitle()}</Text>
                
                <View style={styles.inputContainer}>
                  {/* Nome - apenas no cadastro */}
                  {authMode === 'register' && (
                    <View style={styles.inputGroup}>
                      <User size={20} color="#64748B" />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Nome completo"
                        value={formData.name}
                        onChangeText={(value) => updateFormData('name', value)}
                        autoCapitalize="words"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  )}

                  {/* E-mail */}
                  <View style={styles.inputGroup}>
                    <Mail size={20} color="#64748B" />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="E-mail"
                      value={formData.email}
                      onChangeText={(value) => updateFormData('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  {/* Telefone - apenas no cadastro */}
                  {authMode === 'register' && (
                    <View style={styles.inputGroup}>
                      <Phone size={20} color="#64748B" />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Telefone"
                        value={formData.phone}
                        onChangeText={(value) => updateFormData('phone', value)}
                        keyboardType="phone-pad"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  )}

                  {/* Cidade - apenas no cadastro */}
                  {authMode === 'register' && (
                    <View style={styles.inputGroup}>
                      <MapPin size={20} color="#64748B" />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Cidade"
                        value={formData.city}
                        onChangeText={(value) => updateFormData('city', value)}
                        autoCapitalize="words"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  )}

                  {/* Senha - não mostrar no esqueceu senha */}
                  {authMode !== 'forgot' && (
                    <View style={styles.inputGroup}>
                      <Lock size={20} color="#64748B" />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Senha"
                        value={formData.password}
                        onChangeText={(value) => updateFormData('password', value)}
                        secureTextEntry={!showPassword}
                        placeholderTextColor={colors.textSecondary}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="#64748B" />
                        ) : (
                          <Eye size={20} color="#64748B" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Confirmar senha - apenas no cadastro */}
                  {authMode === 'register' && (
                    <View style={styles.inputGroup}>
                      <Lock size={20} color="#64748B" />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Confirmar senha"
                        value={formData.confirmPassword}
                        onChangeText={(value) => updateFormData('confirmPassword', value)}
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor={colors.textSecondary}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeButton}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color="#64748B" />
                        ) : (
                          <Eye size={20} color="#64748B" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Esqueceu senha - apenas no login */}
                  {authMode === 'login' && (
                    <TouchableOpacity
                      style={styles.forgotPassword}
                      onPress={() => switchMode('forgot')}
                    >
                      <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                  )}

                  {/* Botão principal */}
                  <TouchableOpacity
                    style={[styles.authButton, loading && styles.authButtonDisabled]}
                    onPress={handleAuth}
                    disabled={loading}
                  >
                    <Text style={styles.authButtonText}>{getButtonText()}</Text>
                  </TouchableOpacity>

                  {/* Links de navegação */}
                  <View style={styles.navigationLinks}>
                    {authMode === 'login' && (
                      <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => switchMode('register')}
                      >
                        <Text style={styles.switchButtonText}>
                          Não tem uma conta? Cadastre-se
                        </Text>
                      </TouchableOpacity>
                    )}

                    {authMode === 'register' && (
                      <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => switchMode('login')}
                      >
                        <Text style={styles.switchButtonText}>
                          Já tem uma conta? Entre
                        </Text>
                      </TouchableOpacity>
                    )}

                    {authMode === 'forgot' && (
                      <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => switchMode('login')}
                      >
                        <Text style={styles.switchButtonText}>
                          Voltar para o login
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Guest Access - dentro do card */}
                  {(authMode === 'login' || authMode === 'register') && (
                    <View style={styles.guestSection}>
                      <TouchableOpacity
                        style={styles.guestLink}
                        onPress={handleGuestContinue}
                      >
                        <Text style={styles.guestLinkText}>Continuar como visitante</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 ShopFly. Todos os direitos reservados.</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* Email Confirmation Modal */}
      <Modal
        visible={showEmailConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseEmailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseEmailModal}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Icon */}
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIconBackground}>
                <Mail size={32} color="#3B82F6" />
              </View>
            </View>

            {/* Content */}
            <View style={styles.modalContentContainer}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Confirme seu e-mail
              </Text>
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                Enviamos um link de confirmação para:
              </Text>
              <Text style={[styles.modalEmail, { color: colors.primary }]}>
                {registeredEmail}
              </Text>
              <Text style={[styles.modalInstructions, { color: colors.textSecondary }]}>
                Clique no link do e-mail para ativar sua conta e fazer login.
              </Text>
              
              <View style={styles.modalTips}>
                <Text style={[styles.modalTipsTitle, { color: colors.text }]}>
                  💡 Dicas importantes:
                </Text>
                <Text style={[styles.modalTip, { color: colors.textSecondary }]}>
                  • Verifique sua caixa de entrada
                </Text>
                <Text style={[styles.modalTip, { color: colors.textSecondary }]}>
                  • Olhe também na pasta de spam
                </Text>
                <Text style={[styles.modalTip, { color: colors.textSecondary }]}>
                  • O link expira em 24 horas
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalPrimaryButton, { backgroundColor: colors.primary }]}
                onPress={handleGoToLogin}
              >
                <Text style={styles.modalPrimaryButtonText}>Ir para Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalSecondaryButton, { backgroundColor: colors.background }]}
                onPress={handleCloseEmailModal}
              >
                <Text style={[styles.modalSecondaryButtonText, { color: colors.textSecondary }]}>
                  Fechar
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
  },
  gradient: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
    minHeight: height - 100,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  authContainer: {
    borderRadius: 24,
    padding: 30,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 16,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: '#667EEA',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  authButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  navigationLinks: {
    alignItems: 'center',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: '600',
  },
  guestSection: {
    alignItems: 'center', 
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  guestLink: {
    paddingVertical: 8,
  },
  guestLinkText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    padding: 4,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInstructions: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalTips: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  modalTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalTip: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  modalActions: {
    width: '100%',
    gap: 12,
  },
  modalPrimaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSecondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});