import React, { useState, useRef, useCallback, useMemo } from "react";

const Canvas = ({
  shelf,
  dimensions,
  scaleFactor,
  showGrid,
  onWheelZoom,
  draggedItem,
  setDraggedItem,
  catalogData,
}) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const canvasRef = useRef(null);
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [lastValidPosition, setLastValidPosition] = useState(null);
  const uniqueIdCounter = useRef(0);

  // Générateur d'ID unique en utilisant useRef
  const generateUniqueId = () => `unique-${uniqueIdCounter.current++}`;

  // Définitions constantes pour éviter les répétitions
  const colWidth = 5;
  const rowHeight = shelf?.rowHeight || 21.5;

  // Fonction utilitaire pour calculer la position dans la grille
  const calculateGridPosition = (x, y, width, height) => {
    const startCol = Math.floor(x / colWidth);
    const startRow = Math.floor(y / rowHeight);
    const colsNeeded = Math.ceil(width / colWidth);
    const rowsNeeded = Math.ceil(height / rowHeight);
    return { startCol, startRow, colsNeeded, rowsNeeded };
  };

  // Gestionnaire pour le zoom à la molette
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onWheelZoom(delta);
    },
    [onWheelZoom]
  );

  const handleDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      if (draggedItem || draggingItemId !== null) {
        setIsDraggingOver(true);
      }
    },
    [draggedItem, draggingItemId]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDraggingOver(false);
    setHighlightedCells([]);
  }, []);

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (!(draggedItem || draggingItemId !== null)) return;

      const itemBeingDragged =
        draggedItem ||
        placedItems.find((item) => item.uniqueId === draggingItemId);

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;

      const relativeX = mouseX / scaleFactor;
      const relativeY = mouseY / scaleFactor;

      const objectWidth = itemBeingDragged.width || colWidth;
      const objectHeight = itemBeingDragged.height || rowHeight;

      let { startCol, startRow, colsNeeded, rowsNeeded } =
        calculateGridPosition(relativeX, relativeY, objectWidth, objectHeight);

      const maxCols = Math.floor(dimensions.width / colWidth);
      const maxRows = Math.floor(dimensions.height / rowHeight);

      const isOutOfBounds =
        startCol < 0 ||
        startRow < 0 ||
        startCol + colsNeeded > maxCols ||
        startRow + rowsNeeded > maxRows;

      if (isOutOfBounds) {
        if (lastValidPosition) {
          startCol = lastValidPosition.startCol;
          startRow = lastValidPosition.startRow;
        } else {
          return;
        }
      } else {
        setLastValidPosition({ startCol, startRow });
      }

      const newHighlightedCells = [];
      for (let row = startRow; row < startRow + rowsNeeded; row++) {
        for (let col = startCol; col < startCol + colsNeeded; col++) {
          newHighlightedCells.push({ row, col });
        }
      }

      setHighlightedCells(newHighlightedCells);

      if (draggingItemId !== null) {
        setPlacedItems((prev) =>
          prev.map((item) =>
            item.uniqueId === draggingItemId
              ? {
                  ...item,
                  startRow,
                  startCol,
                  x: startCol * colWidth,
                  y: startRow * rowHeight,
                }
              : item
          )
        );
      }
    },
    [
      draggedItem,
      draggingItemId,
      placedItems,
      scaleFactor,
      colWidth,
      rowHeight,
      dimensions.width,
      dimensions.height,
      lastValidPosition,
    ]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      setHighlightedCells([]);

      const itemBeingDragged =
        draggedItem ||
        placedItems.find((item) => item.uniqueId === draggingItemId);

      if (!itemBeingDragged) {
        console.warn("Aucune donnée à déposer");
        return;
      }

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;

      const relativeX = mouseX / scaleFactor;
      const relativeY = mouseY / scaleFactor;

      const objectWidth = itemBeingDragged.width || colWidth;
      const objectHeight = itemBeingDragged.height || rowHeight;

      const { startCol, startRow, colsNeeded, rowsNeeded } =
        calculateGridPosition(relativeX, relativeY, objectWidth, objectHeight);

      const totalCols = Math.floor(dimensions.width / colWidth);
      const totalRows = Math.floor(dimensions.height / rowHeight);

      const withinBounds =
        startCol >= 0 &&
        startRow >= 0 &&
        startCol + colsNeeded <= totalCols &&
        startRow + rowsNeeded <= totalRows;

      if (!withinBounds) {
        console.warn("Placement hors des limites !");
        setDraggingItemId(null);
        setDraggedItem(null);
        return;
      }
      const isPlant = itemBeingDragged.category === "plant";

      let isPlacementValid;
      if (isPlant) {
        isPlacementValid = true;
      } else {
        isPlacementValid = highlightedCells.every(
          (cell) =>
            !placedItems.some(
              (item) =>
                item.uniqueId !== draggingItemId &&
                cell.row >= item.startRow &&
                cell.row < item.startRow + item.rowsNeeded &&
                cell.col >= item.startCol &&
                cell.col < item.startCol + item.colsNeeded
            )
        );
      }

      if (isPlacementValid) {
        if (draggingItemId !== null) {
          setPlacedItems((prev) =>
            prev.map((item) =>
              item.uniqueId === draggingItemId
                ? {
                    ...item,
                    startRow,
                    startCol,
                    x: startCol * colWidth,
                    y: startRow * rowHeight,
                  }
                : item
            )
          );
          setDraggingItemId(null);
        } else {
          setPlacedItems((prev) => [
            ...prev,
            {
              ...itemBeingDragged,
              id: itemBeingDragged.id,
              uniqueId: generateUniqueId(),
              startRow,
              startCol,
              rowsNeeded,
              colsNeeded,
              x: startCol * colWidth,
              y: startRow * rowHeight,
            },
          ]);
        }
        setDraggedItem(null);
      } else {
        console.warn("Placement invalide !");
        setDraggingItemId(null);
        setDraggedItem(null);
      }
    },
    [
      draggedItem,
      draggingItemId,
      placedItems,
      scaleFactor,
      colWidth,
      rowHeight,
      dimensions.width,
      dimensions.height,
      highlightedCells,
      generateUniqueId,
      setDraggedItem,
    ]
  );

  const handleDrop_ = useCallback(
    (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      setHighlightedCells([]);

      const itemBeingDragged =
        draggedItem ||
        placedItems.find((item) => item.uniqueId === draggingItemId);

      if (!itemBeingDragged) {
        console.warn("Aucune donnée à déposer");
        return;
      }

      const isPlant = itemBeingDragged.category === "plant";

      if (isPlant) {
        // Gestion spécifique pour les plantes
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        const relativeX = mouseX / scaleFactor;
        const relativeY = mouseY / scaleFactor;

        // Positionner la plante au centre du curseur
        const x = relativeX - itemBeingDragged.width / 2;
        const y = relativeY - itemBeingDragged.height / 2;

        // Ajouter la plante sans vérifier les superpositions
        setPlacedItems((prev) => [
          ...prev,
          {
            ...itemBeingDragged,
            id: itemBeingDragged.id,
            uniqueId: generateUniqueId(),
            x,
            y,
            category: "plant",
          },
        ]);

        setDraggedItem(null);
        setDraggingItemId(null);
      } else {
        // Gestion pour les autres objets (pots)
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;

        const relativeX = mouseX / scaleFactor;
        const relativeY = mouseY / scaleFactor;

        const objectWidth = itemBeingDragged.width || colWidth;
        const objectHeight = itemBeingDragged.height || rowHeight;

        const { startCol, startRow, colsNeeded, rowsNeeded } =
          calculateGridPosition(
            relativeX,
            relativeY,
            objectWidth,
            objectHeight
          );

        const totalCols = Math.floor(dimensions.width / colWidth);
        const totalRows = Math.floor(dimensions.height / rowHeight);

        const withinBounds =
          startCol >= 0 &&
          startRow >= 0 &&
          startCol + colsNeeded <= totalCols &&
          startRow + rowsNeeded <= totalRows;

        if (!withinBounds) {
          console.warn("Placement hors des limites !");
          setDraggingItemId(null);
          setDraggedItem(null);
          return;
        }

        const isPlacementValid = highlightedCells.every(
          (cell) =>
            !placedItems.some(
              (item) =>
                item.uniqueId !== draggingItemId &&
                cell.row >= item.startRow &&
                cell.row < item.startRow + item.rowsNeeded &&
                cell.col >= item.startCol &&
                cell.col < item.startCol + item.colsNeeded
            )
        );

        if (isPlacementValid) {
          if (draggingItemId !== null) {
            setPlacedItems((prev) =>
              prev.map((item) =>
                item.uniqueId === draggingItemId
                  ? {
                      ...item,
                      startRow,
                      startCol,
                      x: startCol * colWidth,
                      y: startRow * rowHeight,
                    }
                  : item
              )
            );
            setDraggingItemId(null);
          } else {
            setPlacedItems((prev) => [
              ...prev,
              {
                ...itemBeingDragged,
                id: itemBeingDragged.id,
                uniqueId: generateUniqueId(),
                startRow,
                startCol,
                rowsNeeded,
                colsNeeded,
                x: startCol * colWidth,
                y: startRow * rowHeight,
                category: itemBeingDragged.category,
              },
            ]);
          }
          setDraggedItem(null);
        } else {
          console.warn("Placement invalide !");
          setDraggingItemId(null);
          setDraggedItem(null);
        }
      }
    },
    [
      draggedItem,
      draggingItemId,
      placedItems,
      scaleFactor,
      colWidth,
      rowHeight,
      dimensions.width,
      dimensions.height,
      highlightedCells,
      generateUniqueId,
      setDraggedItem,
    ]
  );

  const handleItemDragEnd = useCallback(
    (e) => {
      e.stopPropagation();

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const droppedOutsideCanvas =
        mouseX < canvasRect.left ||
        mouseX > canvasRect.right ||
        mouseY < canvasRect.top ||
        mouseY > canvasRect.bottom;

      if (droppedOutsideCanvas) {
        setPlacedItems((prev) =>
          prev.filter((item) => item.uniqueId !== draggingItemId)
        );
      }

      setDraggingItemId(null);
      setIsDraggingOver(false);
      setHighlightedCells([]);
    },
    [draggingItemId]
  );

  const handleItemDragStart = useCallback((e, item) => {
    e.stopPropagation();
    setDraggingItemId(item.uniqueId);

    const transparentPixel = document.createElement("div");
    transparentPixel.style.width = "0px";
    transparentPixel.style.height = "0px";
    e.dataTransfer.setDragImage(transparentPixel, 0, 0);
  }, []);

  // Utilisation de useMemo pour la grille
  const grid = useMemo(() => {
    if (!shelf) return [];
    const totalRows = Math.floor(dimensions.height / rowHeight);
    const totalCols = Math.floor(dimensions.width / colWidth);
    return Array.from({ length: totalRows }, (_, rowIndex) =>
      Array.from({ length: totalCols }, (_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
      }))
    );
  }, [shelf, dimensions.height, dimensions.width, rowHeight, colWidth]);

  return (
    <div
      className="h-full flex items-center justify-center select-none"
      onWheel={handleWheel}
      style={{
        cursor: isDraggingOver ? "grabbing" : "default",
        background: "linear-gradient(to top, #797979, #e5e7eb 70%)",
      }}
    >
      {shelf ? (
        <div
          ref={canvasRef}
          className="relative"
          style={{
            width: `${dimensions.width * scaleFactor}px`,
            height: `${dimensions.height * scaleFactor}px`,
            backgroundImage: shelf?.texture ? `url(${shelf.texture})` : "none",
            backgroundRepeat: "repeat",
            backgroundSize: `${150 * scaleFactor}px ${150 * scaleFactor}px`,
            overflow: "hidden",
          }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Grille */}
          {(showGrid || isDraggingOver) &&
            grid.map((row) =>
              row.map((cell) => {
                const isHighlighted = highlightedCells.some(
                  (highlighted) =>
                    highlighted.row === cell.row && highlighted.col === cell.col
                );
                return (
                  <div
                    key={`${cell.row}-${cell.col}`}
                    className={`absolute border ${
                      isHighlighted
                        ? "bg-green-200 border-green-500"
                        : "border-gray-300"
                    }`}
                    style={{
                      width: `${colWidth * scaleFactor}px`,
                      height: `${rowHeight * scaleFactor}px`,
                      top: `${cell.row * rowHeight * scaleFactor}px`,
                      left: `${cell.col * colWidth * scaleFactor}px`,
                    }}
                  ></div>
                );
              })
            )}

          {/* Objets placés */}
          {placedItems.map((item) => {
            let itemStyle = {};

            // Déterminer le zIndex en fonction de la catégorie
            let zIndex = 1; // Par défaut pour les pots
            if (item.category === "plant") {
              zIndex = 2;
            } else if (item.category === "shelf") {
              zIndex = 0;
            }

            // Pour les plantes, utiliser x et y directement
            if (item.category === "plant") {
              itemStyle = {
                width: `${item.width * scaleFactor}px`,
                height: `${item.height * scaleFactor}px`,
                top: `${item.y * scaleFactor}px`,
                left: `${item.x * scaleFactor}px`,
                zIndex,
              };
            } else {
              // Pour les autres objets (pots), utiliser les positions basées sur la grille
              itemStyle = {
                width: `${item.colsNeeded * colWidth * scaleFactor}px`,
                height: `${item.rowsNeeded * rowHeight * scaleFactor}px`,
                top: `${item.startRow * rowHeight * scaleFactor}px`,
                left: `${item.startCol * colWidth * scaleFactor}px`,
                zIndex,
              };
            }

            return (
              <div
                key={item.uniqueId}
                className={`absolute flex items-center justify-center cursor-grab`}
                style={itemStyle}
                draggable="true"
                onDragStart={(e) => handleItemDragStart(e, item)}
                onDragEnd={handleItemDragEnd}
              >
                <img
                  src={item.canvasImage}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain pointer-events-none select-none"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 select-none">
          Sélectionnez une étagère dans le catalogue
        </p>
      )}
    </div>
  );
};

export default Canvas;
