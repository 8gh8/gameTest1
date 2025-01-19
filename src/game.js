import Phaser from "phaser";

export function createGame(containerId) {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerId,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);

    let player;
    let cursors;
    let bullets;
    let lastFired = 0;
    let npcs;

    function preload() {
        this.add.rectangle(400, 300, 800, 600, 0x87ceeb).setOrigin(0.5); // Фон (блакитний)
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png'); // Платформа
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Гравець
        this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png'); // Куля
        this.load.image('npc', 'https://labs.phaser.io/assets/sprites/enemy-baddie.png'); // NPC
    }

    function create() {
        // Платформи
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // Гравець
        player = this.physics.add.sprite(100, 450, 'player');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);

        // Анімації руху (замініть при необхідності)
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Стрілки управління
        cursors = this.input.keyboard.createCursorKeys();

        // Кулі
        bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        // NPC
        npcs = this.physics.add.group({
            key: 'npc',
            repeat: 3,
            setXY: { x: 300, y: 0, stepX: 150 }
        });

        npcs.children.iterate(npc => {
            npc.setBounce(1);
            npc.setCollideWorldBounds(true);
            npc.setVelocity(Phaser.Math.Between(-100, 100), 20);
        });

        this.physics.add.collider(npcs, platforms);
        this.physics.add.overlap(bullets, npcs, hitNpc, null, this);
    }

    function update(time) {
        // Рух гравця
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }

        // Стрілянина
        if (cursors.space.isDown && time > lastFired) {
            const bullet = bullets.get(player.x, player.y);
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.body.velocity.x = 400;
                lastFired = time + 300;
            }
        }
    }

    function hitNpc(bullet, npc) {
        bullet.disableBody(true, true);
        npc.disableBody(true, true);
    }
}
