import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

export default function PrivateLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}
