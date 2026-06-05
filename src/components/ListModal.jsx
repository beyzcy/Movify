import React, { useState } from 'react';
import { X, Plus, Check, List } from 'lucide-react';

const ListModal = ({ isOpen, onClose, movieId, userLists, onAddToList, onCreateList }) => {
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating]       = useState(false);
  const [showCreate, setShowCreate]   = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    setCreating(true);
    await onCreateList(newListName.trim(), movieId);
    setNewListName('');
    setShowCreate(false);
    setCreating(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(26,26,36,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
        style={{ backgroundColor: '#EDE8E8', border: '1px solid rgba(156,129,129,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: '#1A1A24' }}>Add to List</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'rgba(156,129,129,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(156,129,129,0.28)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(156,129,129,0.15)'}
          >
            <X className="w-4 h-4" style={{ color: '#9C8181' }} />
          </button>
        </div>

        {/* List items */}
        {userLists.length === 0 && !showCreate ? (
          <p className="text-sm text-center py-6" style={{ color: '#9C8181' }}>You have no lists yet.</p>
        ) : (
          <div className="space-y-1.5 mb-4 max-h-64 overflow-y-auto">
            {userLists.map(list => {
              const inList = list.movieIds.has(movieId);
              return (
                <button
                  key={list.list_id}
                  onClick={() => onAddToList(list.list_id, movieId)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(129,156,156,0.18)' }}
                    >
                      <List className="w-4 h-4" style={{ color: '#819C9C' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold" style={{ color: '#1A1A24' }}>{list.name}</p>
                      <p className="text-xs text-gray-400">{list.movieIds.size} films</p>
                    </div>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                    style={inList
                      ? { backgroundColor: '#819C81' }
                      : { border: '2px solid rgba(156,129,129,0.3)' }}
                  >
                    {inList && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Create form / button */}
        {showCreate ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="List name..."
              autoFocus
              className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(156,129,129,0.25)',
                color: '#1A1A24',
              }}
              onFocus={e => e.target.style.borderColor = '#9C8181'}
              onBlur={e => e.target.style.borderColor = 'rgba(156,129,129,0.25)'}
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newListName.trim()}
              className="px-4 py-2.5 text-white text-sm font-semibold rounded-xl disabled:opacity-40 transition-all"
              style={{ backgroundColor: '#9C8181' }}
            >
              {creating ? '...' : 'Create'}
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewListName(''); }}
              className="px-3 py-2.5 text-sm rounded-xl transition-colors"
              style={{ backgroundColor: 'rgba(156,129,129,0.15)', color: '#9C8181' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              border: '2px dashed rgba(156,129,129,0.35)',
              color: '#9C8181',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#9C8181'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(156,129,129,0.35)'}
          >
            <Plus className="w-4 h-4" />
            Create New List
          </button>
        )}
      </div>
    </div>
  );
};

export default ListModal;
