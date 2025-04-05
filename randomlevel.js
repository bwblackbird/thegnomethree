import SimplexNoise from 'simplex-noise';

export function generateRandomLevel(map, h, w){
    const noise = new SimplexNoise(); 

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let value = noise.noise2D(x / 5, y / 5); // scale of noise
            if (value > 0.15) {
                setCell(x, y, 1); // Set wall
            } else {
                setCell(x, y, 0); // Set floor
            }
        }
    }
}
