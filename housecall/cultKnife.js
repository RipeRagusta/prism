
function cultKnifeCreator(scene, cultKnifePositions, gameManager)
{     
    scene.cultKnifes = scene.physics.add.group();

    cultKnifePositions.forEach(pos => 
    {
        const cultKnifeInstance = new cultKnife(scene, pos.x, pos.y, scene.player);
        scene.cultKnifes.add(cultKnifeInstance);
    });

    if(scene.ground)
    {
        scene.physics.add.collider(scene.cultKnifes, scene.ground);
    }

    scene.physics.add.overlap(scene.cultKnifes, scene.playerBulletsHolder, (cult, bullet) =>
    {
        cult.health -= bullet.damage;
        bullet.destroy();
        cult.bloodEmitter.setQuantity(4);
        cult.bloodEmitter.emitParticleAt(cult.x, cult.y);
    });

    scene.physics.add.collider(scene.player, scene.cultKnifes, (player, cult) =>
    {
        player.health -= 10;
    });

    scene.physics.add.collider(scene.cultKnifes, scene.cultKnifes);
}

class cultKnife extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, player)
    {
        super(scene, x, y, 'cultknife');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(true);
        this.setVisible(true);
        this.health = 5;
        this.setBounce(0);
        this.player = player;
        this.alert = false;
        this.flip = true;
        this.scene = scene;
      
        this.bloodEmitter = this.scene.add.particles
        (
            0, 0, 
            'blood',
            {
                angle: { min: 0, max: 360 }, 
                speed: { min: 100, max: 200 },
                gravityY: 500,
                lifespan: { min: 750, max: 750 },
                quantity: 75,
                scale: { start: 0.5, end: 0 },
                alpha: { start: 1, end: 0 },
                blendMode: 'NORMAL',
                frequency: -1
            }
        );
        
        if(!scene.anims.get('knifeidle'))
        {
            scene.anims.create
            ({
                key: 'knifeidle',
                frames: scene.anims.generateFrameNumbers('cultknife', { start: 0, end: 2 }),
                frameRate: 4,
                repeat: -1
            });
        }
        
        if(scene.anims.get('knifeidle'))
        {
            this.play('knifeidle');
        }
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        if(this.health < 1)
        {
            this.scene.sound.play('hurt');
            if(this.scene.gameManager.allowScreenShakeOnKill)
            {
                this.scene.cameras.main.shake(50, 0.004);
            }
            this.kill();
        }
        else
        {
            this.checkInRange();

            if(this.alert === true || this.health < 5)
            {
                if(Math.abs(this.player.x - this.x) >= 0 - 5 && Math.abs(this.player.x - this.x) <= 0 + 5)
                {
                    this.setVelocityX(0);
                }
                else
                {
                    if(this.player.x < this.x)
                    {
                        this.setVelocityX(-150);
                        this.flip = false;
                        this.setFlipX(false);
                    }
                    else
                    {
                        this.setVelocityX(150);
                        this.flip = true;
                        this.setFlipX(true);
                    }
                }
            }
            else
            {
                if(this.flip === true)
                {
                    this.setFlipX(true);
                }
                else
                {
                    this.setFlipX(false);
                }
            }
        }
    }

    checkInRange()
    {
        if(this.alert === false && Math.abs(this.player.x - this.x) <= 308)
        {
            this.alert = true;
        }
    }
    
    kill()
    {
        this.bloodEmitter.setQuantity(100);
        this.bloodEmitter.emitParticleAt(this.x, this.y);
        const gameManager = this.scene.gameManager;
        if(gameManager.doubleFireUpgrade)
        {
            if(this.scene.player && this.scene.player.active)
            {
                this.scene.player.activateDoubleFire();
            } 
        }
        gameManager.score += 10;
        if(gameManager.score > gameManager.highScore)
        {
            gameManager.highScore = gameManager.score;
            if(checkStorage() === true)
            {
                localStorage.setItem("HCHighScore", gameManager.highScore);
            }
        }
        const HUD = this.scene.HUD;
        HUD.updateScore();
        HUD.updateHighScore();
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }
}

