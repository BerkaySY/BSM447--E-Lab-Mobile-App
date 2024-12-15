import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './components/screens/WelcomeScreen'; 
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import AdminHomeScreen from './components/admin/AdminHomeScreen';
import UserDashboard from './components/user/UserDashboard';
import GuidelinesScreen from './components/admin/GuideLinesScreen';
import PatientTrackingScreen from './components/admin/PatientTrackingScreen';
import PatientDetailScreen from './components/admin/PatientDetailScreen';
import AddGuidelineScreen from './components/admin/AddGuidelineScreen';
import EditGuidelineScreen from './components/admin/EditGuidelineScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="WelcomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
        <Stack.Screen name="GuidelinesScreen" component={GuidelinesScreen} />
        <Stack.Screen name="PatientTrackingScreen" component={PatientTrackingScreen} />
        <Stack.Screen name="PatientDetailScreen" component={PatientDetailScreen} />
        <Stack.Screen name="AddGuidelineScreen" component={AddGuidelineScreen} />
        <Stack.Screen name="EditGuidelineScreen" component={EditGuidelineScreen} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
