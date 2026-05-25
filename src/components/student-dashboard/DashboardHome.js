import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../common/Header';
import PerformanceChart from '../common/PerformanceChart';
import TopInstructors from '../student/TopInstructors';
import TopReviewers from '../student/PopularReviewers';
import GlobalLoader from '../common/GlobalLoader';
import useDashboardData from './useDashboardData';
import './StudentDashboard.css';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { 
    stats, 
    topInstructors, 
    activeReviewers, 
    aiInsight, 
    engagementTrend,
    loading 
  } = useDashboardData(user);

  const navigateTo = (path) => navigate(`/dashboard/${path}`);

  if (loading || !user) return <GlobalLoader />;

  return (
    <div className="dashboard-home">
      {/* Welcome Hero - High Impact */}
      <div className="welcome-hero clickable" onClick={() => navigateTo('profile')}>
        <img 
          src={user.profilePictureUrl || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} 
          alt="Profile" 
          className="student-avatar-large"
        />
        <div className="hero-content">
          <h1>Welcome back, {user.displayName?.split(' ')[0] || 'Scholar'}!</h1>
          <p className="hero-subtitle">
            Your academic journey is in full swing. You've influenced {stats.reviewsSubmitted || 0} peer decisions this semester.
          </p>
          
          <div className="stats-row">
            <div className="stat-pill">
              <span>{stats.coursesTaken || 0}</span>
              <span>Courses</span>
            </div>
            <div className="stat-pill">
              <span>{stats.instructorsRated || 0}</span>
              <span>Rated</span>
            </div>
            <div className="stat-pill">
              <span>{stats.engagementScore || 0}</span>
              <span>IQ Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      {aiInsight && (
        <div className="ai-insight-card">
          <div className="ai-icon">{aiInsight.icon}</div>
          <div className="ai-text">
            <h4>{aiInsight.title}</h4>
            <p>{aiInsight.text}</p>
          </div>
          <div className="ai-badge">AI INSIGHT</div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="analytics-section">
        <PerformanceChart 
          data={engagementTrend} 
          title="Engagement Analytics" 
          subtitle="Real-time tracking of your academic feedback impact"
        />
      </div>

      {/* Quick Navigation */}
      <div className="quick-nav">
        <div className="nav-card" onClick={() => navigateTo('rate')}>
          <div className="icon">⭐</div>
          <h3>Rate Faculty</h3>
          <p>Provide anonymous, AI-analyzed feedback for your instructors.</p>
        </div>
        <div className="nav-card" onClick={() => navigateTo('activity')}>
          <div className="icon">📝</div>
          <h3>Activity Feed</h3>
          <p>Track your reviews, helpful votes, and instructor replies.</p>
        </div>
        <div className="nav-card" onClick={() => navigateTo('profile')}>
          <div className="icon">👤</div>
          <h3>My Identity</h3>
          <p>Manage your profile, academic stats, and privacy settings.</p>
        </div>
      </div>

      {/* Discovery Widgets */}
      <div className="widgets-grid">
        <div className="widget-section">
          <div className="section-header">
            <h3>Top Rated Faculty</h3>
          </div>
          <TopInstructors instructors={topInstructors} />
          <button className="see-more-btn" onClick={() => navigateTo('rate')}>
            Explore All Faculty →
          </button>
        </div>

        <div className="widget-section">
          <div className="section-header">
            <h3>Elite Contributors</h3>
          </div>
          <TopReviewers reviewers={activeReviewers} />
          <button className="see-more-btn" onClick={() => navigateTo('activity')}>
            View Global Feed →
          </button>
        </div>
      </div>

      <style jsx>{`
        .clickable { cursor: pointer; }
        .ai-badge {
          font-size: 10px;
          font-weight: 800;
          color: #a855f7;
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 4px 12px;
          border-radius: 50px;
          letter-spacing: 0.1em;
        }
        .see-more-btn {
          margin-top: 24px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #6366f1;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .see-more-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
}
