import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import * as Types from '../store/types';

import GetMatchesModal from "../components/get_matches_modal"

function MatchList(props) {
    const navigation = useNavigation(); 
    const iconComplete = <Icon name='md-checkmark-circle' type='ionicon' color='#32CD32' />;
    const iconUnfinished = <Icon name='plus-circle' type='material-community' color='#4583E8' />;

    useEffect(() => {
        getMatches();
        //console.log(props.eventReducer.matches)
    }, [])

    const getMatches = async () => {
        try {
            const eventKey = await AsyncStorage.getItem("currentEvent");
            if (eventKey !== null) {
                const matches = await AsyncStorage.getItem(eventKey);
                const alliance = await AsyncStorage.getItem("alliance");
                props.setEvent(JSON.parse(matches));
                props.setReduxEventKey(eventKey);
                props.setAlliance(alliance);
            }
        } catch (e) {
            alert(e);
        }
    }

    const navigate = (match) => {
        var currMatchData = JSON.parse(JSON.stringify(props.eventReducer.matches[match]))
        // currMatchData.teleEvents = [];
        // console.log(props.eventReducer.alliance)
        currMatchData.teleopActions = [];
        props.setCurrentMatch(match);
        props.setCurrentMatchData(currMatchData);
        navigation.navigate('prematch');
    }

    return (
        <View>
            <ScrollView style={{ paddingHorizontal: 20, fontFamily: 'Helvetica-Light' }}>
                {props.eventReducer.matches &&
                    props.eventReducer.matches.map((match, i) => (
                        <TouchableOpacity key={i} onPress={() => navigate(i)}>
                             <ListItem
                               key={i}
                               bottomDivider
                            >
                                {match.scouted ? iconComplete : iconUnfinished}
                                <ListItem.Content>
                                    <ListItem.Title>{`${match.matchNo}${match.scouted ? ` - Scouted by ${match.scouter}` : ''}`}</ListItem.Title>    
                                    {/* add scouted by name of person if scouted                                  */}
                                </ListItem.Content>
                                <Text>{match.team}</Text>
                                <ListItem.Chevron />
                            </ListItem>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
            <GetMatchesModal />
        </View>
    )
}

const mapStateToProps = state => state;
  const mapDispatchToProps = dispatch => ({
      setEvent: eventData =>
      dispatch({
        type: Types.SET_EVENT,
        payload: {
          eventData,
        },
      }),
      setReduxEventKey: reduxEventKey =>
      dispatch({
        type: Types.SET_CURRENT_EVENT_KEY,
        payload: {
          reduxEventKey,
        },
      }),
      setCurrentMatch: selectedMatch =>
      dispatch({
        type: Types.SET_CURRENT_MATCH,
        payload: {
          selectedMatch,
        },
      }),
      setAlliance: color =>
      dispatch({
        type: Types.SET_ALLIANCE_COLOR,
        payload: {
          color,
        },
      }),
      setCurrentMatchData: newMatchData =>
      dispatch({
        type: Types.SET_CURRENT_MATCH_DATA,
        payload: {
          newMatchData,
        },
      }),
  });
  const connectComponent = connect(mapStateToProps, mapDispatchToProps);
  export default connectComponent(MatchList);