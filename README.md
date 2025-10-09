# 🎮 Pokemon App

A modern, interactive Pokemon application built with React and Vite. Explore, compare, and learn about Pokemon with a beautiful, responsive interface that supports both light and dark themes.

![Pokemon App](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔍 **Pokemon Explorer**
- Browse and search through all Pokemon
- Real-time search with autocomplete
- Detailed Pokemon information cards
- High-quality Pokemon images and sprites

### ⚖️ **Pokemon Comparison**
- Compare up to 3 Pokemon side by side
- Visual stats comparison with animated progress bars
- Base stats analysis with winner highlighting
- Type effectiveness and battle strategy recommendations

### 🧠 **Pokemon Quiz**
- Interactive quiz game with multiple difficulty levels
- Guess Pokemon by silhouette or description
- Score tracking and performance analytics
- Fully responsive with dark mode support

### 🎨 **Modern UI/UX**
- Beautiful, responsive design
- Dark/Light theme toggle
- Smooth animations and transitions
- Mobile-first responsive layout
- Bootstrap integration with custom styling

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AungKoKoKhant-akkk/Pokemon.git
   cd Pokemon
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the app running.

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
pokemon/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── nav/           # Navigation component
│   │   └── PokemonGrid/   # Pokemon grid display
│   ├── pages/             # Main application pages
│   │   ├── components/    # Page-specific components
│   │   ├── PokemonComparison/ # Pokemon comparison feature
│   │   └── PokemonQuiz/   # Quiz game functionality
│   ├── context/           # React Context providers
│   ├── services/          # API services and utilities
│   ├── styles/           # CSS and styling files
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Application entry point
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md            # This file
```

## 🛠 Technologies Used

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite
- **Styling**: CSS3, Bootstrap 5
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: Bootstrap Icons
- **API**: Pokemon API (RESTful)

## 🎮 How to Use

### 1. **Browse Pokemon**
- Navigate through the Pokemon grid
- Use the search bar to find specific Pokemon
- Click on any Pokemon card to view detailed information

### 2. **Compare Pokemon**
- Add Pokemon to comparison by clicking the compare button
- View side-by-side stats comparison
- Analyze type effectiveness and battle strategies
- Clear comparison to start fresh

### 3. **Take the Quiz**
- Select difficulty level (Easy, Medium, Hard)
- Choose game mode (Name by Image, Image by Name)
- Answer questions to test your Pokemon knowledge
- Track your score and improve over time

### 4. **Theme Switching**
- Use the theme toggle in the navigation
- Switch between light and dark modes
- All components adapt to your preferred theme

## 🌟 Key Features Deep Dive

### Pokemon Comparison Engine
- **Visual Stats Bars**: Animated progress bars showing relative stat strengths
- **Winner Highlighting**: Clear indication of which Pokemon excels in each stat
- **Type Analysis**: Comprehensive type effectiveness charts
- **Battle Recommendations**: Strategic advice based on Pokemon matchups

### Advanced Search
- **Real-time Filtering**: Instant results as you type
- **Smart Suggestions**: Autocomplete with Pokemon names
- **Visual Feedback**: Clear search state indicators

### Quiz System
- **Multiple Difficulty Levels**: Adaptive questioning based on skill level
- **Various Game Modes**: Different ways to test Pokemon knowledge
- **Performance Tracking**: Score history and improvement metrics

## 📱 Responsive Design

The app is fully responsive and optimized for:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop computers (1024px and up)
- 🖥 Large screens (1200px and up)

## 🎨 Theming

### Light Theme
- Clean, bright interface
- High contrast for accessibility
- Pokemon-inspired color palette

### Dark Theme
- Reduced eye strain for night usage
- Purple accent colors
- Maintains visual hierarchy and readability

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Start development server with `npm run dev`
4. Open `http://localhost:5173` in your browser

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Performance

- **Fast Loading**: Optimized with Vite for quick development and builds
- **Code Splitting**: Automatic code splitting for optimal loading
- **Image Optimization**: Efficient Pokemon image loading and caching
- **Responsive Images**: Adaptive image sizes for different screen sizes

## 🔗 API Integration

The app integrates with the Pokemon API to provide:
- Complete Pokemon database
- Detailed Pokemon statistics
- High-quality Pokemon images
- Type information and relationships

## 🐛 Known Issues

- Large Pokemon datasets may take time to load initially
- Some Pokemon images may occasionally fail to load
- Quiz difficulty balancing is ongoing

## 🚀 Future Enhancements

- [ ] Pokemon team builder
- [ ] Battle simulator
- [ ] More quiz game modes
- [ ] User profiles and saved favorites
- [ ] Pokemon evolution trees
- [ ] Advanced filtering options
- [ ] Offline support with PWA

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Pokemon API](https://pokeapi.co/) for providing comprehensive Pokemon data
- [React](https://reactjs.org/) for the amazing framework
- [Vite](https://vitejs.dev/) for the lightning-fast build tool
- [Bootstrap](https://getbootstrap.com/) for responsive design components

## 📞 Contact

**Aung Ko Ko Khant**
- GitHub: [@AungKoKoKhant-akkk](https://github.com/AungKoKoKhant-akkk)
- Project Link: [https://github.com/AungKoKoKhant-akkk/Pokemon](https://github.com/AungKoKoKhant-akkk/Pokemon)

---

**⭐ Star this repository if you find it helpful!**

Made with ❤️ and ⚡ by [Aung Ko Ko Khant](https://github.com/AungKoKoKhant-akkk)
