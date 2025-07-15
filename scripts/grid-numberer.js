Hooks.once("init", () => {
  console.log("Grid Numberer | Initialized");
});

Hooks.on('renderSceneControls', (controls) => {
  const tileControl = controls.find(c => c.name === "tiles");
  if (!tileControl.tools.some(t => t.name === "number-grid")) {
    tileControl.tools.push({
      name: "number-grid",
      title: "Number Grid Cells",
      icon: "fas fa-list-ol",
      visible: game.user.isGM,
      onClick: () => numberGrid(),
      button: true
    });
    canvas.hud.render();
  }
});

async function numberGrid() {
  const grid = canvas.scene.grid;
  const isHex = grid.type === CONST.GRID_TYPES.HEXODDR || grid.type === CONST.GRID_TYPES.HEXEVEN;
  const gridSize = grid.size;
  const sceneWidth = canvas.scene.width;
  const sceneHeight = canvas.scene.height;
  const fontSize = 24;
  const fontColor = "#ffffff";
  const tileAlpha = 0.8;
  const startNumber = 1;

  const tiles = [];
  let count = startNumber;

  const cols = Math.floor(sceneWidth / gridSize);
  const rows = Math.floor(sceneHeight / gridSize);

  function getHexCenter(q, r) {
    const w = grid.w;
    const h = grid.h;
    const isPointy = grid.grid.options.orientation === "columns";

    if (isPointy) {
      const x = w * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
      const y = h * (3 / 2 * r);
      return [x + gridSize / 2, y + gridSize / 2];
    } else {
      const x = w * (3 / 2 * q);
      const y = h * (Math.sqrt(3) * r + Math.sqrt(3) / 2 * q);
      return [x + gridSize / 2, y + gridSize / 2];
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      let x, y;
      if (isHex) {
        [x, y] = getHexCenter(q, r);
      } else {
        x = q * gridSize + gridSize / 2;
        y = r * gridSize + gridSize / 2;
      }

      if (x > sceneWidth || y > sceneHeight) continue;

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
  ui.notifications.info(`Grid numbered with ${count - 1} tiles.`);
}
