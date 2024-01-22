const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());



app.get('/getCourses', async (req, res) => {
  const canvas_api_token = req.query.canvas_api_token;

  if (!canvas_api_token) {
    return res.status(400).json({ error: 'canvas_api_token is required' });
  }

  try {
    const response = await axios.get(`https://canvas.instructure.com/api/v1/courses/`, {
      params: {
        'access_token': canvas_api_token
      }
    });
    const ids = response.data.map(course => course.id);
    return res.json({ ids });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(200).json({ message: "No files available" });
  }
});



app.get('/', async (req, res) => {
  res.status(200).json({ message: "hello!" });
});


app.listen(3500, () => {
  console.log('Server running on port 3500');
});