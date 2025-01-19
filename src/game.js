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
                gravity: { y: 500 },
                debug: false
            }
        }
    };

    new Phaser.Game(config);

    let player, cursors, bullets, npcs, platforms;
    let lastFired = 0;

    function preload() {
        // Завантаження ресурсів
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png'); // Платформа
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Гравець
        this.load.image('npc', 'https://labs.phaser.io/assets/sprites/enemy-baddie.png'); // NPC
        this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png'); // Лазер
    }

    function create() {
        // Додаємо фон
        this.cameras.main.setBackgroundColor('#87ceeb'); // Синій фон

        // Додаємо платформи
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // Нижня платформа
        platforms.create(600, 400, 'ground'); // Верхні платформи
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // Додаємо гравця
        player = this.physics.add.sprite(100, 450, 'player');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // Додаємо зіткнення гравця з платформами
        this.physics.add.collider(player, platforms);

        // Керування гравцем
        cursors = this.input.keyboard.createCursorKeys();

        // Додаємо NPC
        npcs = this.physics.add.group({
            key: 'npc',
            repeat: 3,
            setXY: { x: 200, y: 0, stepX: 200 }
        });

        npcs.children.iterate((npc) => {
            npc.setBounce(1);
            npc.setCollideWorldBounds(true);
            npc.setVelocity(Phaser.Math.Between(-100, 100), 20);
        });

        this.physics.add.collider(npcs, platforms);

        // Додаємо кулі
        bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        // Додаємо зіткнення куль з NPC
        this.physics.add.overlap(bullets, npcs, hitNpc, null, this);
    }

    function update(time) {
        // Керування гравцем
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
        } else {
            player.setVelocityX(0);
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-400);
        }

        // Стрільба
        if (cursors.space.isDown && time > lastFired) {
            shootBullet();
            lastFired = time + 300; // Інтервал між пострілами
        }
    }

    function shootBullet() {
        const bullet = bullets.get(player.x, player.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.allowGravity = false;
            bullet.setVelocityX(400); // Напрямок кулі
        }
    }

    function hitNpc(bullet, npc) {
        bullet.disableBody(true, true);
        npc.disableBody(true, true); // Видалення NPC
    }
}

createGame('game-container');
