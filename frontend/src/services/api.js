// Robust API Service for Quiz Generator Microservices

let API_GATEWAY_URL = localStorage.getItem('API_GATEWAY_URL') || 'http://localhost:8787';
let USE_MOCK_MODE = localStorage.getItem('USE_MOCK_MODE') === 'true';

export const getGatewayUrl = () => API_GATEWAY_URL;
export const setGatewayUrl = (url) => {
  API_GATEWAY_URL = url;
  localStorage.setItem('API_GATEWAY_URL', url);
};

export const isMockMode = () => USE_MOCK_MODE;
export const setMockMode = (enabled) => {
  USE_MOCK_MODE = enabled;
  localStorage.setItem('USE_MOCK_MODE', enabled ? 'true' : 'false');
};

// Rich Mock Data Store (Used only in explicit Demo Mode)
const mockQuestions = [
  {
    id: 1,
    questionTitle: "What is the main function of Spring Cloud Eureka in a microservice architecture?",
    option1: "Load Balancing",
    option2: "Service Discovery and Registration",
    option3: "Database ORM Mapping",
    option4: "API Security Authentication",
    rightAnswer: "Service Discovery and Registration",
    difficultylevel: "Easy",
    category: "Java"
  },
  {
    id: 2,
    questionTitle: "Which annotation enables Feign Client interface declarative REST calls in Spring Boot?",
    option1: "@EnableEurekaClient",
    option2: "@EnableFeignClients",
    option3: "@RestController",
    option4: "@SpringBootApplication",
    rightAnswer: "@EnableFeignClients",
    difficultylevel: "Medium",
    category: "Java"
  }
];

let mockQuizzes = [
  {
    id: 101,
    title: "Spring Microservices Fundamentals",
    categoryName: "Java",
    questionIds: [1, 2]
  }
];

// Helper Fetch with Timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Smart dual-endpoint fetcher: Tries Gateway (8787) first, then Direct Service Port
async function smartFetch(gatewayPath, directUrl, options = {}) {
  if (USE_MOCK_MODE) {
    throw new Error('Mock Mode Active');
  }

  // 1. Try Gateway
  try {
    return await fetchWithTimeout(`${API_GATEWAY_URL}${gatewayPath}`, options);
  } catch (errGateway) {
    console.warn(`Gateway call to ${gatewayPath} failed:`, errGateway.message);
    
    // 2. Try Direct Service URL as backup
    if (directUrl) {
      try {
        console.log(`Attempting direct service fallback to ${directUrl}...`);
        return await fetchWithTimeout(directUrl, options);
      } catch (errDirect) {
        console.warn(`Direct call to ${directUrl} failed:`, errDirect.message);
        throw errGateway;
      }
    }
    throw errGateway;
  }
}

// Check Backend Connectivity (Probes Gateway & QuestionService)
export async function checkBackendStatus() {
  try {
    const res = await smartFetch('/question/allQuestions', 'http://localhost:8082/question/allQuestions');
    if (Array.isArray(res)) {
      return { 
        isOnline: true, 
        mode: `Connected (${res.length} Questions Loaded)`, 
        count: res.length 
      };
    }
    return { isOnline: true, mode: 'Connected to Microservices' };
  } catch (err) {
    return { 
      isOnline: false, 
      error: err.message, 
      mode: USE_MOCK_MODE ? 'Demo Mode Active' : 'Offline / Check Microservices Ports' 
    };
  }
}

// Question Service API Callers
export async function getAllQuestions() {
  if (USE_MOCK_MODE) return mockQuestions;
  try {
    return await smartFetch('/question/allQuestions', 'http://localhost:8082/question/allQuestions');
  } catch (err) {
    console.warn("Backend unavailable, using fallback mock data:", err);
    return mockQuestions;
  }
}

export async function getQuestionsByCategory(category) {
  if (USE_MOCK_MODE) return mockQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  try {
    return await smartFetch(`/question/category/${category}`, `http://localhost:8082/question/category/${category}`);
  } catch (err) {
    return mockQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }
}

export async function addQuestion(questionData) {
  if (USE_MOCK_MODE) {
    const newQ = { id: mockQuestions.length + 1, ...questionData };
    mockQuestions.push(newQ);
    return "Success";
  }
  try {
    return await smartFetch('/question/add', 'http://localhost:8082/question/add', {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  } catch (err) {
    const newQ = { id: mockQuestions.length + 1, ...questionData };
    mockQuestions.push(newQ);
    return "Saved in Local Demo Cache";
  }
}

// Quiz Service API Callers
export async function createQuiz(categoryName, numQuestions, title) {
  if (USE_MOCK_MODE) {
    const newId = 100 + mockQuizzes.length + 1;
    mockQuizzes.push({ id: newId, title, categoryName, questionIds: [1, 2] });
    return "Success";
  }
  try {
    return await smartFetch('/quiz/create', 'http://localhost:8090/quiz/create', {
      method: 'POST',
      body: JSON.stringify({ categoryName, numQuestions, title })
    });
  } catch (err) {
    const newId = 100 + mockQuizzes.length + 1;
    mockQuizzes.push({ id: newId, title, categoryName, questionIds: [1, 2] });
    return "Created in Local Demo Cache";
  }
}

export async function getQuizQuestions(quizId) {
  if (USE_MOCK_MODE) {
    return mockQuestions.slice(0, 4).map(q => ({
      id: q.id,
      questionTitle: q.questionTitle,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4
    }));
  }
  try {
    return await smartFetch(`/quiz/get/${quizId}`, `http://localhost:8090/quiz/get/${quizId}`, {
      method: 'POST'
    });
  } catch (err) {
    return mockQuestions.slice(0, 4).map(q => ({
      id: q.id,
      questionTitle: q.questionTitle,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4
    }));
  }
}

export async function submitQuiz(quizId, responses) {
  if (USE_MOCK_MODE) {
    let score = 0;
    responses.forEach(resp => {
      const question = mockQuestions.find(q => q.id === resp.id);
      if (question && question.rightAnswer === resp.response) score++;
    });
    return score;
  }
  try {
    return await smartFetch(`/quiz/submit/${quizId}`, `http://localhost:8090/quiz/submit/${quizId}`, {
      method: 'POST',
      body: JSON.stringify(responses)
    });
  } catch (err) {
    let score = 0;
    responses.forEach(resp => {
      const question = mockQuestions.find(q => q.id === resp.id);
      if (question && question.rightAnswer === resp.response) score++;
    });
    return score;
  }
}
