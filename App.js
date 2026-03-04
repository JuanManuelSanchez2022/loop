import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NotificationProvider, useNotifications } from './src/context/NotificationContext';
import { EventProvider, useEvents } from './src/context/EventContext';
import { SyncProvider } from './src/context/SyncContext';
import { COLORS, SPACING, TYPOGRAPHY } from './src/styles/theme';
import { Badge } from './src/components';

const LOGO_ASSET = require('./assets/caf559ce-ffe9-4f6b-a79f-f42165758f3d.png');

// Screens
import AuthScreen from './src/screens/AuthScreen';
import ExplorarScreen from './src/screens/ExplorarScreen';
import EventosScreen from './src/screens/EventosScreen';
import UserEventDetailScreen from './src/screens/UserEventDetailScreen';
import NotificationCenterScreen from './src/screens/NotificationCenterScreen';
import SendNotificationScreen from './src/screens/SendNotificationScreen';
import ManageEventsScreen from './src/screens/ManageEventsScreen';
import MyEventsScreen from './src/screens/MyEventsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreateEventWizard from './src/screens/CreateEventWizard';
import OperationalDashboardScreen from './src/screens/OperationalDashboardScreen';
import EventPublishConfirmationScreen from './src/screens/EventPublishConfirmationScreen';
import TicketValidationScreen from './src/screens/TicketValidationScreen';
import HomeSegmentsScreen from './src/screens/HomeSegmentsScreen';
import SegmentEventsScreen from './src/screens/SegmentEventsScreen';
import OrganizerAnalyticsScreen from './src/screens/OrganizerAnalyticsScreen';
import OperationalAnalyticsScreen from './src/screens/OperationalAnalyticsScreen';
import FlyerStudioScreen from './src/screens/FlyerStudioScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DiscoveryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explorar" component={ExplorarScreen} />
      <Stack.Screen name="HomeSegments" component={HomeSegmentsScreen} />
      <Stack.Screen name="SegmentEvents" component={SegmentEventsScreen} />
      <Stack.Screen name="Eventos" component={EventosScreen} />
      <Stack.Screen name="EventDetail" component={UserEventDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationCenterScreen} />
      <Stack.Screen name="ManageHub" component={ManageEventsScreen} />
      <Stack.Screen name="OrganizerAnalytics" component={OrganizerAnalyticsScreen} />
      <Stack.Screen name="OperationalAnalytics" component={OperationalAnalyticsScreen} />
      <Stack.Screen name="FlyerStudio" component={FlyerStudioScreen} />
    </Stack.Navigator>
  );
}

function CreateEventProxy({ navigation }) {
  const { promoteToOrganizer } = useAuth();
  React.useEffect(() => {
    if (promoteToOrganizer) promoteToOrganizer();
    navigation.navigate('CreationFlow');
  }, []);
  return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
}

function CreationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateWizard" component={CreateEventWizard} />
      <Stack.Screen name="EventPublishConfirmation" component={EventPublishConfirmationScreen} />
      <Stack.Screen name="TicketScanner" component={TicketValidationScreen} />
      <Stack.Screen name="OrganizerDashboard" component={OperationalDashboardScreen} />
      <Stack.Screen name="SendNotification" component={SendNotificationScreen} />
      <Stack.Screen name="FlyerStudio" component={FlyerStudioScreen} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { logout, user } = useAuth();
  const { navigation } = props;
  const [isOrganizerExpanded, setIsOrganizerExpanded] = useState(false);

  const sections = {
    user: [
      { name: 'Discovery', label: 'Explorar', icon: '🔍' },
      { name: 'MyEvents', label: 'Mis Eventos', icon: '🎫' },
      { name: 'Profile', label: 'Mi Perfil', icon: '👤' },
    ],
    organizer: [
      { name: 'Discovery', label: 'Explorar', icon: '🔍' },
      { name: 'MyEvents', label: 'Mis Eventos', icon: '🎫' },
      { name: 'Profile', label: 'Mi Perfil', icon: '👤' },
    ]
  };

  const currentSections = user?.isOrganizer ? (sections.organizer || []) : (sections.user || []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left']}>
      <ScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <View style={styles.drawerHeader}>
          <Text style={styles.appName}>EVENT-OP</Text>
          <Text style={styles.userRole}>{user?.username || 'Usuario'}</Text>
        </View>

        {currentSections.map((item, index) => (
          <TouchableOpacity
            key={`${item.name}-${index}`}
            onPress={() => item.name === 'Discovery'
              ? navigation.navigate('Discovery', { screen: 'Explorar' })
              : navigation.navigate(item.name)}
            style={styles.drawerItem}
          >
            <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
            <Text style={styles.drawerItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {user?.isOrganizer && (
          <TouchableOpacity
            style={[styles.collapsibleHeader, isOrganizerExpanded && styles.collapsibleHeaderActive]}
            onPress={() => setIsOrganizerExpanded(!isOrganizerExpanded)}
          >
            <View style={styles.collapsibleInner}>
              <Text style={[styles.sectionLabel, styles.sectionLabelOrganizer, { marginBottom: 0, marginTop: 0 }]}>Modo organizador</Text>
              <Text style={styles.chevron}>{isOrganizerExpanded ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
        )}

        {user?.isOrganizer && isOrganizerExpanded && (
          <View style={styles.organizerSections}>
            <View style={styles.organizerBadgeWrap}>
              <Badge label="Organizador" variant="organizer" />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ManageEvents')}
              style={styles.drawerItem}
            >
              <Text style={{ fontSize: 18, marginRight: 12 }}>⚙️</Text>
              <Text style={styles.drawerItemText}>Gestionar Eventos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('OrganizerAnalytics')}
              style={styles.drawerItem}
            >
              <Text style={{ fontSize: 18, marginRight: 12 }}>📊</Text>
              <Text style={styles.drawerItemText}>Métricas Históricas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Organizar un evento')}
              style={styles.drawerItem}
            >
              <Text style={{ fontSize: 18, marginRight: 12 }}>➕</Text>
              <Text style={styles.drawerItemText}>Organizar Evento</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.drawerFooter}>
          <TouchableOpacity
            onPress={logout}
            style={[styles.logoutBtn, { marginTop: 40, justifyContent: 'center' }]}
          >
            <Text style={styles.logoutText}>Cerrar Sesion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AppDrawer() {
  const { user } = useAuth();
  const { getEventsByOwner } = useEvents();

  if (!user) return null;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.primary,
        drawerLabelStyle: { fontWeight: '700' },
        drawerStyle: { backgroundColor: COLORS.background, width: 280 }
      }}
      initialRouteName="Discovery"
    >
      <Drawer.Screen name="Discovery" component={DiscoveryStack} options={{ drawerItemStyle: { height: 0, opacity: 0 } }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerItemStyle: { height: 0, opacity: 0 } }} />
      <Drawer.Screen name="MyEvents" component={MyEventsScreen} options={{ drawerItemStyle: { height: 0, opacity: 0 } }} />
      <Drawer.Screen name="Organizar un evento" component={CreateEventProxy} options={{ drawerItemStyle: { height: 0, opacity: 0 } }} />
      <Drawer.Screen name="ManageEvents" component={ManageEventsScreen} options={{ drawerItemStyle: { height: 0, opacity: 0 } }} />
    </Drawer.Navigator>
  );
}

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>Cargando aplicacion...</Text>
      </View>
    );
  }

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

import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  console.log('App: Component rendering...');
  React.useEffect(() => {
    console.log("lanzada con exito");
  }, []);
  const [isReady, setIsReady] = useState(false);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <AuthProvider>
            <NotificationProvider>
              <EventProvider>
                <SyncProvider>
                  <RootNavigator />
                </SyncProvider>
              </EventProvider>
            </NotificationProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    backgroundColor: COLORS.background,
  },
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
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLabelOrganizer: {
    marginTop: SPACING.lg,
    color: COLORS.organizer,
    flex: 1,
  },
  collapsibleHeader: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  collapsibleHeaderActive: {
    borderColor: COLORS.organizer,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  collapsibleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  chevron: {
    color: COLORS.organizer,
    fontSize: 10,
    fontWeight: 'bold',
  },
  organizerBadgeWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    minHeight: 44,
  },
  drawerItemActive: {
    backgroundColor: COLORS.primary + '25',
  },
  drawerItemOrganizer: {
    backgroundColor: COLORS.surfaceSecondary,
    marginTop: 1,
    borderTopWidth: 0,
  },
  drawerItemOrganizerActive: {
    backgroundColor: COLORS.organizer + '25',
  },
  drawerItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  drawerItemText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  drawerItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  drawerItemOrganizerTextActive: {
    color: COLORS.organizer,
    fontWeight: '700',
  },
});
