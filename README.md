# Network Interfaces Explorer for Android

This is a new [**React Native**](https://reactnative.dev) project, created using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## About

This app shows detailed information about network interfaces on Android devices. It was originally created for use with headless devices, where you can't see the assigned hotspot IP address. While the final `.xx` part of the IP remains constant for the same device, the third octet of the hotspot IP range changes randomly. This app can help to quickly identify the full IP range, making it easy to connect to the headless device. Note that it only shows the IP address of the host device, not of the connected hotspot devices. 

It retrieves the network interface information using `java.net.NetworkInterface` in [NetworkInterfacesModule.kt](android/app/src/main/java/com/networkinterfaceshelper/NetworkInterfacesModule.kt)


This app was tested on Android 14 in Dec 2024.

## Running the app

To run the app on an Android device or emulator, use:

```bash
npm run android

OR

npm run start
press 'A'
```

## Generating an APK

To generate a release APK for installation:

```bash
./android/gradlew bundleRelease
```

## Screenshot

![SCREENSHOT](repo/unknown.png?raw=true "Screenshot") 