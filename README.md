# AI Scenario Explorer

An interactive web application for exploring AI development scenarios and timelines. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Overview

This tool allows users to configure parameters related to AI development and explore different scenarios for how AI capabilities might evolve starting from January 1st, 2027. Users can navigate through branching timelines showing different potential outcomes based on various decisions and events.

## Features

### Current Features (v1.0)
- **Parameter Configuration**: Configure 5 key AI development parameters:
  1. Coding Time Horizon Doubling Rate
  2. Time Horizon Required for Automated Coder (AC)
  3. Difficulty Scaling per Doubling
  4. Top to Median Researcher Value Ratio
  5. AI Research Taste Improvement Speed

- **Company Leaderboard**: Set relative capability leads for major AI companies (Google, Anthropic, OpenAI, xAI, Meta)

- **Pre-written Scenarios**: 5 detailed scenarios for January 1st, 2027, each corresponding to different parameter configurations

- **Branching Timelines**: Navigate through 3-month increments exploring how scenarios could evolve

### Planned Features
- **Community Wiki**: Allow users to create and share their own scenario branches
- **Prediction Markets**: Users can forecast and vote on scenario likelihood
- **Public Sharing**: Share specific parameter configurations and scenario paths via URL
- **Backend Integration**: Database storage for user-created content
- **Authentication**: User accounts for contributing scenarios

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd ai-scenario-explorer
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note**: The project uses Tailwind CSS v4 which requires the `@tailwindcss/postcss` plugin. This is already configured in `postcss.config.js`.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **React**: 19

## Project Structure

```
ai-scenario-explorer/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page (parameter config)
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ScenarioView.tsx   # Scenario display and branching UI
├── data/                  # Data files
│   ├── parameters.ts      # Parameter definitions
│   └── scenarios.ts       # Pre-written scenarios
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types
└── README.md             # This file
```

## Parameter Values

The parameter values are based on the [AI Futures Model](https://www.aifuturesmodel.com). Each parameter has 5 options representing different possible values. The current values are placeholders and should be updated with actual median values from the AI Futures Model.

To update parameter values, edit `data/parameters.ts`.

## Contributing

This is an open source project. Contributions are welcome!

### Adding New Scenarios

To add a new scenario, edit `data/scenarios.ts` and add a new scenario object following the existing structure:

```typescript
{
  id: 'scenario-6',
  date: '2027-01-01',
  title: 'Your Scenario Title',
  description: 'Detailed description...',
  configuration: { /* parameter values */ },
  branches: [ /* branching options */ ]
}
```

### Extending Functionality

Future contributors can:
1. Add backend database integration (PostgreSQL, MongoDB, or Supabase recommended)
2. Implement user authentication
3. Build prediction market features
4. Add URL sharing functionality
5. Create data visualization components

## License

ISC

## Acknowledgments

- Parameter framework inspired by [AI Futures Model](https://www.aifuturesmodel.com)
- Built with Next.js and Tailwind CSS
