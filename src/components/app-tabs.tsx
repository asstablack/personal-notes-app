import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Notes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="note.text"
          drawable="ic_menu_edit"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}