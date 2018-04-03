var config = {
  type: Phaser.WEBGL,
  width: 1000,
  height: 800,
  backgroundColor: '#ababab',
  parent: 'phaser-example',
  scene: {
      preload: preload,
      create: create,
      update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 }
    }
  }
};

var game = new Phaser.Game(config);

var skeletons = [];

var tileWidthHalf;
var tileHeightHalf;

var d = 0;

var scene;
var blocks;

function preload ()
{
  this.load.json('map', 'images/isometric-grass-and-water.json');
  this.load.spritesheet('tiles', 'images/isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
  this.load.image('house', 'images/rem_0002.png');
  this.load.atlas('hero', 'https://dl.dropboxusercontent.com/s/hradzhl7mok1q25/hero_8_4_41_62.png?dl=0', 'https://dl.dropboxusercontent.com/s/95vb0e8zscc4k54/hero_8_4_41_62.json?dl=0');
}

function create ()
{
  scene = this;
  blocks = this.physics.add.staticGroup();
  ground = this.physics.add.staticGroup();
  this.cursors = this.input.keyboard.createCursorKeys();

  buildMap();
  placeHouses();

  this.hero = this.physics.add.sprite(100, 100, 'hero');
  this.hero.depth = 10000;

  this.physics.add.collider(this.hero, blocks);

  this.cameras.main.startFollow(this.hero);
  
}

function buildMap () {
  var data = scene.cache.json.get('map');
  var tilewidth = data.tilewidth;
  var tileheight = data.tileheight;

  tileWidthHalf = tilewidth / 2;
  tileHeightHalf = tileheight / 2;

  var layer = data.layers[0].data;
  var mapwidth = data.layers[0].width;
  var mapheight = data.layers[0].height;
  var centerX = mapwidth * tileWidthHalf;
  var centerY = 16;
  var i = 0;

  for (var y = 0; y < mapheight; y++)
  {
      for (var x = 0; x < mapwidth; x++)
      {
          id = layer[i] - 1;

          var tx = (x - y) * tileWidthHalf;
          var ty = (x + y) * tileHeightHalf;

          if (id === 22 || id === 23) {
            var tile = blocks.create(centerX + tx, centerY + ty, 'tiles', id);
          } else {
            var tile = ground.create(centerX + tx, centerY + ty, 'tiles', id);
          }

          tile.depth = centerY + ty;
          i++;
      }
  }
}

function placeHouses () {
  var house = scene.add.image(240, 370, 'house');
  house.depth = house.y + 86;
  house = scene.add.image(1300, 290, 'house');
  house.depth = house.y + 86;
}

function update () {

  if (this.cursors.left.isDown) {
    this.hero.setVelocityX(-120);
  } else if (this.cursors.right.isDown) {
    this.hero.setVelocityX(120);
  } else if (this.cursors.up.isDown) {
    this.hero.setVelocityY(-120);
  } else if (this.cursors.down.isDown) {
    this.hero.setVelocityY(120);
  } else {
    this.hero.setVelocity(0);
  }

}