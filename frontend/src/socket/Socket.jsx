import React from 'react'
import { io } from "socket.io-client";

const Socket = io({
    withCredentials: true,
  });

export default Socket
