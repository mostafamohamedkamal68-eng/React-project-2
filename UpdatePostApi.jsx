import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PencilLine, RotateCw } from 'lucide-react';
import { useZustandApi } from './Zustand/ZustandApi';

export default function UpdatePostApi() {
  const post = useZustandApi((state) => state.post);
  const loading = useZustandApi((state) => state.postLoading);
  const updating = useZustandApi((state) => state.postUpdating);
  const error = useZustandApi((state) => state.postError);
  const message = useZustandApi((state) => state.postMessage);
  const loadPost = useZustandApi((state) => state.loadPost);
  const updatePost = useZustandApi((state) => state.updatePost);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  async function loadAndEditPost() {
    const loadedPost = await loadPost();
    if (loadedPost) {
      setTitle(loadedPost.title || '');
      setBody(loadedPost.body || '');
    }
  }

  return (
    <section className="posts-api-section" aria-labelledby="update-post-title">
      <div className="section-heading">
        <div><span className="eyebrow">API DEMO</span><h2 id="update-post-title">Update a post</h2></div>
        <div className="post-action-buttons">
          <button className="button button-outline" type="button" onClick={loadAndEditPost} disabled={loading || updating}>
            <RotateCw size={15} /> {loading ? 'Loading...' : post ? 'Reload post' : 'Load post'}
          </button>
          <button className="button button-dark" type="button" onClick={() => updatePost({ title, body })} disabled={loading || updating || !post || !title.trim() || !body.trim()}>
            <PencilLine size={15} /> {updating ? 'Updating...' : 'Save update'}
          </button>
          <Link className="button button-outline" to="/posts/delete">Open delete demo</Link>
        </div>
      </div>
      {error && <p className="users-feedback users-feedback-error" role="alert">{error}</p>}
      {message && <p className="users-feedback" role="status">{message}</p>}
      {loading ? <div className="users-message" role="status">Loading post...</div> : post ? (
        <article className="post-demo-card">
          <span className="post-demo-icon"><FileText size={19} /></span>
          <div className="post-edit-fields">
            <small>Post #{post.id}</small>
            <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label>Body<textarea rows="4" value={body} onChange={(event) => setBody(event.target.value)} /></label>
          </div>
        </article>
      ) : <div className="users-message">Choose “Load post” to load and edit a post.</div>}
    </section>
  );
}
