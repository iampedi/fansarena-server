# Fans Arena – Server

**Backend API for Fans Arena**

Fans Arena is a transparent, global platform where real football fans can register their support for their favorite clubs. This repository contains the backend (RESTful API) built with **Express.js** and **MongoDB**, powering user management, club leaderboards, authentication, and admin features.

---

## Beta Version – Portfolio Project

This is the backend server for Fans Arena, developed as the final project for the Ironhack Web Development Bootcamp by **Pedram Ghane** (*Full Stack Developer*).

**Tech stack:**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cors](https://www.npmjs.com/package/cors)
- ...and more

Live Demo (Frontend): **[fansarena.netlify.app](https://fansarena.netlify.app/)**  
Frontend repo: **[fansarena-client](https://github.com/iampedi/fansarena-client)**

---

## Features

- RESTful API for all core resources (users, clubs, leaderboards, etc.)
- Secure authentication & authorization (JWT)
- User profile & favorite club management
- Admin endpoints (demo only)
- CORS configuration for frontend integration
- Error handling and validation
- MongoDB Atlas/Cloud or local MongoDB support

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

Clone this repository:

```bash
git clone https://github.com/iampedi/fansarena-server
cd fansarena-server
npm install
