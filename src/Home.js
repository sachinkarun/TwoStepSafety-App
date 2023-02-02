import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmergencyScreen from './emergency/Emergency';
import ContactScreen from './contacts/Contact';
import ProfileScreen from './profile/Profile';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
    return (
        <Tab.Navigator initialRouteName='Profile' screenOptions={{
            tabBarActiveTintColor: '#2A2934',
            tabBarInactiveTintColor:"#b9b9b9",
          }}>
            <Tab.Screen name="Emergency" component={EmergencyScreen} options={{
                headerShown:false,
                tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="map-marker-radius" color={color} size={27} />
          ),}}/>

            <Tab.Screen name="Contacts" component={ContactScreen} options={{
                headerShown:false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="book-account" color={color} size={27} />),
            }}/>

            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                headerTitle:"Profile",
                tabBarIcon: ({ color, size }) => (
                <Feather name="user" color={color} size={25} />),
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('setting')} style={{marginRight:30}}>
                        <Feather name="settings" color={"#2A2934"} size={25} />
                    </TouchableOpacity>
                  )}}/>
        </Tab.Navigator>
    )
}

export default Home
