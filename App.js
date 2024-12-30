import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { NativeModules } from 'react-native';

const { NetworkInterfacesModule } = NativeModules;

const App = () => {
  const [interfaces, setInterfaces] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [previousResults, setPreviousResults] = useState([]);
  const [showRawData, setShowRawData] = useState(false);
  const [rawData, setRawData] = useState('');

  const themeStyles = styles;

  const interfaceLookup = {
    lo: 'Loopback',
    wlan0: 'Wi-Fi',
    eth0: 'Ethernet',
  };
  
  const fetchNetworkInterfaces = async () => {
    try {
      const jsonString = await NetworkInterfacesModule.getNetworkInterfaces();
      const data = JSON.parse(jsonString);

      const sortedInterfaces = data.interfaces.sort((a, b) =>
        a.name === 'wlan0' ? -1 : b.name === 'wlan0' ? 1 : 0
      );

      // Remove interface from addresses like '%wlan0'
      const cleanedInterfaces = sortedInterfaces.map((iface) => ({
        ...iface,
        addresses: iface.addresses.map((addr) => ({
          ...addr,
          address: addr.address.split('%')[0],
        })),
      }));

      const timestamp = new Date().toLocaleString('en-GB');

      const isDifferent =
        interfaces.length > 0 && JSON.stringify(cleanedInterfaces) !== JSON.stringify(interfaces);

      if (isDifferent) {
        setPreviousResults((prev) => [
          { timestamp, interfaces: interfaces },
          ...prev,
        ]);
      }

      setInterfaces(cleanedInterfaces);
      setRawData(JSON.stringify(data, null, 2));
      setLastRefreshed(timestamp);
    } catch (error) {
      console.error('Failed to fetch network interfaces:', error);
    }
  };

  useEffect(() => {
    fetchNetworkInterfaces();
  }, []);

  return (
    <View style={[themeStyles.container]}>
      <View style={themeStyles.header}>
        <Text style={themeStyles.title}>Network Interfaces</Text>
      </View>
      <View style={themeStyles.buttonContainer}>
        <Button title="Refresh" onPress={fetchNetworkInterfaces} color={'#1e90ff'} />
        <Button
          title={showRawData ? 'Hide JSON' : 'Show JSON'}
          onPress={() => setShowRawData((prev) => !prev)}
          color={'#1e90ff'}
        />
        <Button
          title="Clear Results"
          onPress={() => {
            setPreviousResults([]);
            setInterfaces([]);
            setLastRefreshed(null);
            setRawData('');
          }}
          color={'#ff4500'}
        />
      </View>
      <ScrollView>
        {showRawData ? (
          <View style={themeStyles.rawDataContainer}>
            <Text style={themeStyles.rawData}>{rawData}</Text>
          </View>
        ) : (
          <>
            <View>
              <Text style={themeStyles.subTitle}>
                Current Results{' '}
                <Text style={themeStyles.lastRefreshed}>
                  ({lastRefreshed !== null ? lastRefreshed : 'No results'})
                </Text>
              </Text>
            </View>
            {interfaces.map((iface) => {
              const readableName = interfaceLookup[iface.name] || iface.name;
              return (
                <View key={iface.name} style={themeStyles.interfaceContainer}>
                  <Text style={themeStyles.interfaceName}>
                    {readableName}{' '}
                    <Text style={themeStyles.interfaceNameGrey}>({iface.name})</Text>
                  </Text>
                  {iface.addresses.map((addr, idx) => (
                    <Text key={idx} style={themeStyles.address}>
                      {addr.isIPv4 ? 'IPv4' : 'IPv6'}: {addr.address}
                    </Text>
                  ))}
                </View>
              );
            })}
            {previousResults.length > 0 && (
              <>
                <Text style={themeStyles.subTitle}>
                  Previous Results{' '}
                  <Text style={themeStyles.lastRefreshed}>
                    ({previousResults.length} result{previousResults.length > 1 ? 's' : ''})
                  </Text>
                </Text>
                {previousResults.map((result, index) => (
                  <View key={`${result.timestamp}-${index}`} style={themeStyles.resultContainer}>
                    <Text style={themeStyles.timestamp}>
                      {result.timestamp && (
                        <Text style={themeStyles.lastRefreshed}>
                          ({result.timestamp})
                        </Text>
                      )}
                    </Text>
                    {result.interfaces.map((iface) => {
                      const readableName = interfaceLookup[iface.name] || iface.name;
                      return (
                        <View key={iface.name} style={themeStyles.interfaceContainer}>
                          <Text style={themeStyles.interfaceName}>
                            {readableName}{' '}
                            <Text style={themeStyles.interfaceNameGrey}>({iface.name})</Text>
                          </Text>
                          {iface.addresses.map((addr, idx) => (
                            <Text key={idx} style={themeStyles.address}>
                              {addr.isIPv4 ? 'IPv4' : 'IPv6'}: {addr.address}
                            </Text>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  wifiState: {
    fontSize: 18,
    color: '#aaaaaa',
  },
  settingsButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#cccccc',
  },
  settingsText: {
    fontSize: 18,
    color: '#ffffff',
  },
  lastRefreshed: {
    fontSize: 14,
    color: '#cccccc',
    color: '#aaaaaa',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  settings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  localePicker: {
    flex: 1,
    marginRight: 10,
  },
  picker: {
    color: '#ffffff',
    backgroundColor: '#1e1e1e',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rawDataContainer: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 5,
  },
  rawData: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  interfaceContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    backgroundColor: '#1e1e1e',
  },
  interfaceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  interfaceNameGrey: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  address: {
    fontSize: 16,
    color: '#cccccc',
  },
  resultContainer: {
    marginBottom: 20,
  },
  timestamp: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 5,
  },
});

export default App;
