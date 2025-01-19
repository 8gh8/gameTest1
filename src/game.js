const Phaser = window.Phaser;

function createGame(containerId) {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        }
    };

    new Phaser.Game(config);

    let player;
    let cursors;

    function preload() {
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png'); // Платформа
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Гравець
    }

    function create() {
        // Додаємо платформу як статичний об'єкт
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // Додаємо гравця
        player = this.physics.add.sprite(100, 450, 'player');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(player, platforms);

        // Додаємо керування
        cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
        // Рух гравця
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
        } else {
            player.setVelocityX(0);
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
}

createGame('game-container');
