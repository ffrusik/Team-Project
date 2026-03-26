#Project plan on notion: https://www.notion.so/Hotel-Reservation-System-Team-Project-Plan-2f1de0b9002f8052a115e991dd727889?source=copy_link


Team project created by 2nd-year Computer Science students:

Ruslan Fefelov (https://github.com/ffrusik)

Clodagh Young (https://github.com/CYoung12)

Adaora Obialo (https://github.com/Adaora101)

Lennon Glackin (https://github.com/LennonGlackin)

Project Setup checklist
-git clone project 
-Ensure git and node is installed( git --version, node -v, npm-v)

Backendset up:
-open cmd terminal
-cd server
-npm install(only if you've never ran it on your computer before)
-make sure you create a .env folder with the following: 
PORT=5000
JWT_SECRET=devsecret
-node app.js
you should see : Server started on port 5000 Connected to SQLite database


Frontend setup:
-open cmd terminal
-cd client
-npm install(only if you've never ran it on your computer before)
-npm start
-open in browser or wait for it open: http://localhost:3000

pages that should be working:
http://localhost:3000/rooms
http://localhost:3000/bookings
http://localhost:3000/admin/dashboard
http://localhost:3000/admin/dashboard/rooms
http://localhost:3000/admin/dashboard/guests
http://localhost:3000/admin/dashboard/extras

and for backend:
http://localhost:5000/api/rooms
http://localhost:5000/api/guests
http://localhost:5000/api/reservations

Usual errors:
if frontend says "Failed to fetch" the backend is not running or port 5000 is not reachable
 if backend says "JWT_SECRET not set" your .env file is missing or not inside the server folder or is not correct




