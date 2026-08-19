import React, { useState, useRef, useEffect } from 'react';
import { X, Save, User, MapPin, Briefcase, MessageSquare } from '#assets/icons';
import { techConfig, getTechConfig } from '#assets/techIcons/techConfig';
import gsap from 'gsap';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const modalRef = useRef();
  const overlayRef = useRef();

  const [formData, setFormData] = useState(() => {
    const rawSkills = userData.skills;
    let skills = Array.isArray(rawSkills)
      ? rawSkills
      : (() => { try { return JSON.parse(rawSkills); } catch { return []; } })();
    if (!Array.isArray(skills)) skills = [];
    return {
      fullName: userData.fullName || '',
      role: userData.role || '',
      bio: userData.bio || '',
      location: userData.location || '',
      skills,
    };
  });

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, scale: 0.95, y: 30, duration: 0.25 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (tech) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(tech)
        ? prev.skills.filter(t => t !== tech)
        : [...prev.skills, tech],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 text-center relative">
          <div className="absolute left-4 top-4 flex gap-2">
            <button onClick={handleClose} className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <h1 className="text-sm font-semibold">Editar Perfil</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <MacInputField
            icon={User}
            label="Nombre completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <MacInputField
            icon={Briefcase}
            label="Rol"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />

          {/* Bio */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs uppercase text-gray-500">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Biografía
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full text-gray-900 dark:text-white px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>

          <MacInputField
            icon={MapPin}
            label="Ubicación"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          {/* SKILLS */}
          <div className="space-y-3">
            <label className="text-xs uppercase text-gray-500">
              Skills
            </label>

            <div className="flex flex-wrap gap-2 h-40 overflow-hidden overflow-y-auto">
              {Object.keys(techConfig).map((tech) => {
                const { color, icon } = getTechConfig(tech);
                const active = formData.skills.includes(tech);

                return (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => toggleSkill(tech)}
                    className={`
                      flex items-center gap-1 px-3 py-1 rounded-full text-xs
                      transition
                      ${active ? color : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}
                    `}
                  >
                    {icon}
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-sm">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              <Save className="w-4 h-4 inline mr-1" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MacInputField = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs uppercase text-gray-500">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
    />
  </div>
);

export default EditProfileModal;
