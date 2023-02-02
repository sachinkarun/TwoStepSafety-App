import React,{ useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Alert, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Contact = ({ navigation }) => {
    const [refreshList, setRefreshList] = useState(false);
    const [contactList, setContactList] = useState([]);

    useEffect(()=>{
        getContactList();
    },[]);

    const onRefreshList = () => {
        setRefreshList(true)
        getContactList();
        setRefreshList(false)
    }

    const getContactList = async() => {
        setContactList([]);
        const users = await firestore().collection('users').doc(auth().currentUser.email).collection("contacts").get();
        users.docs.map((user) => {
            setContactList(prevUsers => [...prevUsers, user.data()]);
        })

    }

    const options = (docData) => {
        Alert.alert('Options', '', [
            {
            text: 'Call',
            onPress: () => {Linking.openURL(`tel:${docData.phone}`)},
            },
            {text: 'Delete', onPress: () => {deleteContact(docData)}},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        ])
    }

    const deleteContact = (docData) =>
        Alert.alert('Remove from contact list', 'Are you sure that you want remove this user from your contact list? You can add this user again anytime you want.', [
            {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
            },
            {text: 'OK', onPress: () => {
                firestore()
                .collection('users')
                .doc(auth().currentUser.email)
                .collection('contacts')
                .doc(docData.email)
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
                console.log('OK Pressed')
            }},
        ]
    )

    return (
        <View style={styles.container}>
                <Text style={{textAlign:'center', margin:15}}>Your message and location will be sent to these contacts</Text>

                <FlatList
                    data={contactList}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshList}
                        onRefresh={onRefreshList}
                    />}
                    renderItem={({item}) => 
                        <View style={styles.listItem}>
                            <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            </View>

                            <TouchableOpacity onPress={() => options(item)}>
                                <MaterialCommunityIcons name="dots-vertical" color={"#2A2934"} size={27} />
                            </TouchableOpacity>

                        </View>
                    }
                    keyExtractor={(item) => item.email}
                />

                <View style={{margin:15}}></View>

                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('add')}>
                    <Text style={styles.plus}>Add <MaterialCommunityIcons name="pencil-outline" color={"#ffffff"} size={22} /></Text>
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:"#ffffff",
        display:"flex",
        flexDirection:"column"
    },
    listItem:{
        width:"85%",
        backgroundColor:"#f1f1f4",
        borderRadius:20,
        padding:20,
        marginVertical:10,
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    name:{
        color: "#2A2934",
        fontSize:20,
        fontWeight:"bold"
    },
    email:{
        color: "#2A2934",
        fontSize:17,
        fontWeight:"500"
    },
    addBtn:{
        borderRadius:30,
        backgroundColor:"#2A2934",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        position:"absolute",
        bottom:20,
        right:30
    },
    plus:{
        fontSize:20,
        fontWeight:"bold",
        color:"#ffffff",
        paddingVertical:10,
        paddingHorizontal:20
    }
})

export default Contact
