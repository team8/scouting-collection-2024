import { Modal, View, TouchableOpacity, Text, Image } from 'react-native';

function headerText(coordinatesList, modalType, fieldOrientation) {
  if (modalType == 'Speaker') try {

    if(fieldOrientation == 1) 
      return 'Speaker: [' + 
      (9-coordinatesList[coordinatesList.length-1][0]) + ', ' +
      coordinatesList[coordinatesList.length-1][1] + ']';
    else if (fieldOrientation == 2)
      return 'Speaker: [' + 
      coordinatesList[coordinatesList.length-1][0] + ', ' +
      (9-coordinatesList[coordinatesList.length-1][1]) + ']';

  } catch(err) {
    console.log(err);
    return 'Speaker';
  }
  else if (modalType == 'Amp') return 'Amp';
}

function ShotSuccessModal(props) {
  return(
    <Modal style={{ width: 100, height: 40 }} transparent={true} visible={props.shotModalVisible} onRequestClose={() => {
      props.setShotModalVisible(!props.shotModalVisible);
    }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20, backgroundColor: 'white', padding: 35, borderRadius: 20, alignItems: 'center' }}>

          <TouchableOpacity style={{ backgroundColor: '#e83149', height: 45, width: 45, borderRadius: 40, alignSelf: 'flex-start', justifyContent: 'center' }} 
            onPress={() => { 
              var temp = props.coordinatesList;
              temp.splice(props.coordinatesList.length-1, 1);
              props.setCoordinatesList(temp);
              
              props.setShotModalVisible(!props.shotModalVisible);
              }}>
            <Text style={{ alignSelf: 'center', color: 'white', fontSize: 20 }}>X</Text>
          </TouchableOpacity>
          {/* Button to close modal */}

          <Text style={{ fontFamily: 'Helvetica-Light', fontSize: 35, alignSelf: 'center', paddingHorizontal: 150, paddingVertical: 20, marginBottom: 15 }}>
          {headerText(props.coordinatesList, props.modalType, props.fieldOrientation)}</Text>
          {/* headerText is used to give the user a more intuitive coordinate shown. (0, 0 at bottom left)
              While the value shown in the modal is different than the actual values saved,
              the actual coordinates saved to matchData are still the same regardless.
              This is purely visual.
           */}

          <Image style={{ height: 175, width: 175, marginBottom: 10 }} source={require('../assets/game_pieces/note.png')} />

          <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>

           
            <TouchableOpacity style={{ borderBottomWidth: 5, borderColor: '#65c862', backgroundColor: '#85e882', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, marginTop: 30 }} onPress={() => {
              props.addAction(props.matchPhase + props.modalType);
              props.setShotModalVisible(!props.shotModalVisible);
            }}><Text style={{ fontFamily: 'Helvetica-Light', fontSize: 25, alignSelf: 'center', paddingHorizontal: 150, paddingVertical: 20 }}>Successful Shot</Text></TouchableOpacity>

            <TouchableOpacity style={{ borderBottomWidth: 5, borderColor: '#e04c4c', backgroundColor: '#f56c6c', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25 }} onPress={() => {
              props.addAction(props.matchPhase + 'Failed' + props.modalType);
              props.setShotModalVisible(!props.shotModalVisible);
            }}><Text style={{ fontFamily: 'Helvetica-Light', fontSize: 25, alignSelf: 'center', paddingHorizontal: 150, paddingVertical: 20 }}>Failed Shot</Text></TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  )
}

export default ShotSuccessModal;