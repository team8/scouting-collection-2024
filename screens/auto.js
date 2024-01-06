import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Switch,
  Modal
} from "react-native";
import { connect } from "react-redux";
import * as Types from "../store/types";
import Blink from "../components/blink";
import GridSuccessModal from "../components/gridSuccessModal";
import { useNavigation } from '@react-navigation/native';
import loadingStationImages from "../loading-station";
import { Button, ButtonGroup } from 'react-native-elements';


function Auto(props) {
  const [grid, setGrid] = useState([
    [{type: "Cone", placements: []}, {type: "Cone", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cube", placements: []}, {type: "Cube", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cone", placements: []}, {type: "Cone", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cone", placements: []}, {type: "Cone", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cube", placements: []}, {type: "Cube", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cone", placements: []}, {type: "Cone", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cone", placements: []}, {type: "Cone", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cube", placements: []}, {type: "Cube", placements: []}, {type: "Hybrid", placements: []}],
    [{type: "Cone", placements: []}, {type: "Cone", placements: []}, {type: "Hybrid", placements: []}]
  ]);
  const [totalCones, setTotalCones] = useState(0);
  const [totalCubes, setTotalCubes] = useState(0);

  const [upperFailedCones, setUpperFailedCones] = useState(0);
  const [upperFailedCubes, setUpperFailedCubes] = useState(0);
  const [midFailedCones, setMidFailedCones] = useState(0);
  const [midFailedCubes, setMidFailedCubes] = useState(0);

  const [chargeStation, setChargeStation] = useState(-1);
  const [mobility, setMobility] = useState(false);

  const [gridModalVisible, setGridModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalGridDimensionX, setModalGridDimensionX] = useState(0);
  const [modalGridDimensionY, setModalGridDimensionY] = useState(0);

  const [autoActions, setAutoActions] = useState([]);

  const alliance = props.eventReducer.alliance;
  const fieldOrientation = props.eventReducer.fieldOrientation;

  const chargeStationText = ["N/A", "Attempt", "Docked", "Engaged"];

  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

  const navigation = useNavigation();



  useEffect(() => {
    navigation.setOptions({
      title: `Auto | ${matchData.team}`
    })
    if (fieldOrientation == 1) {
      var lGrid = JSON.parse(JSON.stringify(flipColumns(grid)));
      setGrid(lGrid);
    }
  }, [])

  useEffect(() => {
    calculateFailedPieces()
  }, [autoActions])

  const updateGrid = (x, y, placementType) => {
    //Placement types: Cube, Cone, RemoveCube, RemoveCone
    let gridCopy = JSON.parse(JSON.stringify(grid));

    if(!(gridCopy[x][y].type == "Cube" && placementType.includes("Cone")) ||
       !(gridCopy[x][y].type == "Cone" && placementType.includes("Cube"))) {
        //Preventing removing/adding game pieces in the wrong node

      switch(true) {
        case placementType == "RemoveCube" && gridCopy[x][y].placements.includes("autoCube"): 
          //Has cube, remove
          try{gridCopy[x][y].placements.splice(gridCopy[x][y].placements.indexOf("autoCube"), 1);}
          catch(err){console.log(err);}
          //Use 'try' in case .placements doesn't contain autoCube
          setTotalCubes(totalCubes - 1);
          break;

        case placementType == "RemoveCone" && gridCopy[x][y].placements.includes("autoCone"): 
          //Has cone, remove
          try{gridCopy[x][y].placements.splice(gridCopy[x][y].placements.indexOf("autoCone"), 1);} 
          catch(err){console.log(err);}
          //Use 'try' in case .placements doesn't contain autoCone
          setTotalCones(totalCones - 1);
          break;

        case placementType == "Cube" && gridCopy[x][y].placements.length < 2: 
          //Add cube
          gridCopy[x][y].placements.push("autoCube");
          setTotalCubes(totalCubes + 1);
          break;

        case placementType == "Cone" && gridCopy[x][y].placements.length < 2: 
          //Add cone
          gridCopy[x][y].placements.push("autoCone");
          setTotalCones(totalCones + 1);
          break;
        
        case placementType == "RemoveCube" || placementType == "RemoveCone" || 
             placementType == "Cube" || placementType == "Cone":
          //Trying to go into the negatives or above 2 game pieces, do nothing
          return;

        default: 
          console.log("updateGrid switch got confused in auto.js /shrug - maybe placementType wasn't set properly");
      }

    } else if ((gridCopy[x][y].type == "Cube" && placementType.includes("Cone")) || (gridCopy[x][y].type == "Cone" && placementType.includes("Cube"))) {
      console.log("Trying to add/remove unplaceable game pieces in auto.js updateGrid :("); return; 
    } else {console.log("idk something went wrong while using auto.js updateGrid XD"); return;}
    
    //console.log("AUTO.JS: " + gridCopy[x][y].type + " node " + x + ", " + y + " changed to " + gridCopy[x][y].placements + " with length " + gridCopy[x][y].placements.length);
    setGrid(gridCopy);

  }

const flipColumns = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length / 2; j++) {
      let temp = arr[i][j];
      arr[i][j] = arr[i][arr[i].length - 1 - j];
      arr[i][arr[i].length - 1 - j] = temp;
    }
  }
  return arr;
}



const updateChargeStation = (index) => {
  setChargeStation(index);
}

const navigate = () => {
  if (chargeStation === -1) {
    alert("Please fill in charge station data.");
    return;
  }
  matchData.autoGrid = grid;
  matchData.autoChargeStation = chargeStationText[chargeStation];
  matchData.totalCones = totalCones;
  matchData.totalCubes = totalCubes;
  matchData.mobility = mobility;
  matchData.autoUpperFailedCones = upperFailedCones;
  matchData.autoUpperFailedCubes = upperFailedCubes;
  matchData.autoMidFailedCones = midFailedCones;
  matchData.autoMidFailedCubes = midFailedCubes;
  props.setCurrentMatchData(matchData);
  navigation.navigate('teleop')
}



const calculateFailedPieces = () => {
  var tempUpperFailedCones = 0
  var tempUpperFailedCubes = 0
  var tempMidFailedCones = 0
  var tempMidFailedCubes = 0
  for (var i=0;i<autoActions.length;i++){
    if (autoActions[i] === 'UpperFailedCone'){
      tempUpperFailedCones += 1;
    } else if (autoActions[i] === 'MidFailedCone'){
      tempMidFailedCones += 1;
    } else if (autoActions[i] === 'UpperFailedCube'){
      tempUpperFailedCubes += 1;
    } else if (autoActions[i] === 'MidFailedCube'){
      tempMidFailedCubes += 1;
    }
  }

  setUpperFailedCones(tempUpperFailedCones);
  setMidFailedCones(tempMidFailedCones);
  setUpperFailedCubes(tempUpperFailedCubes);
  setMidFailedCubes(tempMidFailedCubes);
}

const undo = () => {
  autoActions.pop();
  console.log(autoActions);
  calculateFailedPieces();
}

  if (fieldOrientation == 1) {
    return (
      <View style={autoStyles.mainContainer}>

        <GridSuccessModal modalVisible={gridModalVisible} setModalVisible={setGridModalVisible} matchPhase='auto' updateGrid={updateGrid} modalGridDimensionX={modalGridDimensionX} modalGridDimensionY={modalGridDimensionY} modalType={modalType} autoActions={autoActions} setAutoActions={setAutoActions} calculateFailedPieces={calculateFailedPieces} />

        <ImageBackground
          style={{ flex: 1 }}
          source={loadingStationImages[alliance]}
        ></ImageBackground>

        {/* middle column */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
             

            }}
          >

            <ButtonGroup
              onPress={updateChargeStation}
              selectedIndex={chargeStation}
              buttons={chargeStationText}
              buttonStyle={autoStyles.ButtonGroup}
              containerStyle={{ height: 50 }}
              selectedButtonStyle={{ backgroundColor: '#24a2b6', borderBottomColor: '#188191' }}
            />

          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
      
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

            <View style={{ flex: 0.3, margin: 20, borderColor: 'blue', borderWidth: 0 }}>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cones: {upperFailedCones + midFailedCones}</Text>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cubes: {upperFailedCubes + midFailedCubes}</Text>
            </View>
            <View style={{ flex: 0.3 }}>
              <Text style={{ fontSize: 20 }}>Cones: {totalCones}</Text>
              <Text style={{ fontSize: 20 }}>Cubes: {totalCubes}</Text>
            </View>

          </View>

          <View
            style={{
              flex: 0.8,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
              
            }}
          >
            <TouchableOpacity style={[autoStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
              <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[autoStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
              <Blink text="Continue to Teleop" />
            </TouchableOpacity>

          </View>
        </View>

        <View style={{ flex: 1 }}>
          {grid.map((row, i) => (
            <View style={autoStyles.gridRow} key={i}>
              {row.map((square, j) => (
                <TouchableOpacity
                  style={[
                    autoStyles.square,
                    { backgroundColor: 'white' },
                    square.type == "Cone" && {backgroundColor: (square.placements.length == 0) ? "#EDD488" : "yellow"},
                    square.type == "Cube" && {backgroundColor: (square.placements.length == 0) ? "#BB88ED" : "purple"}
                    //Different background colour depending on if node is empty or not
                  ]}
                  key={j}
                  onPress={() => {
                    setModalGridDimensionX(i);
                    setModalGridDimensionY(j);
                    setModalType(square.type);
                    setGridModalVisible(!gridModalVisible);
                  }}
                >
                  {square.type == "Cube" && square.placements.length > 0 && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cube.png')} />}
                  {square.type == "Cone" && square.placements.length > 0 && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cone.png')} />}

                  {square.type == "Hybrid" && square.placements.length == 2 && square.placements.includes("autoCube") && square.placements.includes("autoCone") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/hybrid.png')} />}
                  {square.type == "Hybrid" && square.placements.length == 2 && square.placements.includes("autoCube") && !square.placements.includes("autoCone") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cube.png')} />}
                  {square.type == "Hybrid" && square.placements.length == 2 && square.placements.includes("autoCone") && !square.placements.includes("autoCube") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cone.png')} />}

                  {square.type == "Hybrid" && square.placements.length == 1 && square.placements.includes("autoCube") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cube.png')} />}
                  {square.type == "Hybrid" && square.placements.length == 1 && square.placements.includes("autoCone") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cone.png')} />}
                  {/* Maybe there's a better way to do the hybrid but idk /shrug */}

                  {square.type == "Cube" && <Text style={{position:"absolute", bottom:5, right:5, fontFamily:"Helvetica-Light", fontSize:26, color:"white"}}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Cone" && <Text style={{position:"absolute", bottom:5, right:5, fontFamily:"Helvetica-Light", fontSize:26}}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Hybrid" && 
                  ((square.placements.includes("autoCube") && !square.placements.includes("autoCone")) ||
                  (!square.placements.includes("autoCube") && square.placements.includes("autoCone"))) &&
                    <Text style={{position:"absolute", bottom:5, right:5, fontFamily:"Helvetica-Light", fontSize:26}}>{square.placements.length > 1 && square.placements.length}</Text>
                  }
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    )
  } else {
    return (
      <View style={autoStyles.mainContainer}>

        <GridSuccessModal modalVisible={gridModalVisible} setModalVisible={setGridModalVisible} matchPhase='auto' updateGrid={updateGrid} modalGridDimensionX={modalGridDimensionX} modalGridDimensionY={modalGridDimensionY} modalType={modalType} autoActions={autoActions} setAutoActions={setAutoActions} calculateFailedPieces={calculateFailedPieces} />

        <View style={{ flex: 1 }}>
          {grid.map((row, i) => (
            <View style={autoStyles.gridRow} key={i}>
              {row.map((square, j) => (
                <TouchableOpacity
                  style={[
                    autoStyles.square,
                    { backgroundColor: 'white' },
                    square.type == "Cone" && {backgroundColor: (square.placements.length == 0) ? "#EDD488" : "yellow"},
                    square.type == "Cube" && {backgroundColor: (square.placements.length == 0) ? "#BB88ED" : "purple"}
                    //Different background colour depending on if node is empty or not
                  ]}
                  key={j}
                  onPress={() => {
                    setModalGridDimensionX(i);
                    setModalGridDimensionY(j);
                    setModalType(square.type);
                    setGridModalVisible(!gridModalVisible);
                  }}
                >
                  {square.type == "Cube" && square.placements.length > 0 && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cube.png')} />}
                  {square.type == "Cone" && square.placements.length > 0 && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cone.png')} />}

                  {square.type == "Hybrid" && square.placements.length == 2 && square.placements.includes("autoCube") && square.placements.includes("autoCone") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/hybrid.png')} />}
                  {square.type == "Hybrid" && square.placements.length == 2 && square.placements.includes("autoCube") && !square.placements.includes("autoCone") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cube.png')} />}
                  {square.type == "Hybrid" && square.placements.length == 2 && square.placements.includes("autoCone") && !square.placements.includes("autoCube") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cone.png')} />}
                  
                  {square.type == "Hybrid" && square.placements.length == 1 && square.placements.includes("autoCube") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cube.png')} />}
                  {square.type == "Hybrid" && square.placements.length == 1 && square.placements.includes("autoCone") && <Image style={autoStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/cone.png')} />}
                  {/* Maybe there's a better way to do the hybrid but idk :thonk: */}

                  {square.type == "Cube" && <Text style={{position:"absolute", bottom:0, right:0, fontFamily:"Helvetica-Light", fontSize:26, color:"white"}}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Cone" && <Text style={{position:"absolute", bottom:0, right:0, fontFamily:"Helvetica-Light", fontSize:26}}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Hybrid" && 
                  ((square.placements.includes("autoCube") && !square.placements.includes("autoCone")) ||
                  (!square.placements.includes("autoCube") && square.placements.includes("autoCone"))) &&
                    <Text style={{position:"absolute", bottom:0, right:0, fontFamily:"Helvetica-Light", fontSize:26}}>{square.placements.length > 1 && square.placements.length}</Text>
                  }
                  

                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* middle column */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
             

            }}
          >

            <ButtonGroup
              onPress={updateChargeStation}
              selectedIndex={chargeStation}
              buttons={chargeStationText}
              buttonStyle={autoStyles.ButtonGroup}
              containerStyle={{ height: 50 }}
              selectedButtonStyle={{ backgroundColor: '#24a2b6', borderBottomColor: '#188191' }}
            />

          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
      
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

            <View style={{ flex: 0.3, margin: 20, borderColor: 'blue', borderWidth: 0 }}>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cones: {upperFailedCones + midFailedCones}</Text>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cubes: {upperFailedCubes + midFailedCubes}</Text>
            </View>
            <View style={{ flex: 0.3 }}>
              <Text style={{ fontSize: 20 }}>Cones: {totalCones}</Text>
              <Text style={{ fontSize: 20 }}>Cubes: {totalCubes}</Text>
            </View>

          </View>

          <View
            style={{
              flex: 0.8,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
              
            }}
          >
            <TouchableOpacity style={[autoStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
              <Text style={[autoStyles.PrematchFont, autoStyles.PrematchButtonFont]}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[autoStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
              <Blink text="Continue to Teleop" />
            </TouchableOpacity>

          </View>
        </View>

        <ImageBackground
          style={{ flex: 1 }}
          source={loadingStationImages[alliance]}
        ></ImageBackground>
      </View>
    );
  }
}


const autoStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  gridRow: {
    flexDirection: "row",
    flex: 1,
  },
  square: {
    width: "33%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "black",
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
    backgroundColor: "#2E8B57",
    borderRadius: 7,
    borderBottomWidth: 5,
    borderColor: "#006400",
    alignItems: "center",
    justifyContent: "center",
  },
  UndoButton: {
    flex: 1,
    backgroundColor: '#ffae19',
    borderRadius: 7,
    borderBottomWidth: 5,
    borderColor: '#c98302',
    alignItems: "center",
    justifyContent: "center",
  },
  PrematchFont: {
    fontFamily: 'Helvetica-Light',
    fontSize: 20
  },
  PrematchButtonFont: {
    color: 'white',
    fontSize: 25
  },//yo wsg if u readin this u a tru g :))))
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
