import React, { useState } from 'react';
import { Search, PlusCircle, Filter, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react';

export default function QuestionBank({ questions, onOpenAddQuestion }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(questions.map(q => q.category).filter(Boolean)))];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || q.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'ALL' || q.difficultylevel?.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyBadge = (diff) => {
    const level = diff?.toLowerCase();
    if (level === 'easy') return <span className="badge badge-easy">Easy</span>;
    if (level === 'medium') return <span className="badge badge-medium">Medium</span>;
    if (level === 'hard') return <span className="badge badge-hard">Hard</span>;
    return <span className="badge badge-easy">{diff || 'Normal'}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Question Repository <span className="gradient-text">({filteredQuestions.length})</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            QuestionService Bank • Managed in MySQL DB (`microservices_questiondb`)
          </p>
        </div>

        <button 
          onClick={onOpenAddQuestion}
          className="btn btn-primary btn-lg"
        >
          <PlusCircle size={18} /> Add New Question
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Search Field */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '999px', fontSize: '0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Select */}
        <select
          className="form-select"
          style={{ width: '150px' }}
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="ALL">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <HelpCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No questions found</h3>
          <p style={{ fontSize: '0.9rem' }}>Try clearing filters or add a new question to the bank.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredQuestions.map((q, idx) => (
            <div key={q.id || idx} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-category">{q.category || 'General'}</span>
                  {getDifficultyBadge(q.difficultylevel)}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.4 }}>
                  {q.questionTitle}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[q.option1, q.option2, q.option3, q.option4].filter(Boolean).map((opt, oIdx) => {
                    const isRight = opt === q.rightAnswer;
                    return (
                      <div
                        key={oIdx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          background: isRight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isRight ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                          color: isRight ? '#10b981' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt}</span>
                        {isRight && <CheckCircle2 size={14} color="#10b981" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Question ID: #{q.id || (idx + 1)}</span>
                <span>QuestionService</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
