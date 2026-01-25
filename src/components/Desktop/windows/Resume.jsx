import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/Desktop/index.js";
import { Download } from "#assets/icons";
import { pdfjs, Page, Document } from "react-pdf";
import { useEffect } from 'react';
import useWindowStore from "#store/window.js";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

const Resume = ({ isMaximized, setIsMaximized }) => {
    const { windows } = useWindowStore();

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    // ✅ Como resume no usa data dinámico, no necesita el useEffect de cierre
    // Solo asegúrate de que esté en la lista de ventanas persistentes

    return (
        <>
            <div id="window-header">
                <WindowControls target="resume" onMaximize={handleMaximize}/>
                <h2>Resume.pdf</h2>

                <a 
                    href="files/resume.pdf" 
                    download 
                    className="cursor-pointer"
                    title="Download resume"
                >
                    <Download className="icon"/>
                </a>
            </div>

            <Document file="files/resume.pdf" className="flex align-item-center justify-center">
                <Page pageNumber={1} renderTextLayer renderAnnotationLayer />
            </Document>
        </>
    );
};

const ResumeWindow = WindowWrapper(Resume, 'resume');

export default ResumeWindow;