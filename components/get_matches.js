import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import * as Types from "../store/types";

function GetMatches(props) {
    return (
        <TouchableOpacity onPress={() => props.matchesModal(true)}>
            <Text style={{ color: "white", fontSize: 16 }}>Get Matches</Text>
        </TouchableOpacity>
    )
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    matchesModal: isVisible => dispatch({ type: Types.MATCHES_MODAL, payload: {
        isVisible
    }})
})

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
export default connectComponent(GetMatches);