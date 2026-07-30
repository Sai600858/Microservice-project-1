import React, { useState } from 'react';
import { Play, PlusCircle, HelpCircle, BookOpen, Layers, CheckCircle2, Zap, Cpu, Server, ShieldCheck } from 'lucide-react';
import { createQuiz } from '../services/api';

export default function Dashboard({ questions, onLaunchQuiz, onOpenAddQuestion, setActiveTab }) {
  const [quizTitle, setQuizTitle] = useState('Spring Boot & Microservices Test');
  const [category, setCategory] = useState('Java');
  const [numQuestions, setNumQuestions] = useState(4);
  const [loading, setLoading] = useState(false);

  // Stats calculation
  const totalQuestions = questions.length;
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const easyCount = questions.filter(q => q.difficultylevel?.toLowerCase() === 'easy').length;
  const mediumCount = questions.filter(q => q.difficultylevel?.toLowerCase() === 'medium').length;
  const hardCount = questions.filter(q => q.difficultylevel?.toLowerCase() === 'hard').length;

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createQuiz(category, Number(numQuestions), quizTitle);
      setLoading(false);
      onLaunchQuiz(1); // Launch default or generated quiz ID
    } catch (err) {
      setLoading(false);
      onLaunchQuiz(1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Section */}
      <div className="glass-card" style={{
        padding: '36px 40px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(17, 23, 38, 0.9) 0%, rgba(30, 41, 64, 0.7) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)'
      }}>
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Zap size={14} /> Powered by Spring Cloud Gateway & Netflix Eureka
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>
            Enterprise Microservices <br />
            <span className="gradient-text">Quiz & Question Platform</span>
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
            Dynamically generate tests, manage question repositories, and evaluate candidate performance using decoupled Java 21 Spring Boot microservices.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('quiz-player')}
              className="btn btn-primary btn-lg"
            >
              <Play size={18} /> Take a Quiz
            </button>

            <button 
              onClick={onOpenAddQuestion}
              className="btn btn-secondary btn-lg"
            >
              <PlusCircle size={18} /> Add New Question
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalQuestions}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Questions</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{categories.length || 1}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Categories</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>4</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Running Microservices</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>Spring Feign</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Inter-service Auth</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Quiz Generator & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Quick Generator Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Zap size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Quick Quiz Generator</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Generate a custom quiz via QuizService</p>
            </div>
          </div>

          <form onSubmit={handleQuickCreate}>
            <div className="form-group">
              <label className="form-label">Quiz Title</label>
              <input
                type="text"
                className="form-input"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="Microservices">Microservices</option>
                  <option value="Spring Boot">Spring Boot</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Questions Count</label>
                <select 
                  className="form-select" 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(e.target.value)}
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '12px', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Generating Quiz...' : '⚡ Generate & Start Quiz'}
            </button>
          </form>
        </div>

        {/* Question Bank Breakdown Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Question Repository</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Managed by QuestionService (Port 8082)</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('question-bank')} 
              className="btn btn-secondary btn-sm"
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-easy)', fontWeight: 600 }}>Easy Questions</span>
                <span style={{ fontWeight: 700 }}>{easyCount}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalQuestions ? (easyCount/totalQuestions)*100 : 33}%`, background: 'var(--color-easy)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-medium)', fontWeight: 600 }}>Medium Questions</span>
                <span style={{ fontWeight: 700 }}>{mediumCount}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalQuestions ? (mediumCount/totalQuestions)*100 : 33}%`, background: 'var(--color-medium)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-hard)', fontWeight: 600 }}>Hard Questions</span>
                <span style={{ fontWeight: 700 }}>{hardCount}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalQuestions ? (hardCount/totalQuestions)*100 : 33}%`, background: 'var(--color-hard)' }} />
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            <CheckCircle2 size={18} color="#10b981" />
            Auto-migrates schema to MySQL via Spring Data JPA.
          </div>
        </div>
      </div>
    </div>
  );
}
