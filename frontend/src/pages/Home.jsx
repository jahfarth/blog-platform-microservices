import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BLOG_API = 'http://localhost:3002';

const DEMO_POSTS = [
  { title: 'Getting Started with Microservices Architecture', category: 'Technology', content: 'Microservices architecture is an approach to building applications as a collection of small, independently deployable services. Each service runs in its own process and communicates via APIs. This approach enables teams to develop, deploy, and scale services independently, leading to greater agility and resilience in modern software systems.', tags: ['microservices', 'architecture', 'backend'], image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', authorId: 'demo' },
  { title: 'The Art of Mindful Living in a Digital Age', category: 'Lifestyle', content: 'In our hyper-connected world, finding balance between technology and mindfulness has never been more important. Mindful living means being fully present in each moment, whether you are eating, working, or spending time with loved ones. Simple practices like morning meditation, digital detox hours, and conscious breathing can transform your daily experience.', tags: ['mindfulness', 'wellness', 'lifestyle'], image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', authorId: 'demo' },
  { title: 'Top 10 JavaScript Tips Every Developer Should Know', category: 'Programming', content: 'JavaScript continues to evolve rapidly. Here are essential tips: Use optional chaining (?.) to safely access nested properties. Leverage destructuring for cleaner code. Master async/await for handling promises. Use array methods like map, filter, and reduce effectively. Understand closures and how they work in JavaScript engines for better performance.', tags: ['javascript', 'webdev', 'programming'], image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80', authorId: 'demo' },
  { title: 'Exploring the Mountains of Nepal: A Trek to Remember', category: 'Travel', content: 'Nepal is home to eight of the world\'s fourteen highest peaks. The Annapurna Circuit trek offers breathtaking views of snow-capped mountains, diverse landscapes from subtropical forests to alpine meadows, and encounters with local Gurung and Thakali cultures. The trail covers approximately 230 km and takes 14-21 days to complete.', tags: ['travel', 'nepal', 'trekking', 'adventure'], image: 'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=800&q=80', authorId: 'demo' },
  { title: 'Plant-Based Diet: Benefits and How to Get Started', category: 'Health', content: 'A plant-based diet focuses on foods derived from plants including vegetables, grains, nuts, seeds, legumes, and fruits. Research shows numerous health benefits including reduced risk of heart disease, type 2 diabetes, and certain cancers. Starting is simple: swap meat for legumes twice a week, add more colorful vegetables to every meal, and explore plant-based protein sources.', tags: ['health', 'nutrition', 'vegan', 'wellness'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', authorId: 'demo' },
  { title: 'Machine Learning Fundamentals: Where to Begin', category: 'Technology', content: 'Machine learning is a subset of AI that enables systems to learn from data. Start with Python and libraries like NumPy, Pandas, and Scikit-learn. Understand supervised vs unsupervised learning. Work through classic datasets like Iris, MNIST, and Boston Housing. Progress to neural networks with TensorFlow or PyTorch. Build projects that solve real problems you care about.', tags: ['machinelearning', 'ai', 'python', 'datascience'], image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80', authorId: 'demo' },
];

const CATEGORIES = ['All', 'Technology', 'Programming', 'Travel', 'Health', 'Lifestyle', 'Food', 'Business', 'Science'];

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [user, setUser] = useState(null);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BLOG_API}/api/posts`);
      const data = res.data;
      // Auto-seed demo posts if none exist
      if (data.length === 0 && !seeded) {
        setSeeded(true);
        await seedDemoPosts();
      } else {
        setPosts(data);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      for (const post of DEMO_POSTS) {
        try {
          await axios.post(`${BLOG_API}/api/posts`, post, { headers });
        } catch {}
      }
      const res = await axios.get(`${BLOG_API}/api/posts`);
      setPosts(res.data);
    } catch {}
  };

  const handleWriteClick = () => {
    if (user) {
      navigate('/create');
    } else {
      navigate('/register');
    }
  };

  const filtered = posts.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const featured = filtered.slice(0, 1);
  const rest = filtered.slice(1);

  return (
    <div style={{minHeight:'100vh',background:'#fafafa'}}>
      {/* Hero Section */}
      <div style={{background:'linear-gradient(135deg, #1a8917 0%, #0d5e0d 100%)',color:'#fff',padding:'80px 20px',textAlign:'center'}}>
        <h1 style={{fontSize:'clamp(32px,5vw,56px)',fontWeight:'800',marginBottom:'16px',lineHeight:'1.2'}}>
          Ideas Worth Reading
        </h1>
        <p style={{fontSize:'18px',opacity:'0.9',marginBottom:'32px',maxWidth:'500px',margin:'0 auto 32px'}}>
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <button onClick={handleWriteClick}
          style={{background:'#fff',color:'#1a8917',border:'none',padding:'14px 32px',borderRadius:'30px',fontSize:'16px',fontWeight:'700',cursor:'pointer',transition:'transform 0.2s',boxShadow:'0 4px 15px rgba(0,0,0,0.2)'}}>
          {user ? 'Start Writing' : 'Start Writing Today'}
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'32px 20px 0'}}>
        <div style={{display:'flex',gap:'12px',marginBottom:'24px',flexWrap:'wrap'}}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            style={{flex:1,minWidth:'200px',padding:'12px 16px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',outline:'none'}}
          />
        </div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'32px'}}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{padding:'8px 18px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500',background: category===cat ? '#1a8917' : '#f0f0f0',color: category===cat ? '#fff' : '#555',transition:'all 0.2s'}}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'60px',color:'#888'}}>Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px',color:'#888'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
            <h3>No posts found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured.length > 0 && (
              <div onClick={() => navigate(`/post/${featured[0]._id}`)}
                style={{cursor:'pointer',background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',marginBottom:'40px',display:'flex',flexDirection:'column'}}>
                {featured[0].image && (
                  <img src={featured[0].image} alt="" style={{width:'100%',height:'300px',objectFit:'cover'}} />
                )}
                <div style={{padding:'32px'}}>
                  <div style={{display:'flex',gap:'12px',marginBottom:'12px',flexWrap:'wrap'}}>
                    {featured[0].category && <span style={{background:'#e8f5e9',color:'#1a8917',padding:'4px 12px',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>{featured[0].category}</span>}
                    <span style={{background:'#fff3e0',color:'#e65100',padding:'4px 12px',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>🔥 Featured</span>
                  </div>
                  <h2 style={{fontSize:'28px',fontWeight:'700',marginBottom:'12px',lineHeight:'1.3'}}>{featured[0].title}</h2>
                  <p style={{color:'#666',fontSize:'16px',lineHeight:'1.6',marginBottom:'16px'}}>{featured[0].content?.substring(0,200)}...</p>
                  <div style={{display:'flex',gap:'16px',color:'#999',fontSize:'13px'}}>
                    <span>👁 {featured[0].views || 0} views</span>
                    <span>⏱ {Math.ceil((featured[0].content?.length||0)/1000)} min read</span>
                  </div>
                </div>
              </div>
            )}

            {/* Post Grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'24px',marginBottom:'40px'}}>
              {rest.map(post => (
                <div key={post._id} onClick={() => navigate(`/post/${post._id}`)}
                  style={{cursor:'pointer',background:'#fff',borderRadius:'12px',overflow:'hidden',boxShadow:'0 2px 15px rgba(0,0,0,0.06)',transition:'transform 0.2s,box-shadow 0.2s'}}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 15px rgba(0,0,0,0.06)'; }}>
                  {post.image && <img src={post.image} alt="" style={{width:'100%',height:'180px',objectFit:'cover'}} />}
                  <div style={{padding:'20px'}}>
                    {post.category && <span style={{background:'#e8f5e9',color:'#1a8917',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>{post.category}</span>}
                    <h3 style={{fontSize:'17px',fontWeight:'700',margin:'10px 0 8px',lineHeight:'1.4',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{post.title}</h3>
                    <p style={{color:'#777',fontSize:'14px',lineHeight:'1.5',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',margin:'0 0 12px'}}>{post.content?.substring(0,120)}...</p>
                    <div style={{display:'flex',gap:'12px',color:'#aaa',fontSize:'12px'}}>
                      <span>👁 {post.views || 0}</span>
                      <span>⏱ {Math.ceil((post.content?.length||0)/1000)} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
