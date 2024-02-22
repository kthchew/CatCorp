import axios from 'axios';

export class InvalidInput extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InvalidInput";
  }
}

export class CanvasAPIError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "CanvasAPIError";
  }
}

export async function getUser(canvas_api_token) {
  if (!canvas_api_token) {
    throw new InvalidInput('canvas_api_token is required');
  }

  try {
    const response = await axios.get(`/users/self/`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      }
    });
    return response.data;
  } catch (error) {
    throw new CanvasAPIError('Error fetching user:', error);
  }
}

export async function getCourses(canvas_api_token) {
  if (!canvas_api_token) {
    throw new InvalidInput('canvas_api_token is required');
  }

  try {
    const response = await axios.get(`/courses/`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      }
    });
    var activeCourses = response.data.filter(course => course.enrollments && course.enrollments[0].enrollment_state == "active" 
                                                        && (!course.end_at || Date.parse(course.end_at) > Date.now()));
    return activeCourses;
  } catch (error) {
    throw new CanvasAPIError('Error fetching courses:', error);
  }
}

export async function getAssignments(canvas_api_token, course_id) {
    const is_num = /^\d+$/

    if (!canvas_api_token || !course_id || !is_num.test(course_id)) {
      throw new InvalidInput('canvas_api_token and course_id are required');
    }
  
    try {
      const response = await axios.get(`/courses/${course_id}/assignments`, {
        params: {
          'access_token': canvas_api_token,
          "per_page": "100"
        }
      });
      return response.data;
    } catch (error) {
      throw new CanvasAPIError('Error fetching assignments:', error);
    }
}

export async function getSubmissions(canvas_api_token, course_id, assignment_id) {
  const is_num = /^\d+$/

  if (!canvas_api_token || !course_id || !is_num.test(course_id) || !assignment_id || !is_num.test(assignment_id)) {
    throw new InvalidInput('canvas_api_token, course_id, and assignment_id are required');
  }

  try {
    const response = await axios.get(`/courses/${course_id}/assignments/${assignment_id}/submissions`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100"
      }
    });
    return response.data;
  } catch (error) {
    throw new CanvasAPIError('Error fetching submissions:', error);
  }
}
