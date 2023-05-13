/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  NativeModules,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const bytes = generate(10 * 1e6); // 10 MB

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.button}>
          <Button
            title="Array"
            onPress={() => {
              measure(() => {
                return NativeModules.TestModule.dataAsArray(Array.from(bytes));
              });
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="JSON stringify"
            onPress={() => {
              measure(() => {
                return NativeModules.TestModule.dataAsJSON(
                  JSON.stringify(bytes),
                );
              });
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Array to string"
            onPress={() => {
              measure(() => {
                return NativeModules.TestModule.dataAsArrayToString(
                  bytes.toString(),
                );
              });
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Base64 encoded string"
            onPress={() => {
              measure(() => {
                return NativeModules.TestModule.dataAsBase64(
                  fromByteArray(bytes),
                );
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function generate(bytes: number): Uint8Array {
  const array: Uint8Array = new Uint8Array(bytes);
  for (let index = 0; index < bytes; index++) {
    array[index] = index % 256;
  }
  return array;
}

async function measure(fun: () => Promise<void>) {
  const start = Date.now();
  fun();
  const end = Date.now();
  console.log('time ms', end - start);
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    margin: 10,
  },
});

export default App;

/* eslint-disable */

// https://github.dev/beatgammit/base64-js/blob/88957c9943c7e2a0f03cdf73e71d579e433627d3/index.js#L119
// License: MIT

const lookup: string[] = []

const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (let i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
}

function tripletToBase64(num: number): string {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk(uint8: Uint8Array | number[], start: number, end: number): string {
  let tmp
  const output = []
  for (let i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  // console.log('encodeChunk', output.length, uint8.length, start, end);
  return output.join('')
}

/**
 *
 */
export function fromByteArray(uint8: Uint8Array | number[]): string {
  let tmp
  const len = uint8.length
  const extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  const parts = []
  const maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      `${lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F]
      }==`
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      `${lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F]
      }=`
    )
  }

  return parts.join('')
}
