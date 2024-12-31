import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/shared/screens/Welcome';
import Login from './components/shared/screens/Login';
import AdminHome from './components/admin/screens/AdminHome';
import Guidelines from './components/admin/screens/Guidelines';
import PatientTracking from './components/admin/screens/PatientTracking';
import PatientDetail from './components/admin/screens/PatientDetail';
import EditUserProfile from './components/user/screens/EditUserProfile';
import UserHome from './components/user/screens/UserHome';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="WelcomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={Welcome} />
        <Stack.Screen name="LoginScreen" component={Login} />
        <Stack.Screen name="AdminHomeScreen" component={AdminHome} />
        <Stack.Screen name="GuidelinesScreen" component={Guidelines} />
        <Stack.Screen name="PatientTrackingScreen" component={PatientTracking} />
        <Stack.Screen name="PatientDetailScreen" component={PatientDetail} />
        <Stack.Screen name="EditUserProfileScreen" component={EditUserProfile} />
        <Stack.Screen name="UserHomeScreen" component={UserHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
