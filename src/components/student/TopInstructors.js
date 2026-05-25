import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function TopInstructors({ instructors }) {
  const navigate = useNavigate();
  const [hydratedInstructors, setHydratedInstructors] = useState(instructors);

  useEffect(() => {
      if (!instructors?.length) return;
      setHydratedInstructors(instructors); // Sync when prop changes
  }, [instructors]);

  if (!hydratedInstructors?.length) return <div className="empty-state-message">No data available.</div>;

  const getDisplayName = (inst) => {
      return inst.fullName || inst.displayName || inst.name || 'Instructor';
  };

  return (
    <div className="discovery-grid-premium">
      {hydratedInstructors.map((inst, index) => {
        const rating = inst.ratingStats?.average || inst.avgRating || 0;
        const count = inst.ratingStats?.totalRatings || inst.ratingCount || 0;
        
        return (
        <div key={inst.id || index} className="premium-card" onClick={() => navigate(`/instructor/${inst.id}`)} style={{ cursor: 'pointer' }}>
           <div className="card-content-row">
               <div className="premium-avatar-small">
                  <img 
                    src={inst.profilePictureUrl || `https://ui-avatars.com/api/?name=${getDisplayName(inst)}&background=random`} 
                    alt={getDisplayName(inst)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                  />
               </div>
               <div className="reviewer-info">
                   <h4 className="reviewer-name">{getDisplayName(inst)}</h4>
                   <p className="reviewer-dept">{inst.department || 'General'}</p>
               </div>
           </div>
           
           <div className="stats-grid-premium">
               <div className="stat-item-premium">
                   <span className="stat-icon">⭐</span>
                   <span className="stat-val">{rating}</span>
                   <span className="stat-lbl">Rating</span>
               </div>
               <div className="stat-item-premium">
                   <span className="stat-icon">📈</span>
                   <span className="stat-val">{count}</span>
                   <span className="stat-lbl">Signals</span>
               </div>
           </div>

           <button className="view-profile-btn-premium">
              View Performance
           </button>
        </div>
        );
      })}
    </div>
  );
}
