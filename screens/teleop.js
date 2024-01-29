import React, { useEffect, useState } from "react";
import { View, Text, Styles, StyleSheet, TouchableOpacity, ImageBackground, Image } from "react-native";
import { connect } from "react-redux";
import * as Types from "../store/types";
import outtakeImages from "../outtake-images";
import TeleopModal from '../components/teleop_modal';
import { useNavigation } from '@react-navigation/native';
import GridSuccessModal from '../components/shotSuccessModal';


function Teleop(props) {
  const matchData = JSON.parse(JSON.stringify(props.eventReducer.currentMatchData));

  const [grid, setGrid] = useState([]);
  const [totalCones, setTotalCones] = useState(matchData.totalCones);
  const [totalCubes, setTotalCubes] = useState(matchData.totalCubes);



  const [gridModalVisible, setGridModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalGridDimensionX, setModalGridDimensionX] = useState(0);
  const [modalGridDimensionY, setModalGridDimensionY] = useState(0);

  const [teleopActions, setTeleopActions] = useState([]);

  const alliance = props.eventReducer.alliance;
  const fieldOrientation = props.eventReducer.fieldOrientation;

  const navigation = useNavigation();

  const [hybridNodeFilled, setHybridNodeFilled] = useState(false); //lol this is only used once

  const navigate = () => {
    matchData.teleGrid = grid;
    matchData.totalCones = totalCones;
    matchData.totalCubes = totalCubes;
    matchData.teleopUpperFailedCones = matchData.teleopActions.filter(x => x == 'UpperFailedCone').length;
    matchData.teleopUpperFailedCubes = matchData.teleopActions.filter(x => x == 'UpperFailedCube').length;
    matchData.teleopMidFailedCones = matchData.teleopActions.filter(x => x == 'MidFailedCone').length;
    matchData.teleopMidFailedCubes = matchData.teleopActions.filter(x => x == 'MidFailedCube').length;
    props.setCurrentMatchData(matchData);
    navigation.navigate('postmatch')
  }

  useEffect(() => {
    navigation.setOptions({
      title: `Teleop | ${matchData.team}`
    })
    setGrid(props.eventReducer.currentMatchData.autoGrid);
  }, [])

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

  const updateGrid = (x, y, placementType) => {
    //Placement types: Cube, Cone, RemoveCube, RemoveCone
    let gridCopy = JSON.parse(JSON.stringify(grid));

    if (!(gridCopy[x][y].type == "Cube" && placementType.includes("Cone")) ||
      !(gridCopy[x][y].type == "Cone" && placementType.includes("Cube"))) {
      //Preventing removing/adding game pieces in the wrong node
      console.log(gridCopy[x][y].type === "Cone")
      if (!(gridCopy[x][y].type === "Cube" && placementType.includes("Cone")) ||
        !(gridCopy[x][y].type ==="Cone" && placementType.includes("Cube"))) {
        //Preventing removing/adding game pieces in the wrong node

      switch(true) {
        case placementType == "RemoveCube" && gridCopy[x][y].placements.includes("teleopCube"): 
          //Has cube, remove
          try{gridCopy[x][y].placements.splice(gridCopy[x][y].placements.indexOf("teleopCube"), 1);}
          catch(err){console.log(err);}
          //Use 'try' in case .placements doesn't contain teleopCube
          setTotalCubes(totalCubes - 1);
          break;

        case placementType == "RemoveCone" && gridCopy[x][y].placements.includes("teleopCone"): 
          //Has cone, remove
          try{gridCopy[x][y].placements.splice(gridCopy[x][y].placements.indexOf("teleopCone"), 1);} 
          catch(err){console.log(err);}
          //Use 'try' in case .placements doesn't contain teleopCone
          setTotalCones(totalCones - 1);
          break;

        case placementType == "Cube" && gridCopy[x][y].placements.length < 2: 
          //Add cube
          gridCopy[x][y].placements.push("teleopCube");
          setTotalCubes(totalCubes + 1);
          break;

        case placementType == "Cone" && gridCopy[x][y].placements.length < 2: 
          //Add cone
          gridCopy[x][y].placements.push("teleopCone");
          setTotalCones(totalCones + 1);
          break;
        
        case placementType == "RemoveCube" || placementType == "RemoveCone" || 
        placementType == "Cube" || placementType == "Cone":
          //Trying to go into the negatives or above 2 game pieces, do nothing
          return;

          default:
            console.log("updateGrid switch got confused in teleop.js :thonk: - maybe placementType wasn't set properly");
        }

      } else if ((gridCopy[x][y].type == "Cube" && placementType.includes("Cone")) || (gridCopy[x][y].type == "Cone" && placementType.includes("Cube"))) {
        console.log("Trying to add/remove unplaceable game pieces in teleop.js updateGrid >:("); return;
      } else { console.log("idk something went wrong while using teleop.js updateGrid lul"); return; }

      //console.log("TELEOP.JS: " + gridCopy[x][y].type + " node " + x + ", " + y + " changed to " + gridCopy[x][y].placements + " with length " + gridCopy[x][y].placements.length);
      setGrid(gridCopy);

    }
  }


  const undo = () => {
    let localMatchData = matchData;
    localMatchData.teleopActions.pop();
    props.setCurrentMatchData(localMatchData);
  }

  if (fieldOrientation == 1) {
    return (
      <View style={teleopStyles.mainContainer}>

        <GridSuccessModal modalVisible={gridModalVisible} setModalVisible={setGridModalVisible} matchPhase='teleop' updateGrid={updateGrid} modalGridDimensionX={modalGridDimensionX} modalGridDimensionY={modalGridDimensionY} modalType={modalType} teleopActions={teleopActions} setTeleopActions={setTeleopActions} />


        <TouchableOpacity style={{ flex: 1 }} onPress={() => props.openTeleopModal(true)}>
          <ImageBackground
            style={{ flex: 1 }}
            source={outtakeImages[fieldOrientation][alliance]}
          ></ImageBackground>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {/* Start cones/cubes loading zone grid */}

          {/* Top header row */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginBottom: "-20%",
            }}
          >
            <View
              style={{
                flex: 1,
                paddingRight: "10%"
              }}
            >

            </View>
            <View
              style={{
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>Cones</Text>
            </View>
            <View
              style={{
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>Cubes</Text>
            </View>
          </View>
          {/* Second data row */}
          <View
            style={{
              flex: 1,
              alignItems: "left",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>S. Subs.</Text>
              <Text style={{ fontSize: 20 }}>D. Subs.</Text>
              <Text style={{ fontSize: 20 }}>Ground</Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "single_substation_cone").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "double_substation_cone").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "ground_cone").length}</Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "single_substation_cube").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "double_substation_cube").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "ground_cube").length}</Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",

            }}
          >
            <View style={{ margin: 20 }}>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cones: {matchData.teleopActions.filter(x => x == 'UpperFailedCone').length + matchData.teleopActions.filter(x => x == 'MidFailedCone').length}</Text>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cubes: {matchData.teleopActions.filter(x => x == 'UpperFailedCube').length + matchData.teleopActions.filter(x => x == 'MidFailedCube').length}</Text>
            </View>

            <Text style={{ fontSize: 20 }}>Cones: {totalCones}</Text>
            <Text style={{ fontSize: 20 }}>Cubes: {totalCubes}</Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10
            }}
          >
            <TouchableOpacity style={[teleopStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[teleopStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Finish Match</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {grid && grid.map((row, i) => (
            <View style={teleopStyles.gridRow} key={i}>
              {row.map((square, j) => (
                <TouchableOpacity
                  style={[
                    teleopStyles.square,
                    { backgroundColor: 'white' },
                    square.type == "Cone" && { backgroundColor: (square.placements.length == 0) ? "#EDD488" : "yellow" },
                    square.type == "Cube" && { backgroundColor: (square.placements.length == 0) ? "#BB88ED" : "purple" }
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
                  {square.type == "Cube" && square.placements.length != 0 && <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />}
                  {square.type == "Cone" && square.placements.length != 0 && <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />}

                  {(square.type == "Hybrid" && square.placements.length == 2) &&
                  (square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                  !square.placements.includes("autoCone") && !square.placements.includes("teleopCone") &&  
                    <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                    // Contains cube, no cone, must be 2 cube
                  }
                  
                 {(square.type == "Hybrid" && square.placements.length == 2) &&
                 (square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                  !square.placements.includes("autoCube") && !square.placements.includes("teleopCube") &&
                    <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                    // Contains cone, no cube, must be 2 cone
                  }

                  {square.type == "Hybrid" && square.placements.length == 2 && 
                    !(((square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                    !square.placements.includes("autoCone") && !square.placements.includes("teleopCone")) || 
                    ((square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                    !square.placements.includes("autoCube") && !square.placements.includes("teleopCube"))) &&
                      <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                      //Doesn't satisfy conditions for it to be double, must be hybrid
                  }


                  {(square.type == "Hybrid" && square.placements.length == 1) &&
                    (square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                      <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} /> 
                  }

                  {(square.type == "Hybrid" && square.placements.length == 1) &&
                    (square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                      <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                    //I'm sure you can read this right 
                  }


                  {square.type == "Cube" && <Text style={{ position: "absolute", bottom: 5, right: 5, fontFamily: "Helvetica-Light", fontSize: 26, color: "white" }}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Cone" && <Text style={{ position: "absolute", bottom: 5, right: 5, fontFamily: "Helvetica-Light", fontSize: 26 }}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Hybrid" &&
                    (((square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                    !square.placements.includes("autoCone") && !square.placements.includes("teleopCone")) || 
                    ((square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                    !square.placements.includes("autoCube") && !square.placements.includes("teleopCube"))) &&
                      <Text style={{position:"absolute", bottom:5, right:5, fontFamily:"Helvetica-Light", fontSize:26}}>{square.placements.length > 1 && square.placements.length}</Text>
                      //Copied logic from the conditions to display hybrid lol
                  }
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        <TeleopModal />
      </View>
    )
  } else {
    return (
      <View style={teleopStyles.mainContainer}>

        <GridSuccessModal modalVisible={gridModalVisible} setModalVisible={setGridModalVisible} matchPhase='teleop' updateGrid={updateGrid} modalGridDimensionX={modalGridDimensionX} modalGridDimensionY={modalGridDimensionY} modalType={modalType} teleopActions={teleopActions} setTeleopActions={setTeleopActions} />


        <View style={{ flex: 1 }}>
          {grid && grid.map((row, i) => (
            <View style={teleopStyles.gridRow} key={i}>
              {row.map((square, j) => (
                <TouchableOpacity
                  style={[
                    teleopStyles.square,
                    { backgroundColor: 'white' },
                    square.type == "Cone" && { backgroundColor: (square.placements.length == 0) ? "#EDD488" : "yellow" },
                    square.type == "Cube" && { backgroundColor: (square.placements.length == 0) ? "#BB88ED" : "purple" }
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
                  {square.type == "Cube" && square.placements.length != 0 && <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />}
                  {square.type == "Cone" && square.placements.length != 0 && <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />}

                  {(square.type == "Hybrid" && square.placements.length == 2) &&
                  (square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                  !square.placements.includes("autoCone") && !square.placements.includes("teleopCone") &&  
                    <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                    // Contains cube, no cone, must be 2 cube
                  }
                  
                 {(square.type == "Hybrid" && square.placements.length == 2) &&
                 (square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                  !square.placements.includes("autoCube") && !square.placements.includes("teleopCube") &&
                    <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                    // Contains cone, no cube, must be 2 cone
                  }

                  {square.type == "Hybrid" && square.placements.length == 2 && 
                    !(((square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                    !square.placements.includes("autoCone") && !square.placements.includes("teleopCone")) || 
                    ((square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                    !square.placements.includes("autoCube") && !square.placements.includes("teleopCube"))) &&
                      <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                      //Doesn't satisfy conditions for it to be double, must be hybrid
                  }


                  {(square.type == "Hybrid" && square.placements.length == 1) &&
                    (square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                      <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} /> 
                  }

                  {(square.type == "Hybrid" && square.placements.length == 1) &&
                    (square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                      <Image style={teleopStyles.gamePieceIcon} resizeMode="contain" source={require('../assets/game_pieces/note.png')} />
                    //I'm sure you can read this right 
                  }

                  {square.type == "Cube" && <Text style={{ position: "absolute", bottom: 5, right: 5, fontFamily: "Helvetica-Light", fontSize: 26, color: "white" }}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Cone" && <Text style={{ position: "absolute", bottom: 5, right: 5, fontFamily: "Helvetica-Light", fontSize: 26 }}>{square.placements.length > 1 && square.placements.length}</Text>}
                  {square.type == "Hybrid" &&
                    (((square.placements.includes("autoCube") || square.placements.includes("teleopCube")) &&
                    !square.placements.includes("autoCone") && !square.placements.includes("teleopCone")) || 
                    ((square.placements.includes("autoCone") || square.placements.includes("teleopCone")) &&
                    !square.placements.includes("autoCube") && !square.placements.includes("teleopCube"))) &&
                      <Text style={{position:"absolute", bottom:5, right:5, fontFamily:"Helvetica-Light", fontSize:26}}>{square.placements.length > 1 && square.placements.length}</Text>
                      //Copied logic from the conditions to display hybrid lol
                  }

                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }}>
          {/* Start cones/cubes loading zone grid */}
          {/* Top header row */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginBottom: "-20%"
            }}
          >
            <View
              style={{
                flex: 1,
                paddingRight: "10%"
              }}
            >

            </View>
            <View
              style={{
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>Cones</Text>
            </View>
            <View
              style={{
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>Cubes</Text>
            </View>
          </View>
          {/* Second data row */}
          <View
            style={{
              flex: 1,
              alignItems: "left",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>S. Subs.</Text>
              <Text style={{ fontSize: 20 }}>D. Subs.</Text>
              <Text style={{ fontSize: 20 }}>Ground</Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "single_substation_cone").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "double_substation_cone").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "ground_cone").length}</Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "single_substation_cube").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "double_substation_cube").length}</Text>
              <Text style={{ fontSize: 20 }}>{matchData.teleopActions.filter(x => x === "ground_cube").length}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ margin: 20 }}>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cones: {matchData.teleopActions.filter(x => x == 'UpperFailedCone').length + matchData.teleopActions.filter(x => x == 'MidFailedCone').length}</Text>
              <Text style={{ fontSize: 20, color: '#f54747', fontWeight: 'bold' }}>Failed Cubes: {matchData.teleopActions.filter(x => x == 'UpperFailedCube').length + matchData.teleopActions.filter(x => x == 'MidFailedCube').length}</Text>
            </View>
            <Text style={{ fontSize: 20 }}>Cones: {totalCones}</Text>
            <Text style={{ fontSize: 20 }}>Cubes: {totalCubes}</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10
            }}
          >
            <TouchableOpacity style={[teleopStyles.UndoButton, { width: 300, marginBottom: 10 }]} onPress={() => undo()}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[teleopStyles.NextButton, { width: 300 }]} onPress={() => navigate()}>
              <Text style={[teleopStyles.PrematchFont, teleopStyles.PrematchButtonFont]}>Finish Match</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => props.openTeleopModal(true)}>
          <ImageBackground
            style={{ flex: 1 }}
            source={outtakeImages[fieldOrientation][alliance]}
          ></ImageBackground>
        </TouchableOpacity>
        <TeleopModal />
      </View>
    )
  }
}

const teleopStyles = StyleSheet.create({
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
  NextButton: {
    flex: 1,
    backgroundColor: "#2E8B57",
    borderRadius: 7,
    borderBottomWidth: 5,
    borderColor: "#006400",
    alignItems: "center",
    justifyContent: "center",
  },
  gamePieceIcon: {
    height: '60%',
    width: '60%',
    alignSelf: 'center'
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
  },
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
  openTeleopModal: isVisible =>
    dispatch({
      type: Types.SET_TELEOP_MODAL,
      payload: {
        isVisible,
      },
    }),
});

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(Teleop);
