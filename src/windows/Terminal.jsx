import WindowControls from "#components/WindowControls";
import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { Check, Flag } from "lucide-react";

const Terminal = ({ isMaximized, setIsMaximized }) => {
       const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    return(
        <>
            <div id="window-header">
                <WindowControls target="terminal" onMaximize={handleMaximize}/>
                <h2>Tech Stack</h2>
            </div>

            <div className="techstack">
                <p>
                    <span className="font-bold">@chillyCode %</span>
                    Mostrar pila tecnológica
                </p>

                <div className="label">
                    <p className="w-32">Categoría</p>
                    <p>Tecnologías</p>
                </div>

                <ul className="content">
                    {techStack.map(({ category, items }) => (
                        <li key={category} className="flex items-center">
                            <Check className="check" size={20} />
                            <h3>{category}</h3>
                            <ul>
                                {items.map((item, i) =>(
                                    <li key={i}>
                                        {item}
                                        {i < items.length - 1 ? "," : ""}
                                     </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <div className="footnote">
                    <p>
                        <Check size={20} /> 5 de 5 pilas cargadas correctamente
                        (100%)
                    </p>

                    <p className="text-black">
                        <Flag size={15} fill="black" />
                        Render time: 6ms
                    </p>
                </div>

            </div>
        </>
    );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;