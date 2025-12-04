import { WindowControls } from "#components";
import { socials } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";

const Contact = ({ isMaximized, setIsMaximized }) =>{
       const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };
    return(
        <>
            <div id="window-header">
                <WindowControls target="contact" onMaximize={handleMaximize}/>
                <h2>Contac Me</h2>
            </div>

            <div className="p-5 space-y-5 bgProf">
                <img 
                src="/images/Avatar.png" 
                alt="Jorge"
                className="w-20 rounded-full" 
                />

                <h3>Conectemos</h3>
                <p>¿Tienes alguna idea? ¿Algún error que corregir? ¿O simplemente quieres hablar de tecnología?
                    Estoy disponible.
                </p>
                <p>jorgecx42@gmail.com</p>

                <ul>
                    {socials.map(({id, bg, link, icon, text}) =>(
                        <li key={id} style={{backgroundColor:bg}}>
                            <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            >
                                <img 
                                src={icon}
                                alt={text}
                                className="size-5"
                                
                                />
                                <p>{text}</p>
                            </a>

                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
};


const ContatacWindow = WindowWrapper(Contact, "contact")
export default ContatacWindow;