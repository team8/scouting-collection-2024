import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ImageBackground} from "react-native";
import {Button, ButtonGroup, Slider} from 'react-native-elements';
import { connect } from "react-redux";
import * as Types from "../store/types";
import stage from "../stage";
import { useNavigation } from '@react-navigation/native';

function Endgame(props) {
    const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));
    const alliance = props.eventReducer.alliance;
    const [endgameStatus, setEndgameStatus] = useState("");
    const [traps, setTraps] = useState(0);
    const [endgameIndex, setEndgameIndex] = useState(0);
    const [endgameActions, setEndgameActions] = useState([]);
    const [failedTraps, setFailedTraps] = useState(0);
    const [endGameText, setEndGameText] = useState(["N/A", "Parked", "Climb", "Harmony"]);
    const navigation = useNavigation();

    const navigate = () => {
        props.setCurrentMatchData(matchData);
        matchData.climbStatus = endgameIndex
        matchData.failedTraps = failedTraps
        matchData.traps = traps
        navigation.navigate('postmatch')
    }

    const undo = () => {
        let editList = endgameActions;
        editList.pop();
        setEndgameActions(editList);
        calculatePieces();
        // props.setCurrentMatchData(localMatchData);
    }

    const calculatePieces = () => {
        let calcTraps = 0
        let calcFailedTraps = 0

        for (let i=0; i<endgameActions.length; i++) {
            if (endgameActions[i] == "Failed") {
                calcFailedTraps++;
            }
            else {
                calcTraps++;
            }
        }

        setFailedTraps(calcFailedTraps);
        setTraps(calcTraps);
    }

    const updateFailedTraps = () => {
        setFailedTraps(failedTraps+1);
        setEndgameActions([...endgameActions, "Failed"])
    }

    const updateTraps = () => {
        setTraps(traps+1);
        setEndgameActions([...endgameActions, "Successful"])
    }

    const updateEndgameStatus = (index) => {
        setEndgameIndex(index);
        setEndgameStatus(index);
    }

    useEffect(() => {
        setTraps(matchData.traps)
        setFailedTraps(matchData.failedTraps)
        setEndgameStatus(matchData.climbStatus)
        navigation.setOptions({
            title: `Endgame | ${matchData.team}`
        })
    }, [])


    return (
        <View style={{flexDirection:'row', height:"100%", width:"100%"}}>

            <ImageBackground style={{flex: 1, height: "100%", width:"90%"}} source={stage[alliance]}></ImageBackground>

            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    width:"50%"
                }}>

                <View style={{flexDirection:"row", marginBottom:30, marginRight: 65}}>
                    <View style={{justifyContent:"center", alignItems:"center"}}>
                        <Text style={{ fontSize: 20, marginRight: 10 }}>Traps:</Text>
                        <Text style={{ fontSize: 20, marginRight: 10 }}>Failed Traps:</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 20 }}>{traps}</Text>
                        <Text style={{ fontSize: 20 }}>{failedTraps}</Text>
                    </View>
                </View>


                <View style={{flexDirection:"row", marginBottom: 40, marginRight: 10}}>
                    <TouchableOpacity style={[endgameStyles.FailedTrapButton, { width: 300, marginBottom: 10 }]} onPress={() => updateFailedTraps()}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Failed Trap</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[endgameStyles.SuccessfulTrapButton, { width: 300, marginBottom: 10 }]} onPress={() => updateTraps()}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Trap</Text>
                    </TouchableOpacity>
                </View>

                <ButtonGroup

                    onPress={updateEndgameStatus}
                    selectedIndex={endgameIndex}
                    buttons={endGameText}
                    buttonStyle={endgameStyles.ButtonGroup}
                    containerStyle={{height: 50, alignSelf:'center', marginRight: 54}}
                    selectedButtonStyle={{ backgroundColor: '#24a2b6', borderBottomColor: '#188191' }}
                />

                <View style={{flexDirection:"row", paddingTop: 100, width:"42%", alignItems:"center"}}>
                    <TouchableOpacity style={[endgameStyles.UndoButton]} onPress={() => undo()}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Undo</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row", paddingTop: 10, width:"42%", alignItems:"center"}}>
                    <TouchableOpacity style={[endgameStyles.NextButton]} onPress={() => navigate()}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Finish Match</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>

    );
        }

const endgameStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: "row",
    },
    NextButton: {
        flex: 1,
        backgroundColor: "#2E8B57",
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: "#006400",
        alignItems: "center",
        justifyContent: "center",
        width: 300,
        height: 100,
    },
    SuccessfulTrapButton: {
        flex: 1,
        backgroundColor: "#2E8B57",
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: "#006400",
        alignItems: "center",
        justifyContent: "center",
        width: 300,
        height: 100,
        marginRight: 40,
    },
    FailedTrapButton: {
        flex: 1,
        backgroundColor: '#c71a1a',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: "#821919",
        alignItems: "center",
        justifyContent: "center",
        height: 100,
        width: 300,
        marginRight: 40,
    },
    UndoButton: {
        flex: 1,
        backgroundColor: '#ffae19',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: '#c98302',
        alignItems: "center",
        justifyContent: "center",
        height: 100,
    },
    PrematchFont: {
        fontFamily: 'Helvetica-Light',
        fontSize: 20
    },
    PrematchButtonFont: {
        color: 'white',
        fontSize: 25
    },
    ButtonGroup: {
    }
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
export default connectComponent(Endgame);