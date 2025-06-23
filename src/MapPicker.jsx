import { useState } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

import Map from "./Map";
import pinImage from "./assets/pin.svg";

const PIN_SIZE = 15;

function Pin({ x, y }) {
  const [image] = useImage(pinImage);
  return <Image width={PIN_SIZE} height={PIN_SIZE} image={image} x={x - PIN_SIZE / 2} y={y - PIN_SIZE} />;
}

function MapPicker() {
  const [pin, setPin] = useState(null);
  function handleClick(pos) {
    setPin(pos);
  }

  return (
    <div style={{ height: "80vh" }}>
      <Map width={window.innerWidth} handleClick={handleClick} setMapNum={() => {}}>
        {pin && <Pin {...pin} />}
      </Map>
    </div>
  );
}

export default MapPicker;
