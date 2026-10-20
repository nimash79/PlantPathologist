# PlantPathologist

A mobile application built with React Native and Expo that connects users with specialists through a conversational interface. The app provides authentication, specialist selection, conversations, file viewing, multilingual support, and user settings.

## Overview

PlantPathologist is designed around a specialist-oriented support experience. Users can navigate the app, select a specialist, manage conversations, and exchange messages through a dedicated chat interface.

The application uses a modular screen structure, centralized state management with Redux, and React Navigation to organize its mobile experience.

## Features

- **Specialist selection:** Navigate to the specialist-selection screen.
- **Authentication:** Access the application's authentication flow.
- **Conversations:** Browse and manage conversation sessions.
- **Messaging:** Open a dedicated chat screen.
- **File viewing:** Navigate to a screen for viewing files.
- **Multilingual interface:** Change the application language using the localization system.
- **Right-to-left layout:** Supports RTL layout behavior for non-English language configurations.
- **User settings:** Access personal information and application preferences.
- **Help and information:** Dedicated FAQ, About Us, and Contact Us screens.
- **Responsive mobile UI:** Built with React Native and supporting Expo libraries.
- **State management:** Uses Redux Toolkit and React Redux.
- **Notifications infrastructure:** Includes notification-related code, although push-notification registration is currently commented out in the main application file.

## Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo SDK 52 | Mobile development and build tooling |
| React Navigation 7 | Screen navigation and routing |
| Redux Toolkit | Application state management |
| React Redux | Connecting components to Redux state |
| Axios | HTTP requests |
| i18next and react-i18next | Internationalization |
| AsyncStorage | Local persistent storage |
| Expo Image Picker | Image selection capabilities |
| Expo Location | Location-related functionality |
| Expo File System | File-system operations |
| Expo AV | Audio and media functionality |
| React Native Maps | Map-based UI functionality |
| Expo Application Services (EAS) | Application build workflow |

The repository includes additional Expo and React Native packages for UI components, gestures, animations, media handling, and device integration.

## Project Structure

```text
PlantPathologist/
├── android/                 # Android project files
├── assets/                  # Images, fonts, and other assets
├── src/
│   ├── screens/
│   │   ├── authentication/  # Authentication screens
│   │   ├── main/            # Home, conversations, chat, files
│   │   └── settings/        # Settings and user information
│   ├── redux/               # Redux state management
│   ├── localization/        # Internationalization setup
│   └── utils/               # Shared utilities and constants
├── App.js                   # Main application and navigation
├── index.js                 # Expo entry point
├── app.json                 # Expo application configuration
├── eas.json                 # EAS build configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
└── README.md
```

This structure highlights the main application areas. Consult the source tree for the complete list of modules and screens.

## Getting Started

### Prerequisites

Install the following tools before starting development:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [Expo development tools](https://docs.expo.dev/)
- Android Studio and an Android SDK if you intend to run a local Android build
- Xcode on macOS if you intend to build locally for iOS

For device testing, install Expo Go when the project's native dependencies are compatible with it. Some native modules or configuration requirements may require a development build instead.

### 1. Clone the repository

```bash
git clone https://github.com/nimash79/PlantPathologist.git
cd PlantPathologist
```

### 2. Install dependencies

```bash
npm ci
```

This installs dependencies according to the committed `package-lock.json`.

### 3. Start the development server

```bash
npm start
```

Alternatively, use the platform-specific commands:

```bash
# Start with a cleared Metro cache
npm run start_c

# Start the Android application
npm run android

# Start the iOS application
npm run ios

# Start the web version
npm run web
```

The available commands are defined in `package.json`. The web command may have compatibility limitations because the application uses native-specific dependencies.

### 4. Configure required services

Before testing authentication, conversations, messaging, or other service-dependent features, identify and configure the required backend endpoints and credentials.

The repository contains Firebase-related configuration files, but the presence of those files does not establish that every application feature is fully configured or operational.

**Security requirement:** Never commit Firebase Admin SDK service-account credentials, private keys, or other privileged secrets to source control. Use secure server-side configuration for administrative credentials and keep public client configuration separate from privileged credentials.

### 5. Build an Android preview

The repository defines an EAS build script:

```bash
npm run build
```

This runs the configured Android preview build. Follow the [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/) for account setup, project configuration, and build requirements.

## Application Navigation

The main application entry point is `App.js`. It configures the navigation container, global Redux provider, status bar, toast notifications, and the application's screen routes.

The registered screens include:

| Screen | Purpose |
|---|---|
| Intro | Initial application flow |
| Language | Language selection |
| Home | Main application screen |
| Select Specialist | Specialist selection |
| Authentication | Authentication flow |
| Chat | Individual conversation interface |
| Conversations | Conversation list |
| View File | File viewing |
| Settings | Application preferences |
| Personal Information | User information |
| FAQ | Frequently asked questions |
| About Us | Application information |
| Contact Us | Contact interface |

## Localization and RTL Support

The application integrates `i18next` and `react-i18next` for language management.

At startup, the app retrieves the saved language preference. When a non-English language is selected, the application can enable right-to-left layout behavior and reload to apply the language configuration.

When adding another language:

1. Add the relevant translation resources to the localization setup.
2. Update the language-selection interface.
3. Verify that every relevant screen uses translated strings.
4. Test both left-to-right and right-to-left layouts where applicable.

## Development Guidelines

### State management

Use the existing Redux architecture for state that needs to be shared across screens. Keep transient UI state within individual components when it does not need to be shared.

### Navigation

Register new screens in the navigation configuration in `App.js` and follow the existing React Navigation conventions.

### API integration

Keep service calls organized and handle loading states, failures, and authentication errors consistently. Backend URLs and credentials should be configurable rather than embedded directly in components.

### Testing

Before releasing a build, verify:

- Authentication and session handling.
- Specialist selection and conversation navigation.
- Message delivery and error handling.
- File viewing and media permissions.
- Language persistence and RTL rendering.
- Android and iOS behavior, where supported.
- Behavior when the backend is unavailable.

## Security Considerations

The repository currently includes a Firebase Admin SDK service-account JSON file. **That credential must be treated as compromised.** Revoke or rotate it immediately, remove the file from the repository, and review relevant Google Cloud audit logs and permissions.

Removing the file from the latest commit does not erase it from Git history. If the repository is public, remove the secret from historical commits as appropriate after revoking it.

Also review the standalone HTML test files before deploying them. The chat-room test page contains a hard-coded WebSocket endpoint using unencrypted `ws://`. Production messaging should use authenticated connections over TLS, normally `wss://`, and enforce authorization on the server.

## License

No explicit license has been verified for this repository. Check the repository's license information before redistributing or reusing its code.

## Author

**Nima Sharifinia**

- GitHub: [@nimash79](https://github.com/nimash79)
- Repository: [PlantPathologist](https://github.com/nimash79/PlantPathologist)

---

Contributions that improve maintainability, security, accessibility, and cross-platform reliability are welcome.
