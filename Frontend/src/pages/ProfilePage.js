import React from 'react';
import { useNavigate} from 'react-router-dom';
import './ProfilePage.css'
import { useState , useEffect } from 'react';
const ProfilePage = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        try {
          const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            setError('Failed to fetch profile');
            navigate('/login');
            return;
          }
          const data = await response.json();
          setProfile(data);
        } catch {
          setError('Something went wrong');
        }
      };
      fetchProfile();
    }, [navigate]);
  

  return (
    <div className="profile-page">
      {error ? (
        <p className="error-message">{error}</p>
      ) : profile ? (
        <div>
          <h1>Profile</h1>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
