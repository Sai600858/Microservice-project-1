import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuizPlayer from './components/QuizPlayer';
import QuestionBank from './components/QuestionBank';
import AddQuestionModal from './components/AddQuestionModal';
import ServiceStatus from './components/ServiceStatus';
import { getAllQuestions, checkBackendStatus } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [questions, setQuestions] = useState([]);
  const [statusInfo, setStatusInfo] = useState({ isOnline: false, mode: 'Checking...' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetQuizId, setTargetQuizId] = useState(1);

  const fetchStatus = async () => {
    const status = await checkBackendStatus();
    setStatusInfo(status);
  };

  const loadQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setQuestions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    loadQuestions();
  }, []);

  const handleLaunchQuiz = (quizId) => {
    setTargetQuizId(quizId);
    setActiveTab('quiz-player');
  };

  const handleQuestionAdded = (newQ) => {
    setQuestions(prev => [newQ, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        statusInfo={statusInfo}
        onRefreshStatus={fetchStatus}
      />

      {/* Main View Container */}
      <main style={{
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px 60px'
      }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            questions={questions}
            onLaunchQuiz={handleLaunchQuiz}
            onOpenAddQuestion={() => setShowAddModal(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'quiz-player' && (
          <QuizPlayer 
            quizIdToPlay={targetQuizId}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'question-bank' && (
          <QuestionBank 
            questions={questions}
            onOpenAddQuestion={() => setShowAddModal(true)}
          />
        )}

        {activeTab === 'services' && (
          <ServiceStatus 
            statusInfo={statusInfo}
            onRefreshStatus={fetchStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        QuizCraft Microservices • Built with Java 21, Spring Boot 4, Netflix Eureka & React Vite UI
      </footer>

      {/* Modal */}
      {showAddModal && (
        <AddQuestionModal 
          onClose={() => setShowAddModal(false)}
          onQuestionAdded={handleQuestionAdded}
        />
      )}
    </div>
  );
}
