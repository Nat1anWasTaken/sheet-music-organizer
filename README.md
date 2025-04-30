# Sheet Music Organizer

A web application for organizing, uploading, and managing sheet music collections. This project was created as a learning exercise for Next.js and Chakra UI.

## Project Overview

Sheet Music Organizer allows users to:
- Upload sheet music files (PDFs)
- Automatically generate metadata for uploaded files with Google Gemini API
- Browse and view sheet music collections
- Organize sheet music by title, composer, and arrangement type

## Technologies Used

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) - React framework for server-side rendering and static site generation
  - [React 19](https://react.dev/) - JavaScript library for building user interfaces
  - [Chakra UI 3](https://chakra-ui.com/) - Component library for building accessible React applications
  - [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
  - [PDF-lib](https://pdf-lib.js.org/) - For PDF manipulation

- **Authentication**:
  - [Auth0](https://auth0.com/) - Authentication and authorization platform

- **Database**:
  - [MongoDB](https://www.mongodb.com/) - NoSQL database

## Features

- **Sheet Music Upload**: Drag and drop interface for uploading PDF files
- **Metadata Generation**: Automatically extract and suggest metadata for uploaded files using Google Gemini API
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Secure user authentication with Auth0

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sheet-music-organizer-frontend.git
cd sheet-music-organizer-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the necessary variables.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Learning Purpose

This project was created to learn and practice:
- Next.js App Router and server components
- Chakra UI component library and styling system
- TypeScript with React
- Authentication integration with Auth0
- File uploads and processing
- MongoDB integration with Next.js

## Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)
