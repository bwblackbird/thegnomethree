export function generateRandomLevel(map, level) {
    const noise = new SimplexNoise();

    let spawnX, spawnY;

    function findLargestSafeArea(map) {
        const visited = new Set();
        let largestRegion = [];

        function floodFill(x, y, currentRegion) {
            const key = `${x},${y}`;
            if (visited.has(key)) return;
            if (x < 0 || x >= map.w || y < 0 || y >= map.h) return;
            if (map.getCell(x, y, 0) !== 0) return; // Only floor tiles

            visited.add(key);
            currentRegion.push([x, y]);

            floodFill(x + 1, y, currentRegion);
            floodFill(x - 1, y, currentRegion);
            floodFill(x, y + 1, currentRegion);
            floodFill(x, y - 1, currentRegion);
        }

        for (let y = 0; y < map.h; y++) {
            for (let x = 0; x < map.w; x++) {
                const key = `${x},${y}`;
                if (!visited.has(key) && map.getCell(x, y, 0) === 0) {
                    const region = [];
                    floodFill(x, y, region);
                    if (region.length > largestRegion.length) {
                        largestRegion = region;
                    }
                }
            }
        }

        return largestRegion;
    }

    // Generate level map
    for (let y = 0; y < map.h; y++) {
        for (let x = 0; x < map.w; x++) {
            let value = noise.noise2D(x / 5, y / 5); // scale of noise

            if (x === 0 || y === 0 || x === map.w - 1 || y === map.h - 1) {
                map.setCell(x, y, 0, 1); // Set the exterior boundaries
            } else if (value > 0.3) {
                map.setCell(x, y, 0, 1); // Set wall
            } else if (value > 0.29) { 
                map.setCell(x, y, 0, 4); // Set poison
            } else {
                map.setCell(x, y, 0, 0); // Set floor
            }
        }
    }

    // Replace some walls with lava lakes
    let lakesCreated = 1;

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

     while (trollsCreated < (4*Math.log(level))+3) {
        const trollX = Math.floor(Math.random() * map.w);
        const trollY = Math.floor(Math.random() * map.h);

        if (map.getCell(trollX, trollY, 0) === 0) {
            map.setCell(trollX, trollY, 1, 2); // Set troll object
            trollsCreated++;
        }
    }

    let gunthersCreated = 2;

     while (gunthersCreated < (level)) {
        const guntherX = Math.floor(Math.random() * map.w);
        const guntherY = Math.floor(Math.random() * map.h);

        if (map.getCell(guntherX, guntherY, 0) === 0) {
            map.setCell(guntherX, guntherY, 1, 4); // Set gunther object
            gunthersCreated++;
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

    const safeRegion = findLargestSafeArea(map);

    if (safeRegion.length >= 2) {
        safeRegion.sort(() => Math.random() - 0.5);

        const spawnTile = safeRegion[0]; 
        spawnX = spawnTile[0];
        spawnY = spawnTile[1];

        console.log("Spawn Tile:", spawnTile);

        // Find a tile at least X distance away
        const exitTile = safeRegion.find(([x, y]) => {
            const dx = x - spawnTile[0];
            const dy = y - spawnTile[1];
            return Math.sqrt(dx * dx + dy * dy) >= 20;
        });

        console.log("Exit Tile:", exitTile);

        if (spawnTile) {
            map.setCell(spawnTile[0], spawnTile[1], 1, 4); // Entrance marker
        }

        if (exitTile) {
            map.setCell(exitTile[0], exitTile[1], 1, 3); // Exit marker
        }
    } else {
        console.error("No large enough safe region found!");
    }

}
