import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
import * as Types from '../store/types';
import Blink from '../components/blink';
import { useNavigation } from '@react-navigation/native';
import outtakeImages from '../outtake-images';
import ShotSuccessModal from '../components/shotSuccessModal';
import ShotLocationModal from '../components/shotLocationModal';


function Auto(props) {
  const [speakerNotes, setSpeakerNotes] = useState(0);
  const [ampNotes, setAmpNotes] = useState(0);

  const [failedSpeakerNotes, setFailedSpeakerNotes] = useState(0);
  const [failedAmpNotes, setFailedAmpNotes] = useState(0);

  const [mobility, setMobility] = useState(false);

  const [shotModalVisible, setShotModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [shotLocationModalVisible, setShotLocationModalVisible] = useState(false)

  const [autoActions, setAutoActions] = useState([]);
  const [coordinatesList, setCoordinatesList] = useState([]);


  const [heatmap, setHeatmap] = useState([]);


  const alliance = props.eventReducer.alliance;
  const allianceBorderColor = (alliance === 'red') ? '#d10000' : '#0000d1';
  const ampColor = (alliance === 'red') ? '#DA4A19' : '#34BFA1';
  const ampBorderColor = (alliance === 'red') ? '#C03D25' : '#289E85';

  const fieldOrientation = props.eventReducer.fieldOrientation;

  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

  const navigation = useNavigation();




  useEffect(() => {
    navigation.setOptions({
      title: `Auto | ${matchData.team}`
    })
  }, [])
  useEffect(() => {

    var heatmapTemp = []
    for (var i = 0; i < 10; i++) {
      heatmapTemp.push([])
      for (var j = 0; j < 10; j++) {
        heatmapTemp[i].push(0)
      }
    }
    console.log(heatmapTemp)
    setHeatmap(heatmapTemp)
  }, [])

  const navigate = () => {
    matchData.speakerNotes = speakerNotes;
    matchData.ampNotes = ampNotes;
    matchData.mobility = mobility;
    matchData.autoFailedSpeakerNotes = failedSpeakerNotes;
    matchData.autoFailedAmpNotes = failedAmpNotes;
    matchData.autoCoordinatesList = coordinatesList;
    props.setCurrentMatchData(matchData);
    navigation.navigate('teleop');
  }

  const undo = () => {
    switch (autoActions[autoActions.length - 1]) {
      case 'autoSpeaker': setSpeakerNotes(speakerNotes - 1); break;
      case 'autoAmp': setAmpNotes(ampNotes - 1); break;
      case 'autoFailedSpeaker': setFailedSpeakerNotes(failedSpeakerNotes - 1); break;
      case 'autoFailedAmp': setFailedAmpNotes(failedAmpNotes - 1); break;
      default: if (autoActions.length != 0) console.log('Wrong autoAction has been undone');
    }

    autoActions.pop();
  }

  const addAction = (action) => {
    let temp = autoActions;
    temp.push(action);

    switch (action) {
      case 'autoSpeaker': setSpeakerNotes(speakerNotes + 1); break;
      case 'autoAmp': setAmpNotes(ampNotes + 1); break;
      case 'autoFailedSpeaker': setFailedSpeakerNotes(failedSpeakerNotes + 1); break;
      case 'autoFailedAmp': setFailedAmpNotes(failedAmpNotes + 1); break;
    }
    setAutoActions(temp);
  }

  const ScoringButtons = () => {
    return (
      <>
        <TouchableOpacity style={[autoStyles.SpeakerButton, { width: 300, marginBottom: 10, backgroundColor: alliance, borderColor: allianceBorderColor, }]}
          onPress={() => {
            setShotModalVisible(!shotModalVisible);
            setModalType('Speaker');
            setShotLocationModalVisible(!shotLocationModalVisible)
          }}>
          <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[autoStyles.AmpButton, { width: 300, marginBottom: 10, backgroundColor: ampColor, borderColor: ampBorderColor }]}
          onPress={() => {
            setModalType('Amp');
            setShotModalVisible(!shotModalVisible);
            setShotLocationModalVisible(!shotLocationModalVisible);
          }}>
          <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Amp</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={autoStyles.mainContainer}>

      <ShotSuccessModal
        shotModalVisible={shotModalVisible}
        setShotModalVisible={setShotModalVisible}
        matchPhase='auto' modalType={modalType}
        autoActions={autoActions}
        setAutoActions={setAutoActions}
        addAction={addAction}
      />

      <ShotLocationModal
        shotLocationModalVisible={shotLocationModalVisible}
        setShotLocationModalVisible={setShotLocationModalVisible}
        speakerButtonStyle={[autoStyles.SpeakerButton, { width: 300, marginBottom: 10, backgroundColor: alliance, borderColor: allianceBorderColor, height: 100 }]}
        ScoringButtons={ScoringButtons}
        coordinatesList={coordinatesList}
        setCoordinatesList={setCoordinatesList}

      />

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
                    <TouchableOpacity style={{ borderColor: "black", borderWidth: 0, width: "10%", }} onPress={() => {
                      console.log([x, y])
                      setCoordinatesList([...coordinatesList, [x, y]])
                      setShotLocationModalVisible(!shotLocationModalVisible)

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

      {/* empty column */}
      <View style={{ flex: 0.3 }}>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',

          }}
        >

          <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[autoStyles.Font, { fontSize: 16, flex: 0.3, marginBottom: '2%' }]}>Mobility Bonus</Text>
            <Switch
              style={{ flex: 0.7 }}
              onValueChange={(value) => setMobility(value)}
              value={mobility}
            />
          </View>

          <View style={{ flex: 0.3, margin: 10, borderColor: 'blue', borderWidth: 0, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Speaker Notes: {failedSpeakerNotes}</Text>
            <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Amp Notes: {failedAmpNotes}</Text>
          </View>
          <View style={{ flex: 0.3, alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Speaker Notes: {speakerNotes}</Text>
            <Text style={{ fontSize: 20 }}>Amp Notes: {ampNotes}</Text>
          </View>

        </View>

        <View
          style={{
            flex: 0.8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,

          }}
        >
          <TouchableOpacity style={[autoStyles.SpeakerButton, { width: 300, marginBottom: 10, backgroundColor: alliance, borderColor: allianceBorderColor }]}
            onPress={() => {
              setShotModalVisible(!shotModalVisible);
              setModalType('Speaker');
            }}>
            <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Speaker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[autoStyles.AmpButton, { width: 300, marginBottom: 10, backgroundColor: ampColor, borderColor: ampBorderColor }]}
            onPress={() => {
              setModalType('Amp');
              setShotModalVisible(!shotModalVisible);
            }}>
            <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Amp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[autoStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
            <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[autoStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
            <Blink text='Continue to Teleop' />
          </TouchableOpacity>

        </View>
      </View>


    </View>
  );
}


const autoStyles = StyleSheet.create({
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
export default connectComponent(Auto);
