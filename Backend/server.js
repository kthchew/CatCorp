import express, { json as _json } from 'express';
import cors from 'cors';
import axios from 'axios';

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

axios.defaults.baseURL = 'https://canvas.instructure.com/api/v1';
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
    console.log("hello");
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
  
  let db = getDb();
  db.updateOne({ "canvasUser": { $eq: user_id } }, { $set: { "lastLogout": Date.now() } })
  console.log("< logged out user " + user_id)
  res.status(200).json({ message: "Logged out!" });
})

app.get('/login', limiter, async (req, res) => {
  const user_id = req.query.user_id;
  
  let db = getDb();
  console.log("> logged in user " + user_id)
  let user = await db.findOne({ "canvasUser": { $eq: user_id } })
  res.status(200).json({ user });
})

app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  connectToServer();
  console.log('Server running on port 3500');
});