import React,{ useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import RegisterScreen from './src/auth/Register';
import LoginScreen from './src/auth/Login';
import HomeScreen from './src/Home';
import SettingScreen from './src/profile/Setting';
import AddContactScreen from './src/contacts/AddContact';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  if(initializing){
    return(
      <View style={{flex:1, backgroundColor:'#ffffff', justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color="#2A2934"/>
      </View>
    )
  }

  if(user){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="home" component={HomeScreen} options={{headerShown:false}}/>
          <Stack.Screen name="add" component={AddContactScreen} options={{headerTitle:"Add Contacts"}}/>
          <Stack.Screen name="setting" component={SettingScreen} options={{headerTitle:"Settings"}}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown:false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown:false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;