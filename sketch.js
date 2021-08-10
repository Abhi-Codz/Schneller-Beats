//Creating variables
let enemy, enemyImage, enemyGroup;
let bg;
let score = 0;
let highscore = 0;
let sound;
let character, characterImage, character1, character1Image; 
let characterS, characterSImage, characterC, characterCImage;
let fft;
let music;
let obstacleSw, obstacleSwImage, obstacleSwGroup;
let onOff;
let song2;
let particles = [];

function preload() 
{
  bg = loadImage('Bg-RPG-Rythm.png');
  characterImage = loadImage("main-Protagonist.png");
  character1Image = loadImage("main-Protagonist1.png");
  characterSImage = loadImage("main-ProtagonistShift.png");
  obstacleSwImage = loadImage('swordanimation0.png');
  characterCImage = loadImage("main-ProtagonistCtrl.png");
  enemyImage = loadImage("Enemy.png");
  sound = loadSound('OSUhitsound.wav');
  music = loadSound('y2mate.com - The Detective is Already Dead Opening TV Koko De Ikiteru Lyrics.mp3');
  song2 = loadSound('y2mate.com - MVREFLECT  Gawr Gura Fanmade (1).mp3');
}

function setup() 
{
  
  createCanvas(1350, 650);
  onOff = true;
  fft = new p5.FFT(); //Using FFT media libraby

  character = createSprite(400, 300);
  character.addImage(characterImage);
  character.scale = 0.7;

  song2.play();
  // music.loop();

  enemyGroup = new Group();
  obstacleSwGroup = new Group();

  character.setCollider("rectangle", 0, 0, character.width/1.5 ,character.height/1.5);
  // character.debug = true;

  obstacleSwGroup.debug = true;

  // frameRate(1000); //FrameRate times to 1000
}

function draw()
{
  background('pink');

  let wave = fft.waveform();

  fft.analyze();
  amp = fft.getEnergy(20, 200);

  // Creating camera shake effect
  if(onOff==true)
  {
    translate(random(-1.1, 1.1),random(-1.1, 1.1));
  }

  // Creating audio wave
  beginShape()
  for(var i = 0; i < width; i++)
  {
    var index = floor(map(i, 0, width, 0, wave.length));
  
    stroke('#00BBB9');
    fill('turquoise');

    var x = i;
    var y = wave[index] * 70 + height / 2;
    vertex(x, y);
  }
  endShape();

  // Creating particles
  var p = new Particle();
  particles.push(p);

  for(var i = 0; i < particles.length; i++)
  {
    particles[i].update(amp > 25);
    particles[i].show();
  }

  // Adding key controls
  if(keyDown("Left_arrow") || keyDown("a"))
  {
    character.x = character.x - 8.5;
    character.addImage(character1Image);
  }
  
  if(keyDown("Right_arrow") || keyDown("d"))
  {
    character.x = character.x + 8.5;
    character.addImage(characterImage);
  }
  
  if(keyDown("Up_arrow") || keyDown("w"))
  {
    character.y = character.y - 8.5;
  }

  if(keyDown("Down_arrow") || keyDown("s"))
  {
    character.y = character.y + 8.5;
  }

  if(keyDown("shift"))
  {
    character.x = character.x + 16;
    character.addImage(characterSImage);
    obstacleSwGroup.destroyEach();
  }
  
  if(keyDown("ctrl"))
  {
    character.x = character.x - 16;
    character.addImage(characterCImage);
    obstacleSwGroup.destroyEach();
  }

  // Adding touch events
  if(enemyGroup.isTouching(character))
  {
    sound.play();
    enemyGroup.destroyEach();
  }

  if(obstacleSwGroup.isTouching(character))
  {
    character.collide(obstacleSwGroup);
  }

  spawnEnemy();
  spawnObstacleSw();

  drawSprites();
}

function spawnEnemy()
{
  if(frameCount % 22 === 0)
  {
    enemy = Math.round(random(1, 10));
    enemy = createSprite(1350, 300);
    enemy.scale = 0.1;
    enemy.velocityX = -8.2;
    enemy.lifetime = 170;
    enemy.addImage(enemyImage);
    enemyGroup.add(enemy);
      
    //Adding random no. dependin onto the random no.
    enemy.y = Math.round(random(1, 600));
    return enemy;
  }
}

function spawnObstacleSw()
{
  if(frameCount % 100 === 0)
  {
    obstacleSw = Math.round(random(1, 10));
    obstacleSw = createSprite(1000, 800);
    obstacleSw.scale = 0.1;
    obstacleSw.velocityY = -8.2;
    obstacleSw.lifetime = 100;
    obstacleSw.addImage(obstacleSwImage);
    obstacleSwGroup.add(obstacleSw);
      
    //Adding random no. dependin onto the random no.
    obstacleSw.x = Math.round(random(1, 1000));
    return obstacleSw;
  }
}

// Creating particle class
class Particle
{
  constructor()
  {
    this.pos = p5.Vector.random2D().mult(10);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.0001))
    this.w = random(3, 5)
  }
  update(cond)
  {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  if(cond)
  {
    this.pos.add(this.vel);
    this.pos.add(this.vel);
    this.pos.add(this.vel);
  }
  show()
  {
    noStroke();
    fill('turquoise');
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}