import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

export default function Blink({ text }) {
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const interval = setInterval(() => {
                setShowText((showText) => !showText);
              }, 100);
              return () => clearInterval(interval);
          
            }, 15000);
        return;
      }, []);

      if (!showText) {
          return null;
      }
      return (
        <Text style={[blinkStyles.Font, blinkStyles.ButtonFont]}>{text}</Text>
      );
}

const blinkStyles = StyleSheet.create({
    ButtonFont: {
        color: 'white',
        fontSize: 25
    },
    Font: {
        fontFamily: 'Helvetica-Light',
        fontSize: 20
      },
})