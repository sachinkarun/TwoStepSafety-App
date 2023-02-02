import React, { useState, useEffect } from 'react';
import { Text, View, Linking, StyleSheet, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Emergency = () => {
    const [list, setList] = useState([]);
    const [refreshList, setRefreshList] = useState(false);

    const getList = async() => {
        setList([]);
        const user = auth().currentUser;
        const users = await firestore()
        .collection('users')
        .doc(user.email)
        .collection('emergency')
        .get();

        users.docs.map((user) => {
            setList(prevList => [...prevList, user.data()]);
        })
    }

    const showDetails = (data) => {
        Alert.alert(`Name: ${data.userData.name}`, `Message: ${data.userData.description}\n\n Email: ${data.userData.email}\n Time: ${data.time}\n Phone Number: ${data.userData.phone}`, [
            {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
            },
            {text: 'Clear this widget from here', onPress: () => {
                firestore()
                .collection('users')
                .doc(auth().currentUser.email)
                .collection('emergency')
                .doc(data.userData.email)
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
                console.log('OK Pressed')
            }},
        ]);
    }

    const onRefreshList = () => {
        setRefreshList(true)
        getList();
        setRefreshList(false)
    }

    useEffect(() => {
        getList();
    }, [])

    if(list.length === 0){
        return(
            <View style={styles.container}>
                <Text style={{textAlign:'center', marginTop:15}}>All emergency requests and locations can be seen here.</Text>
                <Text style={{marginVertical:10}}>Right now, The list is empty!</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={{textAlign:'center', margin:15}}>All emergency requests and locations can be seen here.</Text>

            <FlatList
                data={list}
                refreshControl={
                    <RefreshControl
                    refreshing={refreshList}
                    onRefresh={onRefreshList}
                />}
                renderItem={({item}) => 
                <View style={styles.emergency}>
                    <Image source={require('./locationimage.jpeg')} style={styles.img} />

                    <View style={styles.line}></View>

                    <View style={styles.btnContainer}>
                        <TouchableOpacity>
                            <Text style={styles.txt2} onPress={() => showDetails(item)}>Show Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={styles.txt1} onPress={() => {
                                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`)
                                }}>Show Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }/>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#ffffff",
        width:"100%",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
    },
    emergency:{
        backgroundColor:"#f1f1f4",
        alignItems:"center",
        borderRadius:15,
        marginTop:20
    },
    img:{
        width:"90%",
        height:120,
        borderRadius:15,
        marginVertical:10
    },
    line:{
        width:"88%",
        height:1,
        backgroundColor:"#2A2934"
    },
    btnContainer:{
        width:"90%",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-evenly",
        paddingVertical:5
    },
    txt1:{
        paddingVertical:8,
        paddingHorizontal:15,
        color:"#fff",
        backgroundColor:"#2A2934",
        borderRadius:10,
        fontWeight:"500",
        marginVertical:7
    },
    txt2:{
        paddingVertical:7,
        paddingHorizontal:15,
        color:"#2A2934",
        fontWeight:"500",
        marginVertical:7,
        borderWidth:1,
        borderColor:"#2A2934",
        borderRadius:10,
    }
})

export default Emergency
