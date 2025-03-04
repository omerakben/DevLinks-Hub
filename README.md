# DevLinks Hub

A platform to share and discover developer resources. DevLinks Hub allows users to create and manage their own collection of developer resources, as well as discover resources shared by others.

## Features

### User Features
- **Authentication**: Sign in with Google
- **User Dashboard**: Manage your personal collection of developer resources
- **Link Management**: Add, edit, and delete links to developer resources
- **Category Management**: Organize your links by categories
- **Public Resources**: Discover resources shared by others

### Admin Features
- **Admin Dashboard**: Manage public resources for all users
- **Public Link Management**: Add, edit, and delete public links
- **Public Category Management**: Organize public links by categories

### Technical Features
- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Choose your preferred theme
- **Real-time Database**: Powered by Firebase Realtime Database
- **Authentication**: Secure authentication with Firebase Auth
- **Toast Notifications**: User-friendly notifications for actions
- **Modal Dialogs**: Clean and intuitive UI for forms
- **Confirmation Dialogs**: Prevent accidental deletions
- **Search Functionality**: Find resources quickly

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **Firebase**: Authentication and Realtime Database
- **Tailwind CSS**: Utility-first CSS framework
- **React**: JavaScript library for building user interfaces
- **Context API**: State management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devlinks-hub.git
cd devlinks-hub
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication and select Google as a sign-in method
3. Create a Realtime Database
4. Set up security rules for your database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "userLinks": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "publicLinks": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "publicCategories": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('isAdmin').val() === true"
    }
  }
}
```

## Project Structure

```
devlinks-hub/
├── public/            # Static assets
├── src/               # Source code
│   ├── app/           # Next.js app directory
│   │   ├── admin/     # Admin pages
│   │   ├── user/      # User pages
│   │   ├── layout.js  # Root layout
│   │   └── page.js    # Home page
│   ├── components/    # React components
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
│       ├── auth.js    # Authentication utilities
│       ├── client.js  # Firebase client
│       ├── database.js # Database utilities
│       └── context/   # React contexts
├── .env.local         # Environment variables (not in repo)
├── next.config.js     # Next.js configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
