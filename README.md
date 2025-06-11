Real-Time Polling App
A full-stack web application for creating, joining, and managing live polls with real-time results. Admins can register/login, create polls, and see live responses. Users can join active polls using session codes.
________________________________________
🚀 Features
•	Multiple Admins can create/manage polls
•	Live Poll results (Bar/Pie Charts using Chart.js)
•	MongoDB to store all poll data and results
•	Clean UI with React + MUI
________________________________________
  Tech Stack
•	Frontend: React, MUI, Chart.js
•	Backend: Node.js, Express.js
•	Database: MongoDB (Mongoose)
•	Hosting: Local
________________________________________

Set Up Backend 
cd backend npm install

 Create a .env file in /backend:
env 
PORT=5000
MONGO_URI=your_mongodb_connection_string 


Then run:
node server.js
Set Up Frontend 
cd ../frontend npm install
Then run: 
npm start


 Test it Open http://localhost:3000 for frontend
Backend runs at http://localhost:5000
Create and join polls, see real-time updates!

