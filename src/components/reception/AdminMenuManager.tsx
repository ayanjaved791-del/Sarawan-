import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Image as ImageIcon, AlertCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface AdminMenuManagerProps {
  menuItems: MenuItem[];
  categories: string[];
  authToken: string;
  onRefreshMenu: () => void;
}

export const AdminMenuManager: React.FC<AdminMenuManagerProps> = ({
  menuItems,
  categories,
  authToken,
  onRefreshMenu,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for add / edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0] || 'Biryani & Pulao');
  const [formPrice, setFormPrice] = useState<number>(300);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsSpecial, setFormIsSpecial] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setIsCreatingNew(true);
    setEditingItem(null);
    setFormName('');
    setFormCategory(categories[0] || 'Biryani & Pulao');
    setFormPrice(300);
    setFormDescription('');
    setFormImage('');
    setFormAvailable(true);
    setFormIsPopular(false);
    setFormIsSpecial(false);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreatingNew(false);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormDescription(item.description);
    setFormImage(item.image || '');
    setFormAvailable(item.available);
    setFormIsPopular(Boolean(item.isPopular));
    setFormIsSpecial(Boolean(item.isSpecial));
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/admin/menu/${item.id}/toggle`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        onRefreshMenu();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to toggle availability.' });
    }
  };

  const handleDelete = async (itemId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: `"${name}" removed from menu.` });
        onRefreshMenu();
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete item.' });
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const payload = {
      name: formName.trim(),
      category: formCategory.trim(),
      price: Number(formPrice),
      description: formDescription.trim(),
      image: formImage.trim() || undefined,
      available: formAvailable,
      isPopular: formIsPopular,
      isSpecial: formIsSpecial,
    };

    try {
      if (isCreatingNew) {
        const res = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create new dish.');
        setFeedback({ type: 'success', message: 'New dish added to menu successfully!' });
      } else if (editingItem) {
        const res = await fetch(`/api/admin/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update dish.');
        setFeedback({ type: 'success', message: 'Dish updated successfully!' });
      }

      setIsCreatingNew(false);
      setEditingItem(null);
      onRefreshMenu();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter((i) => {
    const matchesCat = selectedCat === 'All' || i.category === selectedCat;
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6">
        <div>
          <h3 className="text-xl font-sans font-bold text-stone-100">Menu & Price Management</h3>
          <p className="text-xs text-stone-400 mt-1">
            Add new dishes, update prices, change descriptions, and toggle stock availability in real time.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter dish by name or category..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
        >
          <option value="All">All Categories ({menuItems.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table / Cards */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-800">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-850 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover bg-stone-800 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-100 truncate">{item.name}</h4>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-medium">
                    {item.category}
                  </span>
                  {item.isPopular && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 truncate max-w-md mt-0.5">{item.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {formatPrice(item.price)}
                  </span>
                  {item.variants && item.variants.length > 0 && (
                    <span className="text-[10px] text-stone-500">
                      ({item.variants.length} portions configured)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Availability switch */}
              <button
                onClick={() => handleToggleAvailability(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  item.available
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/60'
                    : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-750'
                }`}
                title="Toggle Available / Sold Out"
              >
                {item.available ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>In Stock</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-stone-500" />
                    <span>Sold Out</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
                title="Edit Dish"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(item.id, item.name)}
                className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition"
                title="Delete Dish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-400">
            No dishes match your filter criteria.
          </div>
        )}
      </div>

      {/* Modal for Add / Edit Item */}
      {(isCreatingNew || editingItem) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <h3 className="text-base font-sans font-bold text-stone-100">
                {isCreatingNew ? 'Add New Food Item' : `Edit: ${editingItem?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingItem(null);
                }}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Chicken Malai Boti"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe ingredients, cooking style, portion sizes..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-stone-200">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                    className="rounded border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Currently Available (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-200">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="rounded border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-200">
                  <input
                    type="checkbox"
                    checked={formIsSpecial}
                    onChange={(e) => setFormIsSpecial(e.target.checked)}
                    className="rounded border-stone-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Mark as Chef Special</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition"
                >
                  {isSubmitting ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
