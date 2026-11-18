import { useState } from 'react';
import { AtSign, MapPin, Pencil, RotateCw, Trash2, UserPlus, UserRound, X } from 'lucide-react';
import { useZustandApi } from './Zustand/ZustandApi';

export default function AddusersApi() {
  const users = useZustandApi((state) => state.users);
  const usersLoaded = useZustandApi((state) => state.usersLoaded);
  const loading = useZustandApi((state) => state.usersLoading);
  const error = useZustandApi((state) => state.usersError);
  const adding = useZustandApi((state) => state.addUserLoading);
  const addMessage = useZustandApi((state) => state.addUserMessage);
  const addError = useZustandApi((state) => state.addUserError);
  const busyUserId = useZustandApi((state) => state.userActionBusyId);
  const actionMessage = useZustandApi((state) => state.userActionMessage);
  const actionError = useZustandApi((state) => state.userActionError);
  const loadUsers = useZustandApi((state) => state.loadUsers);
  const addUser = useZustandApi((state) => state.addUser);
  const updateUser = useZustandApi((state) => state.updateUser);
  const deleteUser = useZustandApi((state) => state.deleteUser);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', username: '', email: '', city: '' });

  function startEditing(user) {
    setEditingUserId(user.id);
    setEditForm({ name: user.name || '', username: user.username || '', email: user.email || '', city: user.address?.city || '' });
  }

  async function submitUpdate(user, event) {
    event.preventDefault();
    const saved = await updateUser(user, editForm);
    if (saved) setEditingUserId(null);
  }

  function changeField(event) {
    setEditForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  }

  return (
    <section className="users-section" aria-labelledby="users-title">
      <div className="section-heading">
        <div><span className="eyebrow">API DEMO</span><h2 id="users-title">Users</h2></div>
        <div className="users-actions">
          <p>Load the users list, then add, edit, or delete a demo user.</p>
          <button className="button button-outline" type="button" onClick={loadUsers} disabled={loading}>
            <RotateCw size={15} /> {loading ? 'Loading...' : usersLoaded ? 'Refresh users' : 'Load users'}
          </button>
          <button className="button button-dark add-user-button" type="button" onClick={addUser} disabled={adding || !usersLoaded}>
            <UserPlus size={16} /> {adding ? 'Adding...' : 'Add user'}
          </button>
        </div>
      </div>
      {error && <p className="users-feedback users-feedback-error" role="alert">{error}</p>}
      {addMessage && <p className="users-feedback" role="status">{addMessage}</p>}
      {addError && <p className="users-feedback users-feedback-error" role="alert">{addError}</p>}
      {actionMessage && <p className="users-feedback" role="status">{actionMessage}</p>}
      {actionError && <p className="users-feedback users-feedback-error" role="alert">{actionError}</p>}
      {!usersLoaded ? (
        <div className="users-message" role="status">Choose “Load users” to begin.</div>
      ) : users.length ? (
        <div className="users-grid">
          {users.map((user) => (
            <article className={'user-card' + (editingUserId === user.id ? ' user-card-editing' : '')} key={user.id}>
              <span className="user-avatar"><UserRound size={20} /></span>
              <div className="user-details">
                {editingUserId === user.id ? (
                  <form className="user-edit-form" onSubmit={(event) => submitUpdate(user, event)}>
                    <label>Name<input name="name" value={editForm.name} onChange={changeField} required /></label>
                    <label>Username<input name="username" value={editForm.username} onChange={changeField} required /></label>
                    <label>Email<input name="email" type="email" value={editForm.email} onChange={changeField} required /></label>
                    <label>City<input name="city" value={editForm.city} onChange={changeField} /></label>
                    <div className="user-edit-actions">
                      <button className="button button-dark" type="submit" disabled={busyUserId === user.id}>{busyUserId === user.id ? 'Saving...' : 'Save changes'}</button>
                      <button className="button button-outline" type="button" onClick={() => setEditingUserId(null)} disabled={busyUserId === user.id}><X size={14} /> Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{user.name}</h3>
                    <span className="user-handle">@{user.username}</span>
                    <a href={'mailto:' + user.email}><AtSign size={13} />{user.email}</a>
                    <span className="user-city"><MapPin size={13} />{user.address?.city || 'City not provided'}</span>
                    <div className="user-card-actions">
                      <button type="button" onClick={() => startEditing(user)} disabled={busyUserId === user.id}><Pencil size={13} /> Edit</button>
                      <button className="user-delete-action" type="button" onClick={() => deleteUser(user)} disabled={busyUserId === user.id}><Trash2 size={13} /> {busyUserId === user.id ? 'Deleting...' : 'Delete'}</button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="users-message">No users were returned.</div>
      )}
    </section>
  );
}
