import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import type {RootState, AppDispatch} from "./store"
import {IRoomInfo, IRoomData, ICameraData} from "../types/IRoomData.type";

// Define a type for the room slice state
interface RoomState {
    rooms: IRoomInfo[]
}

// Define the initial state using that type
const initialState: RoomState = {
    rooms: []
} as RoomState

export const roomSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addRoom: (state, action: PayloadAction<IRoomInfo>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.
            state.rooms.push(action.payload)
        },
        removeRoom: (state, action: PayloadAction<IRoomInfo>) => {
            let index = state.rooms.findIndex((room) => {
                return room._id === action.payload._id;
            });

            state.rooms.splice(index, 1);
        },
        initRooms: (state, action: PayloadAction<IRoomInfo[]>) => {
            state.rooms = action.payload
        },
        updateRoom: (state, action: PayloadAction<IRoomInfo>) => {
            let index = state.rooms.findIndex((room) => {
                return room._id === action.payload._id;
            });

            state.rooms[index] = action.payload;
        },
    }
})

export const {updateRoom, addRoom, removeRoom, initRooms} = roomSlice.actions;

export default roomSlice.reducer