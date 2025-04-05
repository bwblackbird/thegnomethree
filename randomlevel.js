import SimplexNoise from './lib/simplex-noise';

export function generateRandomLevel(map, h, w){
    const noise = new SimplexNoise(); 

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let value = noise.noise2D(x / 5, y / 5); // scale of noise
            if (value > 0.15) {
                map.setCell(x, y, 1); // Set wall
            } else {
                map.setCell(x, y, 0); // Set floor
            }
        }
    }
}
