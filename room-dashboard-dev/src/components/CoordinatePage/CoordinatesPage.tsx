import React, { useState, useEffect } from "react";
import ImageCanvas from "./ImageCanvas";
import { useLocation, useNavigate } from "react-router-dom";
import RoomService from "../../services/room.service";
import { Button } from "antd";

type Point = {
  x: number;
  y: number;
}

const CoordinatesPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [coordinates, setCoordinates] = useState<{start: Point, end: Point} | null>(null);
  const [canvasSize, setCanvasSize] = useState<{width: number, height: number}>({width: 800, height: 600});
  const [url, setUrl] = useState<string>('');

  const {camId, room_id} = location.state as {camId: string, room_id: string};
  
  const handleLineDrawn = (start:Point, end: Point) => {
    setCoordinates({start, end});
  }

  useEffect(() => {
    retrieveData();
  }, [])

  const retrieveData = () => {
    RoomService.getImageRoom(room_id, camId)
        .then((response: any) => {
            console.log(response);
            const imageObjectURL = URL.createObjectURL(response.data)
            setUrl(imageObjectURL)
        })
        .catch((e: any) => {
            console.log(e);
            console.log(e.response.status);
            if (e.response && e.response.status === 401) {
                console.log(e.response.data)
            }
        })
  }

  const returnHomePage = () => {
    navigate(-1);
  }

  return (
    <div>
      <ImageCanvas onLineDrawn={handleLineDrawn} url={url}/>
      {coordinates && (
        <div>
          <p style={{
            fontSize: '15px', 
            color: 'black'
          }}>split_line:[[{(coordinates.start.x/canvasSize.width).toFixed(2)}, {(coordinates.start.y/canvasSize.height).toFixed(2)}], [{(coordinates.end.x/canvasSize.width).toFixed(2)}, {(coordinates.end.y/canvasSize.height).toFixed(2)}]]</p>
        </div>
      )}
      <Button
      onClick={returnHomePage}
      type="primary">Return HomePage</Button>
    </div>
  )
}

export default CoordinatesPage;