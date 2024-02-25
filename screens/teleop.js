import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import * as Types from '../store/types';
import { useNavigation } from '@react-navigation/native';
import outtakeImages from '../outtake-images';
import ShotSuccessModal from '../components/shotSuccessModal';


function Teleop(props) {
  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

  const [speakerNotes, setSpeakerNotes] = useState(0);
  const [amplifiedSpeakerNotes, setAmplifiedSpeakerNotes] = useState(0);
  const [ampNotes, setAmpNotes] = useState(0);

  const [failedSpeakerNotes, setFailedSpeakerNotes] = useState(0);
  const [failedAmpNotes, setFailedAmpNotes] = useState(0);


  const [shotModalVisible, setShotModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const [teleopActions, setTeleopActions] = useState([]);

  const alliance = props.eventReducer.alliance;
  const allianceBorderColor = (alliance === 'red') ? '#d10000' : '#0000d1';
  const ampColor = (alliance === 'red') ? '#DA4A19' : '#34BFA1';
  const ampBorderColor = (alliance === 'red') ? '#C03D25' : '#289E85';

  const fieldOrientation = props.eventReducer.fieldOrientation;

  const navigation = useNavigation();

 

  useEffect(() => {
    navigation.setOptions({
      title: `Teleop | ${matchData.team}`
    })
  }, [])

  const navigate = () => {
    matchData.teleopSpeakerNotes = speakerNotes;
    matchData.amplifiedSpeakerNotes = amplifiedSpeakerNotes;
    matchData.teleopAmpNotes = ampNotes;
    matchData.teleopFailedSpeakerNotes = failedSpeakerNotes;
    matchData.teleopFailedAmpNotes = failedAmpNotes;
    props.setCurrentMatchData(matchData);
    navigation.navigate('endgame');
  }

  const undo = () => {
    
    if (teleopActions.length != 0) 
    switch(teleopActions[teleopActions.length-1]) {
      case 'teleopSpeaker': setSpeakerNotes(speakerNotes-1); break;
      case 'teleopAmplifiedSpeaker': setAmplifiedSpeakerNotes(amplifiedSpeakerNotes-1); break;
      case 'teleopAmp': setAmpNotes(ampNotes-1); break;
      case 'teleopFailedSpeaker': setFailedSpeakerNotes(failedSpeakerNotes-1); break;
      case 'teleopFailedAmp': setFailedAmpNotes(failedAmpNotes-1); break;
      default: console.log('Invalid action undone in teleop');
    }

    teleopActions.pop();
  }

  const addAction = (action) => {
    let temp = teleopActions;
    temp.push(action);

    switch(action) {
      case 'teleopSpeaker': setSpeakerNotes(speakerNotes+1); break;
      case 'teleopAmplifiedSpeaker': setAmplifiedSpeakerNotes(amplifiedSpeakerNotes+1); break;
      case 'teleopAmp': setAmpNotes(ampNotes+1); break;
      case 'teleopFailedSpeaker': setFailedSpeakerNotes(failedSpeakerNotes+1); break;
      case 'teleopFailedAmp': setFailedAmpNotes(failedAmpNotes+1); break;
      default: console.log('Invalid action added in teleop');
    }
    
    setTeleopActions(temp);
  }

  return (
    <View style={teleopStyles.mainContainer}>

      <ShotSuccessModal 
      shotModalVisible={shotModalVisible} 
      setShotModalVisible={setShotModalVisible} 
      matchPhase='teleop' modalType={modalType} 
      teleopActions={teleopActions} 
      setTeleopActions={setTeleopActions}
      addAction={addAction}
      />

      {(fieldOrientation == 1) &&
      <ImageBackground
        style={{ flex: 1 }}
        source={outtakeImages[fieldOrientation][alliance]}
      ></ImageBackground>
      }

      {/* empty column */}
      <View style={{ flex: 1 }}>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',

          }}
        >


          <View style={{ flex: 0.3, margin: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Speaker Notes: {failedSpeakerNotes}</Text>
            <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Amp Notes: {failedAmpNotes}</Text>
          </View>
          <View style={{ flex: 0.3, alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Speaker Notes: {speakerNotes + matchData.autoSpeakerNotes}</Text>
            <Text style={{ fontSize: 20 }}>Amp Notes: {ampNotes + matchData.autoAmpNotes}</Text>
            <Text style={{ fontSize: 20, color: '#10b53e' }}>Amplified Speaker Notes: {amplifiedSpeakerNotes}</Text>
          </View>

        </View>

        <View
          style={{
            flex: 1.1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,
          }}
        >
          <TouchableOpacity style={[teleopStyles.SpeakerButton, { width: 300, marginBottom: 10, backgroundColor: alliance, borderColor: allianceBorderColor }]}
            onPress={() => {
            setShotModalVisible(!shotModalVisible);
            setModalType('Speaker');
          }}>
            <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Speaker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[teleopStyles.AmpButton, { width: 300, marginBottom: 10, backgroundColor: ampColor, borderColor: ampBorderColor }]} 
          onPress={() => {
            setModalType('Amp');
            setShotModalVisible(!shotModalVisible);
          }}>
            <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont ]}>Amp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[teleopStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
            <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[teleopStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
            <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Continue to Endgame</Text>
          </TouchableOpacity>

        </View>
      </View>

      {(fieldOrientation == 2) &&
      <ImageBackground
        style={{ flex: 1 }}
        source={outtakeImages[fieldOrientation][alliance]}
      ></ImageBackground>
      }

    </View>
  );
}


const teleopStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    width: '33%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'black',
    flex: 1,
    justifyContent: 'center'
  },
  gamePieceIcon: {
    height: '60%',
    width: '60%',
    alignSelf: 'center'
  },
  NextButton: {
    flex: 1,
    backgroundColor: '#2E8B57',
    borderRadius: 7,
    borderBottomWidth: 5,
    borderColor: '#006400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  UndoButton: {
    flex: 1,
    backgroundColor: '#ffae19',
    borderRadius: 7,
    borderBottomWidth: 5,
    borderColor: '#c98302',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SpeakerButton: {
    flex: 1,
    borderRadius: 7,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AmpButton: {
    flex: 1,
    borderRadius: 7,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PrematchFont: {
    fontFamily: 'Helvetica-Light',
    fontSize: 20
  },
  PrematchButtonFont: {
    color: 'white',
    fontSize: 25
  },//yo wsg if u readin this u a tru g :))))
  //thx bruh :)))
});

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
export default connectComponent(Teleop);
