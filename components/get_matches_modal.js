import React, {useState} from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pullMatches} from '../utilities/TBA_interactor';

import * as Types from '../store/types';

function GetMatchesModal(props) {
    const [eventKey, setEventKey] = useState('');

    const saveEvent = async () => {
    try {
      var matches = await AsyncStorage.getItem(eventKey);
      var allianceColor;
      // if (matches == null) {
        if (eventKey.match(/B/)) {
          allianceColor = 'blue';
        } else if (eventKey.match(/R/)) {
          allianceColor = 'red';
        }
        props.setAlliance(allianceColor);
        var data = await pullMatches(eventKey);
        props.setEvent(data);
        props.setReduxEventKey(eventKey);
        if (data != null) {
          try {
            await AsyncStorage.setItem(eventKey, JSON.stringify(data));
            alert(`Successfully saved ${eventKey} match data.`);
          } catch (e) {
            alert(e);
          }
          try {
            await AsyncStorage.setItem("currentEvent", eventKey);
          } catch (e) {
            alert(e);
          }
          try {
            await AsyncStorage.setItem("alliance", allianceColor);
          } catch (e) {
            alert(e);
          }
        }
        props.matchesModal(false)
    } catch (e) {
      alert(e);
    }
    // AsyncStorage.clear();
  };

    return (
        <Modal
          animationInTiming={50}
          animationIn="fadeIn"
          animationOutTiming={50}
          style={{alignItems: 'center', marginTop: -200}}
          isVisible={props.matchesModalReducer.isMatchesModalOpen}>
          <View style={getMatchModalStyles.ModalContent}>
            <View style={getMatchModalStyles.InputContainer}>
              <View style={getMatchModalStyles.Row}>
                <Text
                  style={[
                    getMatchModalStyles.LabelText,
                    getMatchModalStyles.Font,
                    {fontSize: 22},
                  ]}>
                  Event
                </Text>
                <View style={getMatchModalStyles.TextInputContainer}>
                  <TextInput
                    style={[getMatchModalStyles.Font, {flex: 1}]}
                    placeholder="2020utwvB1"
                    onChangeText={text => setEventKey(text)}
                  />
                </View>
              </View>
            </View>
            <View style={{flex: 0.8, paddingHorizontal: 40, flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  getMatchModalStyles.UndoButton,
                  {marginHorizontal: 30, marginBottom: 25},
                ]}
                onPress={() => props.matchesModal(false)}
                >
                <View style={getMatchModalStyles.Center}>
                  <Text
                    style={[
                      getMatchModalStyles.Font,
                      getMatchModalStyles.ButtonFont,
                    ]}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  getMatchModalStyles.NextButton,
                  {marginHorizontal: 30, marginBottom: 25},
                ]}
                onPress={() => saveEvent()}
                >
                <View style={getMatchModalStyles.Center}>
                  <Text
                    style={[
                      getMatchModalStyles.Font,
                      getMatchModalStyles.ButtonFont,
                    ]}>
                    Save
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
}

const getMatchModalStyles = StyleSheet.create({
    ModalContent: {
      flex: 0.3,
      width: 600,
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    InputContainer: {
      height: 100,
      paddingLeft: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    Row: {
      flexDirection: 'row',
      marginTop: 25,
    },
    LabelText: {
      marginRight: 20,
    },
    Font: {
      fontFamily: 'Helvetica-Light',
      fontSize: 25,
    },
    ButtonFont: {
      color: 'white',
      fontSize: 25,
    },
    TextInputContainer: {
      borderBottomWidth: 3,
      borderBottomColor: '#d4d4d4',
      flex: 0.7,
    },
    UndoButton: {
      flex: 1,
      backgroundColor: '#ffae19',
      borderRadius: 7,
      borderBottomWidth: 5,
      borderColor: '#c98302',
    },
    Center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    NextButton: {
      flex: 1,
      backgroundColor: '#2E8B57',
      borderRadius: 7,
      borderBottomWidth: 5,
      borderColor: '#006400',
    },
});

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    matchesModal: isVisible =>
      dispatch({
        type: Types.MATCHES_MODAL,
        payload: {
          isVisible,
        },
      }),
    setAlliance: color =>
      dispatch({
        type: Types.SET_ALLIANCE_COLOR,
        payload: {
          color,
        },
      }),
      setEvent: eventData =>
      dispatch({
        type: Types.SET_EVENT,
        payload: {
          eventData,
        },
      }),
      setReduxEventKey: reduxEventKey =>
      dispatch({
        type: Types.SET_CURRENT_EVENT_KEY,
        payload: {
          reduxEventKey,
        },
      }),
  });
const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(GetMatchesModal);