const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://axios-2mom.onrender.com/api' : 'http://localhost:5000/api');

const fetchClient = async (endpoint: string, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...((options as any).headers || {}),
    },
  };

  // Skip Content-Type if it's multipart/form-data
  if ((options as any).headers && (options as any).headers['Content-Type'] === 'multipart/form-data') {
    delete (config as any).headers['Content-Type'];
  }

  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { error: 'Unknown API error' };
  }

  if (!response.ok) {
    console.error('API Error:', data?.error || 'Unknown Error');
    return Promise.reject({ response: { data } });
  }

  return { data };
};

const apiClient = {
  get: (url: string) => fetchClient(url, { method: 'GET' }),
  post: (url: string, body?: any, config?: any) => {
    const isFormData = body instanceof FormData;
    return fetchClient(url, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      ...config
    });
  },
  put: (url: string, body?: any) => fetchClient(url, {
    method: 'PUT',
    body: JSON.stringify(body)
  }),
  delete: (url: string) => fetchClient(url, { method: 'DELETE' }),
};

export default apiClient;
