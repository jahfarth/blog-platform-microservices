import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BLOG_API = 'http://localhost:3002';

const CATEGORIES = ['Technology', 'Programming', 'Travel', 'Health', 'Lifestyle', 'Food', 'Business', 'Science', 'Other'];

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: 'Technology', tags: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => { setImagePreview(reader.result); setForm(f => ({ ...f, image: reader.result })); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await axios.post(
        `${BLOG_API}/api/posts`,
        { ...form, tags: tagsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:'100%',padding:'11px 14px',border:'1px solid #e0e0e0',borderRadius:'8px',fontSize:'15px',outline:'none',boxSizing:'border-box',fontFamily:'inherit' };

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'32px 20px'}}>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'28px',fontWeight:'700',color:'#1a1a1a',marginBottom:'6px'}}>Write a New Post</h1>
        <p style={{color:'#888',fontSize:'15px'}}>Share your ideas with the world</p>
      </div>

      {error && (
        <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'8px',padding:'12px',marginBottom:'20px',color:'#dc2626',fontSize:'14px'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{background:'#fff',borderRadius:'16px',padding:'32px',boxShadow:'0 2px 20px rgba(0,0,0,0.06)',marginBottom:'20px'}}>
          <div style={{marginBottom:'20px'}}>
            <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'8px'}}>Title *</div>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Give your post a compelling title..." required style={{...inputStyle,fontSize:'18px',fontWeight:'500',padding:'14px'}}
              onFocus={e => e.target.style.borderColor='#1a8917'}
              onBlur={e => e.target.style.borderColor='#e0e0e0'} />
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
            <div>
              <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'8px'}}>Category</div>
              <select name="category" value={form.category} onChange={handleChange}
                style={{...inputStyle,cursor:'pointer'}}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'8px'}}>Tags (comma-separated)</div>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="react, javascript, web" style={inputStyle}
                onFocus={e => e.target.style.borderColor='#1a8917'}
                onBlur={e => e.target.style.borderColor='#e0e0e0'} />
            </div>
          </div>

          <div style={{marginBottom:'20px'}}>
            <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'8px'}}>Cover Image</div>
            <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:'13px',color:'#888',marginBottom:'6px'}}>Upload from device</div>
                <input type="file" accept="image/*" onChange={handleImageFile}
                  style={{width:'100%',fontSize:'14px',color:'#555',cursor:'pointer'}} />
              </div>
              <div style={{color:'#aaa',fontSize:'13px'}}>or</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'13px',color:'#888',marginBottom:'6px'}}>Image URL</div>
                <input name="image" value={imageFile ? '' : form.image} onChange={e => { setImageFile(null); setImagePreview(''); handleChange(e); }}
                  placeholder="https://example.com/image.jpg" disabled={!!imageFile}
                  style={{...inputStyle,opacity:imageFile?0.5:1}}
                  onFocus={e => e.target.style.borderColor='#1a8917'}
                  onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </div>
            </div>
            {imagePreview && (
              <div style={{marginTop:'12px'}}>
                <img src={imagePreview} alt="Preview" style={{width:'100%',maxHeight:'200px',objectFit:'cover',borderRadius:'8px'}} />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setForm(f => ({...f,image:''})); }}
                  style={{marginTop:'6px',background:'none',border:'1px solid #ddd',padding:'4px 10px',borderRadius:'4px',cursor:'pointer',fontSize:'12px',color:'#666'}}>
                  Remove image
                </button>
              </div>
            )}
            {!imagePreview && form.image && !imageFile && (
              <img src={form.image} alt="Preview" style={{marginTop:'12px',width:'100%',maxHeight:'200px',objectFit:'cover',borderRadius:'8px'}}
                onError={e => e.target.style.display='none'} />
            )}
          </div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'32px',boxShadow:'0 2px 20px rgba(0,0,0,0.06)',marginBottom:'20px'}}>
          <div style={{fontSize:'13px',fontWeight:'600',color:'#555',marginBottom:'8px'}}>Content *</div>
          <textarea name="content" value={form.content} onChange={handleChange}
            placeholder="Write your story here... Share your knowledge, experience, or thoughts."
            required rows={16}
            style={{...inputStyle,resize:'vertical',lineHeight:'1.8',fontSize:'16px'}}
            onFocus={e => e.target.style.borderColor='#1a8917'}
            onBlur={e => e.target.style.borderColor='#e0e0e0'}
          />
          <div style={{textAlign:'right',color:'#aaa',fontSize:'12px',marginTop:'6px'}}>
            {form.content.length} characters
          </div>
        </div>

        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
          <button type="button" onClick={() => navigate('/')}
            style={{padding:'12px 24px',borderRadius:'8px',border:'1px solid #ddd',background:'#fff',color:'#555',fontSize:'15px',fontWeight:'500',cursor:'pointer'}}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            style={{padding:'12px 28px',borderRadius:'8px',border:'none',background:loading?'#aaa':'#1a8917',color:'#fff',fontSize:'15px',fontWeight:'600',cursor:loading?'not-allowed':'pointer'}}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
