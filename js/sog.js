var gameWidth = 800;
var gameHeight = 600;
var scoreText;
var overText;
var reText;
var fireTime = 0;
var roids;
var roidCollisionGroup;
var stationCollisionGroup;
var bulletCollisionGroup;
var ended = false;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'sog', { preload: preload, create: create, update: update });

function preload() {
    game.load.image("roid", "assets/asteroids/small/a10000.png");
    game.load.image("stationImg", "assets/Faction9-Spacestations-by-MillionthVector/smallStation.png");
    game.load.physics('stationPhysics', 'assets/physics/smallStation.json');
    game.load.image("bullet", "assets/bullet.png");
    game.load.image('starfield', 'assets/starfield.jpg');
    game.world.setBounds(-100, -100, gameWidth + 200, gameHeight + 200);
}


function create() {
    s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.applyDamping = false; //removes air resistance
    roidCollisionGroup = game.physics.p2.createCollisionGroup();
    stationCollisionGroup = game.physics.p2.createCollisionGroup();
    bulletCollisionGroup = game.physics.p2.createCollisionGroup();
    var station = game.add.sprite(gameWidth/2, gameHeight/2, "stationImg");
    game.physics.p2.enable(station);
    station.body.clearShapes();
    station.body.loadPolygon('stationPhysics', 'smallStation');
    station.body.static = true;
    station.body.setCollisionGroup(stationCollisionGroup);
    station.body.collides(roidCollisionGroup);
    station.body.onBeginContact.add(gameOver, this);
    roids = game.add.group();
    overText = game.add.text(gameWidth/2, 400, 'Game Over', { font: "40px Arial", fill: "#ffffff", align: "center" });
    overText.anchor.setTo(0.5, 0.5);
    overText.visible = false;
    reText = game.add.text(gameWidth/2, 430, 'Click to Restart', { font: "15px Arial", fill: "#ffffff", align: "center" });
    reText.anchor.setTo(0.5, 0.5);
    reText.visible = false;
    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    game.input.onDown.add(restart, this);
}

function addRemove(){
    // checking for bodies under the mouse
    //var bodyClicked = game.physics.p2.hitTest(pointer.position);
    // creation of physics body and its graphic asset
    //var newRoid = game.add.sprite(pointer.position.x, pointer.position.y, "roid");
    var location = Math.random();
    var newX, newY;
    if (location < 0.25) {
        var newRoid = game.add.sprite(Math.floor(Math.random() * 75) - 75, Math.floor(Math.random() * gameHeight), "roid");
        newX = Math.random() * 100;
        newY = Math.random() * 200 - 100;
    } else if (location < 0.5) {
        var newRoid = game.add.sprite(Math.floor(Math.random() * gameWidth), Math.floor(Math.random() * 75) - 75, "roid");
        newX = Math.random() * 200 - 100;
        newY = Math.random() * 100;
    } else if (location < 0.75) {
        var newRoid = game.add.sprite(Math.floor(Math.random() * 75) + gameWidth, Math.floor(Math.random() * gameHeight), "roid");
        newX = Math.random() * -100;
        newY = Math.random() * 200 - 100;
    } else {
        var newRoid = game.add.sprite(Math.floor(Math.random() * gameWidth), Math.floor(Math.random() * 75) + gameHeight, "roid");
        newX = Math.random() * 200 - 100;
        newY = Math.random() * -100
    }
    game.physics.p2.enable(newRoid); //add a true for collision debug
    newRoid.body.clearShapes();
    newRoid.body.setCircle(13);
    newRoid.body.velocity.x = newX;
    newRoid.body.velocity.y = newY;
    roids.add(newRoid, true);
    newRoid.body.setCollisionGroup(roidCollisionGroup);
    newRoid.body.collides([roidCollisionGroup, stationCollisionGroup, bulletCollisionGroup]);
}


function update () {
    roids.forEachAlive(function(p){
        if (p.x > gameWidth + 75 || p.x < -75 || p.y > gameHeight + 75 || p.y < -75) {
            p.destroy();
        }
    });
    if (fireTime % 100 == 0 && !ended) {
        scoreText.text = "Score :" + fireTime;
    }
    if (Math.random() > 0.95 && !ended) {
        addRemove();
    }
    fireTime++;
    if (fireTime % 25 == 0 && !ended) {
        fire(game.input);
    }
}

function fire (pointer) {
    var newShot = game.add.sprite(gameWidth/2 - 4, gameHeight/2 - 4, "bullet");
    game.physics.p2.enable(newShot);
    newShot.body.clearShapes();
    newShot.body.setCircle(4);
    newShot.body.velocity.x = 300 * (pointer.position.x - (gameWidth/2 - 4)) / Math.sqrt(Math.pow((pointer.position.x - (gameWidth/2 - 4)), 2) + Math.pow((pointer.position.y - (gameHeight/2 - 4)), 2));
    newShot.body.velocity.y = 300 * (pointer.position.y - (gameHeight/2 - 4)) / Math.sqrt(Math.pow((pointer.position.x - (gameWidth/2 - 4)), 2) + Math.pow((pointer.position.y - (gameHeight/2 - 4)), 2));
    newShot.body.setCollisionGroup(bulletCollisionGroup);
    newShot.body.collides([roidCollisionGroup, bulletCollisionGroup]);
}

function gameOver () {
    overText.visible = true;
    reText.visible = true;
    ended = true;
}

function restart () {
    if (ended) {
        roids.removeAll(true);
        overText.visible = false;
        reText.visible = false;
        ended = false;
        fireTime = 0;
    }
}
