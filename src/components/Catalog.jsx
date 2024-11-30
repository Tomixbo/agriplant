// Catalog.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const Catalog = ({ catalogData, onSelect, selectedItems, selectedShelf }) => {
  const [expandedMain, setExpandedMain] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);

  const toggleMainMenu = (index) => {
    setExpandedMain(expandedMain === index ? null : index);
    setExpandedSub(null);
  };

  const toggleSubMenu = (key) => {
    setExpandedSub(expandedSub === key ? null : key);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 ">Catalogue</h3>
      <ul>
        {Object.keys(catalogData).map((category, index) => (
          <li key={index} className="mb-2">
            <button
              className="w-full flex justify-between items-center text-left font-semibold text-gray-300"
              onClick={() => toggleMainMenu(index)}
            >
              {category === "shelves"
                ? "Étagère"
                : category === "pots"
                ? "Pot"
                : "Plante"}
              <FontAwesomeIcon
                icon={expandedMain === index ? faMinus : faPlus}
                className="text-sm"
              />
            </button>
            {expandedMain === index && (
              <ul className="pl-4 mt-2 ">
                {catalogData[category].map((supplier, sIndex) => (
                  <li key={sIndex} className="mb-2 ">
                    <button
                      className="w-full flex justify-between items-center text-sm font-medium text-gray-300"
                      onClick={() => toggleSubMenu(`${index}-${sIndex}`)}
                    >
                      {supplier.name}
                      <FontAwesomeIcon
                        icon={
                          expandedSub === `${index}-${sIndex}`
                            ? faMinus
                            : faPlus
                        }
                        className="text-xs"
                      />
                    </button>
                    {expandedSub === `${index}-${sIndex}` && (
                      <ul className="pl-4 mt-2 ">
                        {supplier.items.map((item) => (
                          <li
                            key={item.id}
                            className={`p-2 mb-2 hover:bg-gray-900 border ${
                              item.name.startsWith("Étagère") &&
                              selectedShelf &&
                              selectedShelf.id === item.id
                                ? "border-green-500"
                                : selectedItems.some(
                                    (selected) => selected.id === item.id
                                  )
                                ? "border-green-500"
                                : "border-gray-300"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(item);
                            }}
                          >
                            <div className="w-24 h-24 mx-auto  flex items-center justify-center overflow-hidden">
                              <img
                                src={item.previewImage}
                                alt={item.name}
                                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                              />
                            </div>
                            <p className="text-sm text-center mt-2 select-none">
                              {item.name}
                            </p>
                          </li>
                        ))}
                        {supplier.items.length === 0 && (
                          <li className="text-gray-500 text-xs italic">
                            Aucun item disponible
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;
