# FlowSync - Intelligent Workflow Management System

[![Next.js](https://img.shields.io/badge/built%20with-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

FlowSync is an advanced workflow management system designed to streamline communication and task handling across various platforms. It intelligently processes, categorizes, and manages information from multiple sources including email and Slack, using AI-powered analysis to prioritize and organize your workflow.

## 🚀 Core Features

### 🔄 Multi-platform Integration
- **Email Integration**: Automatically fetches, processes, and categorizes emails from Gmail
- **Slack Integration**: Seamless communication with Slack workspaces
- **Expandable Platform Support**: Designed with a modular architecture for adding future platforms

### 🤖 AI-Powered Analysis
- **Intelligent Classification**: Automatically categorizes communications into three priority levels:
  - `FLOW_CRITICAL` - Urgent items requiring immediate attention
  - `FLOW_ACTION` - Items requiring action but not time-sensitive
  - `FLOW_INFO` - Informational content requiring no action
- **Content Analysis**: Extracts key information and generates summaries

### 📋 Workflow Management
- **Briefings**: Consolidated information views and summaries
- **Tasks**: Structured task management with priority-based organization
- **Messages**: Unified inbox for communications across platforms

### 🔐 Secure Authentication
- NextAuth.js integration with Google OAuth support
- Role-based access control

## 🛠️ Technology Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI Components

- **Backend**:
  - Next.js API Routes
  - MongoDB Database Integration
  - NextAuth.js Authentication

- **AI/ML**:
  - OpenAI API Integration
  - Custom Classification Models
  - Content Summarization

- **External Integrations**:
  - Google Gmail API
  - Slack API
  - PubSub for real-time updates

## 🏗️ Architecture

FlowSync follows a modern, microservices-oriented architecture:

```
┌─────────────────┐     ┌────────────────┐     ┌──────────────────┐
│  NextJS Frontend│     │ API Layer      │     │ External Services│
│  - React UI     │<───>│ - Data Handlers│<───>│ - Gmail          │
│  - Components   │     │ - Auth         │     │ - Slack          │
└─────────────────┘     └───────┬────────┘     └──────────────────┘
                               │
                      ┌────────▼────────┐
                      │ Analysis Engine │
                      │ - Classification│
                      │ - Processing    │
                      └───────┬─────────┘
                              │
                      ┌───────▼─────────┐
                      │   Data Storage  │
                      │   (MongoDB)     │
                      └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB instance
- API keys for integrations (Google, Slack)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flowsync.git
cd flowsync
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with the following:
```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_string_here

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Keys
OPENAI_API_KEY=your_openai_api_key

# Database
MONGODB_URI=your_mongodb_connection_string

# Integration Keys
SLACK_APP_TOKEN=your_slack_app_token
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📚 API Documentation

### Message Analysis
`POST /api/analyze`
Analyzes message content and returns classification and insights.

### Email Integration
`POST /api/messages/email`
Handles incoming email processing.

### Slack Integration
`POST /api/messages/slack`
Processes Slack messages and events.

### Task Management
`GET|POST|PUT /api/tasks`
Manages task creation, updates, and retrieval.

### Briefings
`GET|POST /api/briefing`
Handles creation and retrieval of briefings.

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## 🔧 Advanced Configuration

### Custom Classification Rules

Create custom rules by modifying the classification engine in:
```
src/lib/analysis/message-analysis.ts
```

### Adding New Integrations

Extend the integration system by implementing new providers in:
```
src/lib/integrations/
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [MongoDB](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Vercel](https://vercel.com/) - Deployment platform
