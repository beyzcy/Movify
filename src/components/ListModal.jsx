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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Listeye Ekle</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {userLists.length === 0 && !showCreate ? (
          <p className="text-sm text-gray-400 text-center py-6">Henüz listeniz yok.</p>
        ) : (
          <div className="space-y-1.5 mb-4 max-h-64 overflow-y-auto">
            {userLists.map(list => {
              const inList = list.movieIds.has(movieId);
              return (
                <button
                  key={list.list_id}
                  onClick={() => onAddToList(list.list_id, movieId)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <List className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{list.name}</p>
                      <p className="text-xs text-gray-400">{list.movieIds.size} film</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    inList ? 'bg-green-500' : 'border-2 border-gray-200'
                  }`}>
                    {inList && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {showCreate ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Liste adı girin..."
              autoFocus
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newListName.trim()}
              className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl disabled:opacity-40 hover:bg-gray-700 transition-colors"
            >
              {creating ? '...' : 'Oluştur'}
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewListName(''); }}
              className="px-3 py-2.5 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Liste Oluştur
          </button>
        )}
      </div>
    </div>
  );
};

export default ListModal;
