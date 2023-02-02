import React,{ useState, useEffect } from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const Profile = () => {
    const [locationOn, setLocationOn] = useState(true);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const addTask = (title, description, contacts) => {
        const newTask = {title, description, contacts};
        axios.post("http://192.168.43.15:3001/request", newTask)
        .then(()=>{
            console.log("Task Added");
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const showLocation = (value) => {
        setLocationOn(value)
        if(value){
            Geolocation.getCurrentPosition(info => {
                setLatitude(info.coords.latitude);
                setLongitude(info.coords.longitude);
            });
        }
    }

    const getData = async() => {
        const user = auth().currentUser;
        setEmail(user.email);

        if (user) {
            await firestore()
            .collection('users')
            .doc(user.email)
            .onSnapshot(documentSnapshot => {
                const {name, phone, message} = documentSnapshot.data()
                setName(name);
                setPhone(phone);
                setMessage(message);
            })
        }
    }

    const sendEmailAndMessage = (contacts) => {
        let time = new Date().toLocaleString();
        let title = `${name} is in emergency`;
        let description = `${message} Time: ${time}. Check location here: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}  or open app from more information.`;
        if((latitude.length === 0 && longitude.length === 0) || locationOn === false){
            let desc = `${message} Time: ${time}.`
            addTask(title, desc, contacts)
        }
        else{
            addTask(title, description, contacts)
        }
        Alert.alert("Information sent successfully");

        if(locationOn === true && (latitude.length === 0 || longitude.length === 0)){
            Alert.alert("Please turn on the GPS from your device and refresh it again to send location.");
        }

        contacts.map((contact) => {
                    firestore()
                    .collection('users')
                    .doc(contact.email)
                    .get()
                    .then(documentSnapshot => {
                        if (documentSnapshot.exists) {
                            firestore()
                            .collection('users')
                            .doc(contact.email)
                            .collection('emergency')
                            .doc(email)
                            .set({
                                latitude: latitude,
                                longitude: longitude,
                                time: new Date().toLocaleString(),
                                userData: {name: name, email: email, phone: phone ,description : description}
                            })
                        }
                    })
                })
    }

    const sendInfo = async() => {
        
        const contacts = [];

        await firestore()
            .collection('users')
            .doc(email)
            .collection("contacts")
            .get()
            .then((userList) => {
                userList.docs.map((currEle) => {
                    contacts.push(currEle.data());
                })
            })
            .then(() => {
                sendEmailAndMessage(contacts);
            })
    }

    useEffect(() =>{
        getData();
        showLocation(true);
    },[])

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} backgroundColor={"#ffffff"} />

            <Text style={styles.info}>{name}</Text>
            <Text style={styles.info}>{phone}</Text>
            <Text style={styles.info}>{email}</Text>

            <View style={styles.location}>

                <TouchableOpacity style={locationOn ? styles.locationOn : styles.locationOff} onPress={() => showLocation(true)}>
                    <Text style={locationOn ? styles.locationBtn : styles.locationBtn2}>Location On</Text>
                </TouchableOpacity>
                <TouchableOpacity style={locationOn ? styles.locationOff : styles.locationOn} onPress={() => showLocation(false)}>
                    <Text style={locationOn ? styles.locationBtn2 : styles.locationBtn}>Location Off</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.userLocation}>
                <TouchableOpacity style={styles.refresh} onPress={() => showLocation(true)}>
                    <Text style={styles.refreshTxt}>Refresh</Text>
                </TouchableOpacity>

                {locationOn && latitude && longitude ? 
                    <TouchableOpacity onPress={() => {
                        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
                    }}>
                        <MaterialCommunityIcons name="google-maps" color={"#2A2934"} size={47} />
                    </TouchableOpacity>
                : null}
            </View>

            <View style={styles.message}>
                <ScrollView>
                    <Text style={{paddingVertical:10, paddingHorizontal:15}}>
                        {message}
                    </Text>
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.btn1} onPress={() => {
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=nearby police station`)
            }}>
                <Text style={styles.txt1}>Nearby Police Station</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn2} onPress={() => sendInfo()}>
                <Text style={styles.txt2}>Send Information</Text>
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
    info:{
        color:"#2A2934",
        fontSize:18,
        fontWeight:"bold"
    },
    location:{
        display:"flex",
        flexDirection:"row",
        backgroundColor:"#f1f1f4",
        marginTop:15,
        padding:10,
        borderRadius:25
    },
    userLocation:{
        display:"flex",
        flexDirection:"row"
    },
    locationOn:{
        paddingVertical:5,
        paddingHorizontal:15,
        backgroundColor:"#2A2934",
        borderRadius:20
    },
    locationOff:{
        paddingVertical:5,
        paddingHorizontal:15,
    },
    locationBtn:{
        color:"#ffffff",
        fontWeight:"bold"
    },
    locationBtn2:{
        color:"#2A2934",
        fontWeight:"bold"
    },
    message:{
        width:"85%",
        height:"25%",
        backgroundColor:"#f1f1f4",
        marginBottom:20,
        borderRadius:15,
    },
    btn1:{
        width:"83%",
        borderWidth:2,
        borderColor:"#2A2934",
        paddingVertical:12,
        borderRadius:25,
        marginBottom:10
    },
    btn2:{
        width:"83%",
        backgroundColor:"#2A2934",
        paddingVertical:12,
        borderRadius:25,
        borderWidth:2,
        borderColor:"#2A2934",
    },
    txt1:{
        color:"#2A2934",
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold"
    },
    txt2:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold"
    },
    refresh:{
        paddingHorizontal:15,
        paddingVertical:10,
        backgroundColor:"#2A2934",
        borderRadius:25,
        margin:10
    },
    refreshTxt:{
        color:"#ffffff",
        fontWeight:"bold",
        textAlign:"center"
    }
})

export default Profile
