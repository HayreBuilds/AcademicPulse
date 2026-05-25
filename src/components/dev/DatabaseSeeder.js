import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, serverTimestamp, collection, writeBatch, getDocs, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DatabaseSeeder = () => {
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const handleClear = async () => {
        if (!window.confirm("This will clear ALL instructors and feedbacks. Continue?")) return;
        setStatus('loading');
        try {
            const cols = ['instructors', 'feedbacks', 'users', 'students'];
            for (const colName of cols) {
                const snap = await getDocs(collection(db, colName));
                addLog(`Clearing ${snap.size} docs from ${colName}...`);
                const batch = writeBatch(db);
                snap.docs.forEach(d => batch.delete(d.ref));
                await batch.commit();
            }
            addLog("Database cleared.");
            setStatus('success');
        } catch (err) {
            addLog(`Error: ${err.message}`);
            setStatus('error');
        }
    };

    const handleSeed = async () => {
        setStatus('loading');
        setLogs([]);
        try {
            const batch = writeBatch(db);

            // 1. Seed Instructors
            addLog("Seeding Elite Faculty...");
            const instructors = [
                { id: 'inst_1', fullName: 'Dr. Abebe Kebede', email: 'abebe.k@aau.edu.et', department: 'Computer Science', courses: ['CS101', 'CS202'], avgRating: 4.9, ratingCount: 42, profilePictureUrl: 'https://i.pravatar.cc/150?u=1' },
                { id: 'inst_2', fullName: 'Prof. Martha Yohannes', email: 'martha.y@aau.edu.et', department: 'Mathematics', courses: ['MATH101', 'MATH301'], avgRating: 4.7, ratingCount: 35, profilePictureUrl: 'https://i.pravatar.cc/150?u=2' },
                { id: 'inst_3', fullName: 'Dr. Solomon Tekle', email: 'solomon.t@aau.edu.et', department: 'Physics', courses: ['PHYS101', 'PHYS402'], avgRating: 4.4, ratingCount: 28, profilePictureUrl: 'https://i.pravatar.cc/150?u=3' },
                { id: 'inst_4', fullName: 'Dr. Bethlehem Tadesse', email: 'betty.t@aau.edu.et', department: 'Biology', courses: ['BIO101', 'BIO205'], avgRating: 4.8, ratingCount: 56, profilePictureUrl: 'https://i.pravatar.cc/150?u=4' },
                { id: 'inst_5', fullName: 'Prof. Kassahun G/Michael', email: 'kass.g@aau.edu.et', department: 'Chemistry', courses: ['CHEM101'], avgRating: 4.2, ratingCount: 19, profilePictureUrl: 'https://i.pravatar.cc/150?u=5' }
            ];

            instructors.forEach(inst => {
                batch.set(doc(db, 'instructors', inst.id), { ...inst, createdAt: serverTimestamp(), isRegistered: true });
            });

            // 2. Seed Users (Students)
            addLog("Seeding Top Contributors...");
            const students = [
                { id: 'stud_1', displayName: 'Amanuel Girma', email: 'aman@aau.edu.et', role: 'student', department: 'Computer Science', profilePictureUrl: 'https://i.pravatar.cc/150?u=11' },
                { id: 'stud_2', displayName: 'Hana Belay', email: 'hana@aau.edu.et', role: 'student', department: 'Mathematics', profilePictureUrl: 'https://i.pravatar.cc/150?u=12' },
                { id: 'stud_3', displayName: 'Yared Tilahun', email: 'yared@aau.edu.et', role: 'student', department: 'Physics', profilePictureUrl: 'https://i.pravatar.cc/150?u=13' },
                { id: 'stud_4', displayName: 'Selamawit Kassa', email: 'selam@aau.edu.et', role: 'student', department: 'Biology', profilePictureUrl: 'https://i.pravatar.cc/150?u=14' }
            ];

            students.forEach(s => {
                batch.set(doc(db, 'users', s.id), { ...s, uid: s.id, createdAt: serverTimestamp(), isRegistered: true, isVerified: true });
                batch.set(doc(db, 'students', s.id), { studentId: s.id, department: s.department, stats: { reviewsCount: Math.floor(Math.random() * 10) + 5, helpfulVotes: Math.floor(Math.random() * 100) }, createdAt: serverTimestamp() });
            });

            // 3. Seed Feedbacks
            addLog("Seeding AI-Analyzed Feedback...");
            const feedbacks = [
                { id: 'fb_1', instructorId: 'inst_1', studentId: 'stud_1', instructorName: 'Dr. Abebe Kebede', studentName: 'Amanuel Girma', rating: 5, text: "The best CS professor at AAU. His explanation of Data Structures is unmatched. Highly recommended!", tags: ["Inspirational", "Clear Communication"], aiScore: { sentiment: 0.95, toxicity: 0.01 }, createdAt: Date.now() },
                { id: 'fb_2', instructorId: 'inst_1', studentId: 'stud_3', instructorName: 'Dr. Abebe Kebede', studentName: 'Yared Tilahun', rating: 5, text: "Very supportive and always available for office hours. Makes complex topics easy to understand.", tags: ["Supportive"], aiScore: { sentiment: 0.88, toxicity: 0.02 }, createdAt: Date.now() - 3600000 },
                { id: 'fb_3', instructorId: 'inst_4', studentId: 'stud_4', instructorName: 'Dr. Bethlehem Tadesse', studentName: 'Selamawit Kassa', rating: 5, text: "Her lab sessions are incredible. I've never enjoyed Biology this much!", tags: ["Practical Knowledge", "Inspirational"], aiScore: { sentiment: 0.92, toxicity: 0.01 }, createdAt: Date.now() - 7200000 },
                { id: 'fb_4', instructorId: 'inst_2', studentId: 'stud_2', instructorName: 'Prof. Martha Yohannes', studentName: 'Hana Belay', rating: 4, text: "Math is hard, but Prof. Martha makes it manageable. Expect a heavy workload though.", tags: ["Tough Grader", "Clear Communication"], aiScore: { sentiment: 0.65, toxicity: 0.05 }, createdAt: Date.now() - 86400000 },
                { id: 'fb_5', instructorId: 'inst_5', studentId: 'stud_1', instructorName: 'Prof. Kassahun G/Michael', studentName: 'Amanuel Girma', rating: 3, text: "Good teacher but the exams are extremely difficult. Study hard!", tags: ["Tough Grader"], aiScore: { sentiment: 0.45, toxicity: 0.02 }, createdAt: Date.now() - 172800000 }
            ];

            feedbacks.forEach(fb => {
                batch.set(doc(db, 'feedbacks', fb.id), { ...fb, timestamp: serverTimestamp() });
            });

            await batch.commit();
            addLog("Academic ecosystem seeded successfully!");
            setStatus('success');
        } catch (err) {
            console.error(err);
            addLog(`Error: ${err.message}`);
            setStatus('error');
        }
    };

    return (
        <div style={{ padding: 40, background: '#050505', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 20, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Ecosystem Seeder
                </h1>
                <p style={{ opacity: 0.7, fontSize: '1.2rem', marginBottom: 40 }}>
                    Populate AcademicPulse with high-quality, AI-analyzed academic data.
                </p>
                
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 60 }}>
                    <button 
                        onClick={handleSeed} 
                        disabled={status === 'loading'}
                        style={{ 
                            padding: '18px 40px', 
                            fontSize: 18, 
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            border: 'none',
                            borderRadius: '16px',
                            color: 'white',
                            fontWeight: 700,
                            boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.5)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        🚀 {status === 'loading' ? 'Seeding...' : 'Seed Full Ecosystem'}
                    </button>

                    <button 
                        onClick={handleClear} 
                        disabled={status === 'loading'}
                        style={{ 
                            padding: '18px 40px', 
                            fontSize: 18, 
                            cursor: 'pointer',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '16px',
                            color: '#ef4444',
                            fontWeight: 700,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        🗑️ Clear All Data
                    </button>
                </div>

                {status === 'success' && (
                    <button 
                        onClick={() => navigate('/dashboard')}
                        style={{ 
                            marginBottom: 40,
                            padding: '14px 28px',
                            borderRadius: '12px',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Go to Dashboard →
                    </button>
                )}

                <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, maxHeight: 400, overflowY: 'auto' }}>
                    <h4 style={{ margin: '0 0 20px', fontSize: '0.8rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Activity Logs</h4>
                    {logs.map((log, i) => (
                        <div key={i} style={{ fontSize: '0.9rem', marginBottom: 8, fontFamily: 'monospace', color: log.includes('Error') ? '#ef4444' : '#a1a1aa' }}>
                            {log}
                        </div>
                    ))}
                    {logs.length === 0 && <p style={{ opacity: 0.2, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>No activity logged.</p>}
                </div>
            </div>
        </div>
    );
};

export default DatabaseSeeder;
