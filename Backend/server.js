import express, { json as _json } from 'express';
import cors from 'cors';
import axios from 'axios';
import bcrypt from "bcrypt"
import { ObjectId } from 'mongodb';

import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

import { connectToServer, getDb } from './db/conn.js';
import * as canvas from './canvas.js';
import * as lootbox from './lootbox.js';
import Cat from "./cat.js";

const app = express();
app.use(cors());
app.use(_json());

axios.defaults.baseURL = 'https://ufl.instructure.com/api/v1';
axios.defaults.headers.common['Accept'] = "application/json+canvas-string-ids";
axios.defaults.headers.post['Content-Type'] = 'application/json';

app.get('/getUser', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;

  if (!canvas_api_token) {
    return res.status(400).json({message: "Invalid input!"});
  }

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

  if (!canvas_api_token) {
    return res.status(400).json({message: "Invalid input!"});
  }

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
  const canvas_api_token = req.query.canvas_api_token;
  const course_id = req.query.course_id;

  if (!canvas_api_token || !course_id) {
    return res.status(400).json({message: "Invalid input!"});
  }
  
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

  if (!canvas_api_token || !course_id || !assignment_id || !user_id) {
    return res.status(400).json({message: "Invalid input!"});
  }
  
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


app.post('/loginUser', limiter, async (req, res) => {
  const u = req.body.username;
  const p = req.body.password;
  const apiKey = req.body.apiKey;
  
  if (!u || !p || !apiKey) {
    return res.status(400).json({message: "Username, password, and API key required!"});
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
      json["message"] = `Logged in user ${u.username}`
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
      const newSubmissions = await canvas.getNewSubmissions(apiKey, c.id, json.userData.lastLogin)

      newCourses.push([c.id, c.name, newAssignments, newSubmissions])
      json["courses"] = newCourses;
    }))

    //UPDATE USER LAST LOGIN ON DB
    let db = getDb();
    db.updateOne({ "_id": { $eq: json.userData._id } }, { $set: { "lastLogin": Date.now() } })

    var gainz = await cashSubmissions(json.userData._id, json.courses);
    json.userData.gems += gainz;
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
  db.insertOne({username: username, password: hashedPassword, canvasUser: null, lastLogin: Date.now(), gems: 1000})
  return res.status(200).json({message: "User registered"});
});

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