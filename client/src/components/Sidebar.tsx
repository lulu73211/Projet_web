import { MessageSquare, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link, useNavigate } from "react-router";
import { useUserStore } from "@/store/userStore";

export default function Sidebar() {
    const navigate = useNavigate();
    const clearUser = useUserStore(state => state.clearUser);

    const handleLogout = () => {
        clearUser(); // reset le store
        navigate("/"); // redirige
    };

    return (
        <TooltipProvider>
            <div className="h-screen w-16 bg-muted flex flex-col justify-between py-6">
                {/* Top icons */}
                <div className="flex flex-col items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/chat">
                                    <MessageSquare className="w-5 h-5" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Messages</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Bottom icon */}
                <div className="flex flex-col items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleLogout}>
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Déconnexion</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}
