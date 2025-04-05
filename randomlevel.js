export function generateRandomLevel(map, level){
    const noise = new SimplexNoise(); 

    for (let y = 0; y < map.h; y++) {
        for (let x = 0; x < map.w; x++) {
            let value = noise.noise2D(x / 5, y / 5); // scale of noise
            
            if (value > 0.1) {
                map.setCell(x, y, 0, 1); // Set wall
            } else if (value > 0.09) {
                map.setCell(x, y, 0, 4); // Set poison
            } else {
                map.setCell(x, y, 0, 0); // Set floor
            }        
        }
    }

    // Replace some walls with lava lakes
    let lakesCreated = 0;

    while (lakesCreated < (0.4*level)) {
        const lavaX = Math.floor(Math.random() * map.w);
        const lavaY = Math.floor(Math.random() * map.h);

        if (map.getCell(lavaX, lavaY, 0) === 1) {
            floodFillLava(map, lavaX, lavaY, 3, 20);
            lakesCreated++;
        }
    }

    // Randomly generate spikes and coins
    for (let y = 0; y < map.h; y++) {
        for (let x = 0; x < map.w; x++) {
            if (map.getCell(x, y, 0) === 0) { 
                if (Math.random() < (0.010*level)) { 
                    map.setCell(x, y, 0, 5); // spikes 
                }
            }
        }
    }

    for (let y = 0; y < map.h; y++) {
        for (let x = 0; x < map.w; x++) {
            if (map.getCell(x, y, 0) === 0) { 
                if (Math.random() < 0.03) { 
                    map.setCell(x, y, 1, 1); // coins
                }
            }
        }
    }

     // Spawn trolls
     let trollsCreated = 0;

     while (trollsCreated < (6*Math.log(level))+3) {
         const trollX = Math.floor(Math.random() * map.w);
         const trollY = Math.floor(Math.random() * map.h);
 
         if (map.getCell(trollX, trollY, 0) === 0) {
            map.setCell(trollX, trollY, 1, 2); // Set troll object
            trollsCreated++;
         }
     }

    // Convert wall tiles to lava tiles
    function floodFillLava(map, startX, startY, tileType, maxTiles) {
        const queue = [[startX, startY]];
        let count = 0;

        while (queue.length > 0 && count < maxTiles) {
            const [x, y] = queue.shift();

            if (x < 0 || x >= map.w || y < 0 || y >= map.h) continue; // Out of bounds
        
            if (map.getCell(x, y, 0) === 1) { // Check if it's a wall
                map.setCell(x, y, 0, tileType); // Set lava tile
                count++;

                queue.push([x + 1, y]);
                queue.push([x - 1, y]);
                queue.push([x, y + 1]);
                queue.push([x, y - 1]);
            }
        }
    }

}