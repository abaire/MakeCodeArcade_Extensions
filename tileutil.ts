/**
 * Utilities for manipulating the tilemap
 */
//% color="#4B0082" weight=100 icon="\uf043" block="Tile Utils"
namespace tileutils {

    function getTilemap(): tiles.TileMap {
        return game.currentScene().tileMap;
    }

    function locationsContain(arr: tiles.Location[], col: number, row: number): boolean {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].column === col && arr[i].row === row) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the tile at the given location is one of the provided tiles.
     */
    //% block="tile at col $col row $row is one of $tilesArray"
    //% tilesArray.shadow="lists_create_with"
    //% tilesArray.defl="tileset_tile_picker"
    export function isTileOneOf(col: number, row: number, tilesArray: Image[]): boolean {
        const loc = tiles.getTileLocation(col, row);
        const currentTile = loc.getImage();

        for (let t of tilesArray) {
            if (t.equals(currentTile)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the tile at the given location is one of the provided tiles.
     */
    //% block="tile at $loc is one of $tilesArray"
    //% loc.shadow="mapgettile"
    //% tilesArray.shadow="lists_create_with"
    //% tilesArray.defl="tileset_tile_picker"
    export function isTileAtLocationOneOf(loc: tiles.Location, tilesArray: Image[]): boolean {
        return isTileOneOf(loc.column, loc.row, tilesArray);
    }


    /**
     * Grows a water pool from a centroid until a target area is reached.
     * @param waterTiles An array of possible water tile images
     * @param loc The starting location
     * @param targetArea Total number of tiles the pool should reach
     * @param minInterval Min growth delay in ms
     * @param maxInterval Max growth delay in ms
     */
    //% block="grow pool at location $loc with tiles $waterTiles || until area $targetArea with interval $minInterval to $maxInterval ms"
    //% loc.shadow="mapgettile"
    //% waterTiles.shadow="lists_create_with"
    //% waterTiles.defl="tileset_tile_picker"
    //% targetArea.defl=10 minInterval.defl=500 maxInterval.defl=1000
    export function growTilePoolAtLocation(
        waterTiles: Image[],
        loc: tiles.Location,
        targetArea: number,
        minInterval: number,
        maxInterval: number
    ): void {
        growTilePool(waterTiles, loc.column, loc.row, targetArea, minInterval, maxInterval);
    }

    /**
     * Grows a water pool from a centroid (col/row) until a target area is reached.
     */
    //% block="grow pool at col $col row $row with tiles $waterTiles || until area $targetArea with interval $minInterval to $maxInterval ms"
    //% waterTiles.shadow="lists_create_with"
    //% waterTiles.defl="tileset_tile_picker"
    //% col.defl=0 row.defl=0 targetArea.defl=10 minInterval.defl=500 maxInterval.defl=1000
    //% weight=90
    export function growTilePool(
        waterTiles: Image[],
        col: number,
        row: number,
        targetArea: number,
        minInterval: number,
        maxInterval: number
    ): void {
        let pool: tiles.Location[] = [tiles.getTileLocation(col, row)];
        tiles.setTileAt(pool[0], waterTiles[Math.randomRange(0, waterTiles.length - 1)]);

        control.runInParallel(() => {
            while (pool.length < targetArea) {
                pause(Math.randomRange(minInterval, maxInterval));

                // Collect all neighbors of every pool tile into a flat list first,
                // then filter membership at the top level to avoid nested-closure
                // capture issues in MakeCode's static TypeScript compiler.
                let neighbors: tiles.Location[] = [];
                for (let loc of pool) {
                    forEachNeighbor(loc, (neighbor) => {
                        neighbors.push(neighbor);
                    });
                }

                let candidates: tiles.Location[] = [];
                for (let i = 0; i < neighbors.length; i++) {
                    const n = neighbors[i];
                    if (!locationsContain(pool, n.column, n.row) &&
                        !locationsContain(candidates, n.column, n.row)) {
                        candidates.push(n);
                    }
                }

                if (candidates.length === 0) break;

                let nextLoc = candidates[Math.randomRange(0, candidates.length - 1)];
                tiles.setTileAt(nextLoc, waterTiles[Math.randomRange(0, waterTiles.length - 1)]);
                pool.push(nextLoc);
            }
        });
    }

    /**
     * Iterates over all 8 neighbors of a location.
     */
    //% block="for each neighbor of $loc"
    //% loc.shadow="mapgettile"
    export function forEachNeighbor(loc: tiles.Location, action: (neighbor: tiles.Location) => void): void {
        const tm = getTilemap();
        if (!tm || !tm.data) return;

        const mapWidth = tm.data.width;
        const mapHeight = tm.data.height;

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