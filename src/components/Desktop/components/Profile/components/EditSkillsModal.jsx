import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Trash, Save } from "#assets/icons";
import gsap from "gsap";

const emptySkill = {
  id: "",
  name: "",
  category: "frontend",
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  projectsCompleted: 0,
  hoursWorked: 0,
  lastUsed: null
};

const EditSkillsModal = ({ isOpen, onClose, skills = [], onSave }) => {
  const modalRef = useRef();
  const overlayRef = useRef();

  const [localSkills, setLocalSkills] = useState([]);

  useEffect(() => {
    setLocalSkills(skills);
  }, [skills]);

  useEffect(() => {
    if (!isOpen) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 }
    );

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3 }
    );
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose
    });
  };

  const updateSkill = (index, field, value) => {
    setLocalSkills(prev =>
      prev.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    );
  };

  const addSkill = () => {
    setLocalSkills(prev => [
      ...prev,
      {
        ...emptySkill,
        id: `skill_${Date.now()}`
      }
    ]);
  };

  const removeSkill = (index) => {
    setLocalSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localSkills);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h1 className="text-sm font-semibold">Editar Skills</h1>
          <button onClick={handleClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {localSkills.map((skill, index) => (
            <div
              key={skill.id}
              className="grid grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
            >
              <input
                className="col-span-3 input"
                placeholder="Skill"
                value={skill.name}
                onChange={e =>
                  updateSkill(index, "name", e.target.value)
                }
              />

              <select
                className="col-span-3 input"
                value={skill.category}
                onChange={e =>
                  updateSkill(index, "category", e.target.value)
                }
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                className="col-span-2 input"
                min={1}
                value={skill.level}
                onChange={e =>
                  updateSkill(index, "level", Number(e.target.value))
                }
              />

              <input
                type="number"
                className="col-span-3 input"
                placeholder="XP"
                value={skill.xp}
                onChange={e =>
                  updateSkill(index, "xp", Number(e.target.value))
                }
              />

              <button
                onClick={() => removeSkill(index)}
                className="col-span-1 text-red-500 hover:text-red-600"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={addSkill}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Agregar skill
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700">
          <button onClick={handleClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSkillsModal;
