import React, { useState } from "react";

const EditGroupForm = ({ group, onSave, onCancel }) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Define state for saving status

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      setError("Group name and description cannot be empty.");
      return;
    }
    setError("");
    setIsSaving(true); // Set saving status to true
    try {
      await onSave({ ...group, name, description });
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false); // Reset saving status
    }
  };

  return (
    <form onSubmit={handleSave} className="p-3 border rounded">
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Edit Group Details</h3>
      <div className="mb-3">
        <label className="form-label">Group Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving} // Disable input while saving
        />
      </div>
      <div className="mb-3">
        <label htmlFor="groupDescription" className="form-label">Description</label>
        <textarea
          id="groupDescription"
          className="form-control"
          value={description} // Set value to description state
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSaving} // Disable input while saving
        />
      </div>
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSaving} // Disable cancel button while saving
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSaving} // Disable save button while saving
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditGroupForm;
