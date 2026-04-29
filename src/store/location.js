import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { locations } from "#constants";


const DEFAULT_LOCATION = locations.work;

const useLocationStore = create
    (immer((set, get) => ({
        activeLocation: DEFAULT_LOCATION,
        history: [DEFAULT_LOCATION],
        historyIndex: 0,

        setActiveLocation: (location) =>
            set((state) => {
                if(!location) return;
                
                // Cuando navegamos a nueva ubicación, cortamos el historial desde la posicion actual
                const newHistory = state.history.slice(0, state.historyIndex + 1);
                newHistory.push(location);
                
                state.history = newHistory;
                state.historyIndex = newHistory.length - 1;
                state.activeLocation = location;
            }),

        goBack: () => 
            set((state) => {
                if (state.historyIndex <= 0) return;
                
                const newIndex = state.historyIndex - 1;
                state.historyIndex = newIndex;
                state.activeLocation = state.history[newIndex];
            }),

        goForward: () => 
            set((state) => {
                if (state.historyIndex >= state.history.length - 1) return;
                
                const newIndex = state.historyIndex + 1;
                state.historyIndex = newIndex;
                state.activeLocation = state.history[newIndex];
            }),

        canGoBack: () => get().historyIndex > 0,
        canGoForward: () => get().historyIndex < get().history.length - 1,

        resetActiveLocations: () =>
            set((state) => {
                state.activeLocation = DEFAULT_LOCATION;
                state.history = [DEFAULT_LOCATION];
                state.historyIndex = 0;
            }),
    }))

    );


export default useLocationStore;
