import { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, Image, Switch } from 'react-native';
import { connect } from 'react-redux';
import * as Types from '../store/types';

function IntakeLocationModal(props) {
 

  return(
    <Modal style={{ width: 100, height: 40 }} transparent={true} visible={props.intakeModalVisible} onRequestClose={() => {
      props.setIntakeModalVisible(!props.intakeModalVisible);
    }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20, backgroundColor: 'white', padding: 35, borderRadius: 20, alignItems: 'center' }}>

          <TouchableOpacity style={{ backgroundColor: '#e83149', height: 30, width: 30, borderRadius: 40, alignSelf: 'flex-start', justifyContent: 'center' }} 
          onPress={() => { props.setIntakeModalVisible(!props.intakeModalVisible) }}>
            <Text style={{ alignSelf: 'center', color: 'white', fontSize: 15 }}>X</Text>
          </TouchableOpacity>
          {/* Button to close modal */}

          <Image style={{ height: 150, width: 150, marginBottom: 10 }} source={require('../assets/game_pieces/note.png')} />

          <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>

            

            <TouchableOpacity style={{ backgroundColor: '#8a8179', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25, marginTop: 30 }} onPress={() => {
             
       
              props.setIntakeModalVisible(!props.intakeModalVisible);
            }}><Text style={{ alignSelf: 'center', fontSize: 20, paddingHorizontal: 130, paddingVertical: 20 }}>Substation</Text></TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: '#995a26', borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 25 }} onPress={() => {
              props.setIntakeModalVisible(!props.intakeModalVisible);
            }}><Text style={{ alignSelf: 'center', fontSize: 20, paddingHorizontal: 130, paddingVertical: 20 }}>Ground</Text></TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  )
}

export default IntakeLocationModal;