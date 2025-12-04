import useWindowStore from "#store/window";

const WindowControls = ({target, onMaximize}) => {
    const { closeWindow } = useWindowStore();

    return (
        <div id="window-controls">
            <div className="close" onClick={() => closeWindow(target)} />
            <div className="minimize" />
            <div className="maximize" onClick={onMaximize} />
        </div>
    )
}

export default WindowControls;