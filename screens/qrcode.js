import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { connect } from 'react-redux';
import * as Types from '../store/types';
import { useNavigation } from '@react-navigation/native';
import { encodeStringData } from '../utilities/encode';
import QRCode from 'react-native-qrcode-svg';
import { ListItem } from "react-native-elements";

function QRCodeScreen(props) {
    const [qrString, setQrString] = useState("");

    let matchData = {...props.eventReducer.currentMatchData, 'event': props.eventReducer.currentEvent};
    console.log(matchData)
    //console.log(JSON.parse(JSON.stringify(encodeStringData(matchData))))
    
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: `QR Code | ${matchData.team}`
        })
        encode();
        return;
    }, [])

    const encode = () => {
        let codeData = matchData;
        //console.log(matchData);
        let localQrString = encodeStringData(codeData);
        setQrString(localQrString)
    }

    const navigate = async () => {
        var allMatches = props.eventReducer.matches;
        var matchNum = parseInt(matchData.matchNo.substring(1));
        var currentMatch = allMatches[matchNum - 1]
        var newMatch = { ...currentMatch, scouted: true, scouter: matchData.scouter }
        var newMatches = [...allMatches];
        newMatches[matchNum - 1] = newMatch;

        props.setEvent(newMatches);
        navigation.navigate('Match List');
    }

    return (

        <View style={qrcodeStyles.MainContainer}>


            <View style={{ width: '100%', flexDirection: 'row', flex: 1, borderColor: 'red', borderWidth: 0 }}>

                <View style={{ flex: 0.4, borderColor: 'purple', borderWidth: 0, flexDirection: "column" }}>
                    {/* qr code */}
                    <View style={{ flex: 0.7, borderColor: 'green', borderWidth: 0,  }}>
                        <View style={{ borderWidth: 0, borderColor: '#d4d4d4', height: '100%', alignSelf:'center', justifyContent:'center' }}>
                            {qrString != "" && <QRCode
                                value={qrString}
                                size={400}
                            />
                            }

                        </View>

                    </View>

                    {/* Next button */}
                    <View style={{ flex: 0.3, borderColor: 'blue', borderWidth: 0, justifyContent:'center' }}>
                        <TouchableOpacity style={[qrcodeStyles.NextButton, { justifyContent: 'center', marginLeft:'5%', marginRight:'5%' }]} onPress={() => 
                            Alert.alert('Wait!', 'Did Your Qrcode Get Scanned?', [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                },
                                {text: 'Yes', onPress: () => navigate()},
                              ])
                            
                            }><Text style={[{ alignSelf: 'center', color: 'white' }, qrcodeStyles.ButtonFont]}>Finish</Text></TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 0.6, borderColor: 'orange', borderWidth: 0 }}>
                    {/* Data view */}
                    <View style={{ borderColor: 'yellow', borderWidth: 0, flexDirection: 'column', marginLeft:'5%' }}>
                        <View style={{alignSelf:'center'}}>
                            <Text style={[qrcodeStyles.Font, {}]}>Data</Text>
                        </View>
                        <View style={{}}>
                            <ScrollView style={{borderColor: 'grey', borderWidth: 0, height:'95%'}}>
                                {Object.keys(matchData).map((key) => {

                                    return (
                                        <View key={key} style={[qrcodeStyles.Border, {}]}>
                                            <ListItem key={key} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title>{key}</ListItem.Title>
                                                </ListItem.Content>
                                                <Text>{JSON.stringify(matchData[key]).replace(/</g, ',').replace(/>/g, ' ')}</Text>
                                            </ListItem>

                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>

                    </View>
                </View>
            </View>

        </View>
    )
}

const qrcodeStyles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 30
    },
    Border: {
        borderWidth: 2.5,
        borderColor: '#d4d4d4',
        margin: 3,
        padding: 4
    },
    NextButton: {
        backgroundColor: '#2E8B57',
        borderRadius: '7%',
        borderBottomWidth: 5,
        borderColor: '#006400',
        padding: '5%'


    },
    Center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Font: {
        fontFamily: 'Helvetica-Light',
        fontSize: 25,
    },
    ButtonFont: {
        color: 'white',
        fontSize: 25
    },
    LabelText: {
        marginRight: 20,
    },
})

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => ({
    setEvent: eventData =>
        dispatch({
            type: Types.SET_EVENT,
            payload: {
                eventData,
            },
        })
});
const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(QRCodeScreen);