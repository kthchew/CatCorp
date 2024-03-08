import express, { json as _json } from 'express';
import cors from 'cors';
import axios from 'axios';
import lusca from 'lusca';
import { ObjectId } from 'mongodb';

import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

import session from 'cookie-session'

import { getDb, connectToServer } from './db/conn.js';
import * as canvas from './canvas.js';
import * as lootbox from './lootbox.js';
import Cat from "./cat.js";
import * as CatCorpUser from './user.js';

const SESSION_SECRET = process.env.SESSION_SECRET

const app = express();
app.use(cors({ origin: true, credentials: true }));
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

async function cashSubmissions(userId, courses) {
  const gainz = courses
    .flatMap((course) => { return course[3]; })
    .reduce((val, submission) => {
      var multiplier = 1;
      //multiplier *= WEIGHT_LOGIC
      const studentScore = submission[7];
      const maximumScore = submission[4];
      if (studentScore && maximumScore) { //score
        multiplier *= (10*studentScore / 8 / maximumScore);
      }
      const dueDate = submission[3];
      const submissionDate = submission[6];
      const unlockDate = submission[2];
      if (dueDate && submissionDate) { //due date
        var due = new Date(dueDate);
        due = due.getTime();
        var sub = new Date(submissionDate);
        sub = sub.getTime();
        var unlock;
        if (unlockDate) { //unlock date given
          unlock = new Date(unlockDate);
        } else { // assume it unlocks 4 weeks before it's due
          unlock = due - 4 * 604800000;
        }
        const frac = (due - sub) / (due - unlock);
        multiplier *= Math.min(Math.max((Math.cbrt(frac) + .5), .000000001), 1.5);
      }
      return val + Math.ceil(multiplier * 100);
    }, 0);

  let db = getDb();
  db.updateOne({ "_id": { $eq: userId } }, { $inc: { "gems": gainz } })  
  return gainz;
}

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

  var json;
  var code;

  if (CatCorpUser.checkUsernameAvailable(u)) {
    code = 401;
    json = {message: "No users found!"}
  } else {
    code = 401;
    json = {message: "Incorrect password!"}
  }

  const user = await CatCorpUser.verifyCredentials(u, p);
  const keyCanvasUser = await canvas.getUser(apiKey);
  if (user) {
    console.log("> logged in user " + user.username)
    code = 200;
    json = {userData: user};

    req.session.ccUserId = user._id
    req.session.canvasKey = apiKey
    CatCorpUser.renewSession(req.session);

    var userId = await CatCorpUser.getCanvasUserId(req.session);
    if (userId && userId !== keyCanvasUser.id) {
      req.session = null
      return res.status(401).json({message: "Canvas user mismatch!"});
    }
    json["userId"] = userId;
    req.session.canvasUserId = userId

    const courses = await canvas.getCourses(apiKey)

    const newCourses = await Promise.all(courses.map(async (c) => {
      const newAssignments = await canvas.getAssignments(apiKey, c.id)
      const newSubmissions = await canvas.getNewSubmissions(apiKey, c.id, json.userData.lastLogin)

      return [c.id, c.name, newAssignments, newSubmissions]
    }))
    json["courses"] = newCourses;

    CatCorpUser.updateLastLogin(req.session);

    var gainz = await cashSubmissions(json.userData._id, json.courses);
    json.userData.gems += gainz;
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
  const courses = await canvas.getCourses(canvasKey);
  const newCourses = await Promise.all(courses.map(async (c) => {
    const newAssignments = await canvas.getAssignments(canvasKey, c.id)
    const newSubmissions = await canvas.getNewSubmissions(canvasKey, c.id, userData.lastLogin)

    return [c.id, c.name, newAssignments, newSubmissions]
  }))

  CatCorpUser.updateLastLogin(req.session);

  return res.status(200).json({userData: userData, userId: canvasUserId, courses: newCourses});
})

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
  const session = req.body.session;

  if (!session) {
    return res.status(400).json({message: "Invalid session"});
  }
  if (isNaN(lootboxID)) {
    return res.status(400).json({message: "Invalid lootbox"});
  }

  const db = getDb();
  // TODO: This is not how we should get the current session. When sessions are implemented, this will use a token.
  const user = await db.findOne({"_id" : { $eq: new ObjectId(session) }});
  
  if (!user) {
    return res.status(400).json({message: "Invalid user"});
  }

  try {
    const cat = lootbox.buyLootbox(lootboxID, user);
    return res.status(200).json(cat);
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
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  connectToServer();
  console.log('Server running on port 3500');
});