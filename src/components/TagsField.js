import React, { useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // ✅ Import default styles

const TagsField = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Tags</label>
      <TagsInput value={value} onChange={onChange} />
    </div>
  );
};

export default TagsField;
