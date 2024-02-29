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
          "per_page": "100",
          "bucket": "unsubmitted",
          "order_by": "due_at"
        }
      });

      const res = response.data.flatMap((a) => {
        const dueAt = new Date(a.due_at);
        if (a.due_at && dueAt > Date.now()) {
          return [[a.id, a.name, a.due_at, a.points_possible]];
        } else {
          return [];
        }
      })
      return res;

    } catch (error) {
      throw new CanvasAPIError('Error fetching assignments:', error);
    }
}

export async function getSubmissions(canvas_api_token, course_id, assignment_id, user_id) {
  const is_num = /^\d+$/

  if (!canvas_api_token || !course_id || !is_num.test(course_id) || !assignment_id || !is_num.test(assignment_id) || !user_id || !is_num.test(user_id)) {
    throw new InvalidInput('canvas_api_token, course_id, and assignment_id are required');
  }

  try {
    const response = await axios.get(`/courses/${course_id}/assignments/${assignment_id}/submissions/${user_id}`, {
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

export async function getNewSubmissions(canvas_api_token, course_id, lastLogin) {
  const is_num = /^\d+$/

  if (!canvas_api_token || !course_id || !is_num.test(course_id)) {
    throw new InvalidInput('canvas_api_token and course_id are required');
  }

  var iso = new Date(Number(lastLogin));
  try {
    const response = await axios.get(`/courses/${course_id}/students/submissions`, {
      params: {
        'access_token': canvas_api_token,
        "per_page": "100",
        "grouped": "true",
        "include[]": "assignment",
        "submitted_since": iso.toISOString(),
        "order": "graded_at",
        "order_direction": "descending"
      }
    })

    const submissions = response.data[0].submissions;
    const newSubmissions = submissions.map((temp) => {
      return [temp.assignment.id, temp.assignment.name, temp.assignment.due_at, temp.assignment.points_possible, 
        temp.id, temp.submitted_at, temp.score]
    })  
    return newSubmissions;
  } catch (error) {
    throw new CanvasAPIError('Error fetching new submissions:', error);
  }
}