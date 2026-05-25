import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, serverTimestamp, collection, writeBatch } from 'firebase/firestore';

const DatabaseSeeder = () => {
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const handleSeed = async () => {
        setStatus('loading');
        setLogs([]);
        try {
            const batch = writeBatch(db);

            // 1. Seed Instructors
            addLog("Seeding Instructors...");
            const instructors = [
                { id: 'inst_1', fullName: 'Dr. Abebe Kebede', email: 'abebe.k@aau.edu.et', department: 'Computer Science', courses: ['CS101', 'CS202'], avgRating: 4.8, ratingCount: 15 },
                { id: 'inst_2', fullName: 'Prof. Martha Yohannes', email: 'martha.y@aau.edu.et', department: 'Mathematics', courses: ['MATH101', 'MATH301'], avgRating: 4.5, ratingCount: 10 },
                { id: 'inst_3', fullName: 'Dr. Solomon Tekle', email: 'solomon.t@aau.edu.et', department: 'Physics', courses: ['PHYS101'], avgRating: 4.2, ratingCount: 8 }
            ];

            instructors.forEach(inst => {
                const ref = doc(db, 'instructors', inst.id);
                batch.set(ref, { ...inst, createdAt: serverTimestamp(), isRegistered: true });
            });

            // 2. Seed Ratings/Feedback
            addLog("Seeding Ratings...");
            const feedbacks = [
                { id: 'fb_1', instructorId: 'inst_1', studentId: 'test_user', rating: 5, text: "Excellent teacher, very clear explanations!", tags: ["Inspirational", "Clear Communication"], createdAt: Date.now() },
                { id: 'fb_2', instructorId: 'inst_1', studentId: 'test_user_2', rating: 4, text: "Tough grader but you learn a lot.", tags: ["Tough Grader"], createdAt: Date.now() - 86400000 },
                { id: 'fb_3', instructorId: 'inst_2', studentId: 'test_user', rating: 5, text: "Best math professor I've had.", tags: ["Inspirational"], createdAt: Date.now() - 172800000 }
            ];

            feedbacks.forEach(fb => {
                const ref = doc(db, 'feedbacks', fb.id);
                batch.set(ref, { ...fb, timestamp: serverTimestamp() });
            });

            // 3. Seed Users (Students)
            addLog("Seeding Student Users...");
            const users = [
                { id: 'test_user', displayName: 'John Doe', email: 'john@example.com', role: 'student', department: 'Computer Science', isRegistered: true, isVerified: true },
                { id: 'test_user_2', displayName: 'Jane Smith', email: 'jane@example.com', role: 'student', department: 'Mathematics', isRegistered: true, isVerified: true }
            ];

            users.forEach(u => {
                const ref = doc(db, 'users', u.id);
                batch.set(ref, { ...u, createdAt: serverTimestamp() });
                
                // Also create student specific doc
                const sRef = doc(db, 'students', u.id);
                batch.set(sRef, { 
                    studentId: u.id, 
                    department: u.department, 
                    stats: { reviewsCount: 1, helpfulVotes: 5 },
                    createdAt: serverTimestamp() 
                });
            });

            await batch.commit();
            addLog("Batch committed successfully!");
            setStatus('success');
        } catch (err) {
            console.error(err);
            addLog(`Error: ${err.message}`);
            setStatus('error');
        }
    };

    return (
        <div style={{ padding: 40, background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 20 }}>Database Seeder</h1>
                <p style={{ opacity: 0.7, marginBottom: 40 }}>Populate your AcademicPulse database with sample data for instructors, ratings, and students.</p>
                
                {status !== 'loading' && (
                    <button 
                        onClick={handleSeed} 
                        style={{ 
                            padding: '16px 32px', 
                            fontSize: 18, 
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: 700,
                            boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        🚀 Seed Database
                    </button>
                )}

                {status === 'loading' && (
                    <div style={{ marginTop: 20 }}>
                        <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
                        <p>Seeding in progress...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ marginTop: 40, padding: 20, background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', borderRadius: 12 }}>
                        <h3 style={{ color: '#4ade80', margin: 0 }}>Success!</h3>
                        <p style={{ margin: '10px 0 0' }}>The database has been populated with sample data.</p>
                    </div>
                )}

                <div style={{ marginTop: 60, textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 12, maxHeight: 300, overflowY: 'auto' }}>
                    <h4 style={{ margin: '0 0 15px', fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase' }}>Seeder Logs</h4>
                    {logs.map((log, i) => (
                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: 5, fontFamily: 'monospace', opacity: 0.8 }}>{log}</div>
                    ))}
                    {logs.length === 0 && <p style={{ opacity: 0.3, fontSize: '0.85rem' }}>No logs yet.</p>}
                </div>
            </div>
            
            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.1);
                    border-left-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default DatabaseSeeder;
