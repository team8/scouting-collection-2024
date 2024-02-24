import { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, Image, Switch } from 'react-native';
import { connect } from 'react-redux';
import * as Types from '../store/types';

function ShotSuccessModal(props) {
  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));
  const [amplified, setAmplified] = useState(false);

  return(
    <Modal style={{ width: 100, height: 40 }} transparent={true} visible={props.shotModalVisible} onRequestClose={() => {
      props.setShotModalVisible(!props.shotModalVisible);
    }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20, backgroundColor: 'white', padding: 35, borderRadius: 20, alignItems: 'center' }}>

          <TouchableOpacity style={{ backgroundColor: '#e83149', height: 30, width: 30, borderRadius: 40, alignSelf: 'flex-start', justifyContent: 'center' }} 
          onPress={() => { props.setShotModalVisible(!props.shotModalVisible) }}>
            <Text style={{ alignSelf: 'center', color: 'white', fontSize: 15 }}>X</Text>
          </TouchableOpacity>
          {/* Button to close modal */}

          <Image style={{ height: 150, width: 150, marginBottom: 10 }} source={require('../assets/game_pieces/note.png')} />

          <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>

            {(props.modalType == 'Speaker') && (props.matchPhase == 'teleop') &&
              <Text style={[{ fontSize: 22, alignSelf: 'center', marginBottom: 20 }]}>Amplified</Text>}
            {(props.modalType == 'Speaker') && (props.matchPhase == 'teleop') &&
              <Switch
                style={{ alignSelf: 'center' }}
                onValueChange={(value) => setAmplified(value)}
                value={amplified}
              />}

            <TouchableOpacity style={{ backgroundColor: '#85e882', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, marginTop: 30 }} onPress={() => {
              if(props.modalType == 'Speaker' && amplified) { props.addAction(props.matchPhase + 'Amplified' + props.modalType); }
              else props.addAction(props.matchPhase + props.modalType);
              setAmplified(false);
              props.setShotModalVisible(!props.shotModalVisible);
            }}><Text style={{ alignSelf: 'center', fontSize: 20, paddingHorizontal: 130, paddingVertical: 20 }}>Successful Shot</Text></TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#f56c6c', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25 }} onPress={() => {
              props.addAction(props.matchPhase + 'Failed' + props.modalType);
              props.setShotModalVisible(!props.shotModalVisible);
            }}><Text style={{ alignSelf: 'center', fontSize: 20, paddingHorizontal: 130, paddingVertical: 20 }}>Failed Shot</Text></TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  )
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    setCurrentMatchData: newMatchData =>
    dispatch({
      type: Types.SET_CURRENT_MATCH_DATA,
      payload: {
          newMatchData,
      },
      }),
       
  });
  const connectComponent = connect(mapStateToProps, mapDispatchToProps);
  export default connectComponent(ShotSuccessModal);