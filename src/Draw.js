import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const createElement = (id, x1, y1, x2, y2, type) => {
  const roughElement =
    type === "line"
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { id, x1, y1, x2, y2, type, roughElement };
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const isWithinElement = (x, y, element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.min(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < 1;
  }
};

const getElementAtPosition = (x, y, elements) => {
  return elements.find((element) => isWithinElement(x, y, element));
};

const Draw = () => {
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement), [
      elements,
    ]);

    /* These are rendered shapes    
    const rect = generator.rectangle(10, 10, 100, 100);
    const line = generator.line(10, 10, 110, 110);
    roughCanvas.draw(rect);
    roughCanvas.draw(line); */
  });

  const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy);
  };

  //maybe a problem here? I'm unable to move rectangles
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offSetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offSetX, offsetY });
        setAction("moving");
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState) => [...prevState, element]);
      setAction("drawing");
    }
  };
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      event.target.style.cursor = getElementAtPosition(
        clientX,
        clientY,
        elements
      )
        ? "move"
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
      //console.log(clientX, clientY);
    } else if (action === "moving") {
      const { id, x1, y1, x2, y2, type, offSetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const nexX1 = clientX - offSetX;
      const nexY1 = clientY - offsetY;
      updateElement(id, nexX1, nexY1, nexX1 + width, nexY1 + height, type);
    }
  };
  const handleMouseUp = () => {
    setAction("none");
    setSelectedElement(null);
  };

  return (
    <div>
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          id="selection"
          checked={tool === "selection"}
          onChange={() => setTool("selection")}
        />
        <label htmlFor="selection">Selection</label>
        <input
          type="radio"
          id="line"
          checked={tool === "line"}
          onChange={() => setTool("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default Draw;
