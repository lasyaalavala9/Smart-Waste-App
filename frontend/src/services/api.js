const BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/role') {
                window.location.href = '/login';
            }
            throw new Error('Session expired. Please log in again.');
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// Authentication API
export const authApi = {
    login: (identifierId, password) => 
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifierId, password })
        }),
    register: (userData) => 
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
    getCurrentUser: () => apiRequest('/auth/me')
};

// Citizen API
export const citizenApi = {
    submitComplaint: (data) => 
        apiRequest('/citizen/complaints', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    getMyComplaints: () => apiRequest('/citizen/complaints'),
    getComplaint: (id) => apiRequest(`/citizen/complaints/${id}`),
    getEcoPoints: () => apiRequest('/citizen/eco-points')
};

// Worker API
export const workerApi = {
    getMyTasks: () => apiRequest('/worker/tasks'),
    getTask: (id) => apiRequest(`/worker/tasks/${id}`),
    startTask: (id, data = {}) => 
        apiRequest(`/worker/tasks/${id}/start`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    completeTask: (id, data) => 
        apiRequest(`/worker/tasks/${id}/complete`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
};

// Authority API
export const authorityApi = {
    getAllComplaints: () => apiRequest('/authority/complaints'),
    getComplaint: (id) => apiRequest(`/authority/complaints/${id}`),
    assignWorker: (complaintId, workerId, priority) => 
        apiRequest(`/authority/complaints/${complaintId}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ workerId, priority })
        }),
    getWorkers: () => apiRequest('/authority/workers'),
    getAnalytics: () => apiRequest('/authority/analytics'),
    getRecycling: () => apiRequest('/authority/recycling'),
    getTrends: () => apiRequest('/authority/trends')
};

// Notification API
export const notificationApi = {
    getAll: () => apiRequest('/notifications'),
    getUnreadCount: () => apiRequest('/notifications/unread-count'),
    markAsRead: (id) => 
        apiRequest(`/notifications/${id}/read`, {
            method: 'PUT'
        }),
    markAllAsRead: () => 
        apiRequest('/notifications/read-all', {
            method: 'PUT'
        })
};
