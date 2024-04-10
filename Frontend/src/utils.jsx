import axios from 'axios';

export async function getCsrfToken() {
  try {
    const resp = await axios.get(`/`);
    axios.defaults.headers.common['X-CSRF-Token'] = resp.data.csrfToken;
  } catch (e) {
    console.error("Failed to get CSRF token");
  }
}
