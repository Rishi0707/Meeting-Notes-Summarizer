'use client';

import React, { useRef, useState } from 'react';

export default function Home() {
  // UI State
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('Summarize the meeting notes in bullet points.');
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [editableSummary, setEditableSummary] = useState('');

  const [recipient, setRecipient] = useState('');
  const [mailStatus, setMailStatus] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] ?? null;
    setFile(uploadedFile);
    setText('');
    setSummary('');
    setEditableSummary('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setText(data.text || 'Unable to extract text.');
    } catch (err) {
      setText('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for generating summary
  const handleGenerate = async () => {
    if (!text || !prompt) return;
    setGenerating(true);
    setSummary('');
    setEditableSummary('');
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, prompt }),
      });
      const data = await res.json();
      setSummary(data.summary || 'Failed to generate summary.');
      setEditableSummary(data.summary || '');
    } catch (err) {
      setSummary('Error generating summary.');
      setEditableSummary('');
    } finally {
      setGenerating(false);
    }
  };

  // Handler for sending email
  const handleSend = async () => {
    if (!editableSummary || !recipient) return;
    setMailStatus('Sending...');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: editableSummary, recipient }),
      });
      const data = await res.json();
      setMailStatus(data.success ? '✅ Email sent!' : `❌ ${data.error || 'Failed to send.'}`);
    } catch (err) {
      setMailStatus('❌ Error sending email.');
    }
  };

  // Handler to reset file input
  const handleReset = () => {
    setFile(null);
    setText('');
    setSummary('');
    setEditableSummary('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#222',
      color: '#f4f4f4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 600,
        background: '#2a2a2a',
        padding: '2rem',
        borderRadius: 16,
        boxShadow: '0 8px 32px #0002'
      }}>
        <h2 style={{ marginBottom: 16, textAlign: 'center' }}>AI Meeting Notes Summarizer</h2>

        {/* Upload Section */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontWeight: 500,
              fontSize: '1.02rem'
            }}
          >
            Upload Meeting Transcript(text file only)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileChange}
            style={{
              background: '#333',
              color: '#f4f4f4',
              borderRadius: 4,
              marginBottom: 8,
              padding: '4px 0'
            }}
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              background: loading ? '#666' : '#31c27c',
              color: '#fff',
              padding: '6px 18px',
              border: 'none',
              borderRadius: 4,
              fontWeight: 500,
              marginLeft: 8,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Uploading...' : 'Upload & Extract'}
          </button>
          <button
            onClick={handleReset}
            style={{
              background: '#444',
              color: '#fff',
              padding: '6px 14px',
              border: 'none',
              borderRadius: 4,
              fontWeight: 500,
              marginLeft: 8,
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>

        {/* Preview Extracted Text */}
        {text && (
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Transcript Preview
            </label>
            <textarea
              value={text}
              readOnly
              style={{
                width: '100%',
                height: 120,
                background: '#191919',
                color: '#fefefe',
                padding: 10,
                borderRadius: 6,
                border: '1px solid #444',
                marginBottom: 8,
                fontFamily: 'inherit',
                fontSize: '.97rem'
              }}
            />
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Custom Instruction / Prompt
            </label>
            <input
              style={{
                width: '100%',
                padding: '7px 6px',
                border: '1px solid #444',
                borderRadius: 6,
                marginBottom: 10,
                background: '#191919',
                color: '#fefefe'
              }}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder='E.g. "Highlight action items only"'
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                background: generating ? '#666' : '#4097e6',
                color: '#fff',
                padding: '7px 18px',
                border: 'none',
                borderRadius: 4,
                fontWeight: 500,
                cursor: generating ? 'not-allowed' : 'pointer'
              }}
            >
              {generating ? 'Generating...' : 'Generate AI Summary'}
            </button>
          </div>
        )}

        {/* Editable Summary */}
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ marginBottom: 8, display: 'block', fontWeight: 500 }}>
              Generated Summary <span style={{ color: '#aaa', fontSize: '0.95em' }}>(You can edit)</span>
            </label>
            <textarea
              value={editableSummary}
              style={{
                width: '100%',
                height: 110,
                background: '#222',
                color: '#fefefe',
                padding: 10,
                borderRadius: 6,
                border: '1px solid #444',
                fontFamily: 'inherit',
                fontSize: '.97rem',
                marginBottom: 8
              }}
              onChange={e => setEditableSummary(e.target.value)}
            />
          </div>
        )}

        {/* Email Sharing */}
        {editableSummary && (
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Share Summary via Email
            </label>
            <input
              type="email"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="Recipient Email"
              style={{
                width: '100%',
                padding: '7px 6px',
                border: '1px solid #444',
                borderRadius: 6,
                marginBottom: 8,
                background: '#191919',
                color: '#fefefe'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!recipient || !editableSummary}
              style={{
                background: '#db1a1a',
                color: '#fff',
                padding: '7px 18px',
                border: 'none',
                borderRadius: 4,
                fontWeight: 500,
                cursor: (!recipient || !editableSummary) ? 'not-allowed' : 'pointer'
              }}
            >
              Send Summary
            </button>
            {mailStatus && (
              <div style={{ marginTop: 10, fontWeight: 500, color: mailStatus.startsWith('✅') ? '#16c784' : '#e1513a' }}>
                {mailStatus}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ marginTop: 28, fontSize: '.95rem', opacity: .7 }}>
        <span>© 2025 AI Meeting Notes Summarizer</span>
      </div>
    </div>
  );
}
