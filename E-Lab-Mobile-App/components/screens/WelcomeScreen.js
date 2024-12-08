import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#ff2e2e', '#87cefa']} // Kırmızı ve açık mavi arka plan gradyanı
      style={styles.container}
    >
      {/* Logo ve Title Kısmı*/}
      <Image
        source={require('../../assets/labLogo.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Berkay LAB</Text>
      <Text style={styles.welcomeText}>Hoş geldiniz</Text>

      {/*Giriş yapma formuna yönlendirme */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} 
      >
        <LinearGradient
          colors={['#d32f2f', '#ff5252']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Kayıt formuna yönlendirme */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <LinearGradient
          colors={['#42a5f5', '#90caf9']} 
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

export default WelcomeScreen;