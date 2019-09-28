import * as Battery from 'expo-battery';
import * as React from 'react';
import { Text as MonoText, ScrollView } from 'react-native';

export default function BatteryScreen() {
  if (!Battery.isSupported) {
    return <MonoText>Battery API is not supported on this device</MonoText>;
  }

  const [batteryLevel, setBatteryLevel] = React.useState(-1);
  const [batteryState, setBatteryState] = React.useState(Battery.BatteryState.UNKNOWN);
  const [lowPowerMode, setLowPowerMode] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const [batteryLevel, batteryState, lowPowerMode] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
      ]);

      setBatteryLevel(batteryLevel);
      setBatteryState(batteryState);
      setLowPowerMode(lowPowerMode);
    })();
    const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) =>
      setBatteryLevel(batteryLevel)
    );
    const batteryStateListener = Battery.addBatteryStateListener(({ batteryState }) =>
      setBatteryState(batteryState)
    );
    const lowPowerModeListener = Battery.addLowPowerModeListener(({ lowPowerMode }) =>
      setLowPowerMode(lowPowerMode)
    );
    return () => {
      batteryLevelListener && batteryLevelListener.remove();
      batteryStateListener && batteryStateListener.remove();
      lowPowerModeListener && lowPowerModeListener.remove();
    };
  }, []);

  return (
    <ScrollView style={{ padding: 10 }}>
      <MonoText>
        {JSON.stringify(
          {
            batteryLevel,
            batteryState: getBatteryStateString(batteryState),
            lowPowerMode,
          },
          null,
          2
        )}
      </MonoText>
    </ScrollView>
  );
}

BatteryScreen.navigationOptions = {
  title: 'Battery',
};

function getBatteryStateString(batteryState) {
  switch (batteryState) {
    case Battery.BatteryState.UNPLUGGED:
      return 'UNPLUGGED';
    case Battery.BatteryState.CHARGING:
      return 'CHARGING';
    case Battery.BatteryState.FULL:
      return 'FULL';
    case Battery.BatteryState.UNKNOWN:
    default:
      return 'UNKNOWN';
  }
}