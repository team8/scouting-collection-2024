import { Modal, View, TouchableOpacity, Text, Image } from 'react-native';

function ShotLocationModal(props) {
  const ScoringButtons = props.ScoringButtons;

  return (
    <Modal style={{ width: 90, height: 30 }} transparent={true} visible={props.shotLocationModalVisible} onRequestClose={() => {
      props.setShotLocationModalVisible(!props.shotLocationModalVisible);
    }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20, backgroundColor: 'white', padding: 35, borderRadius: 20, alignItems: 'center' }}>

          <TouchableOpacity style={{ backgroundColor: '#e83149', height: 30, width: 30, borderRadius: 40, alignSelf: 'flex-start', justifyContent: 'center' }}
            onPress={() => { 
              var temp = props.coordinatesList
              temp.pop()
              props.setCoordinatesList(temp)

              props.setShotLocationModalVisible(!props.shotLocationModalVisible)
               }}>
            <Text style={{ alignSelf: 'center', color: 'white', fontSize: 15 }}>X</Text>
          </TouchableOpacity>
          {/* Button to close modal */}

          <Image style={{ height: 150, width: 150, marginBottom: 10 }} source={require('../assets/game_pieces/note.png')} />

          <View style={{
            flex: 0.6,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,
          }}>

            <ScoringButtons style={{alignSelf: "center"}}/>

          </View>

        </View>
      </View>
    </Modal>
  )
}

export default ShotLocationModal;