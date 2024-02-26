import express, { json as _json } from 'express';
import cors from 'cors';
import axios from 'axios';
import bcrypt from "bcrypt"

import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

import { connectToServer, getDb } from './db/conn.js';
import * as canvas from './canvas.js';

const app = express();
app.use(cors());
app.use(_json());

axios.defaults.baseURL = 'https://ufl.instructure.com/api/v1';
axios.defaults.headers.common['Accept'] = "application/json+canvas-string-ids";
axios.defaults.headers.post['Content-Type'] = 'application/json';

app.get('/getUser', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;

  try {
    const user = await canvas.getUser(canvas_api_token);
    return res.json(user);
  } catch (error) {
    if (error instanceof canvas.InvalidInput) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof canvas.CanvasAPIError) {
      return res.status(500).json({ error: error.message });
    }
  }
});

app.get('/getCourses', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;

  try {
    const courses = await canvas.getCourses(canvas_api_token);
    return res.json(courses);
  } catch (error) {
    if (error instanceof canvas.InvalidInput) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof canvas.CanvasAPIError) {
      return res.status(500).json({ error: error.message });
    }
  }
});

app.get('/getAssignments', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;
  const course_id = req.query.course_id;
  
  try {
    const assignments = await canvas.getAssignments(canvas_api_token, course_id);
    return res.json(assignments);
  } catch (error) {
    if (error instanceof canvas.InvalidInput) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof canvas.CanvasAPIError) {
      return res.status(500).json({ error: error.message });
    }
  }
});

app.get('/getSubmission', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;
  const course_id = req.query.course_id;
  const assignment_id = req.query.assignment_id;
  const user_id = req.query.user_id;
  
  try {
    const submission = await canvas.getSubmissions(canvas_api_token, course_id, assignment_id, user_id);
    return res.json(submission);
  } catch (error) {
    if (error instanceof canvas.InvalidInput) {
      return res.status(400).json({ error: error.message });
    } else if (error instanceof canvas.CanvasAPIError) {
      return res.status(500).json({ error: error.message });
    }
  }
});

app.get('/logout', limiter, async (req, res) => {
  const user_id = req.query.user_id;
  const login_time = req.query.login_time;  
  console.log(login_time)
  
  let db = getDb();
  db.updateOne({ "username": { $eq: user_id } }, { $set: { "lastLogin": login_time } })
  console.log("< logged out user " + user_id)
  res.status(200).json({ message: "Logged out!" });
})



app.post('/loginUser', limiter, async (req, res) => {
  const u = req.body.username;
  const p = req.body.password;
  const apiKey = req.body.apiKey;
  
  if (!u || !p) {
    return res.status(400).json({message: "Username and password required!"});
  }

  let db = getDb();
  let user = await db.find({"username" : { $eq: u }})
  user = await user.toArray();

  var json;
  var code;

  if (user.length > 0) {
    code = 401;
    json = {message: "Incorrect password!"}
  } else {
    code = 401;
    json = {message: "No users found!"}
  }

  const evals = await user.map(async (u) => {
    var correctPass = await bcrypt.compare(p, u.password);

    if (correctPass) {
      console.log("> logged in user " + u.username)
      code = 200;
      json = {userData: u};
    }
  })


  await Promise.all(evals);
  
  if (json.userData) {
    const getUserData = async () => {
      const res = await canvas.getUser(apiKey)
      return res.id;
    }
    var userId = await getUserData();
    json["userId"] = userId;

    const res = await canvas.getCourses(apiKey)
    
    var newCourses = [];
    await Promise.all(res.map(async (c) => {

      const newAssignments = await canvas.getAssignments(apiKey, c.id)
      const newSubmissions = await canvas.getNewSubmissions(apiKey, c.id)

      newCourses.push([c.id, c.name, newAssignments, newSubmissions])
      json["courses"] = newCourses;
    }))


  }


  return res.status(code).json(json);
})

app.post('/registerAccount', limiter, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Input both a username and password"});
  }

  let db = getDb();
  let user = await db.find({"username" : { $eq: username }})
  user = await user.toArray();

  if (user.length > 0) {
    return res.status(400).json({message: "Username already taken"});
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.insertOne({username: { $eq: username }, password: hashedPassword, canvasUser: null, lastLogin: Date.now(), lastLogout: null})
  return res.status(200).json({message: "User registered"});
});

app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  connectToServer();
  console.log('Server running on port 3500');
});