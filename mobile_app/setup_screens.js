const fs = require('fs');
const path = require('path');

const screens = ['LandingScreen', 'LoginScreen', 'FarmSetupScreen', 'DashboardScreen', 'InsightsScreen'];

screens.forEach(s => {
  const content = `import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../theme/theme';

export default function ${s}() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: 'bold' }}>${s}</Text>
    </View>
  );
}`;
  fs.writeFileSync(path.join(__dirname, 'src', 'screens', s + '.js'), content);
});
console.log('Screens created!');
