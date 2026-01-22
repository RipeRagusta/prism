
function cultKnifeCreator(scene, cultKnifePositions, gameManager)
{     
    scene.cultKnifes = scene.physics.add.group();

    cultKnifePositions.forEach(pos => 
    {
        const cultKnifeInstance = new cultKnife(scene, pos.x, pos.y, scene.player);
        scene.cultKnifes.add(cultKnifeInstance);
    });

    scene.physics.add.overlap(scene.cultKnifes, scene.playerBulletsHolder, (cult, bullet) =>
    {
        if(!bullet.damagedList.includes(cult.id) && !bullet.penetrationsLeft >= 1)
        {
            bullet.damagedList.push(cult.id);
            bullet.destroy();
            cult.hitFrom = bullet.fromWhat;
            cult.health -= bullet.damage;
            cult.bloodEmitter.setQuantity(Math.max(1, Math.round(bullet.damage * 2)));
            cult.bloodEmitter.emitParticleAt(cult.x, cult.y);
        }
        else
        {
            if(!bullet.damagedList.includes(cult.id))
            {
                bullet.damagedList.push(cult.id);
                bullet.penetrationsLeft -= 1;
                cult.hitFrom = bullet.fromWhat;
                cult.health -= bullet.damage;
                cult.bloodEmitter.setQuantity(Math.max(1, Math.round(bullet.damage * 2)));
                cult.bloodEmitter.emitParticleAt(cult.x, cult.y);
                bullet.damage = bullet.damage * bullet.penetrationReduction;
            }
        }
    });

    scene.physics.add.collider(scene.player, scene.cultKnifes, (player, cult) =>
    {
        player.health -= 10;
        scene.sound.play("playerhurt");
    });

    scene.physics.add.collider(scene.cultKnifes, scene.cultKnifes);
}

class cultKnife extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, player)
    {
        super(scene, x, y, "cultknife");

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
        this.id = Phaser.Utils.String.UUID();
        this.gameManager = game.scene.getScene("GameManager");
      
        this.bloodEmitter = this.scene.add.particles
        (
            0, 0, 
            "blood",
            {
                angle: { min: 180, max: 360 }, 
                speed: { min: 50, max: 125 },
                gravityY: 500,
                lifespan: { min: 500, max: 1000 },
                quantity: 10,
                scale: { start: 1, end: 1 },
                alpha: { start: 0.75, end: 0 },
                rotate: { min: -180, max: 180 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.boneEmitter = this.scene.add.particles
        (
            0, 0, 
            "bonegib",
            {
                angle: { min: 180, max: 360 }, 
                speed: { min: 75, max: 100 },
                gravityY: 500,
                lifespan: { min: 1000, max: 1000 },
                quantity: 2,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 0.5 },
                rotate: { min: -180, max: 180 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.organEmitter = this.scene.add.particles
        (
            0, 0, 
            "organgib",
            {
                angle: { min: 180, max: 360 }, 
                speed: { min: 50, max: 100 },
                gravityY: 500,
                lifespan: { min: 1000, max: 1000 },
                quantity: 4,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 0.5 },
                rotate: { min: -180, max: 180 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.headEmitter = this.scene.add.particles
        (
            0, 0, 
            "headgib",
            {
                angle: { min: 270, max: 315 }, 
                speed: { min: 125, max: 150 },
                gravityY: 500,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 1 },
                rotate: { min: 0, max: 90 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );
        
        this.ribEmitter = this.scene.add.particles
        (
            0, 0, 
            "ribcagegib",
            {
                angle: { min: 270, max: 315 }, 
                speed: { min: 75, max: 100 },
                gravityY: 500,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 0.5 },
                rotate: { min: 0, max: 90 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );
        
        if(!scene.anims.get("knifeidle"))
        {
            scene.anims.create
            ({
                key: "knifeidle",
                frames: scene.anims.generateFrameNumbers("cultknife", { start: 0, end: 2 }),
                frameRate: 4,
                repeat: -1
            });
        }
        
        if(scene.anims.get("knifeidle"))
        {
            this.play("knifeidle");
        }
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        if(this.health < 1)
        {
            this.scene.sound.play("hurt");
            if(this.scene.gameManager.screenShake)
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
                if(this.gameManager.knifeAggressionUpgrade)
                {
                    this.setVelocityX(-150);
                    this.flip = false;
                    this.setFlipX(false);
                }
                else
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
        this.bloodEmitter.setQuantity(35);
        this.bloodEmitter.emitParticleAt(this.x, this.y);
        this.boneEmitter.emitParticleAt(this.x, this.y);
        this.organEmitter.emitParticleAt(this.x, this.y);
        this.headEmitter.emitParticleAt(this.x, this.y);
        this.ribEmitter.emitParticleAt(this.x, this.y);
        const gameManager = this.scene.gameManager;
        if(gameManager.doubleFireUpgrade)
        {
            if(this.scene.player && this.scene.player.active)
            {
                this.scene.player.activateDoubleFire();
            } 
        }
        
        if(!gameManager.cheats)
        {
            let currentScore = 10;
            
            if(this.hitFrom === "pistol")
            {
                currentScore = currentScore * 4;
            }
            else if(this.hitFrom === "doubleFire")
            {
                currentScore = currentScore * 2;
            }
            
            gameManager.score += currentScore;
        }
        
        if(gameManager.gameMode === "Classic")
        {
            if(gameManager.score > gameManager.highScore)
            {
                gameManager.highScore = gameManager.score;
                if(checkStorage() === true)
                {
                    localStorage.setItem("HCHighScore", gameManager.highScore);
                }
            }
        }
        else if(gameManager.gameMode === "Standard")
        {
            if(gameManager.score > gameManager.experimentalHighScore)
            {
                gameManager.experimentalHighScore = gameManager.score;
                if(checkStorage() === true)
                {
                    localStorage.setItem("HCExperimentalHighScore", gameManager.experimentalHighScore);
                }
            }
        }
        else if(gameManager.gameMode === "Easy")
        {
            if(gameManager.score > gameManager.easyHighScore)
            {
                gameManager.easyHighScore = gameManager.score;
                if(checkStorage() === true)
                {
                    localStorage.setItem("HCEasyHighScore", gameManager.easyHighScore);
                }
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

