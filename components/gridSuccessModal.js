import { Modal, View, TouchableOpacity, Text, Image } from 'react-native';
import {connect} from 'react-redux';
import * as Types from '../store/types';

function GridSuccessModal(props) {
  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));
  if(props.modalType != "Hybrid") return (
    <Modal transparent={true} visible={props.modalVisible} onRequestClose={() => {
      props.setModalVisible(!props.modalVisible);
    }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20, backgroundColor: 'white', padding: 35, borderRadius: 20, alignItems: 'center' }}>

          <TouchableOpacity style={{ backgroundColor: '#e83149', height: 30, width: 30, borderRadius: 40, alignSelf: 'flex-start', justifyContent: 'center' }} onPress={() => { props.setModalVisible(!props.modalVisible) }}><Text style={{ alignSelf: 'center', color: 'white', fontSize: 15 }}>x</Text></TouchableOpacity>
          {/* Button to close modal */}

          {props.modalType == "Cube" && <Image style={{ height: 100, width: 100, marginBottom: 10 }} source={require('../assets/game_pieces/cube.png')} />}
          {props.modalType == "Cone" && <Image style={{ height: 100, width: 100, marginBottom: 10 }} source={require('../assets/game_pieces/cone.png')} />}

          <View style={{ flexDirection: 'column' }}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={{ backgroundColor: '#f56c6c', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, width: '45%', height: '100%' }} onPress={() => {
                props.updateGrid(props.modalGridDimensionX, props.modalGridDimensionY, "Remove" + props.modalType);
                props.setModalVisible(!props.modalVisible);
              }}><Text style={{ alignSelf: 'center' }}>Remove Game Piece</Text></TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#85e882', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, width: '45%', height: '100%' }} onPress={() => {
                props.updateGrid(props.modalGridDimensionX, props.modalGridDimensionY, props.modalType); 
                props.setModalVisible(!props.modalVisible);
              }}><Text style={{ alignSelf: 'center' }}>Add Game Piece</Text></TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={{ backgroundColor: 'red', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, marginTop: 10, width: '100%', height: '100%' }} onPress={() => {
                
                if (props.matchPhase === 'auto') {
                  var temp = [...props.autoActions];
                  if (props.modalType == 'Cube') {
                    if (props.modalGridDimensionY == 0 || props.modalGridDimensionY == 2) {
                      temp.push('UpperFailedCube');
                    } else if (props.modalGridDimensionY == 1) {
                      temp.push('MidFailedCube');
                    }
                  }

                  if (props.modalType == 'Cone') {

                    if (props.modalGridDimensionY == 0 || props.modalGridDimensionY == 2) {
                      temp.push('UpperFailedCone');
                    } else if (props.modalGridDimensionY == 1) {
                      temp.push('MidFailedCone');
                    }
                  }
                  props.setAutoActions(temp);
                } else {
                  console.log('teleop actions:')
                  console.log(matchData.teleopActions);
                  console.log('^')
                  
                  
                  if (props.modalType == 'Cube') {
                    if (props.modalGridDimensionY == 0 || props.modalGridDimensionY == 2) {
                      matchData.teleopActions.push('UpperFailedCube');
                    } else if (props.modalGridDimensionY == 1) {
                      matchData.teleopActions.push('MidFailedCube');
                    }
                  }

                  if (props.modalType == 'Cone') {

                    if (props.modalGridDimensionY == 0 || props.modalGridDimensionY == 2) {
                      matchData.teleopActions.push('UpperFailedCone');
                    } else if (props.modalGridDimensionY == 1) {
                      matchData.teleopActions.push('MidFailedCone');
                    }
                  }
                  console.log('matchData:')
                  console.log(matchData.teleopActions);
                  props.setCurrentMatchData(matchData);
                }
                //Big "if" statement is for undo button
                
                props.setModalVisible(!props.modalVisible);


              }}><Text style={{ alignSelf: 'center' }}>Failed Placement</Text></TouchableOpacity>

              
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
  else return (
    <Modal transparent={true} visible={props.modalVisible} onRequestClose={() => {
      props.setModalVisible(!props.modalVisible);
    }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20, backgroundColor: 'white', padding: 35, borderRadius: 20, alignItems: 'center' }}>

          <TouchableOpacity style={{ backgroundColor: '#e83149', height: 30, width: 30, borderRadius: 40, alignSelf: 'flex-start', justifyContent: 'center' }} onPress={() => { props.setModalVisible(!props.modalVisible) }}><Text style={{ alignSelf: 'center', color: 'white', fontSize: 15 }}>x</Text></TouchableOpacity>
          {/* Button to close modal */}

          <Image style={{ height: 100, width: 100, marginBottom: 10 }} source={require('../assets/game_pieces/hybrid.png')} />

          <View style={{ flexDirection: 'column' }}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={{ backgroundColor: '#f56c6c', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, width: '40%', height: '100%' }} onPress={() => {
                props.updateGrid(props.modalGridDimensionX, props.modalGridDimensionY, "RemoveCube");
                props.setModalVisible(!props.modalVisible);
              }}><Text style={{ alignSelf: 'center' }}>Remove Cube</Text></TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#85e882', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, width: '40%', height: '100%' }} onPress={() => {
                props.updateGrid(props.modalGridDimensionX, props.modalGridDimensionY, "Cube"); 
                props.setModalVisible(!props.modalVisible);
              }}><Text style={{ alignSelf: 'center' }}>Add Cube</Text></TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={{ backgroundColor: '#f56c6c', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, marginTop: 10, width: '40%', height: '100%' }} onPress={() => {
                props.updateGrid(props.modalGridDimensionX, props.modalGridDimensionY, "RemoveCone");
                props.setModalVisible(!props.modalVisible);
              }}><Text style={{ alignSelf: 'center' }}>Remove Cone</Text></TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#85e882', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, marginTop: 10, width: '40%', height: '100%' }} onPress={() => {
                props.updateGrid(props.modalGridDimensionX, props.modalGridDimensionY, "Cone"); 
                props.setModalVisible(!props.modalVisible);
              }}><Text style={{ alignSelf: 'center' }}>Add Cone</Text></TouchableOpacity>

              
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
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
  export default connectComponent(GridSuccessModal);