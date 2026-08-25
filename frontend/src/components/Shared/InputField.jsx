import React from "react";

// InputField.jsx
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  type = "text",
  className = "luxury-input",
}) => {
  return (
    <div className="field-group">
      {label && (
        <label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder || `Enter ${name}`}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
