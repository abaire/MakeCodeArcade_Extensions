/**
 * Utilities for manipulating the tilemap
 */
//% color="#4B0082" weight=100 icon="\uf043" block="Tile Utils"
namespace tileutils {

    /**
     * Grows a water pool from a centroid until a target area is reached.
     * @param waterTiles An array of possible water tile images
     * @param loc The starting location
     * @param targetArea Total number of tiles the pool should reach
     * @param minInterval Min growth delay in ms
     * @param maxInterval Max growth delay in ms
     */
    //% block="grow pool at location $loc || with tiles $waterTiles until area $targetArea with interval $minInterval to $maxInterval ms"
    //% loc.shadow="mapgettile"
    //% waterTiles.shadow="lists_create_with"
    //% targetArea.defl=10 minInterval.defl=500 maxInterval.defl=1000
    export function growTilePoolAtLocation(
        waterTiles: Image[],
        loc: tiles.Location,
        targetArea: number,
        minInterval: number,
        maxInterval: number
    ) {
        // Delegate to the original logic using column and row
        growTilePool(waterTiles, loc.column, loc.row, targetArea, minInterval, maxInterval);
    }

    /**
     * Grows a water pool from a centroid (col/row) until a target area is reached.
     */
    //% block="grow pool at col $col row $row || with tiles $waterTiles until area $targetArea with interval $minInterval to $maxInterval ms"
    //% waterTiles.shadow="lists_create_with"
    //% col.defl=0 row.defl=0 targetArea.defl=10 minInterval.defl=500 maxInterval.defl=1000
    //% weight=90
    export function growTilePool(
        waterTiles: Image[],
        col: number,
        row: number,
        targetArea: number,
        minInterval: number,
        maxInterval: number
    ) {
        let pool: tiles.Location[] = [tiles.getTileLocation(col, row)];
        tiles.setTileAt(pool[0], waterTiles[Math.randomRange(0, waterTiles.length - 1)]);

        function expand() {
            if (pool.length >= targetArea) return;

            let candidates: tiles.Location[] = [];

            for (let loc of pool) {
                forEachNeighbor(loc, (neighbor) => {
                    const isMember = pool.some(p => p.column === neighbor.column && p.row === neighbor.row);
                    const isCandidate = candidates.some(c => c.column === neighbor.column && c.row === neighbor.row);

                    if (!isMember && !isCandidate) {
                        candidates.push(neighbor);
                    }
                });
            }

            if (candidates.length > 0) {
                let nextLoc = candidates[Math.randomRange(0, candidates.length - 1)];
                tiles.setTileAt(nextLoc, waterTiles[Math.randomRange(0, waterTiles.length - 1)]);
                pool.push(nextLoc);
            }

            setTimeout(expand, Math.randomRange(minInterval, maxInterval));
        }

        expand();
    }

    /**
     * Iterates over all 8 neighbors of a location.
     */
    //% block="for each neighbor of $loc"
    export function forEachNeighbor(loc: tiles.Location, action: (neighbor: tiles.Location) => void) {
        const mapWidth = tiles.tilemapColumns();
        const mapHeight = tiles.tilemapRows();

        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                if (dc === 0 && dr === 0) continue;

                const nextCol = loc.column + dc;
                const nextRow = loc.row + dr;

                if (nextCol >= 0 && nextCol < mapWidth && nextRow >= 0 && nextRow < mapHeight) {
                    action(tiles.getTileLocation(nextCol, nextRow));
                }
            }
        }
    }
}