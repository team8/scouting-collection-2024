import { Modal, View, TouchableOpacity, Text, Image } from 'react-native';
import {connect} from 'react-redux';
import * as Types from '../store/types';

function ShotSuccessModal(props) {
  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

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

          <Image style={{ height: 100, width: 100, marginBottom: 10 }} source={require('../assets/game_pieces/note.png')} />

          <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>

            <TouchableOpacity style={{ backgroundColor: '#85e882', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25 }} onPress={() => {
              //console.log('Successful shot button in modal pressed');

              let temp = (props.matchPhase == 'auto') ? props.autoActions : props.teleopActions;
              temp.push(String(props.matchPhase + props.modalType));

              if(props.matchPhase == 'auto') props.setAutoActions(temp);
              else props.setTeleopActions(temp);

              props.setShotModalVisible(!props.shotModalVisible);
            }}><Text style={{ alignSelf: 'center' }}>Successful Shot</Text></TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#f56c6c', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25 }} onPress={() => {
              //console.log('Failed shot button in modal pressed');

              let temp = (props.matchPhase == 'auto') ? props.autoActions : props.teleopActions; 
              temp.push(String(props.matchPhase + 'Failed' + props.modalType));

              if(props.matchPhase == 'auto') props.setAutoActions(temp);
              else props.setTeleopActions(temp);

              props.setShotModalVisible(!props.shotModalVisible);
            }}><Text style={{ alignSelf: 'center' }}>Failed Shot</Text></TouchableOpacity>

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