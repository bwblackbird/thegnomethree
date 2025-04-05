export function generateRandomLevel(map){
    const noise = new SimplexNoise(); 

    console.log("Generating random level with dimensions: ", map.w, map.h);

    for (let y = 0; y < map.h; y++) {
        for (let x = 0; x < map.w; x++) {
            let value = noise.noise2D(x / 5, y / 5); // scale of noise
            console.log("Noise value at ", x, y, ": ", value);
            if (value > 0.1) {
                map.setCell(x, y, 0, 1); // Set wall
            } else {
                map.setCell(x, y, 0, 0); // Set floor
            }
        }

        
    }
}
