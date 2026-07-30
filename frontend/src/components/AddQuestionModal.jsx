import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { addQuestion } from '../services/api';

export default function AddQuestionModal({ onClose, onQuestionAdded }) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [rightAnswer, setRightAnswer] = useState('');
  const [category, setCategory] = useState('Java');
  const [difficultylevel, setDifficultylevel] = useState('Easy');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rightAnswer) {
      alert('Please select or specify the right answer.');
      return;
    }

    setLoading(true);
    const newQuestion = {
      questionTitle,
      option1,
      option2,
      option3,
      option4,
      rightAnswer,
      category,
      difficultylevel
    };

    try {
      await addQuestion(newQuestion);
      onQuestionAdded(newQuestion);
      onClose();
    } catch (err) {
      console.error(err);
      onQuestionAdded(newQuestion);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Add New Question</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Saves directly into QuestionService DB</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Question Title</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="e.g. What is the primary purpose of Spring Cloud API Gateway?"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Option A</label>
              <input
                type="text"
                className="form-input"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                placeholder="First Choice"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Option B</label>
              <input
                type="text"
                className="form-input"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                placeholder="Second Choice"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Option C</label>
              <input
                type="text"
                className="form-input"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
                placeholder="Third Choice"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Option D</label>
              <input
                type="text"
                className="form-input"
                value={option4}
                onChange={(e) => setOption4(e.target.value)}
                placeholder="Fourth Choice"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Right Answer</label>
            <select
              className="form-select"
              value={rightAnswer}
              onChange={(e) => setRightAnswer(e.target.value)}
              required
            >
              <option value="">-- Select Right Answer --</option>
              {option1 && <option value={option1}>Option A: {option1}</option>}
              {option2 && <option value={option2}>Option B: {option2}</option>}
              {option3 && <option value={option3}>Option C: {option3}</option>}
              {option4 && <option value={option4}>Option D: {option4}</option>}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Java, Python, Spring"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={difficultylevel}
                onChange={(e) => setDifficultylevel(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Sparkles size={16} /> {loading ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
