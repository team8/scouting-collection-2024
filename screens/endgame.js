import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Types from '../store/types';
import stage from '../stage';
import { useNavigation } from '@react-navigation/native';

function Endgame(props) {
    const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));
    const alliance = props.eventReducer.alliance;


    const [traps, setTraps] = useState(0);
    const [failedTraps, setFailedTraps] = useState(0);

    const [climbStatus, setClimbStatus] = useState(0);
    const [endgameActions, setEndgameActions] = useState([]);
    const endgameText = ['N/A', 'Parked', 'Climb', 'Harmony'];
    const navigation = useNavigation();

    const navigate = () => {
        matchData.traps = traps;
        matchData.failedTraps = failedTraps;
        matchData.climbStatus = endgameText[climbStatus];
        props.setCurrentMatchData(matchData);
        navigation.navigate('postmatch');
    }

    const undo = () => {
        switch(endgameActions[endgameActions.length-1]) {
            case 'trap': setTraps(traps-1); break;
            case 'failedTrap': setFailedTraps(failedTraps-1); break;
            default: if(endgameActions.length != 0 ) console.log('Invalid action undone in endgame');
        }

        let temp = endgameActions;
        temp.splice(endgameActions.length-1, 1)
        setEndgameActions(temp);
        // props.setCurrentMatchData(localMatchData);
    }

    const addAction = (action) => {
        let temp = endgameActions;
        temp.push(action);

        switch(action) {
            case 'trap': setTraps(traps+1); break;
            case 'failedTrap': setFailedTraps(failedTraps+1); break;
            default: console.log('Invalid action added in endgame');
        }
        setEndgameActions(temp);
    }

    const updateClimbStatus = (index) => {
        setClimbStatus(index);
    }

    useEffect(() => {
        navigation.setOptions({
            title: `Endgame | ${matchData.team}`
        })
    }, [])


    return (
        <View style={{flexDirection:'row', flex: 1}}>

            <ImageBackground style={{flex: 1, height: '100%', width:'100%' }} source={stage[alliance]}></ImageBackground>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }}>

                <View style={{flex: 0.3, alignItems: 'center', margin: 20 }}>
                    <Text style={{ fontSize: 20 }}>Traps: {traps}</Text>
                    <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Traps: {failedTraps}</Text>
                </View>

                <View style={{alignItems: 'stretch', flexDirection: 'row', marginVertical: 40, marginHorizontal: 40}}>
                    <TouchableOpacity style={[endgameStyles.SuccessfulTrapButton, { width: 300, marginBottom: 10 }]} onPress={() => addAction('trap')}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Trap</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[endgameStyles.FailedTrapButton, { width: 300, marginBottom: 10 }]} onPress={() => addAction('failedTrap')}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Failed Trap</Text>
                    </TouchableOpacity>
                </View>

                <ButtonGroup
                    onPress={setClimbStatus}
                    selectedIndex={climbStatus}
                    buttons={endgameText}
                    buttonStyle={endgameStyles.ButtonGroup}
                    containerStyle={{height: 50}}
                    selectedButtonStyle={{ backgroundColor: '#24a2b6', borderBottomColor: '#188191' }}
                />

                <View style={{ flexDirection:'row', paddingTop: 70, width:'42%' }}>
                    <TouchableOpacity style={[endgameStyles.UndoButton]} onPress={() => undo()}>
                        <Text style={[endgameStyles.PrematchFont, endgameStyles.PrematchButtonFont]}>Undo</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection:'row', paddingTop: 10, width:'42%' }}>
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
        flexDirection: 'row',
        flexDirection: 'row',
    },
    NextButton: {
        flex: 1,
        backgroundColor: '#2E8B57',
        backgroundColor: '#2E8B57',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: '#006400',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#006400',
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 100,
    },
    SuccessfulTrapButton: {
        flex: 1,
        backgroundColor: '#2E8B57',
        backgroundColor: '#2E8B57',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: '#006400',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#006400',
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 100,
        marginRight: 40,
    },
    FailedTrapButton: {
        flex: 1,
        backgroundColor: '#c71a1a',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: '#821919',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#821919',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width: 300,
    },
    UndoButton: {
        flex: 1,
        backgroundColor: '#ffae19',
        borderRadius: 7,
        borderBottomWidth: 5,
        borderColor: '#c98302',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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