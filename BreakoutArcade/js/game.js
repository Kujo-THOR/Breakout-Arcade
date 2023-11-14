let config = {
    width: 1280,
    height: 800,
    type: Phaser.AUTO,
    parent: 'game',
    scene: {
        preload,
        create,
        update
    },
    // 1. Добавить настройки физики в config
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        },
    }
};

let game = new Phaser.Game(config);

// 2. Объявить глобальные переменные player, ball, cursors
let cursors;
let ball;
let paddle;
let brick1;
let brick2;
let brick3;
let text1;
let text2;
let text3;
let background;

let started = false;
// 3. в функции preload через this.load.image загрузить изображения ball.png, paddle.png, brick1.png
function preload() {
    this.load.image('paddle', './img/paddle.png');
    this.load.image('ball', './img/ball.png');
    this.load.image('brick1', './img/brick1.png');
    this.load.image('brick2', './img/brick2.png');
    this.load.image('brick3', './img/brick3.png');
    this.load.image('background', './img/background.jpg');
}
// 4. создать спрайты на основе загруженных изображений используя метод this.physics.add.sprite 
function create() {
    background = this.add.image(640, 400, 'background').setScale(0.4);
    paddle = this.physics.add.sprite(637, 677, 'paddle');
    ball = this.physics.add.sprite(640, 640, 'ball');

    text2 = this.add.text(210, 350, 'Press Left Button On A Mouse ', { fontSize: 60, fontFamily: 'cursive' });
    text4 = this.add.text(400, 450, 'Control by [ A/d or <-/->]', { fontSize: 40, fontFamily: 'cursive' });
    for (let i = 0; i < 16; i++) {
        brick1 = this.physics.add.sprite(50 + i * 78, 50, 'brick1');
        brick2 = this.physics.add.sprite(50 + i * 78, 100, 'brick2');
        brick3 = this.physics.add.sprite(50 + i * 78, 150, 'brick3');

        this.physics.add.collider(brick1, ball, destroyBrick1);
        brick1.setImmovable(true);
        this.physics.add.collider(brick2, ball, destroyBrick2);
        brick2.setImmovable(true);
        this.physics.add.collider(brick3, ball, destroyBrick3);
        brick3.setImmovable(true);

        brick1.setCollideWorldBounds(true);
        brick2.setCollideWorldBounds(true);
        brick3.setCollideWorldBounds(true);
    }
    paddle.setImmovable(true);
    ball.setScale(0.02);
    paddle.setScale(0.5, 0.4);

    // 5. создать объект cursors для управления объектом paddle
    cursors = this.input.keyboard.createCursorKeys();

    // 6. задать коллизию с миром через метод setCollideWorldBounds() для спрайтов ball и paddle
    paddle.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);


    // 7.Через метод setBouce(1,1) задать осткакивание мяча (ball)
    ball.setBounce(1, 1);
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.world.checkCollision.down = false;
}

function hitPaddle(ball, paddle) {
}
function destroyBrick1(brick1) {
    brick1.destroy();
}
function destroyBrick2(brick2) {
    brick2.destroy();
}
function destroyBrick3(brick3) {
    brick3.destroy();
}

// 8. реализовать управление paddle
function update() {
    paddle.setVelocityX(0);
    if (cursors.left.isDown || this.input.keyboard.addKey('a').isDown) {
        paddle.setVelocityX(-500)
    } else if (cursors.right.isDown || this.input.keyboard.addKey('d').isDown) {
        paddle.setVelocityX(500);
    }

    // 9. реализовать начальное движение мяча при нажатии кнопки
    this.input.on('pointerdown', function (pointer) {
        if (!started) {
            ball.setVelocityX(450);
            ball.setVelocityY(-450);
            text2.visible = false;
            text4.visible = false;
            started = true;
        }
    });

    // Проверка, есть ли еще блоки на сцене
    function checkNoBricks() {
        return (
            !brick1.active &&
            !brick2.active &&
            !brick3.active
        );
    }

    if (ball.y > 850) {
        this.physics.pause();
        text1 = this.add.text(480, 350, 'Game Over', { fontSize: 60, fontFamily: 'cursive' });
        text3 = this.add.text(460, 450, 'Click To Restart', { fontSize: 45, fontFamily: 'cursive' });
        this.input.on('pointerup', () => {
            score = 0;
            started = false;
            this.scene.restart();
        });
    } else if (checkNoBricks()) {
        this.physics.pause();
        this.add.text(500, 350, 'You Win!', { fontSize: 60, fontFamily: 'cursive' });
        this.add.text(480, 450, 'Click To Restart', { fontSize: 45, fontFamily: 'cursive' });
        this.input.on('pointerup', () => {
            score = 0;
            started = false;
            this.scene.restart();
        this.scene.restart();
    });
    }
}