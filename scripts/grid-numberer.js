Hooks.once('init', () => {
  console.log("Grid Numberer | Initialized");
});

Hooks.on('getSceneControlButtons', (controls) => {
  // Find the tiles control group
  const tileControl = controls.find(c => c.name === "tiles");
  if (!tileControl) {
    console.warn("Grid Numberer | Tiles control group not found");
    return;
  }

  // Check if our tool is already added
  if (tileControl.tools.some(t => t.name === "number-grid")) return;

  // Add our tool button
  tileControl.tools.push({
    name: "number-grid",
    title: "Number Grid Cells",
    icon: "fas fa-list-ol",
    visible: game.user.isGM,
    onClick: () => numberGrid(),
    button: true
  });
});

// The function that numbers the grid cells by creating tiles with numbers
async function numberGrid() {
  const grid = canvas.scene.grid;
  const gridSize = grid.size;
  const sceneWidth = canvas.scene.width;
  const sceneHeight = canvas.scene.height;
  const fontSize = 24;
  const fontColor = "#ffffff";
  const tileAlpha = 0.8;

  const tiles = [];
  let count = 1;

  const cols = Math.floor(sceneWidth / gridSize);
  const rows = Math.floor(sceneHeight / gridSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * gridSize + gridSize / 2;
      const y = r * gridSize + gridSize / 2;

      tiles.push({
        x: x - fontSize / 2,
        y: y - fontSize / 2,
        width: 1,
        height: 1,
        text: count.toString(),
        alpha: tileAlpha,
        locked: true,
        z: 100,
        flags: {
          "text-draw": {
            text: count.toString(),
            fontSize: fontSize,
            fillColor: fontColor,
            anchor: { x: 0.5, y: 0.5 }
          }
        }
      });

      count++;
    }
  }

  await canvas.scene.createEmbeddedDocuments("Tile", tiles);
  ui.notifications.info(`Numbered ${count - 1} grid cells.`);
}
