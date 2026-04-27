// components/admin/CRUDPanel.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchRTDB, addRTDB, updateRTDB, deleteRTDB } from '@/lib/rtdb';

const SCHEMAS = {
  about: [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'photoUrl', label: 'Photo URL', type: 'text' },
    { key: 'resumeUrl', label: 'Resume URL', type: 'text' },
    { key: 'interests', label: 'Interests (comma separated)', type: 'text' },
  ],
  education: [
    { key: 'degree', label: 'Degree / Course', type: 'text', required: true },
    { key: 'institution', label: 'Institution', type: 'text', required: true },
    { key: 'year', label: 'Year (e.g. 2020–2024)', type: 'text' },
    { key: 'gpa', label: 'GPA / Score', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'subjects', label: 'Subjects (comma separated)', type: 'text' },
    { key: 'order', label: 'Order (number)', type: 'number' },
  ],
  projects: [
    { key: 'title', label: 'Project Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
    { key: 'liveUrl', label: 'Live URL', type: 'text' },
    { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
    { key: 'imageUrl', label: 'Image URL', type: 'text' },
    { key: 'emoji', label: 'Emoji', type: 'text' },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
  certificates: [
    { key: 'title', label: 'Certificate Title', type: 'text', required: true },
    { key: 'issuer', label: 'Issuer / Platform', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'credentialUrl', label: 'Credential URL', type: 'text' },
    { key: 'skills', label: 'Skills (comma separated)', type: 'text' },
    { key: 'emoji', label: 'Emoji', type: 'text' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
  skills: [
    { key: 'name', label: 'Skill Name', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'level', label: 'Level (0–100)', type: 'number' },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
  achievements: [
    { key: 'title', label: 'Achievement Title', type: 'text', required: true },
    { key: 'issuer', label: 'Issuer / Event', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'link', label: 'Link / Paper URL', type: 'text' },
    { key: 'emoji', label: 'Emoji', type: 'text' },
    { key: 'order', label: 'Order', type: 'number' },
  ],
};

const ARRAY_FIELDS = /tags|subjects|interests|skills/;

function getLabel(item) {
  return item.title || item.name || item.degree || item.id || '(untitled)';
}

function getSubLabel(item) {
  return item.institution || item.issuer || item.category || item.tagline || item.subtitle || '';
}

function parseField(value, type) {
  if (type === 'number') return value === '' || value === undefined ? undefined : (parseInt(value) || 0);
  if (type === 'checkbox') return Boolean(value);
  return value ?? '';
}

function serializeItem(formData, schema) {
  const result = {};
  for (const field of schema) {
    let val = formData[field.key];
    if (field.type === 'text' && ARRAY_FIELDS.test(field.key)) {
      result[field.key] = val ? String(val).split(',').map((s) => s.trim()).filter(Boolean) : [];
    } else if (field.type === 'number') {
      const parsed = parseField(val, 'number');
      if (parsed !== undefined) result[field.key] = parsed;
    } else if (field.type === 'checkbox') {
      result[field.key] = Boolean(val);
    } else {
      result[field.key] = val ?? '';
    }
  }
  return result;
}

function validateRequired(formData, schema) {
  for (const field of schema) {
    if (field.required && !formData[field.key]) {
      return `"${field.label}" is required`;
    }
  }
  return null;
}

export default function CRUDPanel({ section }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | { id, ...item }
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const schema = SCHEMAS[section] || [];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRTDB(section);
      setItems(data);
    } catch (e) {
      toast.error('Failed to load: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setFormData({});
    setModal('add');
  };

  const openEdit = (item) => {
    const flat = { ...item };
    for (const field of schema) {
      if (Array.isArray(flat[field.key])) {
        flat[field.key] = flat[field.key].join(', ');
      }
    }
    setFormData(flat);
    setModal(item);
  };

  const handleSave = async () => {
    const err = validateRequired(formData, schema);
    if (err) { toast.error(err); return; }

    setSaving(true);
    try {
      const payload = serializeItem(formData, schema);
      if (modal === 'add') {
        await addRTDB(section, payload);
        toast.success('Entry added ✓');
      } else {
        await updateRTDB(section, modal.id, payload);
        toast.success('Saved ✓');
      }
      setModal(null);
      await load();
    } catch (e) {
      toast.error('Save failed: ' + (e.message || 'Unknown error'));
      console.error('[CRUDPanel] save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteRTDB(section, id);
      toast.success('Deleted');
      await load();
    } catch (e) {
      toast.error('Delete failed: ' + (e.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  };

  const setField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
            CMS
          </div>
          <h1 className="text-3xl font-light capitalize" style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}>
            {section}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
          >
            ↻
          </button>
          <button onClick={openAdd} className="btn-gold text-sm">
            + Add Entry
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center" style={{ fontFamily: 'var(--font-mono)' }}>
          Loading {section}...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-3xl mb-3 text-white/10">◻</div>
          <p className="text-white/30 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            No entries yet. Click <span style={{ color: 'var(--gold)' }}>+ Add Entry</span> to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white/80 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {getLabel(item)}
                </div>
                {getSubLabel(item) && (
                  <div className="text-xs text-white/30 mt-0.5 truncate">{getSubLabel(item)}</div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{ border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)', background: 'rgba(201,168,76,0.06)' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                  style={{ border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', background: 'rgba(239,68,68,0.04)' }}
                >
                  {deleting === item.id ? '...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              style={{ border: '1px solid rgba(201,168,76,0.2)' }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light capitalize" style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}>
                  {modal === 'add' ? `Add ${section}` : `Edit ${section}`}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                {schema.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                      {field.label} {field.required && <span style={{ color: 'var(--gold)' }}>*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formData[field.key] || ''}
                        onChange={(e) => setField(field.key, e.target.value)}
                        className="input-field w-full resize-none"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!formData[field.key]}
                          onChange={(e) => setField(field.key, e.target.checked)}
                          className="w-4 h-4 accent-yellow-500"
                        />
                        <span className="text-sm text-white/50">Yes</span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] ?? ''}
                        onChange={(e) => setField(field.key, e.target.value)}
                        className="input-field w-full"
                        placeholder={field.key === 'order' ? '1' : `Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-7">
                <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 disabled:opacity-60">
                  {saving ? 'Saving...' : modal === 'add' ? 'Add Entry' : 'Save Changes'}
                </button>
                <button onClick={() => setModal(null)} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
