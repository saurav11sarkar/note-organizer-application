# NoteApp - Organize Your Thoughts Efficiently

![NoteApp Screenshot](/NoteApplication.png)

NoteApp is a modern, user-friendly note-taking application designed to help you organize your thoughts, ideas, and tasks efficiently. With a clean interface and powerful features, NoteApp makes it easy to capture, categorize, and access your notes anytime, anywhere.

## Features ✨

- **User Authentication**: Secure login with email/password or social providers (Google, GitHub)
- **Note Management**: Create, edit, view, and organize your notes
- **Categories**: Group notes by categories for better organization
- **Dashboard**: Overview of your notes and categories at a glance
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Rich Text Editing**: Create formatted notes with ease
- **Profile Management**: Update your profile information and avatar

## Live Demo 🌐

Experience NoteApp live: [https://frontend-nine-wheat-31.vercel.app](https://frontend-nine-wheat-31.vercel.app)

## Technology Stack 🛠️

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **UI Components**: Lucide Icons
- **Form Handling**: Form
- **Notifications**: Sonner toast notifications

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB Atlas account (for database)
- Google OAuth credentials (for social login)
- GitHub OAuth credentials (for social login)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saurav11sarkar/note-organizer-application.git
   cd note-organizer-application
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000 || https://note-backend-pink.vercel.app
   NEXTAUTH_URL=http://localhost:3000 || https://frontend-nine-wheat-31.vercel.app
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_random_secret_string
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure 📂

```
note-organizer-application/
├── components/          # Reusable components
├── pages/               # Application pages
├── provider/            # Context providers
├── services/            # API services
├── styles/              # Global styles
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

For questions or suggestions, please contact:

Saurav Sarkar  
[sarkar15-4285@diu.edu.bd](mailto:sarkar15-4285@diu.edu.bd)  
[GitHub Profile](https://github.com/saurav11sarkar)

---

Happy Note Taking! 📝✨