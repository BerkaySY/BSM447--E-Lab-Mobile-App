import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './components/screens/WelcomeScreen'; 
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import GuideCreation from './components/admin/GuideCreation';
import PatientTracking from './components/admin/PatientTracking';
import PatientDetail from './components/admin/PatientDetail';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="WelcomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="GuideCreation" component={GuideCreation} />
        <Stack.Screen name="PatientTracking" component={PatientTracking} />
        <Stack.Screen name="PatientDetail" component={PatientDetail} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
