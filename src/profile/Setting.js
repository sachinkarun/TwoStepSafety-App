import React,{ useState, useRef } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-number-input';

const Setting = () => {
    const [yourPhone, setyourPhone] = useState("");
    const [yourMessage, setyourMessage] = useState("");
    const phoneInput = useRef(null);

    const updateData = async() => {
        if(yourPhone.length === 0 && yourMessage.length === 0){
            Alert.alert("Input fields are empty.");
            return;
        }

        let obj = {}
        if(yourPhone.length > 0 && yourMessage.length > 0){
            obj = {
                phone: yourPhone,
                message: yourMessage
            }
        }
        else if(yourPhone.length > 0){
            obj = {
                phone: yourPhone
            }
        }
        else if(yourMessage.length > 0){
            obj = {
                message: yourMessage
            }
        }

        await firestore()
            .collection('users')
            .doc(auth().currentUser.email)
            .update({
                ...obj,
            })
            .then(() => {
                setyourPhone("")
                setyourMessage("")
                Alert.alert("Information Updated!")
            });
    }

    const logout = () => {
        auth()
        .signOut()
        .then(() => Alert.alert('User signed out!'));
    }

    return (
        <View style={styles.container}>

            <View style={{marginVertical:15}}></View>
            <PhoneInput
                ref={phoneInput}
                defaultValue={yourPhone}
                defaultCode="IN"
                layout="first"
                withShadow
                textContainerStyle={{ paddingVertical: 0 }}
                onChangeFormattedText={(text) => setyourPhone(text)}
            />

            <TextInput placeholder="Write your message" style={styles.message} multiline={true} value={yourMessage} onChangeText={(text) => setyourMessage(text)}/>

            <TouchableOpacity style={styles.btn} onPress={() => updateData()}>
                <Text style={styles.txt}>Save Information</Text>
            </TouchableOpacity>

            <View style={styles.line}></View>

            <TouchableOpacity style={styles.btn} onPress={() => logout()}>
                <Text style={styles.txt}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:"#fff",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
    },
    txt:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold"
    },
    input:{
        width:"85%",
        backgroundColor:"#f1f1f4",
        padding:15,
        marginTop:15,
        borderRadius:10
    },
    message:{
        width:"85%",
        backgroundColor:"#f1f1f4",
        padding:15,
        marginTop:15,
        borderRadius:10,
        height:150,
        textAlignVertical:"top"
    },
    btn:{
        width:"85%",
        backgroundColor:"#2A2934",
        paddingVertical:12,
        borderRadius:25,
        marginTop:15,
    },
    line:{
        width:"80%",
        height:1,
        backgroundColor:"#2A2934",
        margin:20
    }
})

export default Setting
