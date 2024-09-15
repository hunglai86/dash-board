import http from '../http-common'
import {IRoomData, IRoomInfo, IFrameData, ImageResponse} from "../types/IRoomData.type";
import authHeader from "./auth-header";

const getAllRoom = () => {
    return http.get<Array<IRoomInfo>>('/room/all', {headers: authHeader()})
}

const getRoomById = (id: string) => {
    return http.get<IRoomData>(`/room/${id}`, {headers: authHeader()})
}

const createRoom = (data: IRoomInfo) => {
    return http.post<IRoomInfo>('/room/create', data, {headers: authHeader()})
}

const updateRoom = (id: string, data: IRoomInfo) => {
    return http.put<IRoomInfo>(`/room/update/${id}`, data, {headers: authHeader()})
}

const deleteRoom = (id: string) => {
    return http.delete<any>(`/room/delete/${id}`, {headers: authHeader()})
}

const getAnalyzedRooms = () => {
    return http.get<IRoomData[]>('/room/analyzed', {headers: authHeader()})
}

const getLastAnalyzedRooms = async (id: string) => {
    return http.get<IFrameData[]>(`/room/analyzed/last/${id}`, {headers: authHeader()})
}

const getAnalyzedRoom = async (id: string, start_time?: number, end_time?: number) => {
    let query = "?";
    if (start_time)
        query += `&start_time=${start_time}`;
    if (end_time)
        query += `&end_time=${end_time}`;
    return http.get<IFrameData[]>(`/room/analyzed/${id}${query}`, {headers: authHeader()})
}

const getImageRoom = async (id: string, cam_id: string) => {
    const header_type = {
        "Content-Type": "image/jpeg",
    };
    const header_auth = authHeader();
    const header = Object.assign({}, header_type, header_auth);
    return await http.get<string>(`/room/image/${id}?camera_id=${cam_id}`, {
        headers: header,
        responseType: "blob"
    })
}

const getScaleImageRoom = async (id: string, cam_id: string, scale?: number, width?: number, height?: number) => {
    let query = '?';
    if (scale) query += `&scale=${scale}`;
    if (width) query += `&width=${scale}`;
    if (height) query += `&height=${scale}`;

    return http.get<ImageResponse>(`/room/image/${id}/${cam_id}`, {headers: authHeader()})
}

const RoomService = {
    getAllRoom,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getAnalyzedRooms,
    getLastAnalyzedRooms,
    getImageRoom,
    getScaleImageRoom,
    getAnalyzedRoom
}

export default RoomService;