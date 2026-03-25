import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const USER_API = 'http://localhost:3001';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API}/api/users/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:'100%',padding:'11px 14px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px',outline:'none',boxSizing:'border-box' };

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#fafafa'}}>
      <div style={{width:'100%',maxWidth:'440px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{width:'52px',height:'52px',background:'linear-gradient(135deg,#1a8917,#0d5e0d)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'800',fontSize:'24px',margin:'0 auto 16px'}}>
            B
          </div>
          <h1 style={{fontSize:'26px',fontWeight:'700',color:'#1a1a1a',marginBottom:'8px'}}>Join BlogHub</h1>
          <p style={{color:'#888',fontSize:'15px'}}>Create your account and start writing</p>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'32px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
          {error && (
            <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'8px',padding:'12px',marginBottom:'20px',color:'#dc2626',fontSize:'14px'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              <div>
                <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'6px'}}>Full Name</div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#1a8917'}
                  onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
              <div>
                <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'6px'}}>Username</div>
                <input name="username" value={form.username} onChange={handleChange} placeholder="johndoe" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#1a8917'}
                  onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
            </div>

            <div style={{marginBottom:'12px'}}>
              <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'6px'}}>Email</div>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor='#1a8917'}
                onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>

            <div style={{marginBottom:'24px'}}>
              <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'6px'}}>Password</div>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required style={inputStyle}
                onFocus={e => e.target.style.borderColor='#1a8917'}
                onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>

            <button type="submit" disabled={loading}
              style={{width:'100%',background:loading?'#aaa':'#1a8917',color:'#fff',border:'none',padding:'12px',borderRadius:'8px',fontSize:'16px',fontWeight:'600',cursor:loading?'not-allowed':'pointer'}}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:'20px',color:'#888',fontSize:'14px'}}>
            Already have an account?{' '}
            <Link to="/login" style={{color:'#1a8917',fontWeight:'600'}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
