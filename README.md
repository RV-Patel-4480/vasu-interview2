# Welcome to Vasu's interview Expo app 👋

Expo Interview Project

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

For better local notification testing I suggest to use development build instead of Expo Go.
2. Generate ios and android native code

   ```bash
   npx expo prebuild
   ```

3. Run on android

   ```bash
   npm run android
   ```

4. Run on ios

   ```bash
   npm run ios
   ```

Or run on Expo Go

   ```bash
   npx expo start
   ```

## Project Overview
# Tech Stack

Expo 54.0.33

React Native 0.81.5

Expo Router (file-based routing)

Axios – API communication

Zustand – State management

Zod – Schema validation

MMKV – Fast local key-value storage

Expo Secure Store – Secure auth storage


# UI & Theming

Google Fonts integration

Custom theme engine:

Light mode

Dark mode

Centralized color system

Linear gradients (expo-linear-gradient)

Lucide icons (lucide-react-native)

Custom bottom tab UI (not default Expo tabs)

# Navigation & Routing

Expo Router for navigation

File-based routing system

Custom layouts

Auth & App route separation

Protected routes using:

Custom useAuth hook

<Stack.Protected> method

# Authentication System

Secure login/session handling

Auth state management via custom hook

Secure data storage using:

expo-secure-store

Fast local storage using:

MMKV

# API Layer

Axios-based API services

Modular API structure

Centralized API handling

Clean request/response flow

# Notifications

Local notifications using expo-notifications

Scheduled notification support

# Media & Profile

Image upload using expo-image-picker

Optimized image rendering using expo-image

# Keyboard Handling

Smooth keyboard behavior using:

react-native-keyboard-controller

# State Management

Zustand for global state

Modular store architecture

Scalable and maintainable design

