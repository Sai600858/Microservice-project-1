// API Service for Quiz Generator Microservices

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

// Rich Mock Data Store
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
  },
  {
    id: 3,
    questionTitle: "In Spring Cloud Gateway, which predicate routes traffic based on URL request path patterns?",
    option1: "Header Route Predicate",
    option2: "Path Route Predicate",
    option3: "Query Route Predicate",
    option4: "Method Route Predicate",
    rightAnswer: "Path Route Predicate",
    difficultylevel: "Easy",
    category: "Java"
  },
  {
    id: 4,
    questionTitle: "What is the default port for Netflix Eureka Server?",
    option1: "8080",
    option2: "8082",
    option3: "8761",
    option4: "8787",
    rightAnswer: "8761",
    difficultylevel: "Easy",
    category: "Java"
  },
  {
    id: 5,
    questionTitle: "Which component of Spring Data JPA generates SQL queries dynamically based on method names?",
    option1: "JpaRepository",
    option2: "EntityManager",
    option3: "Hibernate Criteria API",
    option4: "Spring JDBC Template",
    rightAnswer: "JpaRepository",
    difficultylevel: "Medium",
    category: "Java"
  },
  {
    id: 6,
    questionTitle: "What feature in Python 3.12 improved asynchronous task scheduling efficiency?",
    option1: "Global Interpreter Lock (GIL) removal preview",
    option2: "f-string syntax expansion",
    option3: "Per-interpreter GIL and asyncio performance enhancements",
    option4: "Pattern matching improvement",
    rightAnswer: "Per-interpreter GIL and asyncio performance enhancements",
    difficultylevel: "Hard",
    category: "Python"
  }
];

let mockQuizzes = [
  {
    id: 101,
    title: "Spring Microservices Fundamentals",
    categoryName: "Java",
    questionIds: [1, 2, 3, 4]
  }
];

// Helper Fetch with Timeout and Fallback
async function fetchWithFallback(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);
  
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
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

// Check Backend Connectivity
export async function checkBackendStatus() {
  if (USE_MOCK_MODE) return { isOnline: false, mode: 'Mock Mode Active' };
  try {
    // Try Gateway or Service Registry
    const res = await fetchWithFallback(`${API_GATEWAY_URL}/question/allQuestions`);
    return { isOnline: true, mode: 'Connected to API Gateway (Port 8787)' };
  } catch (err) {
    return { isOnline: false, error: err.message, mode: 'Offline / Gateway Disconnected' };
  }
}

// Question Service API Callers
export async function getAllQuestions() {
  if (USE_MOCK_MODE) return mockQuestions;
  try {
    return await fetchWithFallback(`${API_GATEWAY_URL}/question/allQuestions`);
  } catch (err) {
    console.warn("Backend unavailable, returning mock data:", err);
    return mockQuestions;
  }
}

export async function getQuestionsByCategory(category) {
  if (USE_MOCK_MODE) return mockQuestions.filter(q => q.category.toLowerCase() === category.toLowerCase());
  try {
    return await fetchWithFallback(`${API_GATEWAY_URL}/question/category/${category}`);
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
    return await fetchWithFallback(`${API_GATEWAY_URL}/question/add`, {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  } catch (err) {
    const newQ = { id: mockQuestions.length + 1, ...questionData };
    mockQuestions.push(newQ);
    return "Success (Mock Saved)";
  }
}

// Quiz Service API Callers
export async function createQuiz(categoryName, numQuestions, title) {
  if (USE_MOCK_MODE) {
    const newId = 100 + mockQuizzes.length + 1;
    const questions = mockQuestions.filter(q => q.category.toLowerCase() === categoryName.toLowerCase());
    const selectedIds = questions.slice(0, numQuestions).map(q => q.id);
    mockQuizzes.push({
      id: newId,
      title,
      categoryName,
      questionIds: selectedIds.length ? selectedIds : [1, 2]
    });
    return "Success";
  }
  try {
    return await fetchWithFallback(`${API_GATEWAY_URL}/quiz/create`, {
      method: 'POST',
      body: JSON.stringify({ categoryName, numQuestions, title })
    });
  } catch (err) {
    const newId = 100 + mockQuizzes.length + 1;
    mockQuizzes.push({
      id: newId,
      title,
      categoryName,
      questionIds: [1, 2, 3]
    });
    return "Success (Mock Created)";
  }
}

export async function getQuizQuestions(quizId) {
  if (USE_MOCK_MODE) {
    const quiz = mockQuizzes.find(q => q.id === Number(quizId)) || mockQuizzes[0];
    const qList = mockQuestions.filter(q => quiz.questionIds.includes(q.id));
    return (qList.length ? qList : mockQuestions.slice(0, 4)).map(q => ({
      id: q.id,
      questionTitle: q.questionTitle,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4
    }));
  }
  try {
    return await fetchWithFallback(`${API_GATEWAY_URL}/quiz/get/${quizId}`, {
      method: 'POST'
    });
  } catch (err) {
    // Fallback to mock
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
      if (question && question.rightAnswer === resp.response) {
        score++;
      }
    });
    return score;
  }
  try {
    return await fetchWithFallback(`${API_GATEWAY_URL}/quiz/submit/${quizId}`, {
      method: 'POST',
      body: JSON.stringify(responses)
    });
  } catch (err) {
    let score = 0;
    responses.forEach(resp => {
      const question = mockQuestions.find(q => q.id === resp.id);
      if (question && question.rightAnswer === resp.response) {
        score++;
      }
    });
    return score;
  }
}
