import {Col, Divider, Row, Flex} from 'antd';

import {useAppDispatch, useAppSelector} from "../store/hooks";
import {useState, useEffect} from "react";
import RoomService from "../services/room.service";
import {IRoomInfo, IRoomData} from "../types/IRoomData.type";
import {Room} from "./Room"
import {initRooms} from "../store/roomSlice";
import {usePub} from "../common/EventBus";


export function RoomList() {
    const rooms: Array<IRoomInfo> = useAppSelector((state) => state.rooms.rooms)
    const dispatch = useAppDispatch();
    const publish = usePub();

    useEffect(() => {
        retrieveRooms();
    }, []);

    const retrieveRooms = () => {
        RoomService.getAllRoom()
            .then((response: any) => {

                dispatch(initRooms(response.data))
            })
            .catch((e: any) => {
                console.log(e);
                if (e.response && e.response.status == 401) {
                    publish('logout', {});
                }
            });
    }

    const listItem = rooms.map((room: IRoomInfo, index) => {
        // console.log(room);
        return (
            <div key={room._id}>
                <Room
                    _id={room._id}
                    name={room.name}
                    camera={room.camera}
                    capacity={room.capacity}
                    active={room.active}
                />
            </div>
        );
    });

    return (
        <div style={{
            padding: '25px'
        }}>
            <Divider orientation="left" style={{fontWeight: 'bold', fontSize: 'large'}}>Dashboard</Divider>

            <Flex wrap gap="large">
                {listItem}
            </Flex>
        </div>
    )
}