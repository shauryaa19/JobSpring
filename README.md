# JobSpring - Job Board Application

A React-based job board application with mock data, featuring job search, user profiles, and an AI chatbot assistant (Buddy Bot).

## Features

### Dynamic Features (Real-time/Interactive)
- **Job Search & Filtering**: Search jobs by title, company, location with real-time filtering
- **Profile Management**: Edit and update user profile information with form validation
- **Theme Switching**: Toggle between light and dark themes with localStorage persistence
- **AI Chatbot**: Interactive chat assistant with localStorage message history sync and user/bot avatars
- **Job Applications**: Save jobs and apply to positions with compatibility scoring
- **Responsive Pagination**: Dynamic pagination that adjusts based on screen size
- **Real-time Profile Sync**: Profile updates reflect immediately across all components
- **Job Compatibility Scoring**: Intelligent job matching based on user profile and preferences

### Static Features (Mock Data/Simulated)
- **Job Listings**: All job data is mock data stored in `src/data/jobs.js`
- **User Profile**: Profile data is mock data in `src/data/profile.js`
- **Applications**: Application history is static mock data
- **API Responses**: All API calls are simulated with 10% error probability
- **Chatbot Responses**: Pre-defined responses based on keyword matching

## Tech Stack

- **React 19.1.0** - UI framework with functional components and hooks
- **React Router DOM 7.7.1** - Client-side routing
- **Vite 7.0.4** - Build tool and dev server
- **Lucide React** - Icons
- **@lottiefiles/dotlottie-react** - Hero section animation
- **Jest** - Testing framework
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/             # Reusable components (Button, Modal, etc.)
│   ├── jobs/           # Job listing components
│   ├── profile/        # Profile management components
│   ├── Navigation.jsx  # Main navigation
│   └── Chatbot.jsx     # AI chat assistant
├── pages/              # Page components
│   ├── HomePage.jsx    # Landing page with search
│   ├── JobsPage.jsx    # Job listing with filters
│   ├── JobDetailsPage.jsx # Individual job view
│   └── ProfilePage.jsx # User profile management
├── hooks/              # Custom React hooks
├── context/            # React Context (ThemeContext)
├── services/           # Mock API service
├── data/               # Static mock data
├── utils/              # Utility functions
└── styles/             # CSS files
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open http://localhost:5173

## How It Works

### Job Search
- Search jobs using the search bar on the home page
- Apply filters for job type, salary, experience level
- View job compatibility scores (calculated from mock data)
- Click job cards to see detailed descriptions
- Real-time filtering and search functionality

### Profile System
- View and edit profile information (name, title, location, etc.)
- Track mock application history
- View profile statistics and activity
- Form validation for profile updates
- Real-time profile synchronization across components

### AI Chatbot with localStorage Sync
- Click the chat icon to open the assistant
- Ask questions about jobs, resume tips, interviews
- **Chat history persists in localStorage** - messages remain after page refresh
- Responses are based on keyword matching in the message
- Quick action buttons for common queries
- Clear chat history option
- User and bot avatars for better UX
- Typing indicators and loading states

### Theme System
- Toggle between light and dark themes
- **Theme preference saved in localStorage** - persists across sessions
- Automatically applies theme classes to the document
- Smooth transitions between themes

## Responsive Design

### Mobile (< 768px)
- Single column job grid
- 4 jobs per page
- Collapsible filters
- Touch-friendly interactions
- Floating chatbot button

### Tablet (768px - 1024px)
- Two column job grid
- 8 jobs per page
- Side-by-side filters
- Medium-sized touch targets

### Desktop (> 1024px)
- Three column job grid
- 12 jobs per page
- Full-width filters
- Hover effects and detailed interactions

## API Simulation

The application uses a mock API service (`src/services/api.js`) that:
- Simulates network delays (300ms - 1200ms)
- Has 10% error probability for testing error handling
- Returns mock data for all endpoints
- Includes realistic pagination and filtering
- Simulates different response times for different operations

## State Management

- **Context API**: Global theme state with localStorage persistence
- **Custom Hooks**: API calls, localStorage, modal state
- **Shared Profile Cache**: Real-time profile updates across components
- **Local Storage**: Theme preference and chat history persistence

## Testing

Run tests with:
```bash
npm test
npm run test:coverage
```

Tests cover:
- Custom hooks (useLocalStorage, useTheme, useModal)
- Context providers
- Utility functions
- Component rendering

## What's Mock vs Real

### Mock (Static Data)
- All job listings and company information
- User profile data and application history
- API responses and network calls
- Chatbot intelligence (keyword-based responses)

### Real (Dynamic/Interactive)
- User interface and interactions
- Theme switching and localStorage persistence
- Search and filtering functionality
- Responsive design and pagination
- Component state management
- Error handling and loading states
- Chatbot message history persistence
- Job compatibility UI
- Form validation and user input processing

## Development Notes

- Built with modern React patterns (hooks, context, custom hooks)
- Uses CSS custom properties for theming
- Implements responsive design with CSS Grid and Flexbox
- Follows component-based architecture
- Includes comprehensive error handling
- Uses ESLint for code quality
- localStorage integration for persistent user preferences
- Semantic HTML and accessibility features
- Performance optimizations using useCallback and API caching

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
