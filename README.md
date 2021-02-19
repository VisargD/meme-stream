<div align="center">
<h1 align=center> Meme-Stream</h1>
<p align="center">
	<strong>
		<a href="https://frozen-brook-19812.herokuapp.com/">Frontend</a>
		•
		<a href="https://fast-atoll-99688.herokuapp.com/">Backend</a>
		•
		<a href="https://youtu.be/okEYNpZzheI">Walkthrough</a>
		•
		<a href="https://fast-atoll-99688.herokuapp.com/swagger-ui/">Swagger Docs</a>
	</strong>
</p>
</div>
Get ready with your memes!! XMeme (Meme-Stream) is a single page react application that allows you to share memes, like/dislike memes, edit a meme and tell someone how much you laughed at their meme using comments. It comes with a user-friendly UI which is very simple to navigate through. Apart from this, you can also access the API using the above given links. Both frontend and backend are deployed separately on Heroku.

# Features
- :heavy_plus_sign: **Add** Meme
- :pencil2: **Edit** Meme
- :+1: **Like/Dislike** Meme
- :speech_balloon: **Comment** on a Meme
- :wastebasket: **Delete** Meme

# Tech Stack

- Frontend: ReactJs
	- Material UI
	- Context for State Management
	
- Backend: NodeJS
	- ExpressJs
	- Swagger JSDoc for API documentation
	
- Database: MongoDB 

- Deployment: Heroku (Separate Frontend and Backend)

# Usage

## For development and local testing

1.   Clone the repository using ```git clone <url>```
2. Cd into the repo using ```cd <dir>```
3. Cd into frontend and backend directory and run ```npm install``` in both the directories to install the dependencies
4. You need MongoDB. You can follow the instructions from their [official website](https://docs.mongodb.com/manual/installation/)
```
git clone <url>
cd <dir>

# Go into frontend directory and install dependencies
cd frontend
npm install
# Port 3000 (http://localhost:3000)
npm start

# Go into backend directory and install dependencies
cd backend
npm install
# Port 8081 (http://localhost:8081)
node index.js
```

4. Alternatively for backend, you can run <b>install.sh</b> which will install all the backend dependencies and then execute the <b>server_run.sh</b> which will spin up the backend server.

## For Dockerized backend,
1. Go into backend directory and run ```docker-compose up```. You can then go to ```http://localhost:8081/```  Make sure you have docker and docker-compose installed.

# Backend Project Structue
```
.
├── helpers						# Helper function directory
│   ├── checkError.js       	# Function to check error message and return code
│   └── checkId.js				# Function to check if ID is valid or not
├── index.js					# Spinning up a server and database
├── models						# Directory containing database schema
│   └── memes.js				# Meme Schema for MongoDB
├── package.json				
├── package-lock.json
└── routes						# Routes directory holding different routes
    ├── comments.js				# All the routes that are related to comments resource
    ├── likeDislike.js			# All the routes that are related to like/dislike resource
    └── memes.js				# All the routes that are related to memes resource
```

# Frontend Project Structure (Only src Directory)

```
.
└── src
    ├── App.js
    ├── App.test.js
    ├── components						# Main Components Directory
    │   ├── controls					# Controls directory
    │   │   ├── Popup.js				# Popup Control for all forms
    │   │   └── toast.js				# Toast Control for notification
    │   ├── forms						# Forms Directory
    │   │   ├── CommentForm.js			# Comment Form Component
    │   │   ├── EditForm.js				# Edit Form Component
    │   │   ├── LikeDislike.js			# Like /Dislike Form Component
    │   │   └── MemeForm.js				# Meme Add Form Component
    │   └── home						# Home page Directory
    │       ├── Appbar.js				# App Bar component
    │       ├── MemeList.js				# List of Memes Component
    │       └── MemePost.js				# Meme Post Card Component
    ├── context							# Context Directory
    │   └── MemeContext.js				# Context Provider for Memes
    ├── index.css
    ├── index.js
    ├── reportWebVitals.js
    └── setupTests.js
```