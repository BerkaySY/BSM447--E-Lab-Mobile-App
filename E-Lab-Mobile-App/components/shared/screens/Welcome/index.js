import { Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

const Welcome = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#ff2e2e', '#87cefa']} // Kırmızı ve açık mavi arka plan gradyanı
      style={styles.container}
    >
      {/* Logo ve Title Kısmı*/}
      <Image
        source={require('../../../../assets/labLogo.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Berkay LAB</Text>
      <Text style={styles.welcomeText}>Hoş geldiniz</Text>

      {/*Giriş yapma formuna yönlendirme */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')} 
      >
        <LinearGradient
          colors={['#d32f2f', '#ff5252']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Welcome;