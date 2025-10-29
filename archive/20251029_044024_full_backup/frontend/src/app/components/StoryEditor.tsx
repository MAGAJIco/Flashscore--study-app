
import React, { useState } from 'react';

interface Story {
  id?: number;
  title: string;
  preview: string;
  fullContent: string;
}

interface StoryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (story: Story) => void;
  story?: Story;
}

const StoryEditor: React.FC<StoryEditorProps> = ({ isOpen, onClose, onSave, story }) => {
  const [title, setTitle] = useState(story?.title || '');
  const [preview, setPreview] = useState(story?.preview || '');
  const [fullContent, setFullContent] = useState(story?.fullContent || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !preview || !fullContent) {
      alert('Please fill in all fields');
      return;
    }

    onSave({
      id: story?.id,
      title,
      preview,
      fullContent
    });

    // Reset form
    setTitle('');
    setPreview('');
    setFullContent('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      <div className="glass-card" style={{
        width: '600px',
        maxHeight: '80vh',
        padding: '30px',
        margin: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflowY: 'auto'
      }}>
        <h3 style={{
          color: '#e8f5e8',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          ✍️ {story ? 'Edit Story' : 'Add New Story'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#d1fae5', marginBottom: '5px', display: 'block' }}>
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                fontSize: '16px'
              }}
              placeholder="Enter story title..."
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#d1fae5', marginBottom: '5px', display: 'block' }}>
              Preview Text
            </label>
            <textarea
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                fontSize: '16px',
                resize: 'vertical'
              }}
              placeholder="Enter preview text (shown when collapsed)..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#d1fae5', marginBottom: '5px', display: 'block' }}>
              Full Story Content
            </label>
            <textarea
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                fontSize: '16px',
                resize: 'vertical'
              }}
              placeholder="Enter full story content (shown when expanded)..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              💾 Save Story
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryEditor;
