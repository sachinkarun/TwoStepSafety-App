import React,{ useState } from "react";
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
    const [user, setUser] = useState({
        email:'',
        password:''
    })

    const login = () => {
        auth().signInWithEmailAndPassword(user.email, user.password)
            .then(() => {
                console.log("Logged in")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return(
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} backgroundColor={"#ffffff"} />

            <Text style={{color:"#2A2934", fontWeight:'bold', fontSize:35}}>Hello!</Text>
            <Text style={{color:"#2A2934", fontWeight:'bold', fontSize:20}}>Please login to continue</Text>
         
            <View style={styles.login}>
                <View style={styles.input}>
                    <TextInput placeholder="Email" keyboardType="email-address" style={{color:"#2A2934"}} value={user.email} onChangeText={(txt) => setUser({...user, email:txt})} />
                </View>

                <View style={styles.input}>
                    <TextInput placeholder="Password" style={{color:"#2A2934"}} value={user.password} onChangeText={(txt) => setUser({...user, password:txt})} />
                </View>

                <TouchableOpacity style={styles.btn} onPress={() => login()}>
                    <Text style={{color:"#fff", fontWeight:'bold', fontSize:20}}>Login</Text>
                </TouchableOpacity>


                <View style={{marginTop:20, flexDirection:'row'}}>
                    <Text style={{fontWeight:'bold', color:"#2A2934"}}>Don't have an Account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{fontWeight:'bold', color:'tomato'}}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        backgroundColor:"#ffffff",
        paddingHorizontal:30
    },
    login: {
        width:"100%",
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
    },
    input: {
        width:"100%",
        height:45,
        borderWidth:1,
        borderColor:"#e3e2e9",
        marginTop:15,
        borderRadius:13,
        paddingHorizontal:20
    },
    btn: {
        width:"100%",
        height:50,
        backgroundColor:"#2A2934",
        borderRadius:13,
        marginTop:50,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default Login