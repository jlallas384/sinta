import useImage from "use-image";
import { Image } from "react-konva";

import startPinImage from "../assets/start.svg";
import endPinImage from "../assets/end.svg";

export function StartPin({ x, y, ...props }) {
  const SIZE = 7.5;
  const [startPin] = useImage(startPinImage);

  return (
    <Image
      image={startPin}
      x={x - SIZE / 2}
      y={y - SIZE / 2}
      width={SIZE}
      height={SIZE}
      {...props}
    />
  );
}

export function EndPin({ x, y, ...props }) {
  const SIZE_X = 6.4;
  const SIZE_Y = 8.8;
  const [endPin] = useImage(endPinImage);

  return (
    <Image
      image={endPin}
      x={x - SIZE_X / 2}
      y={y - SIZE_Y}
      width={SIZE_X}
      height={SIZE_Y}
      {...props}
    />
  );
}
