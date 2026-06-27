//% color="#E67E22" icon="\uf06e" block="Screen Utils"
namespace screenutils {

    /**
     * Returns true if the target sprite's center is currently inside the screen boundaries.
     * @param sprite The sprite to check
     */
    //% blockId=screenutils_is_sprite_on_screen
    //% block="is %sprite=variables_get(sprite) on screen"
    export function isOnScreen(sprite: Sprite): boolean {
        if (!sprite) return false;

        return Math.abs(sprite.x - scene.cameraProperty(CameraProperty.X)) < scene.screenWidth() / 2 &&
            Math.abs(sprite.y - scene.cameraProperty(CameraProperty.Y)) < scene.screenHeight() / 2;
    }

}
