import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BLOG_API = 'http://localhost:3002';
const USER_API = 'http://localhost:3001';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${BLOG_API}/posts/${id}`);
      setPost(res.data);
      setComments(res.data.comments || []);
      if (res.data.author) {
        fetchAuthor(res.data.author);
      }
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthor = async (authorId) => {
    try {
      const res = await axios.get(`${USER_API}/users/${authorId}`);
      setAuthor(res.data);
    } catch (err) {
      console.error('Failed to fetch author');
    }
  };

  const handleLike = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post(`${BLOG_API}/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPost();
    } catch (err) {
      console.error('Like failed');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${BLOG_API}/posts/${id}/comments`, { content: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment('');
      fetchPost();
    } catch (err) {
      console.error('Comment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${BLOG_API}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      console.error('Delete failed');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return <div style={{textAlign:'center',padding:'60px',fontSize:'18px',color:'#666'}}>Loading...</div>;
  if (error) return <div style={{textAlign:'center',padding:'60px',color:'#e74c3c'}}>{error}</div>;
  if (!post) return null;

  const isAuthor = userId && post.author === userId;
  const liked = post.likes && post.likes.includes(userId);

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'24px 20px'}}>
      <button onClick={() => navigate('/')}
        style={{marginBottom:'20px',background:'none',border:'none',color:'#3498db',cursor:'pointer',fontSize:'15px',padding:'0'}}>
        &larr; Back to Posts
      </button>

      <article style={{background:'#fff',borderRadius:'12px',padding:'36px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)',marginBottom:'24px'}}>
        {post.category && (
          <span style={{background:'#3498db',color:'#fff',padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>
            {post.category}
          </span>
        )}
        <h1 style={{fontSize:'32px',fontWeight:'700',color:'#2c3e50',margin:'16px 0',lineHeight:'1.3'}}>{post.title}</h1>

        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'24px',color:'#777',fontSize:'14px',flexWrap:'wrap'}}>
          <span>By <strong style={{color:'#2c3e50'}}>{author ? author.username : 'Unknown'}</strong></span>
          <span>{formatDate(post.createdAt)}</span>
          <span>{post.readTime || Math.ceil((post.content||'').split(' ').length / 200)} min read</span>
          <span>{post.views || 0} views</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'24px'}}>
            {post.tags.map(tag => (
              <span key={tag} style={{background:'#f0f0f0',color:'#555',padding:'4px 10px',borderRadius:'20px',fontSize:'12px'}}>#{tag}</span>
            ))}
          </div>
        )}

        <div style={{fontSize:'17px',lineHeight:'1.8',color:'#444',whiteSpace:'pre-wrap',borderTop:'1px solid #eee',paddingTop:'24px'}}>
          {post.content}
        </div>

        <div style={{display:'flex',gap:'16px',marginTop:'32px',paddingTop:'20px',borderTop:'1px solid #eee',alignItems:'center'}}>
          <button onClick={handleLike}
            style={{display:'flex',alignItems:'center',gap:'6px',background:liked?'#e74c3c':'#f5f5f5',color:liked?'#fff':'#555',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'15px',fontWeight:'500'}}>
            {liked ? '❤️' : '🤍'} {post.likes ? post.likes.length : 0} Likes
          </button>
          <span style={{color:'#777',fontSize:'14px'}}>💬 {comments.length} Comments</span>
          {isAuthor && (
            <>
              <button onClick={() => navigate(`/edit/${id}`)}
                style={{marginLeft:'auto',background:'#3498db',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'14px'}}>
                Edit
              </button>
              <button onClick={handleDelete}
                style={{background:'#e74c3c',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 20px',cursor:'pointer',fontSize:'14px'}}>
                Delete
              </button>
            </>
          )}
        </div>
      </article>

      <section style={{background:'#fff',borderRadius:'12px',padding:'28px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#2c3e50',marginBottom:'20px'}}>Comments ({comments.length})</h2>

        {token && (
          <form onSubmit={handleComment} style={{marginBottom:'28px'}}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{width:'100%',padding:'12px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'15px',resize:'vertical',boxSizing:'border-box',fontFamily:'inherit'}}
            />
            <button type="submit" disabled={submitting || !comment.trim()}
              style={{marginTop:'8px',background:submitting?'#aaa':'#3498db',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',cursor:submitting?'not-allowed':'pointer',fontSize:'14px',fontWeight:'500'}}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}

        {!token && (
          <p style={{marginBottom:'20px',color:'#777'}}>
            <button onClick={() => navigate('/login')}
              style={{color:'#3498db',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',fontSize:'15px'}}>
              Login
            </button> to leave a comment.
          </p>
        )}

        {comments.length === 0 ? (
          <p style={{color:'#aaa',textAlign:'center',padding:'20px'}}>No comments yet. Be the first!</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {comments.map((c, i) => (
              <div key={i} style={{background:'#f8f9fa',borderRadius:'8px',padding:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <strong style={{color:'#2c3e50'}}>{c.username || 'Anonymous'}</strong>
                  <span style={{color:'#aaa',fontSize:'13px'}}>{formatDate(c.createdAt)}</span>
                </div>
                <p style={{color:'#555',margin:0,lineHeight:'1.6'}}>{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
