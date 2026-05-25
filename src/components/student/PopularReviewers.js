import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PopularReviewers({ reviewers }) {
  const navigate = useNavigate();

  if (!reviewers?.length) return <div className="empty-state-message">No data yet.</div>;

  return (
    <div className="discovery-grid-premium">
      {reviewers.map((reviewer, index) => (
        <div key={reviewer.studentId || index} className="premium-card" onClick={() => navigate(`/student/${reviewer.studentId}`)} style={{ cursor: 'pointer' }}>
           <div className="card-content-row">
               <div className="premium-avatar-small">
                  <img 
                    src={reviewer.photoURL || `https://ui-avatars.com/api/?name=${reviewer.name || 'Student'}&background=random`} 
                    alt={reviewer.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} 
                  />
               </div>
               <div className="reviewer-info">
                   <h4 className="reviewer-name">{reviewer.name || 'Student'}</h4>
                   <p className="reviewer-dept">{reviewer.department || 'Elite Contributor'}</p>
               </div>
           </div>
           
           <div className="stats-grid-premium">
               <div className="stat-item-premium">
                   <span className="stat-icon">📝</span>
                   <span className="stat-val">{reviewer.count || 0}</span>
                   <span className="stat-lbl">Reviews</span>
               </div>
               <div className="stat-item-premium">
                   <span className="stat-icon">👍</span>
                   <span className="stat-val">{reviewer.helpfulVotes || 0}</span>
                   <span className="stat-lbl">Helpful</span>
               </div>
           </div>

           <button className="view-profile-btn-premium">
              View Influence
           </button>
        </div>
      ))}
    </div>
  );
}
