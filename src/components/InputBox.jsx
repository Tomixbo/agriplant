import React from "react";

const InputBox = ({ dimensions, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Largeur (cm):</label>
      <input
        type="number"
        name="width"
        value={dimensions.width}
        onChange={onChange}
        className="border p-1 w-16"
      />
      <span className="text-sm">x</span>
      <input
        type="number"
        name="height"
        value={dimensions.height}
        onChange={onChange}
        className="border p-1 w-16"
      />
      <label className="text-sm font-medium">Hauteur (cm):</label>
    </div>
  );
};

export default InputBox;
