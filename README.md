# 🎬 Stream-Core

A production-style YouTube-like backend built with **Node.js**, **Express**, and **MongoDB**.  
Covers real-world concepts like JWT auth, Cloudinary media uploads, aggregation pipelines, and a full channel/subscription system.

---

## 📌 Features

### 🔐 Authentication
- Register with avatar + cover image upload (Multer → Cloudinary)
- JWT-based login with access token + refresh token
- httpOnly cookie security
- Refresh token rotation
- Change password, logout

### 🎥 Video Management
- Upload video + thumbnail (Cloudinary)
- Get all videos, get by ID
- Update title, description, thumbnail
- Toggle publish/unpublish status
- Delete video

### 💬 Tweets
- Create, update, delete tweets
- Bulk delete tweets
- Get all tweets of a user

### 🗨️ Comments
- Add, update, delete comments on videos
- Get all comments for a video (with pagination via `mongoose-aggregate-paginate-v2`)

### ❤️ Likes
- Toggle like/unlike on videos, comments, and tweets
- Get all liked videos of current user

### 📂 Playlists
- Create, update, delete playlists
- Add / remove videos from a playlist
- Get playlist by ID (with populated videos)
- Get all playlists of a user

### 🔔 Subscriptions
- Toggle subscribe/unsubscribe to a channel
- Get all subscribers of a channel
- Get all channels a user is subscribed to

### 📊 Dashboard (Aggregation Pipelines)
- Total videos uploaded
- Total views across all videos
- Total subscribers
- Total likes (via `$lookup` across Like collection)
- Get all videos of a channel

---

## 🧠 Concepts Covered

- RESTful API design
- JWT authentication (access + refresh tokens)
- MongoDB Aggregation Pipeline (`$lookup`, `$group`, `$project`)
- Mongoose Relationships (`ref` + `populate`)
- File uploads with Multer + Cloudinary
- Custom error handling (`ApiError`, `asyncHandler`)
- Modular MVC structure
- Mongoose indexes for performance + uniqueness

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Media Storage | Cloudinary |
| File Uploads | Multer |
| Validation | Custom middleware |
| Dev Tools | Nodemon, Prettier |

---

## 📁 Project Structure

```
src/
├── config/          # Environment variable exports
├── controllers/     # Business logic (one file per module)
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── tweet.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── dashboard.controller.js
│   └── healthCheck.controller.js
├── db/              # MongoDB connection
├── middlewares/
│   ├── auth.middleware.js     # verifyJWT
│   └── multer.middleware.js   # file uploads
├── models/          # Mongoose schemas
│   ├── user.models.js
│   ├── video.models.js
│   ├── tweet.models.js
│   ├── comment.models.js
│   ├── like.models.js
│   ├── playlist.models.js
│   └── subscription.models.js
├── routes/          # Express routers (one file per module)
├── utils/
│   ├── Cloudinary.js          # upload/delete helpers
│   ├── apiError.js            # custom error class
│   ├── apiResponse.js         # standard response wrapper
│   ├── asyncHandlerPromise.js
│   └── asyncHandlerTrycatch.js
├── app.js           # Express app setup, middleware, routes
└── index.js         # Entry point – DB connect + server start
```

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/abdullahbutt09/stream-core.git

# Move into the project
cd stream-core

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root and add:

```env
PORT=8000
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📬 API Endpoints – Full Reference

Base URL: `http://localhost:8000/api/v1`

### 🏥 Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/healthcheck` | ❌ | Server health check |

### 👤 Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | ❌ | Register with avatar + cover image |
| POST | `/users/login` | ❌ | Login, get tokens |
| POST | `/users/refresh-token` | ❌ | Refresh access token |
| POST | `/users/logout` | ✅ | Logout current user |
| POST | `/users/change-password` | ✅ | Change password |
| GET | `/users/get-current-user` | ✅ | Get logged in user |
| PATCH | `/users/update-account` | ✅ | Update fullName / email |
| PATCH | `/users/change-avatar` | ✅ | Update avatar |
| PATCH | `/users/change-cover-image` | ✅ | Update cover image |
| GET | `/users/c/:username` | ✅ | Get channel profile |
| GET | `/users/history` | ✅ | Get watch history |

### 🎥 Videos
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/videos/upload-video` | ✅ | Upload video + thumbnail |
| GET | `/videos/get-all-videos` | ✅ | Get all videos |
| GET | `/videos/v/:videoId` | ✅ | Get video by ID |
| PATCH | `/videos/v/:videoId` | ✅ | Update title / description |
| PATCH | `/videos/v/:videoId/thumbnail` | ✅ | Update thumbnail |
| PATCH | `/videos/v/:videoId/publish` | ✅ | Toggle publish status |
| DELETE | `/videos/delete-videos` | ✅ | Delete a video |

### 🐦 Tweets
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/tweets/create-tweet` | ✅ | Create a tweet |
| GET | `/tweets/get-tweets` | ✅ | Get user tweets |
| PATCH | `/tweets/t/:tweetId` | ✅ | Update a tweet |
| DELETE | `/tweets/t/:tweetId` | ✅ | Delete a tweet |
| DELETE | `/tweets/delete-bulk-tweets` | ✅ | Bulk delete tweets |

### 🗨️ Comments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/comments/c/:videoId` | ✅ | Get comments for a video |
| POST | `/comments/c/:videoId/add-comment` | ✅ | Add a comment |
| PATCH | `/comments/c/:commentId/v/:videoId/update-comment` | ✅ | Update a comment |
| DELETE | `/comments/c/:commentId/v/:videoId/delete-comment` | ✅ | Delete a comment |

### ❤️ Likes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/likes/l/:videoId` | ✅ | Toggle like on video |
| POST | `/likes/c/:commentId` | ✅ | Toggle like on comment |
| POST | `/likes/t/:tweetId` | ✅ | Toggle like on tweet |
| GET | `/likes/get-liked-videos` | ✅ | Get liked videos |

### 📂 Playlists
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/playlists/create-playlist` | ✅ | Create playlist |
| GET | `/playlists/p/:playlistId` | ✅ | Get playlist by ID |
| PATCH | `/playlists/p/:playlistId` | ✅ | Update playlist |
| DELETE | `/playlists/p/:playlistId` | ✅ | Delete playlist |
| GET | `/playlists/users/:userId/playlists` | ✅ | Get user playlists |
| PUT | `/playlists/p/:playlistId/v/:videoId` | ✅ | Add video to playlist |
| DELETE | `/playlists/p/:playlistId/v/:videoId` | ✅ | Remove video from playlist |

### 🔔 Subscriptions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/subscriptions/s/:channelId` | ✅ | Toggle subscribe |
| GET | `/subscriptions/s/:channelId` | ✅ | Get channel subscribers |
| GET | `/subscriptions/s/:subscriberId` | ✅ | Get subscribed channels |

### 📊 Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | ✅ | Channel stats (views, subs, likes, videos) |
| GET | `/dashboard/videos` | ✅ | All videos of current channel |

> ✅ = Requires Bearer token &nbsp;&nbsp; ❌ = Public

---

## 📖 API Documentation (Swagger UI)

Open: `http://localhost:8000/api-docs`

---

## 🧑‍💻 Author

**Abdullah Bin Mughira**  
Full Stack Developer (MERN Stack)  
[LinkedIn](https://www.linkedin.com/in/abdullah-bin-mughira)

---

## 🔮 Future Improvements

- Pagination on all list endpoints
- Role-based access control (Admin panel)
- Redis caching for dashboard stats
- Video streaming with byte-range support
- Search and filter videos
- Notification system
