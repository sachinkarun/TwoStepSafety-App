import React,{ useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-number-input';

const AddContact = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const phoneInput = useRef(null);

    const saveContactUser = () => {
        if(name.length === 0 || email.length === 0 && phone.length === 0){
            Alert.alert("Please fill all the details.")
            return;
        }

        firestore()
        .collection('users')
        .doc(auth().currentUser.email)
        .collection("contacts")
        .doc(email)
        .set({
            name: name,
            email: email,
            phone: phone
        })
        .then(() => {
            setName("");
            setEmail("");
            setPhone("");
            Alert.alert('User added!');
        });
    }

    return (
        <View style={styles.container}>
            <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={(text) => setName(text)}/>
            <TextInput placeholder="Email Address" keyboardType="email-address" style={styles.input2} value={email} onChangeText={(text) => setEmail(text)}/>

            <PhoneInput
                ref={phoneInput}
                defaultValue={phone}
                defaultCode="IN"
                layout="first"
                withShadow
                textContainerStyle={{ paddingVertical: 0 }}
                onChangeFormattedText={text => {
                setPhone(text);
                }}
            />

            <TouchableOpacity style={styles.btn} onPress={() => saveContactUser()}>
                <Text style={styles.txt}>Save Information</Text>
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
        alignItems:"center"
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
    input2:{
        width:"85%",
        backgroundColor:"#f1f1f4",
        padding:15,
        marginVertical:15,
        borderRadius:10
    },
    btn:{
        width:"85%",
        backgroundColor:"#2A2934",
        paddingVertical:12,
        borderRadius:25,
        marginTop:15,
    }
})

export default AddContact
