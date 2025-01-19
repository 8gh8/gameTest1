import Phaser from "phaser";

export function createGame(containerId) {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };
    return new Phaser.Game(config);

    function preload() {
        this.load.image('logo', 'path/to/logo.png'); // Замініть шлях на ваш ресурс
    }

    function create() {
        this.add.image(400, 300, 'logo');
    }

    function update() {
        // Логіка гри
    }
}
