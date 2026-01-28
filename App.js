import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NotificationProvider, useNotifications } from './src/context/NotificationContext';
import { EventProvider, useEvents } from './src/context/EventContext';
import { COLORS, SPACING, TYPOGRAPHY } from './src/styles/theme';

const LOGO_ASSET = require('./assets/caf559ce-ffe9-4f6b-a79f-f42165758f3d.png');

// Screens
import AuthScreen from './src/screens/AuthScreen';
import ExplorarScreen from './src/screens/ExplorarScreen';
import EventosScreen from './src/screens/EventosScreen';
import UserEventDetailScreen from './src/screens/UserEventDetailScreen';
import NotificationCenterScreen from './src/screens/NotificationCenterScreen';
import SendNotificationScreen from './src/screens/SendNotificationScreen';
import ManageEventsScreen from './src/screens/ManageEventsScreen'; // New
import MyEventsScreen from './src/screens/MyEventsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreateEventWizard from './src/screens/CreateEventWizard';
import OperationalDashboardScreen from './src/screens/OperationalDashboardScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DiscoveryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explorar" component={ExplorarScreen} />
      <Stack.Screen name="Eventos" component={EventosScreen} />
      <Stack.Screen name="EventDetail" component={UserEventDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationCenterScreen} />
      <Stack.Screen name="ManageHub" component={ManageEventsScreen} />
    </Stack.Navigator>
  );
}

function CreateEventProxy({ navigation }) {
  const { promoteToOrganizer } = useAuth();
  React.useEffect(() => {
    promoteToOrganizer();
    navigation.navigate('CreationFlow');
  }, []);
  return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
}

function CreationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateWizard" component={CreateEventWizard} />
      <Stack.Screen name="OrganizerDashboard" component={OperationalDashboardScreen} />
      <Stack.Screen name="SendNotification" component={SendNotificationScreen} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image source={LOGO_ASSET} style={styles.logoMini} resizeMode="contain" />
        <View>
          <Text style={TYPOGRAPHY.h2}>LOOP</Text>
          <Text style={TYPOGRAPHY.caption}>Connected Community</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  logoMini: {
    width: 40,
    height: 40,
  },
  logoutBtn: {
    marginTop: 40,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.secondary + '10',
  },
  logoutText: {
    color: COLORS.secondary,
    fontWeight: '700',
    textAlign: 'center',
  },
});

function AppDrawer() {
  const { user } = useAuth();
  const { getEventsByOwner } = useEvents();
  const hasEvents = getEventsByOwner(user?.id).length > 0;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.primary,
        drawerLabelStyle: { fontWeight: '700' },
        drawerStyle: { backgroundColor: COLORS.surface, width: 280 }
      }}
    >
      <Drawer.Screen name="Explorar" component={DiscoveryStack} />
      <Drawer.Screen name="Mi cuenta" component={ProfileScreen} />
      <Drawer.Screen name="Organizar un evento" component={CreateEventProxy} />
      {hasEvents && (
        <Drawer.Screen name="Gestionar eventos" component={ManageEventsScreen} />
      )}
      <Drawer.Screen name="Mis eventos" component={MyEventsScreen} />
    </Drawer.Navigator>
  );
}

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="MainDrawer" component={AppDrawer} />
            <Stack.Screen name="CreationFlow" component={CreationStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <EventProvider>
            <RootNavigator />
          </EventProvider>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
