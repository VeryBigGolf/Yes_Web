# Boiler 11 Operations Dashboard

A real-time boiler operations monitoring and analytics dashboard built with Node.js, Express, Socket.IO, React, and TypeScript.

## Features

- **Real-time Monitoring**: Live data streaming with Socket.IO
- **Interactive Charts**: Time series visualization with Recharts
- **KPI Dashboard**: Key performance indicators with sparklines
- **AI Suggestions**: Optimization recommendations (mock implementation)
- **Chat Assistant**: AI-powered boiler operations assistant (mock implementation)
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui
- **Dark Mode**: Built-in dark/light theme toggle
- **CSV Data Support**: Automatic CSV parsing with demo data fallback

## Tech Stack

### Backend
- **Node.js** with **Express** and **TypeScript**
- **Socket.IO** for real-time communication
- **csv-parse** for CSV data processing
- **CORS** enabled for development

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization
- **Zustand** for state management
- **Socket.IO Client** for real-time updates

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env and add your GROQ_API_KEY (optional for now)
   ```

3. **Add your CSV data (optional):**
   - Place your `Boiler11_1.csv` file in the project root or `server/data/` directory
   - If no CSV is found, the app will use demo data automatically

4. **Start development servers:**
   ```bash
   npm run dev
   ```
   This starts both the Express server (port 8080) and Vite dev server (port 5173).

5. **Open your browser:**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend (Vite)
- `npm run dev:server` - Start only the backend (Express + Socket.IO)
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start the production server
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
├── server/                 # Backend Express server
│   ├── index.ts           # Main server file with Express + Socket.IO
│   ├── csv.ts             # CSV parsing and data management
│   ├── suggestions.ts     # Mock suggestions generator
│   ├── chat.ts            # Mock chat handler (TODO: GROQ integration)
│   ├── types.ts           # Server-side type definitions
│   └── data/              # Optional CSV data directory
├── src/                   # Frontend React application
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── Header.tsx    # Top navigation bar
│   │   ├── Sidebar.tsx   # Left navigation sidebar
│   │   ├── KpiCard.tsx   # KPI display cards
│   │   ├── TimeSeriesChart.tsx # Main chart component
│   │   ├── SuggestionsPanel.tsx # Suggestions display
│   │   └── ChatDrawer.tsx # Chat interface
│   ├── pages/            # Main application pages
│   │   ├── Overview.tsx  # Dashboard overview
│   │   ├── TimeSeries.tsx # Time series analysis
│   │   ├── Suggestions.tsx # Optimization suggestions
│   │   └── Settings.tsx  # Application settings
│   ├── hooks/            # Custom React hooks
│   │   ├── useCsvData.ts # Data fetching hooks
│   │   └── useRealtime.ts # Socket.IO real-time hooks
│   ├── store/            # Zustand state management
│   │   └── useDashboardStore.ts
│   ├── lib/              # Utility functions
│   │   ├── utils.ts      # General utilities
│   │   ├── thresholds.ts # Parameter thresholds
│   │   ├── format.ts     # Data formatting
│   │   └── route.ts      # Navigation helpers
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main application component
│   └── main.tsx          # React entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration with proxy
├── tailwind.config.ts    # Tailwind CSS configuration
└── README.md            # This file
```

## API Endpoints

### REST API
- `GET /api/parameters` - Get list of all parameters
- `GET /api/data?feature=<name>&range=<time>` - Get time series data
- `GET /api/suggestions` - Get optimization suggestions
- `GET /api/suggestions/top?limit=<n>` - Get top N suggestions
- `POST /api/chat` - Send chat message (mock implementation)
- `GET /api/status` - Get system status

### Socket.IO Events
- `subscribe-realtime` - Subscribe to real-time updates for a feature
- `unsubscribe-realtime` - Unsubscribe from real-time updates
- `tick` - Real-time data update (emitted by server)

## Data Format

### CSV Requirements
The application expects a CSV file with the following structure:
- **Time column**: ISO timestamp format
- **Parameter columns**: Numeric values for all measurements

Example columns:
```
Time,BOILER MASTER,HP FEEDWATER FLOW,MAIN STEAM FLOW,...
```

### API Response Format
```typescript
// Time series data
type DataPoint = { t: string; v: number }

// Suggestions
type Suggestion = {
  id: string;
  title: string;
  reason: string;
  feature: string;
  delta: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}
```

## Configuration

### Thresholds
Parameter thresholds are defined in `src/lib/thresholds.ts`:
```typescript
export const THRESHOLDS: Record<string, { min?: number; max?: number }> = {
  'MAIN STEAM PRESSURE': { min: 35, max: 65 },
  'MAIN STEAM TEMPERATURE': { min: 350, max: 540 },
  // ... more thresholds
}
```

### Time Ranges
Available time ranges for data visualization:
- 15 minutes
- 1 hour  
- 8 hours
- 24 hours

## Development

### Adding New Features

1. **New API Endpoints**: Add routes in `server/index.ts`
2. **New Components**: Create in `src/components/`
3. **New Pages**: Add to `src/pages/` and update routing in `App.tsx`
4. **State Management**: Extend `src/store/useDashboardStore.ts`

### GROQ Integration (TODO)

To enable real AI chat functionality:

1. Get a GROQ API key from [console.groq.com](https://console.groq.com)
2. Add it to your `.env` file
3. Uncomment the GROQ implementation in `server/chat.ts`
4. Install the GROQ SDK: `npm install groq-sdk`

### Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Environment variables for production:**
   ```bash
   NODE_ENV=production
   PORT=8080
   GROQ_API_KEY=your_actual_key
   ```

## Troubleshooting

### Common Issues

1. **CSV not loading**: Ensure the CSV file is in the correct location and has proper formatting
2. **Socket.IO connection issues**: Check that both servers are running and ports are available
3. **Build errors**: Run `npm run type-check` to identify TypeScript issues

### Performance Tips

- Use the real-time toggle sparingly to reduce server load
- Limit time ranges for large datasets
- Consider implementing data pagination for very large CSV files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub

---

**Note**: This is a demonstration application. For production use, implement proper authentication, data validation, error handling, and security measures.
