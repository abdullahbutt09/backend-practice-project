# 🚀 Backend Practice Project

A production-style backend project built using Node.js, Express, and MongoDB.  
This project demonstrates real-world backend concepts including authentication, playlist management, video handling, and dashboard analytics using aggregation pipelines.

---

## 📌 Features

### 🔐 Authentication
- JWT-based authentication
- Secure protected routes using middleware

### 🎥 Video Management
- Upload and manage videos
- Store video metadata (views, owner, etc.)

### 📂 Playlist System
- Create playlists
- Add video to playlist
- Remove video from playlist
- Delete playlist
- Update playlist details
- Fetch user playlists
- Fetch playlist with populated videos

### 📊 Dashboard (Aggregation)
- Total videos
- Total views
- Total subscribers
- Total likes (using aggregation + lookup)

---

## 🧠 Concepts Covered

- RESTful API design
- MongoDB Aggregation Pipeline
- Mongoose Relationships (Ref & Populate)
- Data validation & error handling
- Modular controller structure
- Async error handling (custom wrapper)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT
- **Cloud:** Cloudinary (for media storage)
- **Tools:** Postman, Nodemon

---

## 📁 Project Structure

```

src/
│── controllers/
│── models/
│── routes/
│── middlewares/
│── utils/
│── app.js
│── server.js

````

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/abdullahbutt09/backend-practice-project.git

# Go into project
cd backend-practice-project

# Install dependencies
npm install

# Run server
npm run dev
````

---

## 🔑 Environment Variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 📬 API Endpoints (Sample)

### Playlist

```
POST    /playlists
GET     /playlists/:playlistId
PATCH   /playlists/:playlistId
DELETE  /playlists/:playlistId
PUT     /playlists/:playlistId/videos/:videoId
DELETE  /playlists/:playlistId/videos/:videoId
```

### Dashboard

```
GET /dashboard/stats
```

---

## 📈 Key Highlight

> Implemented MongoDB Aggregation Pipeline to calculate:

* Total views
* Total likes (via `$lookup`)
* Total videos

---

## 🧑‍💻 Author

**Abdullah**
Full Stack Developer (Learning Phase 🚀)

---

## ⭐ Note

This project is built for learning and practicing backend development concepts.
Future improvements may include:

* Pagination
* Role-based access
* Advanced analytics
* Caching (Redis)

---