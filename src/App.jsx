// App.js
import React, { useState } from "react";
import Catalog from "./components/Catalog";
import Canvas from "./components/Canvas";
import InputBox from "./components/InputBox";
import SelectedItems from "./components/SelectedItems";

export default function App() {
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 110, height: 150 });
  const [scaleFactor, setScaleFactor] = useState(4);
  const [showGrid, setShowGrid] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // Objets dans le catalogue avec fournisseurs
  const catalogData = {
    shelves: [
      {
        name: "Fournisseur 01",
        items: [
          {
            id: 1,
            name: "Étagère 1",
            previewImage: "/shelf1-preview.jpg",
            rowHeight: 21.4,
            texture: "/wood-texture-1.png", // Texture pour cette étagère
            category: "shelf",
          },
          {
            id: 2,
            name: "Étagère 2",
            previewImage: "/shelf2-preview.jpg",
            rowHeight: 21.4,
            texture: "/wood-texture-2.png", // Texture pour cette étagère
            category: "shelf",
          },
        ],
      },
      { name: "Fournisseur 02", items: [] },
      { name: "Fournisseur 03", items: [] },
    ],
    pots: [
      {
        name: "Fournisseur 01",
        items: [
          {
            id: 201,
            name: "Pot 1",
            previewImage: "/pot1-preview.jpg",
            canvasImage: "/pot1-canvas.jpg",
            width: 50,
            height: 17,
            category: "pot",
          },
          {
            id: 202,
            name: "Pot 2",
            previewImage: "/pot2-preview.jpg",
            canvasImage: "/pot2-canvas.jpg",
            width: 50,
            height: 17,
            category: "pot",
          },
        ],
      },
      {
        name: "Fournisseur 02",
        items: [
          {
            id: 203,
            name: "Pot 3",
            previewImage: "/pot3-preview.jpg",
            canvasImage: "/pot3-canvas.jpg",
            width: 50,
            height: 17,
            category: "pot",
          },
          {
            id: 204,
            name: "Pot 4",
            previewImage: "/pot4-preview.jpg",
            canvasImage: "/pot4-canvas.jpg",
            width: 50,
            height: 17,
            category: "pot",
          },
        ],
      },
      { name: "Fournisseur 03", items: [] },
    ],
    plants: [
      {
        name: "Fournisseur 01",
        items: [
          {
            id: 301,
            name: "Plante 1",
            previewImage: "/plant1-preview.jpg", // Image dans le catalogue
            canvasImage: "/plant1-canvas.png", // Image utilisée sur le canvas
            width: 60,
            height: 42.8,
            category: "plant",
          },
          {
            id: 302,
            name: "Plante 2",
            previewImage: "/plant2-preview.jpg",
            canvasImage: "/plant2-canvas.png",
            width: 60,
            height: 42.8,
            category: "plant",
          },
        ],
      },
      { name: "Fournisseur 02", items: [] },
      { name: "Fournisseur 03", items: [] },
    ],
  };

  const handleItemSelect = (item) => {
    if (item.name.startsWith("Étagère")) {
      setSelectedShelf(item);
      setDimensions({ width: 110, height: 150 });
    } else {
      const isAlreadySelected = selectedItems.some(
        (selected) => selected.id === item.id
      );
      if (isAlreadySelected) {
        setSelectedItems((prev) =>
          prev.filter((selected) => selected.id !== item.id)
        );
      } else {
        setSelectedItems((prev) => [...prev, { ...item }]); // Assurez-vous que la catégorie est incluse
      }
    }
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleZoomChange = (e) => {
    setScaleFactor(Number(e.target.value));
  };

  const handleWheelZoom = (delta) => {
    setScaleFactor((prev) => Math.min(Math.max(prev + delta, 1), 10));
  };

  return (
    <div className="flex h-screen select-none">
      {/* Menu Catalogue */}
      <div className="bg-slate-800 p-4 text-white" style={{ width: "220px" }}>
        <Catalog
          catalogData={catalogData}
          onSelect={handleItemSelect}
          selectedItems={selectedItems}
          selectedShelf={selectedShelf}
        />
      </div>

      {/* Zone des objets sélectionnés */}
      <SelectedItems
        selectedItems={selectedItems}
        onDragStart={setDraggedItem}
        onDragEnd={() => setDraggedItem(null)}
      />

      {/* Canvas */}
      <div className="flex-1 relative">
        {/* Inputs pour modifier les dimensions de l'étagère */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          {selectedShelf && (
            <InputBox
              dimensions={dimensions}
              onChange={handleDimensionChange}
            />
          )}
        </div>

        {/* Canvas principal */}
        <Canvas
          shelf={selectedShelf}
          dimensions={dimensions}
          scaleFactor={scaleFactor}
          showGrid={showGrid}
          onWheelZoom={handleWheelZoom}
          draggedItem={draggedItem}
          setDraggedItem={setDraggedItem}
          catalogData={catalogData}
        />

        {/* Slider de zoom et bouton pour afficher/masquer la grille */}
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Zoom:</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={scaleFactor}
              onChange={handleZoomChange}
              className="w-32"
            />
            <span>{scaleFactor.toFixed(1)}x</span>
          </div>
          <button
            className={`px-4 py-2 text-sm font-medium border rounded ${
              showGrid ? "bg-green-500 text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setShowGrid((prev) => !prev)}
          >
            {showGrid ? "Masquer Grille" : "Afficher Grille"}
          </button>
        </div>
      </div>
    </div>
  );
}
