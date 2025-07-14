# Note Organizer Application - Backend



## Overview

The Note Organizer Application backend is a robust RESTful API built with Node.js, Express, and MongoDB. It provides the core functionality for a full-featured note-taking application with user authentication, note management, and category organization.

## Key Features

- 🔐 **Secure Authentication** (JWT, bcrypt)
- 📝 **Note Management** (CRUD operations)
- 📂 **Category Organization**
- ☁️ **Cloudinary Image Upload**
- 📊 **Pagination & Filtering**
- 🔍 **Search Functionality**
- 🛡️ **Role-Based Access Control**
- 🔄 **Social Login Integration**

## Live Deployment

🌐 **Backend API**: [https://note-backend-pink.vercel.app](https://note-backend-pink.vercel.app)

🔌 **Frontend**: [https://frontend-nine-wheat-31.vercel.app](https://frontend-nine-wheat-31.vercel.app)

## Technology Stack

### Core
- **Node.js** (v18+)
- **Express.js**
- **MongoDB** (Atlas)
- **Mongoose** (ODM)

### Authentication
- **JWT** (JSON Web Tokens)
- **bcrypt** (Password hashing)
- **OAuth** (Google, GitHub)

### Utilities
- **Cloudinary** (Image storage)
- **Multer** (File upload)
- **CORS** (Cross-origin requests)
- **Helmet** (Security headers)
- **Morgan** (Request logging)

## API Endpoints

### Authentication
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| POST   | `/api/user/register` | Register new user              |
| POST   | `/api/user/login`    | User login                     |
| POST   | `/api/user/refreshToken` | Refresh access token       |

### Notes
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/api/note`       | Get all notes (paginated)       |
| POST   | `/api/note`       | Create new note                 |
| GET    | `/api/note/:id`   | Get single note                 |
| PUT    | `/api/note/:id`   | Update note                     |
| DELETE | `/api/note/:id`   | Delete note                     |

### Categories
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/api/category`   | Get all categories              |
| POST   | `/api/category`   | Create new category             |
| GET    | `/api/category/:id` | Get single category           |
| PUT    | `/api/category/:id` | Update category               |
| DELETE | `/api/category/:id` | Delete category               |

## Database Schema

```mermaid
erDiagram
    USER ||--o{ NOTE : creates
    USER ||--o{ CATEGORY : creates
    CATEGORY ||--o{ NOTE : contains
    
    USER {
        string _id
        string name
        string email
        string password
        string role
        string method
        string image
        date createdAt
        date updatedAt
    }
    
    NOTE {
        string _id
        string title
        string content
        ObjectId category
        ObjectId user
        string image
        date createdAt
        date updatedAt
    }
    
    CATEGORY {
        string _id
        string name
        ObjectId user
        date createdAt
        date updatedAt
    }
```

## Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
SALT_ROUNDS=10
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saurav11sarkar/note-organizer-application.git
   cd note-organizer-application/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Development

- Run in development mode:
  ```bash
  npm run dev
  ```

- Lint code:
  ```bash
  npm run lint
  ```

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error",
  "stack": "Error stack (development only)"
}
```

## Rate Limiting

API requests are rate-limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Security Features

- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ CSRF protection
- ✅ CORS configuration
- ✅ Secure HTTP headers (Helmet)
- ✅ Input validation
- ✅ Rate limiting

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Saurav Sarkar**  
📧 [sarkar15-4285@diu.edu.bd](mailto:sarkar15-4285@diu.edu.bd)  
💻 [GitHub Profile](https://github.com/saurav11sarkar)