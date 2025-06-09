const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const { connectMongoDB } = require('./db/connectMongoDB.js');

const authRoute = require('./routes/auth.route.js');
const userRoute = require('./routes/user.route.js');
const postRoute = require('./routes/post.route.js');
const notificationRoute = require('./routes/notification.route.js');
const messageRoute = require('./routes/message.route.js');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);

const io = (process.env.NODE_ENV === 'development') ? new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  },
})
: new Server(server);

const PORT = 8000 || process.env.PORT;

global.io = io;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/users", userRoute);
app.use("/api/messages", messageRoute);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectMongoDB();
});
