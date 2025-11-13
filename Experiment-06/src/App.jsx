import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [color, setColor] = useState("#ff0000");
  const [shapeType, setShapeType] = useState("circle");
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const svgRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setCurrentShape({ type: shapeType, x1: startX, y1: startY, x2: startX, y2: startY, fill: color });
  };

  const handleMouseMove = (e) => {
    if (!currentShape) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentShape({ ...currentShape, x2: x, y2: y });
  };

  const handleMouseUp = () => {
    if (currentShape) {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
  };

  const handleUndo = () => {
    setShapes(shapes.slice(0, -1));
  };

  const handleClear = () => {
    setShapes([]);
    setCurrentShape(null);
  };

  const renderShape = (s, index) => {
    if (s.type === "circle") {
      const r = Math.sqrt(Math.pow(s.x2 - s.x1, 2) + Math.pow(s.y2 - s.y1, 2));
      return <circle key={index} cx={s.x1} cy={s.y1} r={r} fill={s.fill} />;
    } else if (s.type === "rect") {
      const x = Math.min(s.x1, s.x2);
      const y = Math.min(s.y1, s.y2);
      const width = Math.abs(s.x2 - s.x1);
      const height = Math.abs(s.y2 - s.y1);
      return <rect key={index} x={x} y={y} width={width} height={height} fill={s.fill} />;
    } else if (s.type === "line") {
      return <line key={index} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.fill} strokeWidth={2} />;
    }
    return null;
  };

  return (
    <div className="App">
      <h1>SVG Drawing Tool</h1>
      <div className="controls">
        <label>Color: <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
        <label>Shape: 
          <select value={shapeType} onChange={(e) => setShapeType(e.target.value)}>
            <option value="circle">Circle</option>
            <option value="rect">Rectangle</option>
            <option value="line">Line</option>
          </select>
        </label>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      <svg
        ref={svgRef}
        width={800}
        height={600}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {shapes.map((s, i) => renderShape(s, i))}
        {currentShape && renderShape(currentShape, "current")}
      </svg>
    </div>
  );
}

export default App;
