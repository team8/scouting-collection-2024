import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import {connect} from 'react-redux';
import * as Types from '../store/types';
import fieldImages from '../field.js';

let startingPositions = require('../assets/button_settings/starting_positions.json');

function Prematch(props) {
    const [name, setName] = useState("");
    const [predWinner, setPredWinner] = useState("red");
    const [currentRobotPositionName, setCurrentRobotPositionName] = useState("");
    const [fieldOrientation, setFieldOrientation] = useState(props.eventReducer.fieldOrientation);
    const [isEnabled, setIsEnabled] = useState(false);

    const navigation = useNavigation(); 
    const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));
    const alliance = props.eventReducer.alliance;
    var startingPositionSettings = fieldOrientation === 1 ? startingPositions.two_blue : startingPositions.one_blue;

    if (alliance == "red") {
        startingPositionSettings = fieldOrientation === 1 ? startingPositions.two_red : startingPositions.one_red;
    }

    useEffect(() => {
        navigation.setOptions({
            title: `Prematch | ${matchData.team}`
        })
    }, [])

    const toggleSwitch = () => {
        if (predWinner === "blue") {
            setPredWinner("blue");
        } else {
            setPredWinner("red");
        }
        setIsEnabled(!isEnabled);
    }

    const capitaliseFirstLetter = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const toggleFieldOrientation = () => {
        setFieldOrientation(1+Number(!(fieldOrientation-1)));

        //minus 1, so it should be 1 or 0, switch from 1->0 or 0->1 via "not" operator, add 1 again
    }
    
    

    const navigate = () => {
        if (!name || !currentRobotPositionName) {
            alert("Please fill in all the information before proceeding.");
            return;
        }
        let localMatchData = matchData || {};
        localMatchData.scouter = name || "";
        localMatchData.startingPosition = currentRobotPositionName;
        localMatchData.predictedWinner = predWinner;
        localMatchData.intakeLocations = [];
        localMatchData.mobility = false;
        props.setCurrentMatchData(localMatchData);
        props.setFieldOrientationRedux(fieldOrientation);
        navigation.navigate('auto')
    }
    

    return (
        <View style={{ flex: 1, backgroundColor: '#eaeaea', paddingLeft: 60, paddingRight: 20 }}>
             <View style={prematchStyles.InputContainer}>
                <View style={prematchStyles.Row}>
                    <TextInput
                        style={[prematchStyles.Font, { borderBottomWidth: 3, borderBottomColor: '#d4d4d4', flex: 1,}]}
                        placeholder="Scouter Name, Ex: Buca Depepo"
                        onChangeText={(text) => setName(text)}
                    />
                    <Switch
                        trackColor={{true: 'blue', false: 'red'}}
                        ios_backgroundColor="red"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{ marginLeft: 10 }}
                    />
                </View>
             </View>
             <View style={[prematchStyles.FieldContainer, prematchStyles.Row]}>
                <View style={{ flex: 0.56, borderWidth: 4, borderColor: '#d4d4d4', height: "120%" }}>
                    <ImageBackground style={prematchStyles.Field} source={fieldImages[fieldOrientation][alliance]}>
                        {startingPositionSettings.map((pos, i) => (
                                <TouchableOpacity
                                 key={i}
                                 style={[prematchStyles.Clicky, { position: 'absolute', borderRadius: 5, borderWidth: 3, borderColor: 'transparent', left: pos.left, right: pos.right, top: pos.top, padding: pos.padding, paddingLeft: pos.paddingLeft, paddingRight: pos.paddingRight},
                                 (pos.name == currentRobotPositionName) && prematchStyles.Highlighted
                                ]}
                                 onPress={() => setCurrentRobotPositionName(pos.name)}
                                >
                               </TouchableOpacity>
                            ))}
                    </ImageBackground>
                </View>
                <View style={{ flex: 0.4, marginLeft: 50, marginBottom: -50}}>
                    <View style={{ flex: 0.7, alignItems: 'center' }}>
                        <Text style={[prematchStyles.Font, { fontWeight: 'bold' }]}>Starting Position</Text>
                        <Text style={[prematchStyles.Font, { fontSize: 23 } ]}>{capitaliseFirstLetter(currentRobotPositionName)}</Text>
                    </View>
                    <View style={{ flex: 0.3 }}>
                        <TouchableOpacity style={[prematchStyles.NextButton, { backgroundColor: '#ffae19', borderColor: '#c98302', marginBottom: 10 }]} onPress={() => toggleFieldOrientation()}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[prematchStyles.Font, prematchStyles.ButtonFont]}>Toggle Field Orientation</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={prematchStyles.NextButton} onPress={() => navigate()}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[prematchStyles.Font, prematchStyles.ButtonFont]}>Begin Match</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
             </View>
        </View>
    )
}

const prematchStyles = StyleSheet.create({
    Clicky: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex:1
    },
    Font: {
      fontFamily: 'Helvetica-Light',
      fontSize: 20
    },
    InputContainer: {
      height: 130,
      paddingLeft: 20,
      marginBottom: -80,
    },
    FieldContainer: {
      flex: 2,
      marginBottom: 60,
      marginTop: 50,
    },
    Row: {
      flexDirection: 'row',
      marginTop: 25,
    },
    LabelText: {
      marginRight: 20,
    },
    TextInputContainer: {
      borderBottomWidth: 3,
      borderBottomColor: '#d4d4d4',
      flex: 0.7
    },
    ButtonFont: {
      color: 'white',
      fontSize: 25
    },
    Field: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'contain',
    },
    Highlighted: {
      borderColor: 'yellow'
    },
    NextButton: {
      flex: 1,
      backgroundColor: '#2E8B57',
      borderRadius: 7,
      borderBottomWidth: 5,
      borderColor: '#006400'
    }
})

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    setCurrentMatchData: newMatchData =>
    dispatch({
      type: Types.SET_CURRENT_MATCH_DATA,
      payload: {
        newMatchData,
      },
    }),
    setFieldOrientationRedux: fieldOrientation =>
    dispatch({
      type: Types.SET_FIELD_ORIENTATION,
      payload: {
        fieldOrientation,
      },
    }),
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(Prematch);