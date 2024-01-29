import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import * as Types from '../store/types';

function TeleopModal(props) {

    const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

    const addIntakeLocation = (location) => {
        let localMatchData = matchData;
        localMatchData.teleopActions.push(location);
        props.setCurrentMatchData(localMatchData);
        closeModal();
    }

    const closeModal = () => {
        props.openTeleopModal(false);
    }

    return (
        <Modal animationInTiming={50} animationIn='fadeIn' animationOutTiming={50} animationOut='fadeOut' style={{ alignItems: 'center', justifyContent: "center" }} isVisible={props.teleopModalReducer.isTeleopModalOpen}>
             <View style={autoStyles.ModalContent}>
                <View style={[autoStyles.Center]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[autoStyles.Font, { textAlign: 'center' }]}>Select Intake Location</Text>
                    </View>
                    <View style={{ flex: 3, flexDirection: "row", marginTop: -100, alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ padding: 10, alignItems: "center", justifyContent: "center", marginRight: 100 }}>
                            <TouchableOpacity style={autoStyles.ScoreButtonCube} onPress={() => addIntakeLocation("single_substation_cube")}>
                                <Text style={autoStyles.ButtonFont}>Single Substation</Text>
                                <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={autoStyles.ScoreButtonCube} onPress={() => addIntakeLocation("double_substation_cube")}>
                                <Text style={autoStyles.ButtonFont}>Double Substation</Text>
                                <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={autoStyles.ScoreButtonCube} onPress={() => addIntakeLocation("ground_cube")}>
                                <Text style={autoStyles.ButtonFont}>Ground Substation</Text>
                                <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 10, alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={autoStyles.ScoreButtonCone} onPress={() => addIntakeLocation("single_substation_cone")}>
                                <Text style={autoStyles.ButtonFont}>Single Substation</Text>
                                <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={autoStyles.ScoreButtonCone} onPress={() =>addIntakeLocation("double_substation_cone")}>
                                <Text style={autoStyles.ButtonFont}>Double Substation</Text>
                                <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={autoStyles.ScoreButtonCone} onPress={() => addIntakeLocation("ground_cone")}>
                                <Text style={autoStyles.ButtonFont}>Ground Substation</Text>
                                <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 0.5, width: "80%" }}>
                        <TouchableOpacity style={autoStyles.CancelButton} onPress={() => closeModal()}>
                            <Text style={autoStyles.ButtonFont}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
             </View>
        </Modal>
    )
}

const autoStyles = StyleSheet.create({
    ButtonFont: {
        color: 'white',
        fontSize: 25
    },
    Font: {
        fontFamily: 'Helvetica-Light',
        fontSize: 20
    },
    Center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    Left: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    ModalContent: {
      flex: 0.9,
      width: 900,
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 20
    },
    CancelButton: {
      flex: 1,
      backgroundColor: '#f74c4c',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#d63e3e',
      alignItems: "center",
      justifyContent: 'center',
    },
    SaveButton: {
      flex: 1,
      backgroundColor: '#2E8B57',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#006400',
    },
    ScoreButtonCube: {
      flex: 1,
      backgroundColor: 'purple',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#540a4d',
      alignItems: "center",
      padding: 10,
      marginBottom: 10,
      width: "150%"
    },
    ScoreButtonCone: {
        flex: 1,
        backgroundColor: '#e3d214',
        borderRadius: 15,
        borderBottomWidth: 5,
        borderColor: '#bdae0f',
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        width: "150%"
      },
    MissButton: {
      flex: 1,
      backgroundColor: '#E76316',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#C45E21'
    },
    AddStackButton: {
      flex: 1,
      backgroundColor: '#32CD32',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#13616d'
    },
    SubtractStackButton: {
      flex: 1,
      backgroundColor: '#d63e3e',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#13616d'
    },
    ScoreView: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 15,
      borderBottomWidth: 5,
      borderColor: '#13616d'
    },
    gamePieceIcon: {
      height: '60%',
      width: '60%',
      alignSelf: 'center'
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
    openTeleopModal: isVisible =>
      dispatch({
      type: Types.SET_TELEOP_MODAL,
      payload: {
          isVisible: isVisible,
      },
      }),     
  });
  const connectComponent = connect(mapStateToProps, mapDispatchToProps);
  export default connectComponent(TeleopModal);