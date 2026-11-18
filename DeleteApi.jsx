import { Link } from 'react-router-dom';
import { FileText, RotateCw, Trash2 } from 'lucide-react';
import { useZustandApi } from './Zustand/ZustandApi';

export default function DeleteApi() {
  const post = useZustandApi((state) => state.post);
  const loading = useZustandApi((state) => state.postLoading);
  const deleting = useZustandApi((state) => state.postDeleting);
  const error = useZustandApi((state) => state.postError);
  const message = useZustandApi((state) => state.postMessage);
  const loadPost = useZustandApi((state) => state.loadPost);
  const deletePost = useZustandApi((state) => state.deletePost);

  return (
    <section className="posts-api-section" aria-labelledby="delete-post-title">
      <div className="section-heading">
        <div><span className="eyebrow">API DEMO</span><h2 id="delete-post-title">Delete a post</h2></div>
        <div className="post-action-buttons">
          <button className="button button-outline" type="button" onClick={loadPost} disabled={loading || deleting}>
            <RotateCw size={15} /> {loading ? 'Loading...' : post ? 'Reload post' : 'Load post'}
          </button>
          <Link className="button button-outline" to="/posts/update">Open update demo</Link>
        </div>
      </div>
      {error && <p className="users-feedback users-feedback-error" role="alert">{error}</p>}
      {message && <p className="users-feedback" role="status">{message}</p>}
      {loading ? <div className="users-message" role="status">Loading post...</div> : post ? (
        <article className="post-demo-card">
          <span className="post-demo-icon"><FileText size={19} /></span>
          <div><small>Post #{post.id}</small><h3>{post.title}</h3><p>{post.body}</p></div>
          <button className="button button-outline delete-post-button" type="button" onClick={deletePost} disabled={deleting}>
            <Trash2 size={15} /> {deleting ? 'Deleting...' : 'Delete post'}
          </button>
        </article>
      ) : <div className="users-message">Choose “Load post” to get the post before deleting it.</div>}
    </section>
  );
}
