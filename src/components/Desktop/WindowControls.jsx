import useWindowStore from "#store/window";

const WindowControls = ({target, onMaximize}) => {
    const { closeWindow, minimizeWindow  } = useWindowStore();

    return (
        <div id="window-controls">
            <div className="close" onClick={() => closeWindow(target)} />
            <div className="minimize" onClick={(e) => {e.stopPropagation(); minimizeWindow(target);}}/>
            <div className="maximize" onClick={onMaximize} />
        </div>
    )
}

export default WindowControls;