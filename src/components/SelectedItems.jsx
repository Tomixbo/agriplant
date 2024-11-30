import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

const SelectedItems = ({ selectedItems, onDragStart, onDragEnd }) => {
  const handleDragStart = (e, item) => {
    // Attachez les données de l'objet au transfert de données
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copyMove";

    // Créez un élément temporaire avec une icône de cube
    const dragPreview = document.createElement("div");
    dragPreview.style.position = "absolute";
    dragPreview.style.top = "0";
    dragPreview.style.left = "0";
    dragPreview.style.width = "40px";
    dragPreview.style.height = "40px";
    dragPreview.style.display = "flex";
    dragPreview.style.justifyContent = "center";
    dragPreview.style.alignItems = "center";
    dragPreview.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    dragPreview.style.borderRadius = "4px";
    dragPreview.style.color = "white";
    dragPreview.style.zIndex = "1000";

    // Ajouter l'icône FontAwesome
    dragPreview.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="white"><path d="M488.2 97.1L278.6 3.7c-10.6-4.7-22.5-4.7-33 0L23.8 97.1C9.5 103.3 0 117.5 0 133.6V378.4c0 16.1 9.5 30.3 23.8 36.5l209.6 93.3c10.6 4.7 22.5 4.7 33 0l209.6-93.3c14.3-6.2 23.8-20.4 23.8-36.5V133.6c0-16.1-9.5-30.3-23.8-36.5zM239 437.8L48 354.4V177.1l191 83.4v177.3zm32 0V260.5l191-83.4v177.3L271 437.8zm-24-209L56.4 145.2 256 62.3l199.6 82.9L247 228.8z"/></svg>`;

    // Ajoutez-le au document pour qu'il soit visible par `setDragImage`
    document.body.appendChild(dragPreview);

    // Utilisez cet élément comme image fantôme
    e.dataTransfer.setDragImage(dragPreview, 20, 20);

    // Nettoyez l'élément après un délai court
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);

    onDragStart(item);
  };

  return (
    <div className="bg-gray-500 p-4 w-auto text-white">
      <h3 className="text-lg font-bold mb-8">Objets Sélectionnés</h3>
      <ul className="space-y-4">
        {selectedItems.map((item) => (
          <li
            key={item.id}
            className="mb-2 cursor-grab p-2 hover:bg-gray-600"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={onDragEnd}
          >
            <div className="w-24 h-auto mx-auto flex items-center justify-center overflow-hidden">
              <img
                src={item.previewImage}
                alt={item.name}
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
              />
            </div>
            <p className="text-sm text-center mt-2 select-none">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedItems;
