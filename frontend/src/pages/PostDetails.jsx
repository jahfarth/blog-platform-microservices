import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BLOG_API = 'http://localhost:3002';
const USER_API = 'http://localhost:3001';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const viewCounted = useRef(false);

  const REACTIONS = ['👍', '❤️', '👏', '😂', '😮', '😢'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) setUser(JSON.parse(userData));
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${BLOG_API}/api/posts/${id}`);
      setPost(res.data);
      if (res.data.authorId) {
        try {
          const uRes = await axios.get(`${USER_API}/api/users/${res.data.authorId}`);
          setAuthorName(uRes.data.name || uRes.data.username || 'Unknown');
        } catch { setAuthorName('Unknown'); }
      }
      // Count view only once per page load
      if (!viewCounted.current) {
        viewCounted.current = true;
        await axios.post(`${BLOG_API}/api/posts/${id}/view`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${BLOG_API}/api/posts/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (emoji) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await axios.post(
        `${BLOG_API}/api/posts/${id}/react`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(prev => ({ ...prev, reactions: res.data.reactions }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to react');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post(
        `${BLOG_API}/api/posts/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  const handleReply = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post(
        `${BLOG_API}/api/posts/${id}/comments/${commentId}/reply`,
        { content: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyTo(null);
      setReplyText('');
      fetchComments();
    } catch (err) {
      alert('Failed to post reply');
    }
  };

  const getReactionCount = (emoji) => {
    if (!post?.reactions) return 0;
    return post.reactions.filter(r => r.emoji === emoji).length;
  };

  const getUserReaction = () => {
    if (!post?.reactions || !user) return null;
    const found = post.reactions.find(r => r.userId === user._id || r.userId === user.id);
    return found ? found.emoji : null;
  };

  if (loading) return <div style={{textAlign:'center',padding:'60px',color:'#666'}}>Loading...</div>;
  if (!post) return <div style={{textAlign:'center',padding:'60px',color:'#666'}}>Post not found</div>;

  const userReaction = getUserReaction();

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'30px 20px'}}>
      <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'#1a8917',cursor:'pointer',fontSize:'14px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'5px'}}>
        ← Back
      </button>

      <div style={{background:'#fff',borderRadius:'12px',padding:'40px',boxShadow:'0 2px 20px rgba(0,0,0,0.08)'}}>
        {post.category && (
          <span style={{background:'#e8f5e9',color:'#1a8917',padding:'4px 12px',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>
            {post.category}
          </span>
        )}
        <h1 style={{fontSize:'32px',fontWeight:'700',marginTop:'16px',marginBottom:'8px',lineHeight:'1.3'}}>{post.title}</h1>
        <div style={{display:'flex',gap:'20px',color:'#888',fontSize:'14px',marginBottom:'24px',flexWrap:'wrap'}}>
          <span>By <strong style={{color:'#333'}}>{authorName || 'Unknown'}</strong></span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span>
          <span>👁 {post.views || 0} views</span>
          <span>⏱ {Math.ceil((post.content?.length || 0) / 1000)} min read</span>
        </div>

        {post.image && (
          <img src={post.image} alt="Post" style={{width:'100%',borderRadius:'8px',marginBottom:'24px',maxHeight:'400px',objectFit:'cover'}} />
        )}

        <div style={{fontSize:'17px',lineHeight:'1.8',color:'#333',whiteSpace:'pre-wrap'}}>{post.content}</div>

        {post.tags && post.tags.length > 0 && (
          <div style={{marginTop:'24px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {post.tags.map(tag => (
              <span key={tag} style={{background:'#f0f0f0',color:'#555',padding:'4px 12px',borderRadius:'20px',fontSize:'13px'}}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Reactions */}
        <div style={{marginTop:'32px',borderTop:'1px solid #f0f0f0',paddingTop:'24px'}}>
          <h3 style={{marginBottom:'12px',fontSize:'16px',color:'#333'}}>Reactions</h3>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            {REACTIONS.map(emoji => {
              const count = getReactionCount(emoji);
              const isActive = userReaction === emoji;
              return (
                <button key={emoji} onClick={() => handleReact(emoji)}
                  style={{background: isActive ? '#e8f5e9' : '#f8f8f8',border: isActive ? '2px solid #1a8917' : '2px solid #eee',borderRadius:'30px',padding:'8px 16px',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.2s'}}>
                  {emoji} <span style={{fontSize:'14px',fontWeight:'600',color:isActive?'#1a8917':'#555'}}>{count > 0 ? count : ''}</span>
                </button>
              );
            })}
          </div>
          {!user && <p style={{color:'#aaa',fontSize:'13px',marginTop:'8px'}}>Login to react</p>}
        </div>

        {/* Comments */}
        <div style={{marginTop:'32px',borderTop:'1px solid #f0f0f0',paddingTop:'24px'}}>
          <h3 style={{marginBottom:'20px',fontSize:'18px',color:'#333'}}>Comments ({comments.length})</h3>

          {user ? (
            <form onSubmit={handleComment} style={{marginBottom:'24px'}}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                required
                style={{width:'100%',minHeight:'80px',padding:'12px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
              />
              <button type="submit" style={{marginTop:'8px',background:'#1a8917',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'6px',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}>
                Post Comment
              </button>
            </form>
          ) : (
            <p style={{color:'#888',marginBottom:'16px'}}><Link to="/login" style={{color:'#1a8917'}}>Login</Link> to comment</p>
          )}

          {comments.length === 0 ? (
            <p style={{color:'#aaa',textAlign:'center',padding:'20px'}}>No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} style={{marginBottom:'16px',padding:'16px',background:'#f9f9f9',borderRadius:'8px',borderLeft:'3px solid #1a8917'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <strong style={{color:'#333',fontSize:'14px'}}>{comment.authorName || 'Anonymous'}</strong>
                  <span style={{color:'#aaa',fontSize:'12px'}}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{color:'#555',fontSize:'14px',margin:'0 0 8px'}}>{comment.content}</p>
                {user && (
                  <button onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                    style={{background:'none',border:'none',color:'#1a8917',cursor:'pointer',fontSize:'13px',padding:'0'}}>
                    {replyTo === comment._id ? 'Cancel' : 'Reply'}
                  </button>
                )}
                {replyTo === comment._id && (
                  <div style={{marginTop:'8px'}}>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      style={{width:'100%',minHeight:'60px',padding:'8px',borderRadius:'6px',border:'1px solid #ddd',fontSize:'13px',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
                    />
                    <button onClick={() => handleReply(comment._id)}
                      style={{marginTop:'6px',background:'#1a8917',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>
                      Post Reply
                    </button>
                  </div>
                )}
                {comment.replies && comment.replies.map((reply, i) => (
                  <div key={i} style={{marginTop:'10px',marginLeft:'20px',padding:'10px',background:'#fff',borderRadius:'6px',borderLeft:'2px solid #ddd'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                      <strong style={{color:'#333',fontSize:'13px'}}>{reply.authorName || 'Anonymous'}</strong>
                      <span style={{color:'#aaa',fontSize:'11px'}}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{color:'#555',fontSize:'13px',margin:0}}>{reply.content}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
