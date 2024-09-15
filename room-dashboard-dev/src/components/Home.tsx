import {RoomList} from "./RoomList";
import {useAppSelector} from "../store/hooks";
import {Navigate, useNavigate} from "react-router-dom";
import Dashboard from "./Table/Table";


export function Home() {
    const {user: currentUser} = useAppSelector((state) => state.auth);

    if (!currentUser) {
        return <Navigate to="/login"/>;
    }

    return (
        <div>
            <RoomList/>
        </div>
    );
}