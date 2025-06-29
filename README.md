# Money Flow Simpler 💰

A modern, voice-enabled personal finance tracking app built with React Native and Expo. Track your income and expenses effortlessly with natural language voice commands or manual entry.

## 🎯 Features

### Core Functionality
- **Dashboard Overview** - Real-time view of your available monthly funds
- **Income Management** - Track multiple income sources (monthly/yearly)
- **Expense Tracking** - Categorize expenses as monthly, static, or yearly
- **Smart Calculations** - Automatic conversion between monthly and yearly amounts
- **Visual Feedback** - Color-coded UI for positive (green) or negative (red) balance

### Voice Intelligence
- **Natural Language Input** - Say "I spent $50 on groceries today" and let AI handle the rest
- **Automatic Categorization** - Expenses are categorized into food, transport, housing, entertainment, utilities, or other
- **Smart Context Detection** - AI distinguishes between income and expenses based on context
- **Transcription & Processing** - Powered by OpenAI's Whisper and GPT-3.5

### User Experience
- **Recent Activity Feed** - Quick view of your last 3 income and expense entries
- **Responsive Design** - Works seamlessly on iOS, Android, and web
- **Dark Mode** - Eye-friendly dark theme by default
- **Haptic Feedback** - Tactile responses for better interaction (mobile)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Studio (for mobile development)
- OpenAI API key (optional, for voice features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/money-flow-simpler.git
cd money-flow-simpler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional, for voice features):
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## 📱 Available Scripts

- `npm run dev` - Start the Expo development server with tunnel
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality
- `npm run build:web` - Build for web deployment
- `npm run build:android` - Prebuild for Android

## 🏗️ Project Structure

```
money-flow-simpler/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Dashboard home screen
│   ├── income/            # Income management screen
│   ├── expenses/          # Expense management screen
│   └── instructions/      # App instructions
├── components/            # Reusable UI components
│   ├── AddExpenseModal.tsx
│   ├── AddIncomeModal.tsx
│   ├── Button.tsx
│   ├── Icon.tsx
│   └── VoiceRecordButton.tsx
├── context/               # React Context for state management
│   └── FinanceContext.tsx
├── services/              # External service integrations
│   ├── ChatGPTService.ts  # OpenAI API integration
│   └── VoiceService.ts    # Voice recording service
├── styles/                # Shared styling constants
│   └── commonStyles.ts
├── utils/                 # Helper utilities
│   └── errorLogger.ts
└── assets/               # Images and static assets
```

## 🔧 Configuration

### App Configuration (app.json)
- **Name**: Natively
- **Orientation**: Portrait only
- **Theme**: Dark mode
- **Platform Support**: iOS, Android, Web

### Technical Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router v5
- **State Management**: React Context API
- **Styling**: Inline styles with shared constants
- **Fonts**: Inter font family
- **Icons**: Expo Vector Icons
- **AI Integration**: OpenAI API (Whisper + GPT-3.5)

## 💡 Usage Examples

### Voice Input
1. Tap the microphone button on the dashboard
2. Speak naturally: "I earned $5000 this month from my salary"
3. The app will automatically:
   - Transcribe your speech
   - Identify it as income
   - Set the frequency as monthly
   - Add it to your income list

### Manual Entry
1. Use the "+" buttons for income or expenses
2. Fill in the amount, description, and frequency
3. For expenses, select a category
4. Save to add to your tracking

### Expense Categories
- 🍕 **Food & Dining**
- 🚗 **Transportation**
- 🏠 **Housing & Rent**
- 🎮 **Entertainment**
- 💡 **Utilities**
- 📦 **Other**

## 🔐 Data Storage

- **Local Storage**: All financial data is stored locally on your device
- **No Cloud Sync**: Your financial information never leaves your device
- **Data Structure**: JSON format in localStorage (web) or AsyncStorage (mobile)

## 🧪 Development Tips

### Running Without OpenAI API
The app includes a demo mode that simulates voice processing:
- Voice recording will still work
- A mock response will be generated
- Perfect for testing UI/UX without API costs

### Linting
Run the linter before committing:
```bash
npm run lint
```

### TypeScript
The project uses TypeScript for type safety. Key types are defined in:
- `context/FinanceContext.tsx` - Core data models
- `services/ChatGPTService.ts` - API response types

## 🚢 Deployment

### Web Deployment
```bash
npm run build:web
```
This creates an optimized build with service worker support for offline functionality.

### Mobile Deployment
For production builds, use Expo EAS:
```bash
eas build --platform ios
eas build --platform android
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Voice processing powered by [OpenAI](https://openai.com/)
- Icons from [@expo/vector-icons](https://icons.expo.fyi/)
- Font: [Inter](https://fonts.google.com/specimen/Inter)

## 📞 Support

For issues and feature requests, please use the GitHub issues page.

---

Made with ❤️ for better personal finance management