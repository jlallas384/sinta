import { useState, useRef } from "react";
import useImage from "use-image";
import { Stage, Layer, Image } from "react-konva";

import baseMap from "../assets/map.svg";
import mapGround from "../assets/map-ground.svg";
import map2nd from "../assets/map-2.svg"

const MAP_WIDTH = 1080;
const MAP_HEIGHT = 648;

function getDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.clientX - p2.clientX, 2) + Math.pow(p1.clientY - p2.clientY, 2)
  );
}

function getCenter(p1, p2) {
  return {
    x: (p1.clientX + p2.clientX) / 2,
    y: (p1.clientY + p2.clientY) / 2,
  };
}

const floors = [
  ["2", 2],
  ["G", 1],
];

function Map({ width, handleClick, setMapNum, children }) {
  const maps = [
    useImage(baseMap),
    useImage(mapGround),
    useImage(map2nd),
  ];

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [height, setHeight] = useState(0);


  const pointerStates = useRef({
    lastDist: 0,
    lastPos: null,
    clickPos: null,
    isDragging: false,
  });

  const stage = useRef(null);
  const layer = useRef(null);

  const [isInteriorActive, setInteriorActive] = useState(false);
  const [interiorMapNum, setInteriorMapNum] = useState(1);

  function clampPosition({ x, y }) {
    x = Math.max(Math.min(0, x), width - MAP_WIDTH * scale);
    y = Math.max(Math.min(0, y), height - MAP_HEIGHT * scale);
    return { x, y };
  }

  function clampScale(s) {
    s = Math.max(s, width / MAP_WIDTH);
    s = Math.max(s, height / MAP_HEIGHT);
    return s;
  }

  function changeScale(scale) {
    scale = clampScale(scale);
    setScale(scale);
    if (scale * 250 >= height) {
      setInteriorActive(true);
      setMapNum(interiorMapNum);
    } else {
      setInteriorActive(false);
      setMapNum(0);
    }
  }

  function changePosition(pos) {
    setPosition(clampPosition(pos));
  }

  function normalizePos(pos) {
    const transform = layer.current.getAbsoluteTransform().copy().invert();
    return transform.point(pos);
  }

  function onTouchStart(e) {
    if (e.evt.touches.length === 2) {
      pointerStates.current.lastDist = getDistance(
        e.evt.touches[0],
        e.evt.touches[1]
      );
    } else if (e.evt.touches.length === 1) {
      pointerStates.current.lastPos = stage.current.getPointerPosition();
      pointerStates.current.clickPos = stage.current.getPointerPosition();
    }
  }

  function onTouchMove(e) {
    const pointer = stage.current.getPointerPosition();

    if (e.evt.touches.length === 2) {
      const dist = getDistance(e.evt.touches[0], e.evt.touches[1]);
      const center = getCenter(e.evt.touches[0], e.evt.touches[1]);

      if (!pointerStates.current.lastDist) {
        return (pointerStates.current.lastDist = dist);
      }

      const scaleBy = dist / pointerStates.current.lastDist;
      const oldScale = scale;

      let newScale = oldScale * scaleBy;

      const mousePointTo = {
        x: (center.x - position.x) / oldScale,
        y: (center.y - position.y) / oldScale,
      };

      const pos = {
        x: center.x - mousePointTo.x * newScale,
        y: center.y - mousePointTo.y * newScale,
      };

      pointerStates.current.lastDist = dist;
      changeScale(newScale);
      changePosition(pos);
    } else if (e.evt.touches.length === 1 && pointerStates.current.lastPos) {
      const dx = pointer.x - pointerStates.current.lastPos.x;
      const dy = pointer.y - pointerStates.current.lastPos.y;

      const pos = {
        x: position.x + dx,
        y: position.y + dy,
      };

      pointerStates.current.lastPos = pointer;
      changePosition(pos);
    }
  }

  function onTouchEnd() {
    const pos = stage.current.getPointerPosition();

    if (
      pos.x == pointerStates.current.clickPos.x &&
      pos.y == pointerStates.current.clickPos.y
    ) {
      handleClick(normalizePos(pos));
    }

    pointerStates.current.lastDist = null;
    pointerStates.current.lastPos = null;
  }

  function onMouseDown(e) {
    if (e.evt.button === 0) {
      pointerStates.current.isDragging = true;
      pointerStates.current.lastPos = stage.current.getPointerPosition();
      pointerStates.current.clickPos = stage.current.getPointerPosition();
    }
  }

  function onMouseMove() {
    if (!pointerStates.current.isDragging) return;
    const stagePos = stage.current.getPointerPosition();
    const dx = stagePos.x - pointerStates.current.lastPos.x;
    const dy = stagePos.y - pointerStates.current.lastPos.y;

    const pos = {
      x: position.x + dx,
      y: position.y + dy,
    };

    changePosition(pos);
    pointerStates.current.lastPos = stagePos;
  }

  function onMouseUp(e) {
    if (e.evt.button === 0) {
      const pos = stage.current.getPointerPosition();
      if (
        pos.x == pointerStates.current.clickPos.x &&
        pos.y == pointerStates.current.clickPos.y
      ) {
        handleClick(normalizePos(pos));
      }
      pointerStates.current.isDragging = false;
    }
  }

  function onWheel(e) {
    const scaleBy = 1.05;
    const oldScale = scale;
    const pointer = stage.current.getPointerPosition();
    const direction = e.evt.deltaY > 0 ? -1 : 1;

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const pos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    changeScale(newScale);
    changePosition(pos);
  }

  const map = (!isInteriorActive ? maps[0] : maps[interiorMapNum])[0];

  return (
    <div
      className="h-full relative"
      ref={(node) => {
        if (node && height == 0) {
          setHeight(node.offsetHeight);
          const initScale = Math.max(node.offsetHeight / MAP_HEIGHT, width / MAP_WIDTH);
          setScale(initScale);
        }
      }}
    >
      <Stage
        className="absolute"
        ref={stage}
        width={width}
        height={height}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onWheel={onWheel}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Layer
          ref={layer}
          x={position.x}
          y={position.y}
          scaleX={scale}
          scaleY={scale}
        >
          <Image image={map} x={0} y={0} />
          {children}
        </Layer>
      </Stage>

      {isInteriorActive && (
        <div className="absolute font-bold text-sm bg-white shadow shadow-gray-600 rounded-full right-3 top-5 text-gray-400">
          {floors.map(([txt, id], i) => {
            let className = "p-2 cursor-pointer";
            if (id === interiorMapNum) {
              className += " bg-gray-300 text-black";
            }
            if (i === 0) {
              className += " rounded-t-full";
            }
            if (i === floors.length - 1) {
              className += " rounded-b-full";
            }
            return (
              <div
                key={id}
                className={className}
                onClick={() => {
                  setInteriorMapNum(id);
                  setMapNum(id);
                }}
              >
                {txt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Map;
