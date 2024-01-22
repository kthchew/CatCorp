const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const config = {   transformResponse: [(data) => JSONbig.parse(data)], };

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
      config
    });
    console.log(response)
    // const ids = response.data.map(course => course);
    return res.json(response.data);
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
    });
    const ids = response.data.map(course => course);
    return res.json({ ids });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(200).json({ message: "No assignments available" });
  }
});

app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  console.log('Server running on port 3500');
});