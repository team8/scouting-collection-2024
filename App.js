import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchList from "./screens/match_list";
import Prematch from "./screens/prematch";
import Auto from "./screens/auto";
import Teleop from "./screens/teleop";
import Endgame from "./screens/endgame";
import Postmatch from "./screens/postmatch";
import QRCode from "./screens/qrcode";

import GetMatches from "./components/get_matches";

import { Provider } from "react-redux";
import store from "./store/store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
       <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#03572C',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
            <Stack.Screen 
              name="Match List" 
              component={MatchList} 
              options={{
                title: 'Match List',
                headerRight: () => (
                  <GetMatches />
                )
              }}
              />
            <Stack.Screen name="prematch" component={Prematch} />
            <Stack.Screen name="auto" component={Auto} />
            <Stack.Screen name="teleop" component={Teleop} />
            <Stack.Screen name="endgame" component={Endgame} />
            <Stack.Screen name="postmatch" component={Postmatch} />
            <Stack.Screen name="qrcode" component={QRCode} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
