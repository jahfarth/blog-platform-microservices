import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BLOG_API = 'http://localhost:3002';
const USER_API = 'http://localhost:3001';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProfile();
    fetchUserPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${USER_API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setForm({ username: res.data.username || '', bio: res.data.bio || '' });
    } catch (err) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`${BLOG_API}/posts?author=${userId}`);
      setPosts(res.data.posts || res.data || []);
    } catch (err) {
      console.error('Failed to fetch posts');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await axios.put(`${USER_API}/users/me`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditing(false);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return <div style={{textAlign:'center',padding:'60px',fontSize:'18px',color:'#666'}}>Loading...</div>;

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'24px 20px'}}>
      <div style={{background:'#fff',borderRadius:'12px',padding:'36px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)',marginBottom:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'linear-gradient(135deg,#3498db,#2ecc71)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',color:'#fff',fontWeight:'700'}}>
              {user && user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 style={{fontSize:'24px',fontWeight:'700',color:'#2c3e50',margin:'0 0 4px'}}>{user && user.username}</h1>
              <p style={{color:'#777',margin:'0 0 4px',fontSize:'14px'}}>{user && user.email}</p>
              <p style={{color:'#aaa',margin:0,fontSize:'13px'}}>Member since {user && formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={() => { setEditing(!editing); setMsg(''); }}
              style={{background:'#3498db',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button onClick={handleLogout}
              style={{background:'#e74c3c',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>
              Logout
            </button>
          </div>
        </div>

        {user && user.bio && !editing && (
          <p style={{marginTop:'20px',color:'#555',lineHeight:'1.6',borderTop:'1px solid #eee',paddingTop:'16px'}}>{user.bio}</p>
        )}

        {msg && (
          <div style={{marginTop:'16px',padding:'12px',background:msg.includes('success')?'#d4edda':'#f8d7da',color:msg.includes('success')?'#155724':'#721c24',borderRadius:'8px',fontSize:'14px'}}>
            {msg}
          </div>
        )}

        {editing && (
          <form onSubmit={handleUpdate} style={{marginTop:'20px',borderTop:'1px solid #eee',paddingTop:'20px'}}>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',marginBottom:'6px',fontWeight:'500',color:'#555',fontSize:'14px'}}>Username</label>
              <input
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                style={{width:'100%',padding:'10px 14px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'15px',boxSizing:'border-box'}}
              />
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',marginBottom:'6px',fontWeight:'500',color:'#555',fontSize:'14px'}}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({...form, bio: e.target.value})}
                rows={3}
                placeholder="Tell us about yourself..."
                style={{width:'100%',padding:'10px 14px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'15px',resize:'vertical',boxSizing:'border-box',fontFamily:'inherit'}}
              />
            </div>
            <button type="submit" disabled={saving}
              style={{background:saving?'#aaa':'#2ecc71',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',cursor:saving?'not-allowed':'pointer',fontSize:'14px',fontWeight:'500'}}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      <div style={{background:'#fff',borderRadius:'12px',padding:'28px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <h2 style={{fontSize:'20px',fontWeight:'600',color:'#2c3e50',margin:0}}>My Posts ({posts.length})</h2>
          <button onClick={() => navigate('/create')}
            style={{background:'#3498db',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>
            + New Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div style={{textAlign:'center',padding:'40px',color:'#aaa'}}>
            <p style={{fontSize:'16px',marginBottom:'16px'}}>You haven't written any posts yet.</p>
            <button onClick={() => navigate('/create')}
              style={{background:'#3498db',color:'#fff',border:'none',borderRadius:'8px',padding:'12px 24px',cursor:'pointer',fontSize:'15px',fontWeight:'500'}}>
              Write Your First Post
            </button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {posts.map(post => (
              <div key={post._id}
                style={{border:'1px solid #eee',borderRadius:'8px',padding:'16px',cursor:'pointer',transition:'box-shadow 0.2s'}}
                onClick={() => navigate(`/post/${post._id}`)}
                onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px'}}>
                  <div>
                    <h3 style={{margin:'0 0 8px',color:'#2c3e50',fontSize:'16px',fontWeight:'600'}}>{post.title}</h3>
                    <p style={{margin:'0 0 8px',color:'#777',fontSize:'14px',lineHeight:'1.5'}}>
                      {post.content ? post.content.substring(0, 100) + '...' : ''}
                    </p>
                    <div style={{display:'flex',gap:'16px',color:'#aaa',fontSize:'13px'}}>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post.likes ? post.likes.length : 0} likes</span>
                      <span>{post.comments ? post.comments.length : 0} comments</span>
                      <span>{post.views || 0} views</span>
                    </div>
                  </div>
                  {post.category && (
                    <span style={{background:'#ebf5fb',color:'#3498db',padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'500',whiteSpace:'nowrap'}}>
                      {post.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
