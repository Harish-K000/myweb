export type Point = { x: number; y: number };

// Renders a silhouette offscreen and samples it into a normalized (0-1) point
// cloud — this is how particle targets are derived from a drawn shape rather
// than hand-placed coordinates.
function samplePoints(
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
    count: number,
    w = 240,
    h = 160
): Point[] {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    draw(ctx, w, h);

    const { data } = ctx.getImageData(0, 0, w, h);
    const candidates: Point[] = [];
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const alpha = data[(y * w + x) * 4 + 3];
            if (alpha > 80) candidates.push({ x: x / w, y: y / h });
        }
    }
    if (candidates.length === 0) return [];

    const points: Point[] = [];
    for (let i = 0; i < count; i++) {
        points.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
    return points;
}

export function castlePoints(count: number): Point[] {
    return samplePoints((ctx, w, h) => {
        ctx.fillRect(w * 0.08, h * 0.62, w * 0.84, h * 0.3);
        const towerW = w * 0.15;
        [0.1, 0.42, 0.75].forEach((tx, i) => {
            const towerH = i === 1 ? h * 0.62 : h * 0.48;
            const towerY = i === 1 ? h * 0.1 : h * 0.24;
            ctx.fillRect(w * tx, towerY, towerW, towerH);
            for (let c = 0; c < 4; c++) {
                ctx.fillRect(w * tx + (c * towerW) / 4, towerY - h * 0.06, towerW / 4 - 2, h * 0.07);
            }
        });
    }, count);
}

export function anvilPoints(count: number): Point[] {
    return samplePoints((ctx, w, h) => {
        ctx.beginPath();
        ctx.moveTo(w * 0.18, h * 0.42);
        ctx.lineTo(w * 0.8, h * 0.42);
        ctx.lineTo(w * 0.9, h * 0.54);
        ctx.lineTo(w * 0.18, h * 0.54);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(w * 0.18, h * 0.42);
        ctx.lineTo(w * 0.02, h * 0.48);
        ctx.lineTo(w * 0.18, h * 0.54);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(w * 0.42, h * 0.54, w * 0.18, h * 0.16);
        ctx.fillRect(w * 0.32, h * 0.7, w * 0.38, h * 0.13);
    }, count);
}

export function roadPoints(count: number): Point[] {
    return samplePoints((ctx, w, h) => {
        ctx.lineWidth = h * 0.07;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(w * 0.05, h * 0.88);
        ctx.bezierCurveTo(w * 0.32, h * 0.62, w * 0.22, h * 0.38, w * 0.55, h * 0.32);
        ctx.bezierCurveTo(w * 0.82, h * 0.27, w * 0.86, h * 0.16, w * 0.96, h * 0.06);
        ctx.stroke();
    }, count);
}

export function bookPoints(count: number): Point[] {
    return samplePoints((ctx, w, h) => {
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.28);
        ctx.lineTo(w * 0.08, h * 0.38);
        ctx.lineTo(w * 0.08, h * 0.8);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.28);
        ctx.lineTo(w * 0.92, h * 0.38);
        ctx.lineTo(w * 0.92, h * 0.8);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.closePath();
        ctx.fill();
    }, count);
}

export function chaosPoints(count: number): Point[] {
    const points: Point[] = [];
    for (let i = 0; i < count; i++) {
        points.push({ x: Math.random(), y: Math.random() });
    }
    return points;
}

export type ShapeKey = "castle" | "anvil" | "road" | "book" | "chaos";

export const SHAPE_GENERATORS: Record<ShapeKey, (count: number) => Point[]> = {
    castle: castlePoints,
    anvil: anvilPoints,
    road: roadPoints,
    book: bookPoints,
    chaos: chaosPoints,
};
