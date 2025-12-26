/**
 * Notification Service - Daily Cadence
 * Schedules morning/evening/weekly rituals
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface RitualNotificationConfig {
  id: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
  repeats?: 'daily' | 'weekly';
  weekday?: number; // 1 = Sunday, 7 = Saturday
}

const RITUAL_NOTIFICATIONS: RitualNotificationConfig[] = [
  {
    id: 'morning_ritual',
    title: '🌅 Günaydın! Bugünün Enerjisi Hazır',
    body: 'CohenDad bugün için bir kart çekti. Günlük ritüeline başla.',
    hour: 9,
    minute: 0,
    repeats: 'daily',
  },
  {
    id: 'evening_ritual',
    title: '🌙 Gün Değerlendirmesi Zamanı',
    body: 'Bugünü yansıt, bilinçaltını keşfet. CohenDad seni bekliyor.',
    hour: 21,
    minute: 0,
    repeats: 'daily',
  },
  {
    id: 'weekly_reflection',
    title: '📅 Haftanın Dersi',
    body: 'Bu haftayı birlikte analiz edelim. Derin içgörüler seni bekliyor.',
    hour: 10,
    minute: 0,
    repeats: 'weekly',
    weekday: 1, // Sunday
  },
];

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permissions not granted');
    return false;
  }

  // Register for push notifications on iOS
  if (Platform.OS === 'ios') {
    await Notifications.setNotificationCategoryAsync('ritual', []);
  }

  return true;
};

/**
 * Schedule all daily cadence notifications
 */
export const scheduleDailyCadenceNotifications = async (): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Cancel existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule each ritual notification
  for (const config of RITUAL_NOTIFICATIONS) {
    try {
      const trigger: any = {
        hour: config.hour,
        minute: config.minute,
        repeats: true,
      };

      if (config.repeats === 'weekly' && config.weekday) {
        trigger.weekday = config.weekday;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            ritualType: config.id,
            deepLink: `cohendad://ritual/${config.id}`,
          },
        },
        trigger,
      });

      console.log(`Scheduled notification: ${config.id}`);
    } catch (error) {
      console.error(`Error scheduling notification ${config.id}:`, error);
    }
  }

  // Save that notifications were scheduled
  await AsyncStorage.setItem('notifications_scheduled', 'true');
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem('notifications_scheduled');
};

/**
 * Check if notifications are scheduled
 */
export const areNotificationsScheduled = async (): Promise<boolean> => {
  const scheduled = await AsyncStorage.getItem('notifications_scheduled');
  return scheduled === 'true';
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

/**
 * Handle notification response (when user taps notification)
 */
export const handleNotificationResponse = (
  response: Notifications.NotificationResponse,
  navigation: any
) => {
  const { ritualType } = response.notification.request.content.data;

  // Navigate to appropriate ritual screen
  switch (ritualType) {
    case 'morning_ritual':
      navigation.navigate('MorningRitual');
      break;
    case 'evening_ritual':
      navigation.navigate('EveningRitual');
      break;
    case 'weekly_reflection':
      navigation.navigate('WeeklyReflection');
      break;
    default:
      navigation.navigate('Home');
  }
};

/**
 * Schedule a one-time reminder notification
 */
export const scheduleReminder = async (
  title: string,
  body: string,
  date: Date
): Promise<string | null> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        date,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return null;
  }
};

/**
 * Send local notification immediately
 */
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data,
    },
    trigger: null, // Send immediately
  });
};
