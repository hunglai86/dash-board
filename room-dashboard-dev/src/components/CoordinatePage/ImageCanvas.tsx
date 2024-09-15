import React, { useEffect, useState } from "react";
import './ImageCanvas.css';
import { ICameraData, ImageResponse } from "../../types/IRoomData.type";
import RoomService from "../../services/room.service";

type Point = {
  x: number;
  y: number;
}

type Line = {
  start: Point;
  end: Point | null;
}

type ImageCanvasProps = {
  onLineDrawn: (start: Point, end: Point) => void;
  url: string
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({onLineDrawn, url}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [line, setLine] = useState<Line | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(prevPoints => {
      if(prevPoints.length === 1) {
        const newLine = {start: prevPoints[0], end: {x, y}};
        setLine(newLine);
        onLineDrawn(newLine.start, newLine.end);
        return [];
      } else {
        return [{x, y}];
      }
    });
  }

  return (
    <div>
      <div className="Canvas"
      style={{
        position: 'relative',
        border: '1px solid black',
        width: '800px',
        height: '600px',
        backgroundImage: ` url(${url})`,
        backgroundSize: 'cover'
      }}
      onClick={handleClick}>
        {line && (
        <svg style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2}} >
        <line
          x1 ={line.start.x}
          y1 = {line.start?.y}
          x2 = {line.end?.x}
          y2 = {line.end?.y}
          stroke="#a2fca2"
          strokeWidth="3"
        />
        </svg>
        )}
        <img src={url}
          className="OverlayImage"/>
      </div>
    </div>
  );
}

export default ImageCanvas;