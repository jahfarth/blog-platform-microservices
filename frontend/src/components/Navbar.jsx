import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled ? 'rgba(255,255,255,0.98)' : '#fff',
    borderBottom: '1px solid #e8e8e8',
    padding: '0 24px',
    height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
    transition: 'all 0.3s'
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px',textDecoration:'none'}}>
        <div style={{width:'36px',height:'36px',background:'linear-gradient(135deg,#1a8917,#0d5e0d)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'800',fontSize:'18px'}}>
          B
        </div>
        <span style={{fontSize:'20px',fontWeight:'700',color:'#1a8917',letterSpacing:'-0.5px'}}>BlogHub</span>
      </Link>

      {/* Desktop Nav */}
      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
        <Link to="/" style={{color:'#555',textDecoration:'none',fontSize:'14px',fontWeight:'500',padding:'6px 12px',borderRadius:'6px',background:location.pathname==='/'?'#f0f9f0':'transparent'}}>
          Home
        </Link>
        {user ? (
          <>
            <Link to="/create"
              style={{background:'#1a8917',color:'#fff',padding:'8px 18px',borderRadius:'20px',fontSize:'14px',fontWeight:'600',textDecoration:'none',display:'flex',alignItems:'center',gap:'6px'}}>
              + Write
            </Link>
            <div style={{position:'relative'}}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#1a8917,#2ecc71)',border:'none',cursor:'pointer',color:'#fff',fontWeight:'700',fontSize:'15px'}}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </button>
              {menuOpen && (
                <div style={{position:'absolute',right:0,top:'44px',background:'#fff',borderRadius:'10px',boxShadow:'0 8px 30px rgba(0,0,0,0.12)',padding:'8px',minWidth:'160px',zIndex:100}}>
                  <div style={{padding:'10px 14px',borderBottom:'1px solid #f0f0f0',marginBottom:'4px'}}>
                    <div style={{fontWeight:'600',fontSize:'14px',color:'#333'}}>{user.name}</div>
                    <div style={{fontSize:'12px',color:'#888'}}>{user.email}</div>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    style={{width:'100%',background:'none',border:'none',padding:'10px 14px',textAlign:'left',cursor:'pointer',color:'#e53935',fontSize:'14px',borderRadius:'6px',fontWeight:'500'}}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{color:'#555',textDecoration:'none',fontSize:'14px',fontWeight:'500',padding:'8px 16px',borderRadius:'20px',border:'1px solid #ddd'}}>
              Sign In
            </Link>
            <Link to="/register" style={{background:'#1a8917',color:'#fff',padding:'8px 18px',borderRadius:'20px',fontSize:'14px',fontWeight:'600',textDecoration:'none'}}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
