export default {
  "expo": {
    "name": "Commercius",
    "slug": "Marketplace-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/plain-logo.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/plain-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#09203F"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.admin.commercius",
      "googleServicesFile": process.env.GOOGLE_SERVICES_INFOPLIST
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/plain-logo.png",
        "backgroundColor": "#09203F"
      },
      "package": "com.admin.commercius",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON
    },
    "web": {
      "favicon": "./assets/plain-logo.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-font",
      "@react-native-google-signin/google-signin",
      "expo-build-properties",
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "3a724747-bfd2-41e5-b4a3-b0b09e9307ad"
      }
    }
  }
}
