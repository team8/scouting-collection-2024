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
import IntakeLocationModal from '../components/intakeLocationModal';

function Teleop(props) {
  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

  const [speakerNotes, setSpeakerNotes] = useState(0);
  const [ampNotes, setAmpNotes] = useState(0);

  const [failedSpeakerNotes, setFailedSpeakerNotes] = useState(0);
  const [failedAmpNotes, setFailedAmpNotes] = useState(0);



  const [shotModalVisible, setShotModalVisible] = useState(false);
  const [intakeModalVisible, setIntakeModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const [teleopActions, setTeleopActions] = useState([]);

  const [groundIntakes, setGroundIntakes] = useState(0);
  const [substationIntakes, setSubstationIntakes] = useState(0);;
  const [coordinatesList, setCoordinatesList] = useState([]);

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

  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {

    let heatmapTemp = []
    for (let i = 0; i < 10; i++) {
      heatmapTemp.push([])
      for (let j = 0; j < 10; j++) {
        heatmapTemp[i].push(0)
      }
    }
    setHeatmap(heatmapTemp)
  }, [])



  const navigate = () => {
    matchData.teleopSpeakerNotes = speakerNotes;
    matchData.teleopAmpNotes = ampNotes;
    matchData.teleopFailedSpeakerNotes = failedSpeakerNotes;
    matchData.teleopFailedAmpNotes = failedAmpNotes;
    matchData.teleopCoordinatesList = coordinatesList;
    matchData.groundIntakes = groundIntakes;
    matchData.substationIntakes = substationIntakes;
    matchData.teleopActions = teleopActions;
    props.setCurrentMatchData(matchData);

    navigation.navigate('endgame');
  }

  const undo = () => {
    if(teleopActions.length == 0) return;

    switch (teleopActions[teleopActions.length - 1]) {
      case 'teleopSpeaker': setSpeakerNotes(speakerNotes - 1); 
      setCoordinatesList(coordinatesList.splice(coordinatesList.length-1, 1)); break;
      case 'teleopAmp': setAmpNotes(ampNotes - 1); break;
      case 'teleopFailedSpeaker': setFailedSpeakerNotes(failedSpeakerNotes - 1); 
      setCoordinatesList(coordinatesList.splice(coordinatesList.length-1, 1)); break;
      case 'teleopFailedAmp': setFailedAmpNotes(failedAmpNotes - 1); break;
      case 'groundIntake': setGroundIntakes(groundIntakes - 1); break;
      case 'substationIntake': setSubstationIntakes(substationIntakes - 1); break;
      default: if (teleopActions.length != 0) console.log('Wrong teleopAction has been undone');
    }
    
    let temp = teleopActions;
    temp.splice(teleopActions.length-1, 1)
    setTeleopActions(temp);
  }

  const addIntakeLocation = (location) => {
    // let localMatchData = matchData;
    // localMatchData.teleopActions.push(location);

    if (location == "ground") setGroundIntakes(groundIntakes + 1);
    else setSubstationIntakes(substationIntakes + 1);


    // props.setCurrentMatchData(localMatchData);
    setIntakeModalVisible(false);

    let temp = teleopActions;
    temp.push(location + "Intake");
    setTeleopActions(temp);;
  }

  const addAction = (action) => {
    let temp = teleopActions;
    temp.push(action);

    switch (action) {
      case 'teleopSpeaker': setSpeakerNotes(speakerNotes + 1); break;
      case 'teleopAmp': setAmpNotes(ampNotes + 1); break;
      case 'teleopFailedSpeaker': setFailedSpeakerNotes(failedSpeakerNotes + 1); break;
      case 'teleopFailedAmp': setFailedAmpNotes(failedAmpNotes + 1); break;
      default: console.log('Invalid action added in teleop');
    }

    setTeleopActions(temp);
  }

  return (
    <View style={teleopStyles.mainContainer}>

      <IntakeLocationModal
        intakeModalVisible={intakeModalVisible}
        setIntakeModalVisible={setIntakeModalVisible}
        addIntakeLocation={addIntakeLocation}
      />

      <ShotSuccessModal
        shotModalVisible={shotModalVisible}
        setShotModalVisible={setShotModalVisible}
        matchPhase='teleop' modalType={modalType}
        fieldOrientation={fieldOrientation}
        teleopActions={teleopActions}
        setTeleopActions={setTeleopActions}
        addAction={addAction}
        coordinatesList={coordinatesList}
        setCoordinatesList={setCoordinatesList}
      />


      {/* <Text style={{alignSelf: (fieldOrientation == 1) ? "flex-start": "flex-end"}}>Test</Text> */}





      <ImageBackground
        style={{ flex: 0.7, justifyContent: 'center', alignSelf: fieldOrientation == 1 ? "flex-start" : "flex-end" }}
        source={outtakeImages[fieldOrientation][alliance]}
      >


        <View style={{ width: "100%", alignSelf: "center" }}>
          {heatmap && [...Array(heatmap.length).keys()].map((y) => {


            return (
              <View style={{ flexDirection: 'row', width: "100%", height: "10%" }}>
                {heatmap[y] && [...Array(heatmap[y].length).keys()].map((x) => {

                  return (
                    <TouchableOpacity style={{ width: "10%", }} onPress={() => {
                      setModalType('Speaker'); //This is redundant but eh whatever
                      let temp = coordinatesList;

                      if(fieldOrientation == 1) temp[coordinatesList.length] = [9-x, 9-y]; //Make coordinates consistent regardless of field orientation
                      else if(fieldOrientation == 2) temp[coordinatesList.length] = [x, y];

                      setCoordinatesList(temp);
                      setShotModalVisible(!shotModalVisible);

                    }}>
                      <Text></Text>
                      {/* ^ Do not remove the empty text - we need to trick the button into thinking it has a child for it to work properly */}
                    </TouchableOpacity>
                  )
                })}


              </View>
            )

          })}
        </View>
      </ImageBackground>


      <View style={{ flex: 0.3 }}
        addIntakeLocation={addIntakeLocation}
        intakeModalVisible={intakeModalVisible}
        setIntakeModalVisible={setIntakeModalVisible}
      >


        {/* empty column */}
        <View style={{ flex: 1 }}>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >

            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Speaker Notes: {failedSpeakerNotes + matchData.autoFailedSpeakerNotes}</Text>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Amp Notes: {failedAmpNotes + matchData.autoFailedAmpNotes}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 20 }}>Speaker Notes: {speakerNotes + matchData.autoSpeakerNotes}</Text>
              <Text style={{ fontSize: 20 }}>Amp Notes: {ampNotes + matchData.autoAmpNotes}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 20 }}>Ground Intakes: {groundIntakes}</Text>
              <Text style={{ fontSize: 20 }}>Substation Intakes: {substationIntakes}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1.4,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 10,
              paddingHorizontal: 19
            }}
          >
            <TouchableOpacity style={[teleopStyles.IntakeButton, { width: 300, marginBottom: 10, backgroundColor: alliance, borderColor: allianceBorderColor }]} onPress={() => { setIntakeModalVisible(true) }}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Intake</Text>
            </TouchableOpacity>

            <View style={{flex: 1.5, flexDirection: "row"}}>
              <TouchableOpacity style={[teleopStyles.AmpButton, { marginBottom: 10, backgroundColor: ampColor, borderBottomColor: ampBorderColor }]} onPress={() => {
              addAction("teleopAmp");
              }}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont, {textAlign: "center"}]}>{"Success.\nAmp"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[teleopStyles.AmpButton, { marginBottom: 10, backgroundColor: ampColor, borderBottomColor: ampBorderColor }]} onPress={() => {
              addAction("teleopFailedAmp");
              }}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont, {textAlign: "center"}]}>{"Failed\nAmp"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[teleopStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Undo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[teleopStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Continue to Endgame</Text>
            </TouchableOpacity>

          </View>
        </View>



      </View>
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
      marginHorizontal: 10
  },
    IntakeButton: {
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

