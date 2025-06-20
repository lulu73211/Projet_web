import { Home, MessageSquare, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "react-router";

export default function Sidebar() {


    return (
        <TooltipProvider>
            <div className="h-screen w-16 bg-muted flex flex-col justify-between py-6">
                {/* Top icons */}
                <div className="flex flex-col items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Home className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Accueil</p>
                        </TooltipContent>
                    </Tooltip>

                    <Link to="/chat">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MessageSquare className="w-5 h-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Messages</p>
                            </TooltipContent>
                        </Tooltip>
                    </Link>
                </div>

                {/* Bottom icon */}
                <div className="flex flex-col items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
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
