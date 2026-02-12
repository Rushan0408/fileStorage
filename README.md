# ☁️ Cloud File Storage System

A full-stack cloud-based file storage application with secure authentication, real-time file management, and S3 integration. Built with Spring Boot, React Router v7, and MongoDB.

## 📹 Video Preview

[![Watch Demo](https://img.youtube.com/vi/jf6MYJMsdts/maxresdefault.jpg)](https://youtu.be/jf6MYJMsdts)


--- --

https://github.com/user-attachments/assets/911924b1-771c-405d-b532-96a4f30f8f48



## 📊 System Architecture

<!-- Add your high-level architecture diagram here -->

<img width="800" height="2000" alt="image" src="https://github.com/user-attachments/assets/128185ed-4616-43ec-aa9c-dbd48a3a6c3d" />


---

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- ✅ **File Upload/Download** - Direct S3 upload using presigned URLs for optimal performance
- ✅ **Folder Management** - Create hierarchical folder structures with breadcrumb navigation
- ✅ **File Search** - Search files by name, type, and metadata
- ✅ **Storage Quota** - Track storage usage with visual indicators
- ✅ **Real-time Updates** - Instant UI updates after file operations

### Security Features
- 🔐 JWT token-based authentication (24-hour expiry)
- 🔒 Bcrypt password hashing
- 🛡️ CORS protection
- 🔑 Presigned S3 URLs (1-hour expiry for uploads/downloads)
- 👤 User-level access control

### User Experience
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast uploads with progress tracking
- 📂 Intuitive folder navigation
- 🔍 Quick file search
- 💾 Storage usage visualization

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with React Router v7
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** MongoDB
- **Authentication:** JWT (jjwt library)
- **Security:** Spring Security
- **Storage:** AWS S3
- **Build Tool:** Maven

### Infrastructure
- **File Storage:** AWS S3
- **Database:** MongoDB Atlas / Local MongoDB
- **Authentication:** JWT Tokens
- **API Design:** RESTful API

---

## 📁 Project Structure

### Frontend Structure
```
cloud-storage-frontend/
├── app/
│   ├── routes/
│   │   ├── _index.tsx                 # Landing page
│   │   ├── login.tsx                  # Login page
│   │   ├── register.tsx               # Registration page
│   │   └── dashboard/
│   │       ├── _layout.tsx            # Dashboard layout with auth
│   │       ├── _index.tsx             # Dashboard home (root files/folders)
│   │       ├── folder.$folderId.tsx   # Folder view with contents
│   │       └── search.tsx             # File search page
│   ├── components/
│   │   ├── Navbar.tsx                 # Top navigation bar
│   │   ├── Sidebar.tsx                # Sidebar with storage stats
│   │   ├── FileUpload.tsx             # File upload modal
│   │   ├── FileList.tsx               # File grid display
│   │   ├── FolderList.tsx             # Folder grid display
│   │   └── CreateFolder.tsx           # Folder creation modal
│   ├── lib/
│   │   ├── api.ts                     # API client and endpoints
│   │   ├── auth.ts                    # Authentication utilities
│   │   └── types.ts                   # TypeScript type definitions
│   └── root.tsx                       # Root layout
├── public/
└── package.json
```

### Backend Structure
```
file-storage-backend/
├── src/main/java/com/fileStorage/
│   ├── config/
│   │   ├── SecurityConfig.java        # Spring Security configuration
│   │   ├── CorsConfig.java            # CORS configuration
│   │   └── S3Config.java              # AWS S3 configuration
│   ├── controller/
│   │   ├── AuthController.java        # Authentication endpoints
│   │   ├── FileController.java        # File management endpoints
│   │   ├── FolderController.java      # Folder management endpoints
│   │   └── StorageController.java     # Storage stats endpoints
│   ├── service/
│   │   ├── AuthService.java           # Authentication logic
│   │   ├── FileService.java           # File operations
│   │   ├── FolderService.java         # Folder operations
│   │   ├── S3Service.java             # AWS S3 integration
│   │   └── StorageService.java        # Storage calculations
│   ├── repository/
│   │   ├── UserRepository.java        # User data access
│   │   ├── FileRepository.java        # File metadata access
│   │   └── FolderRepository.java      # Folder data access
│   ├── model/
│   │   ├── User.java                  # User entity
│   │   ├── File.java                  # File metadata entity
│   │   └── Folder.java                # Folder entity
│   ├── dto/
│   │   ├── AuthResponse.java          # Auth response DTO
│   │   ├── FileUploadRequest.java     # Upload request DTO
│   │   ├── UploadResponse.java        # Upload response DTO
│   │   └── StorageStatsDto.java       # Storage stats DTO
│   └── security/
│       ├── JwtAuthFilter.java         # JWT authentication filter
│       └── AuthUtil.java              # JWT utility methods
├── src/main/resources/
│   └── application.yml                # Application configuration
└── pom.xml
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  password: String (bcrypt hashed),
  storageUsed: Long,              // Bytes used
  storageQuota: Long,             // Default: 10 GB
  createdAt: Date,
  updatedAt: Date
}
```

### Folders Collection
```javascript
{
  _id: ObjectId,
  name: String,
  ownerId: ObjectId (indexed),
  parentFolderId: ObjectId (nullable, indexed),
  path: String,                   // e.g., "/Documents/Work"
  createdAt: Date,
  updatedAt: Date
}
```

### Files Collection
```javascript
{
  _id: ObjectId,
  name: String,
  ownerId: ObjectId (indexed),
  folderId: ObjectId (indexed, nullable),
  size: Long,
  mimeType: String,
  s3Key: String (unique),
  s3Bucket: String,
  uploadStatus: String,           // "pending", "complete", "failed"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register        Register new user
POST   /api/v1/auth/login           Login user
```

### Folders
```
POST   /api/v1/folders              Create folder
GET    /api/v1/folders              Get root folders
GET    /api/v1/folders/{id}/contents  Get folder contents
DELETE /api/v1/folders/{id}         Delete folder
```

### Files
```
POST   /api/v1/files/initiate-upload  Get presigned S3 URL
POST   /api/v1/files/{id}/complete    Mark upload as complete
GET    /api/v1/files/{id}/download    Get download URL
GET    /api/v1/files/root             Get root files
DELETE /api/v1/files/{id}             Delete file
GET    /api/v1/files/search           Search files
```

### Storage
```
GET    /api/v1/storage/stats        Get storage statistics
```

---

## 🎯 File Upload Flow

1. **Client initiates upload**
   - Frontend sends file metadata to `/files/initiate-upload`
   - Backend creates file record with `uploadStatus: "pending"`

2. **Backend generates presigned URL**
   - Creates unique S3 key: `users/{userId}/{timestamp}-{uuid}-{filename}`
   - Generates presigned PUT URL (valid for 1 hour)
   - Returns `fileId` and `uploadUrl` to client

3. **Client uploads to S3**
   - Direct upload to S3 using presigned URL
   - Shows progress bar to user
   - No backend bottleneck

4. **Client confirms completion**
   - Calls `/files/{fileId}/complete`
   - Backend verifies file exists in S3
   - Updates `uploadStatus: "complete"`
   - Updates user's `storageUsed`

5. **File appears in UI**
   - Dashboard refreshes
   - File shows in appropriate folder

---

## 🔐 Authentication Flow

### Registration
```
1. User submits username + password
2. Backend hashes password with bcrypt
3. Creates user with default 10GB quota
4. Generates JWT token (24h expiry)
5. Returns token + user info
6. Frontend stores token in localStorage
```

### Login
```
1. User submits credentials
2. Backend verifies password hash
3. Generates new JWT token
4. Returns token + user info
5. Frontend stores token and redirects to dashboard
```

### Protected Requests
```
1. Frontend sends JWT in Authorization header
2. JwtAuthFilter validates token
3. Extracts userId from token claims
4. Sets authentication in SecurityContext
5. Controller receives authenticated userId
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- MongoDB (local or Atlas)
- AWS Account with S3 bucket

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cloud-storage.git
   cd cloud-storage/backend
   ```

2. **Configure application.yml**
   ```yaml
   spring:
     data:
       mongodb:
         uri: mongodb://localhost:27017/cloudstorage
   
   aws:
     s3:
       bucket: your-bucket-name
       region: us-east-1
       access-key: ${AWS_ACCESS_KEY}
       secret-key: ${AWS_SECRET_KEY}
   
   jwt:
     secret: your-super-secret-jwt-key-change-in-production
     expiration: 86400000  # 24 hours
   
   storage:
     default-quota: 10737418240  # 10 GB
   ```

3. **Set environment variables**
   ```bash
   export AWS_ACCESS_KEY=your-access-key
   export AWS_SECRET_KEY=your-secret-key
   ```

4. **Build and run**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   Backend runs on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

### AWS S3 Setup

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

2. **Configure CORS**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:5173"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Set bucket policy** (adjust as needed for production)

---

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Test File Upload Flow
1. Register/login to get JWT token
2. Call initiate-upload endpoint
3. Upload file to returned S3 URL
4. Call complete endpoint
5. Verify file appears in dashboard

---

## 📈 Performance Optimizations

### Frontend
- **Direct S3 uploads** - No backend bottleneck
- **Lazy loading** - Components load on demand
- **Optimistic UI updates** - Immediate feedback
- **Debounced search** - Reduces API calls

### Backend
- **Presigned URLs** - Offload file transfer to S3
- **Database indexing** - Fast queries on userId, folderId
- **Stateless JWT** - No session storage needed
- **Connection pooling** - Efficient MongoDB connections

### Storage
- **S3 lifecycle policies** - Archive old files
- **Multipart uploads** - Handle large files (>100MB)
- **CDN integration ready** - CloudFront support

---

## 🔒 Security Best Practices

### Implemented
✅ Password hashing with bcrypt (10 rounds)  
✅ JWT tokens with expiration  
✅ CORS configuration  
✅ Input validation  
✅ SQL/NoSQL injection prevention  
✅ Presigned URL expiration (1 hour)  
✅ User-level access control  

### Recommended for Production
⚠️ HTTPS only  
⚠️ Rate limiting on auth endpoints  
⚠️ File type validation/scanning  
⚠️ API request throttling  
⚠️ Encrypted S3 buckets  
⚠️ Environment variable encryption  
⚠️ Security headers (CSP, HSTS)  
⚠️ Regular dependency updates  

---

## 🐛 Known Issues & Limitations

1. **Single file upload** - Bulk upload not yet implemented
2. **No file versioning** - Overwrites on duplicate names
3. **No sharing features** - Cannot share files with other users
4. **No trash/recycle bin** - Deletions are permanent
5. **No file preview** - Cannot preview files in browser
6. **No compression** - Large files upload as-is

---

## 🚧 Future Enhancements

### Planned Features
- [ ] Bulk file upload/download
- [ ] File sharing with permissions
- [ ] Trash/recycle bin with auto-cleanup
- [ ] File versioning
- [ ] In-browser file preview (images, PDFs, videos)
- [ ] File compression before upload
- [ ] Public file links with expiration
- [ ] Two-factor authentication
- [ ] Activity logs and audit trail
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] File comments and annotations

### Technical Improvements
- [ ] Redis caching for frequently accessed data
- [ ] Elasticsearch for better search
- [ ] WebSocket for real-time updates
- [ ] Background job processing (file scanning, thumbnails)
- [ ] CDN integration (CloudFront)
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] Automated testing (unit, integration, e2e)
- [ ] API documentation (Swagger/OpenAPI)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@Rushan0408](https://github.com/Rushan0408)
- LinkedIn: [Rushan](https://www.linkedin.com/in/rushan-gupta-374886249/)
- Email: rushangupta99@gmail.com

---

## 🙏 Acknowledgments

- Spring Boot for excellent backend framework
- React Router for modern routing
- MongoDB for flexible document storage
- AWS S3 for reliable file storage
- Tailwind CSS for beautiful styling
- Lucide for clean icons

---

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

