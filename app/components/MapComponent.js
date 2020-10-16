import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { userReducer } from '../reducers/userReducer'
import CONFIG from '../config';
import axios from 'axios';
import { ActivityIndicator, Modal } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';


export default function HeatMap() {

    const token = useSelector(state => state.userReducer.authToken)
    const user = useSelector(state => state.userReducer.user)
    //const [contents, setContents] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [markers, setMarkers] = useState([])


    useEffect(() => {
        async function mapLoad() {
            // for the testing, i'm just going to load 3 specific
            // places in brisbane and have the map situated so that we start
            // by viewing those places
            await axios.get(`${CONFIG.API_URL}content`,
                { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    const tmpList = res.data.map(c => {
                        return  {name: c.name, description: c.description, latlng:
                        {latitude:c.lattitude,longitude:c.longitude}}
                    }).filter(m => m.name == "Uni tour" || m.name == "Pub Crawl")
                    setMarkers(tmpList)
                })
                .catch(res => {
                    console.log("map thingy failed, cause:" + res)
                })
        }
        mapLoad()
    }, [])

    const styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            height: 400,
            width: 400,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
    });
    return (
        <View style={styles.container}>
                <MapView
                    initialRegion={{
                        latitude: -27.4698,
                        longitude: 153.0251,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker.latlng}
                            title={marker.name}
                            description={marker.description}
                        />
                    ))}
                </MapView>
        </View>
    )
}

