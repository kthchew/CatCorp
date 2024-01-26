const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {connectToServer, getDb} = require('./db/conn.js')
const { ObjectID } = require('mongodb')

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

  if (!canvas_api_token || !course_id) {
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

  if (!canvas_api_token || !course_id || !assignment_id || !user_id) {
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


app.get('/logout', async (req, res) => {
  const user_id = req.query.user_id;
  
  let db = getDb();
  db.updateOne({"canvasUser" : user_id}, { $set: { "lastLogout": Date.now()  } })
  console.log("logged out user " + user_id)
  res.status(200).json({ message: "Logged out!" });
})


app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  connectToServer();
  console.log('Server running on port 3500');
});