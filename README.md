# Vertical Shelf Design Application

## Project Overview

This project is a **React application** that allows users to design and visualize a shelf arrangement by selecting items from a catalog and placing them onto a canvas. The items include shelves, pots, and plants provided by different suppliers. The key features of the application are:

- **Interactive Catalog**: Users can browse through a catalog categorized by item types (shelves, pots, plants) and suppliers.
- **Selectable Items**: Items can be selected and added to a list of selected items for easy access.
- **Drag and Drop Functionality**: Users can drag items from the selected items list and drop them onto the canvas.
  - **Shelves**: Once selected, the shelf serves as the background of the canvas.
  - **Pots**: Can be placed on the shelf grid, respecting placement boundaries and avoiding overlaps.
  - **Plants**: Can be placed freely on the canvas, including over pots or other items.
- **Grid System**: An optional grid overlay helps with the precise placement of items.
- **Zoom Control**: Users can zoom in and out of the canvas for better visibility and control.
- **Dynamic Item Rendering**: Items use different images for catalog previews and canvas placement, enhancing performance and visual fidelity.

## Features

- **Catalog with Suppliers**: Items are organized by suppliers, allowing users to filter and select items from specific vendors.
- **Responsive Canvas**: The canvas adapts to the selected shelf dimensions and supports zooming and panning.
- **Placement Rules**:
  - **Pots**: Must be placed within the shelf boundaries and cannot overlap other pots.
  - **Plants**: Can be placed anywhere on the canvas and can overlap with other items.
- **Interactive Drag and Drop**:
  - Items provide visual feedback during drag operations.
  - Pots highlight grid cells when being dragged over the canvas.
  - Plants can be moved freely after being placed.

## How to Use

1. **Select a Shelf**:
   - Open the catalog and choose a shelf from the list.
   - The selected shelf sets the canvas background and dimensions.

2. **Select Pots and Plants**:
   - Browse the catalog and select pots and plants to add them to the selected items list.

3. **Place Items on the Canvas**:
   - Drag pots from the selected items list to the canvas.
     - Pots snap to the grid and cannot overlap with other pots.
   - Drag plants onto the canvas.
     - Plants can be placed anywhere and overlap with other items.

4. **Adjust the View**:
   - Use the zoom slider or mouse wheel to zoom in and out.
   - Toggle the grid overlay for precise placement.

5. **Interact with Placed Items**:
   - Drag placed items to reposition them.
   - Items can be removed by dragging them off the canvas.

## Technologies Used

- **React**: For building the user interface components.
- **JavaScript (ES6+)**: Core language for application logic.
- **HTML & CSS**: Structure and styling of components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **FontAwesome**: Icons used within the application.

## Project Structure

- `App.jsx`: Main application component managing state and rendering the layout.
- `Catalog.jsx`: Component displaying the catalog of items categorized by suppliers.
- `SelectedItems.jsx`: Component showing the list of items selected from the catalog.
- `Canvas.jsx`: Interactive canvas where items are placed and arranged.
- `InputBox.jsx`: Component for adjusting shelf dimensions (if applicable).

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**:
   ```bash
    npm install
   ```
4. **Start the Development Server**:
   ```bash
     npm run dev
   ```
## Future Improvements

- **Supplier Management**: Add functionality to manage suppliers and their catalogs dynamically.
- **Item Customization**: Allow users to customize item properties (e.g., colors, sizes).
- **Save and Load Designs**: Enable users to save their arrangements and load them later.
- **Export Feature**: Provide options to export the canvas as an image or shareable link.
- **Responsive Design**: Enhance the UI to be fully responsive across different devices.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **React**: [https://reactjs.org/](https://reactjs.org/)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)
- **FontAwesome**: [https://fontawesome.com/](https://fontawesome.com/)
