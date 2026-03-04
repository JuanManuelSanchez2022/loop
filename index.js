import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { registerRootComponent } from 'expo';
console.log('index.js: Application Bootstrap...');
import App from './App';

function Root() {
  try {
    return <App />;
  } catch (e) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#1a1a1a' }}>
        <Text style={{ color: '#ef4444', fontSize: 18, marginBottom: 8 }}>Error al cargar la app</Text>
        <ScrollView>
          <Text style={{ color: '#f9fafb', fontSize: 12 }}>{String(e?.message || e)}</Text>
        </ScrollView>
      </View>
    );
  }
}

registerRootComponent(Root);
