import express, { json as _json } from 'express';
import cors from 'cors';
import axios from 'axios';
import lusca from 'lusca';

import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

import session from 'cookie-session'

import { connectToServer } from './db/conn.js';
import * as canvas from './canvas.js';
import * as lootbox from './lootbox.js';
import Cat from "./cat.js";
import * as CatCorpUser from './user.js';

const SESSION_SECRET = process.env.SESSION_SECRET

const app = express();
const httpLocalhost = /^http:\/\/localhost:[0-9]{1,5}$/;
const stagingVercelDeployments = /^https:\/\/catcorp-frontend-.*-kenneths-projects-[a-z0-9]{8}\.vercel\.app$/;
app.use(cors({ origin: ["https://catcorp.vercel.app", "https://catcorporation.vercel.app", httpLocalhost, stagingVercelDeployments], credentials: true }));
app.use(_json());
app.use(session({
  name: 'session',
  secret: SESSION_SECRET,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
}))
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true,
  nosniff: true,
  referrerPolicy: 'same-origin'
}))

app.use((req, res, next) => {
  CatCorpUser.renewSession(req.session);
  next();
})

axios.defaults.baseURL = 'https://ufl.instructure.com/api/v1';
axios.defaults.headers.common['Accept'] = "application/json+canvas-string-ids";
axios.defaults.headers.post['Content-Type'] = 'application/json';

app.get('/getUser', async (req, res) => {
  const canvas_api_token = req.session.canvas_api_token;

  if (!canvas_api_token) {
    return res.status(401).json({message: "Invalid session!"});
  }

  try {
    const user = await canvas.getUser(canvas_api_token);
    return res.json(user);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

app.get('/getCourses', async (req, res) => {
  const canvas_api_token = req.session.canvasKey;

  if (!canvas_api_token) {
    return res.status(401).json({message: "Invalid session!"});
  }

  try {
    const courses = await canvas.getCourses(canvas_api_token);
    return res.json(courses);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

app.get('/getAssignments', async (req, res) => {
  const canvas_api_token = req.session.canvasKey;
  const course_id = req.query.course_id;

  if (!canvas_api_token) {
    return res.status(401).json({message: "Invalid session!"});
  }
  if (!course_id) {
    return res.status(400).json({message: "Invalid input!"});
  }
  
  try {
    const assignments = await canvas.getAssignments(canvas_api_token, course_id);
    return res.json(assignments);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

//DEPRECATED AND UNUSED :P
app.get('/getSubmission', async (req, res) => {
  const canvas_api_token = req.session.canvasKey;
  const course_id = req.query.course_id;
  const assignment_id = req.query.assignment_id;
  const user_id = req.session.canvasUserId;

  if (!canvas_api_token || !user_id) {
    return res.status(401).json({message: "Invalid session!"});
  }
  if (!course_id || !assignment_id) {
    return res.status(400).json({message: "Invalid input!"});
  }
  
  try {
    const submission = await canvas.getSubmissions(canvas_api_token, course_id, assignment_id, user_id);
    return res.json(submission);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});


app.post('/loginUser', limiter, async (req, res) => {
  const u = req.body.username;
  const p = req.body.password;
  const apiKey = req.body.apiKey;
  
  if (!u || !p || !apiKey) {
    //we just lie about the api key to make it look better on the frontend
    return res.status(400).json({message: "Username and password required!"});
  }

  let json;
  let code;

  const user = await CatCorpUser.verifyCredentials(u, p);
  if (user) {
    try {
      const keyCanvasUser = await canvas.getUser(apiKey);

      console.log("> logged in user " + user.username)
      code = 200;
      json = {message: `Logged in as "${user.username}"`};

      req.session.ccUserId = user._id
      req.session.canvasKey = apiKey
      CatCorpUser.renewSession(req.session);

      let userId = await CatCorpUser.getCanvasUserId(req.session);
      if (userId && userId !== keyCanvasUser.id) {
        req.session = null
        return res.status(401).json({message: "Canvas user mismatch!"});
      }
      req.session.canvasUserId = userId
    } catch (error) {
      code = error.status;
      json = {message: error.message};
    }
    //this code is no longer needed
  } else if (await CatCorpUser.checkUsernameAvailable(u)) {
    code = 401;
    json = {message: "Incorrect username/password!"}
  } else {
    code = 401;
    json = {message: "Incorrect username/password!"}
  }

  return res.status(code).json(json);
})

app.get('/getAccountInfo', limiter, async (req, res) => {
  const userId = req.session.ccUserId;
  const canvasKey = req.session.canvasKey;
  const canvasUserId = req.session.canvasUserId;
  if (!userId || !canvasKey || !canvasUserId) {
    return res.status(401).json({message: "Invalid session!"});
  }

  const userData = await CatCorpUser.getUserDataFromSession(req.session);
  delete userData.password;

  return res.status(200).json({userData: userData, userId: userData.canvasUserId});
})

app.post('/cashNewSubmissions', limiter, async (req, res) => {
  const userId = req.session.ccUserId;
  const canvasKey = req.session.canvasKey;
  const canvasUserId = req.session.canvasUserId;
  if (!userId || !canvasKey || !canvasUserId) {
    return res.status(401).json({message: "Invalid session!"});
  }

  try {
    const userData = await CatCorpUser.getUserDataFromSession(req.session);
    const courses = await canvas.getCourses(canvasKey);
    const newCourses = await Promise.all(courses.map(async (c) => {
      const newAssignments = await canvas.getAssignments(canvasKey, c.id)
      const newSubmissions = await canvas.getNewSubmissions(canvasKey, c.id, userData.lastLogin)
      const weeklySubmissions = await canvas.getNewSubmissions(canvasKey, c.id, getLastSundayNight(Date.now()))

      return [c.id, c.name, newAssignments, newSubmissions, weeklySubmissions]
    }))
    const gainz = await CatCorpUser.cashSubmissions(req.session, newCourses);
    return res.status(200).json({courses: gainz[0], gainedGems: gainz[1], bossResults: gainz[2]});
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
})

function getLastSundayNight(date) { //inputs unix timestamp, output unix timestamp
  date = new Date(date)
  date.setDate(date.getDate() - (date.getDay() == 0 ? 7 : date.getDay()));
  return Math.floor(date.getTime() / 86400000 + 1) * 86400000;
}

app.post('/registerAccount', limiter, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    //we just lie about the api key to make it look better on the frontend
    return res.status(400).json({message: "Input a username, password, and API key!"});
  }

  if (!await CatCorpUser.checkUsernameAvailable(username)) {
    return res.status(400).json({message: "Username already taken"});
  }

  const userId = await CatCorpUser.registerAccount(username, password)
  return res.status(200).json({message: "User registered", userId: userId});
});

app.post('/logout', async (req, res) => {
  req.session = null;
  res.status(200).json({message: "Logged out"});
})

app.post('/buyLootbox', limiter, async (req, res) => {
  const lootboxID = parseInt(req.body.lootboxID);
  if (isNaN(lootboxID)) {
    return res.status(400).json({message: "Invalid lootbox"});
  }

  try {
    const purchased = await CatCorpUser.buyLootbox(req.session, lootboxID);
    return res.status(200).json(purchased);
  } catch (error) {
    if (error instanceof lootbox.LootboxOpenError) {
      return res.status(400).json({ message: error.message });
    }
  }
});

app.get('/randomCat', async (req, res) => {
  const cat1 = new Cat(lootbox.LOOTBOX_RARITY_FUNCTIONS[0]);
  const cat2 = new Cat(lootbox.LOOTBOX_RARITY_FUNCTIONS[1]);
  const cat3 = new Cat(lootbox.LOOTBOX_RARITY_FUNCTIONS[2]);
  return res.status(200).json({
    cat1: cat1,
    cat2: cat2,
    cat3: cat3
  });
});

app.get('/', async (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


app.listen(3500, () => {
  connectToServer();
  console.log('Server running on port 3500');
});