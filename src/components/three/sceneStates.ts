export type SceneState = {
    camera: {
        position: [number, number, number];
        rotation: [number, number, number];
    };
    monolith: {
        position: [number, number, number];
        rotation: [number, number, number];
        opacity: number;
    };
    particles: {
        opacity: number;
        speed: number;
    };
    bloom: number;
};
