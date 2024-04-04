# Notes about the toy project

I am trying to list my steps of how to finish this capstone project. The initial version is messy in structure and I started to refactor my code base after graduation and I hope to make it the app easier to use.

## Tech Stacks

### Backend

Node.js, Express.js, Mongodb, Restful APIs

### Frontend

React, Three.js, D3.js

### Tools

Vite(build tool), Mongodb compass, Postman

## Database(configuration)

1. MongoBD atlas as remote database. You can also use local database under development. MongoDB compass helps to handle the connections. 
2. Used the **mongoose** as ODM( object document mapping);
3. Initialized the **Express** application, connect to remote database via mongoose.connect function, and finally started the server to listen on port 3000.

## Routers(backend)

### Authentication

#### Signup

Post  /api/user/signup

#### Login

Post  /api/user/login

### User Profile

#### Get Profile

Get /api/profile/:uid

#### Update Profile

Patch /api/profile/:uid

### Training

#### Add One

Post /api/training/:uid

#### Update One

Patch /api/training/:tid

#### Get All

Get /api/training/:uid

