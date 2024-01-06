import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity } from "react-native";
import { ButtonGroup, Slider } from 'react-native-elements';
import { connect } from "react-redux";
import * as Types from "../store/types";
import { useNavigation } from '@react-navigation/native';


function Postmatch(props) {
    const [notes, setNotes] = useState("");
    const [chargeNotes, setChargeNotes] = useState("");
    const [robotDied, setRobotDied] = useState(false);
    const [robotTipped, setRobotTipped] = useState(false);
    const [charge, setCharge] = useState(0);
    const [driverRating, setDriverRating] = useState(0);
    const [defenseRating, setDefenseRating] = useState(0);
    const [cubeIntakeRating, setCubeIntakeRating] = useState(0);
    const [coneIntakeRating, setConeIntakeRating] = useState(0);

    const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

    const endGameText = ["N/A", "Parked", "Docked", "Engaged"];

    const navigation = useNavigation(); 

    useEffect(() => {
        navigation.setOptions({
            title: `Postmatch | ${matchData.team}`
        })
    })

    const updateCharge = (index) => {
        setCharge(index);
    }

    const compile_data = () => {
        if (notes == "" || chargeNotes == "") {
            alert("Please fill in all the notes.");
            return;
        }
        matchData.notes = notes.replace(/ /g, '>').replace(/,/g, '<');
        matchData.chargeNotes = chargeNotes.replace(/ /g, '>').replace(/,/g, '<');
        matchData.died = robotDied;
        matchData.endgameChargeStation = endGameText[charge];
        matchData.tipped = robotTipped;
        matchData.driverRating = driverRating;
        matchData.defenseRating = defenseRating;
        matchData.cubeIntakeRating = cubeIntakeRating;
        matchData.coneIntakeRating = coneIntakeRating;
        props.setCurrentMatchData(matchData);
        navigation.navigate("qrcode");
    }

    return (
        <View style={{ flex: 1, marginHorizontal: 40 }}>
            <View style={postmatchStyles.Row}>
                <Text style={[postmatchStyles.Font, {fontSize: 22, flex: 0.15}]}>Notes</Text>
                <View style={[postmatchStyles.InputContainer, {flex: 0.9}]}>
                    <TextInput
                        style={postmatchStyles.TextInputContainer}
                        placeholder="Topics to Note: Ease of intaking game pieces, speed of cycles, unique aspects of robot (good or bad), etc.. Max Char: 200"
                        multiline={true}
                        maxLength = {200}
                        onChangeText={(text) => setNotes(text)}
                    />
                </View>
            </View>
            <View style={postmatchStyles.Row}>
                <Text style={[postmatchStyles.Font, {fontSize: 22, flex: 0.15}]}>Charge Notes</Text>
                <View style={[postmatchStyles.InputContainer, {flex: 0.65}]}>
                    <TextInput
                        style={postmatchStyles.TextInputContainer}
                        placeholder="Topics to Note: Time at which robot began climbing, ease of assisted climb, why robot failed, etc.. Max Char: 150"
                        multiline={true}
                        maxLength = {150}
                        onChangeText={(text) => setChargeNotes(text)}
                    />
                </View>
                <View style={{flex: 0.1, marginLeft: 25}}>
                    <Text style={[postmatchStyles.Font, {fontSize: 16, flex: 0.3}]}>Robot Died</Text>
                    <Switch
                        style={{flex: 0.7}}
                        onValueChange={(value) => setRobotDied(value)}
                        value={robotDied}
                    />
                </View>
                <View style={{flex: 0.1, marginLeft: 25}}>
                    <Text style={[postmatchStyles.Font, {fontSize: 16, flex: 0.3}]}>Tipped</Text>
                    <Switch
                        style={{flex: 0.7}}
                        onValueChange = {(value) => setRobotTipped(value)}
                        value={robotTipped}
                    />
                </View>
            </View>
            <View style={[postmatchStyles.Row, {marginTop: 10}]}>
                <View style={{flex: 1}}>
                <ButtonGroup 
                    onPress={updateCharge}
                    selectedIndex={charge}
                    buttons={endGameText}
                    buttonStyle={postmatchStyles.ButtonGroup}
                    containerStyle={{height: 50}}
                    selectedButtonStyle={{backgroundColor: '#24a2b6', borderBottomColor: '#188191'}}
                    />
                </View>
            </View>
            <View style={postmatchStyles.Row}>
                <Text style={[postmatchStyles.LabelText, postmatchStyles.Font, {fontSize: 22, marginTop: 10, flex: 0.1}]}>Driving</Text>
                <View style={{flex: 0.4, alignItems: 'stretch'}}>
                    <Slider
                        thumbTintColor='#24a2b6'
                        value={driverRating}
                        onValueChange={(driverRating) => setDriverRating(driverRating)} 
                    />
                    <Text>{Math.round(driverRating*5)}</Text>
                </View>
                <Text style={[postmatchStyles.LabelText, postmatchStyles.Font, {fontSize: 22, marginTop: 10, flex: 0.1}]}>Defense</Text>
                <View style={{flex: 0.4, alignItems: 'stretch'}}>
                    <Slider
                        thumbTintColor='#24a2b6'
                        value={defenseRating}
                        onValueChange={(defenseRating) => setDefenseRating(defenseRating)} 
                    />
                    <Text>{Math.round(defenseRating*6)-1 == -1 ? 'N/a' : Math.round(defenseRating*6)-1}</Text>
                </View>
            </View>
            <View style={postmatchStyles.Row}>
                <Text style={[postmatchStyles.LabelText, postmatchStyles.Font, {fontSize: 22, marginTop: 10, flex: 0.1}]}>Cube Intake</Text>
                <View style={{flex: 0.4, alignItems: 'stretch'}}>
                    <Slider
                        thumbTintColor='#24a2b6'
                        value={cubeIntakeRating}
                        onValueChange={(intakeRating) => setCubeIntakeRating(intakeRating)} />
                    <Text>{Math.round(cubeIntakeRating*6)-1 == -1 ? 'N/a' : Math.round(cubeIntakeRating*6)-1}</Text>
                </View>
                <Text style={[postmatchStyles.LabelText, postmatchStyles.Font, {fontSize: 22, marginTop: 10, flex: 0.1}]}>Cone Intake</Text>
                <View style={{flex: 0.4, alignItems: 'stretch'}}>
                    <Slider
                        thumbTintColor='#24a2b6'
                        value={coneIntakeRating}
                        onValueChange={(intakeRating) => setConeIntakeRating(intakeRating)} />
                    <Text>{Math.round(coneIntakeRating*6)-1 == -1 ? 'N/a' : Math.round(coneIntakeRating*6)-1}</Text>
                </View>
            </View>
            <View style={[postmatchStyles.Row, {height: 100 }]}>
                <TouchableOpacity style={[postmatchStyles.NextButton, {marginHorizontal: 60, marginBottom:25}]} onPress={() => compile_data()}>
                    <View style={postmatchStyles.Center}>
                        <Text style={[postmatchStyles.Font, postmatchStyles.ButtonFont]}>Continue to QRCode</Text>
                    </View> 
                </TouchableOpacity>
            </View>
        </View>
    )
}

const postmatchStyles = StyleSheet.create({
    Row: {
        flexDirection: 'row',
        marginTop: 15,
        padding: 10
    },
    Font: {
        fontFamily: 'Helvetica-Light',
        fontSize: 25,
    },
    InputContainer: {
        height: 130,
        paddingLeft: 20,
        borderWidth: 2,
        borderColor: '#d4d4d4',
    },
    LabelText: {
        marginLeft: 10
    },
    NextButton: {
        flex: 1,
        backgroundColor: '#2E8B57',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: '#006400'
    },
    Center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonFont: {
        color: 'white',
        fontSize: 25
    },
})

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => ({
  setCurrentMatchData: (newMatchData) =>
    dispatch({
      type: Types.SET_CURRENT_MATCH_DATA,
      payload: {
        newMatchData,
      },
    }),
});
const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(Postmatch);