const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {connectToServer, getDb} = require('./db/conn.js')
const bcrypt = require('bcrypt')

const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(cors());

app.get('/getUser', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;

  if (!canvas_api_token) {
    return res.status(400).json({ error: 'canvas_api_token is required' });
  }

  try {
    const response = await axios.get(`https://canvas.instructure.com/api/v1/users/self/`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      },
      headers: {
        'Accept': "application/json+canvas-string-ids"
      }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(200).json({ message: "No user available" });
  }
});

app.get('/getCourses', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;

  if (!canvas_api_token) {
    return res.status(400).json({ error: 'canvas_api_token is required' });
  }

  try {
    const response = await axios.get(`https://canvas.instructure.com/api/v1/courses/`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      },
      headers: {
        'Accept': "application/json+canvas-string-ids"
      }
    });
    var activeCourses = response.data.filter(course => course.enrollments && course.enrollments[0].enrollment_state == "active" 
                                                        && (!course.end_at || Date.parse(course.end_at) > Date.now()));
    return res.json(activeCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(200).json({ message: "No courses available" });
  }
});

app.get('/getAssignments', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;
  const course_id = req.query.course_id;
  const is_num = /^\d+$/

  if (!canvas_api_token || !course_id || !is_num.test(course_id)) {
    return res.status(400).json({ error: 'canvas_api_token and course_id are required' });
  }

  try {
    const response = await axios.get(`https://canvas.instructure.com/api/v1/courses/${course_id}/assignments`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      },
      headers: {
        'Accept': "application/json+canvas-string-ids"
      }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(200).json({ message: "No assignments available" });
  }
});

app.get('/getSubmission', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;
  const course_id = req.query.course_id;
  const assignment_id = req.query.assignment_id;
  const user_id = req.query.user_id;
  const is_num = /^\d+$/

  if (!canvas_api_token || !course_id || !assignment_id || !user_id ||
    !is_num.test(course_id) || !is_num.test(assignment_id) || !is_num.test(user_id)) {
    return res.status(400).json({ error: 'canvas_api_token, course_id, assignment_id, and user_id are required' });
  }

  try {
    const response = await axios.get(`https://canvas.instructure.com/api/v1/courses/${course_id}/assignments/${assignment_id}/submissions/${user_id}`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      },
      headers: {
        'Accept': "application/json+canvas-string-ids"
      }
    });
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(200).json({ message: "No submissions available" });
  }
})


app.get('/logout', limiter, async (req, res) => {
  const user_id = req.query.user_id;
  const login_time = req.query.login_time;  
  console.log(login_time)
  
  let db = getDb();
  db.updateOne({ "username": { $eq: user_id } }, { $set: { "lastLogin": login_time } })
  console.log("< logged out user " + user_id)
  res.status(200).json({ message: "Logged out!" });
})

// app.get('/login', limiter, async (req, res) => {
//   const user_id = req.query.user_id;
  
//   let db = getDb();
//   console.log("> logged in user " + user_id)
//   let user = await db.findOne({ "canvasUser": { $eq: user_id } })
//   res.status(200).json({ user });
// })

app.get('/loginUser', async (req, res) => {
  const u = req.query.username;
  const p = req.query.password;
  
  if (!u || !p) {
    return res.status(400).json({message: "Username and password required!"});
  }

  let db = getDb();
  let user = await db.find({"username" : u})
  user = await user.toArray();

  var json;
  var code;

  if (user.length > 0) {
    code = 401;
    json = {message: "Incorrect password!"}
  } else {
    code = 404;
    json = {message: "No users found!"}
  }

  const evals = await user.map(async (u) => {
    var correctPass = await bcrypt.compare(p, u.password);
    console.log("TEST", correctPass)

    if (correctPass) {
      code = 200;
      json = {u};
    }
  })

  await Promise.all(evals);

  return res.status(code).json(json);
})

app.get('/registerAccount', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Input both a username and password"});
  }

  let db = getDb();
  let user = await db.find({"username" : username})
  user = await user.toArray();

  if (user.length > 0) {
    return res.status(400).json({message: "Username already taken"});
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.insertOne({username: username, password: hashedPassword, canvasUser: null, lastLogin: Date.now(), lastLogout: null})
  return res.status(200).json({message: "User registered"});
});

app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  connectToServer();
  console.log('Server running on port 3500');
});