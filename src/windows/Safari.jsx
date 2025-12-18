import { WindowControls } from "#components";
import { blogPosts } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { ChevronLeft, ChevronRight, PanelLeft, Search, ShieldHalf, Share, Plus, Copy, MoveRight } from "lucide-react";

const Safari = ({isMaximized, setIsMaximized}) => {
        const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    return (
        <>
            <div id="window-header" className="bgt">
                <WindowControls target="safari" onMaximize={handleMaximize}/>

                <PanelLeft className="ml-10 icon" />

                <div className="flex items-center gap-1 ml-5">
                    <ChevronLeft className="icon" />
                    <ChevronRight className="icon" />
                </div>

                <div className="flex-1 flex-center gap-3">
                    <ShieldHalf className="icon" />

                    <div className="search">

                        <Search className="w-5 h-5 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Buscar o escribir URL"
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <Share className="icon" />
                    <Plus className="icon" />
                    <Copy className="icon" />
                </div>
            </div>

            <div className="blog overflow-y-auto">
                <h2>Mi blog de desarrollador</h2>
                <h2 className="sapce-y-8">
                    {blogPosts.map(({id, image, title, date, link}) =>(
                        <div key={id} className="blog-post">
                            <div className="col-span-2">
                                <img loading="lazy" draggable={false}src={image} alt={title} />
                            </div>
                            <div className="content">
                                <p>{date}</p>
                                <h3>{title}</h3>
                                <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                                    Leer más <MoveRight className="icon-hover" />
                                </a>
                            </div>
                        </div>
                    ))}
                    </h2>
            </div>
        </>
    );
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;