class playerBullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);
        this.setActive(false);
        this.setVisible(false);
        this.scene = scene;
    }

    fire(x, y, angle, damage, velocity = 400, penetrations = 0, penetrationReduction = 0.5, fromWhat)
    {
        this.startX = x;
        this.setOrigin(0, 0);
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setRotation(angle);
        this.damage = damage;
        this.speed = velocity;
        this.damagedList = [];
        this.penetrationsLeft = penetrations;
        this.penetrationReduction = penetrationReduction;
        this.fromWhat = fromWhat;
        
        this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
       
        this.initialVelocity = this.body.velocity.x;
 
        this.body.allowGravity = false;
    }
    
    extraDistanceForRange()
    {
        return this.scene.player.x + (this.scene.player.width / 2) + (this.scene.player.width / 16) - this.startX;
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);
      
        if(this.isFollowingX())
        {
          this.body.velocity.x = this.initialVelocity + this.scene.player.body.velocity.x;
          this.distance = 275 + this.extraDistanceForRange();
        }
        else
        {
            this.distance = 275;
        }
          
        if(this.y < 0 || this.y > this.scene.sys.game.config.height || this.x > this.startX + this.distance || this.x < this.startX - this.distance)
        {
          this.setActive(false);
          this.setVisible(false);
          this.destroy();
        }
    }
    
    isFollowingX()
    {
        if(this.scene.player.body)
        {
            return Math.abs((this.scene.cameras.main.midPoint.x - (this.scene.sys.game.config.width / 4)) - this.scene.player.x) < 1;
        }
        else
        {
            return false;
        }
    }
}
  
  function createPlayer(scene, x, y, gameManager)
  {
        scene.playerBulletsHolder = scene.physics.add.group
        ({
          classType: playerBullet,
          maxSize: 360,
          runChildUpdate: true
        });

        scene.player = new player(scene, x, scene.sys.game.config.height - 24, scene.playerBulletsHolder);
        
        scene.player.canShoot = false;
        scene.time.delayedCall(200, () => scene.player.canShoot = true);
        
        scene.player.fireMode = scene.gameManager.fireModeUpgrade;
        
        if(scene.gameManager.damageUpgrade)
        {
            scene.player.baseDamage = 1.25;
        }
        
        if(scene.gameManager.healthUpgrade)
        {
            scene.player.health = 20;
        }
        
        if(scene.gameManager.alwaysBuddha)
        {
            scene.player.buddha();
        }
  }
  
  class player extends Phaser.Physics.Arcade.Sprite
  {
    constructor(scene, x, y, playerBulletsHolder)
    {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(6, 16);
        this.setActive(true);
        this.setVisible(true);
        this.flip = false;
        this.aimAngle = 0;
        this.fireRate = 750;
        this.baseFireRate = this.fireRate;
        this.doubleFire = false;
        this.doubleFireDuration = 1500;
        this.lastPlayerShot = 0;
        this.health = 10;
        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.scene = scene;
        this.lastPlayerBlock = 0;
        this.blockRate = 750;
        this.block = false;
        this.playerBulletsHolder = playerBulletsHolder;
        this.canShoot = true;
        this.damagePerShot = 1;
        this.baseDamage = 1;
        this.initialDamage = this.baseDamage;
        this.fireMode = "buckshot";
        this.pistolMoveFireRate = 1500;
        this.lastPistolMove = 0;
        this.lastShellCycle = 0;
        this.canMove = true;
        this.pistolShootingFrames = [4];
        this.triplePistolShootingFrames = [4, 6, 8];
        this.quintuplePistolShootingFrames = [4, 6, 8, 10, 12];
        this.playedPistolShootingSound = false;
        this.killed = false;
        
        this.mouseRef = scene.input;
        this.bullets = playerBulletsHolder;
        this.settings = game.scene.getScene("Settings");
        this.gameManager = game.scene.getScene("GameManager");

        if(!scene.anims.get("pump"))
        {
            scene.anims.create
            ({
                key: "pump",
                frames: scene.anims.generateFrameNumbers("player", { start: 1, end: 0 }),
                frameRate: 6,
                repeat: 0
            });
        }
        
        if(!scene.anims.get("block"))
        {
            scene.anims.create
            ({
                key: "block",
                frames: [
                            { key: "player", frame: 2 },
                            { key: "player", frame: 0 }
                        ],
                frameRate: 2,
                repeat: 0
            });
        }
        
        if(!scene.anims.get("pistolmove"))
        {
            scene.anims.create
            ({
                key: "pistolmove",
                frames: [
                            { key: "player", frame: 5 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 5 },
                            { key: "player", frame: 0 }
                        ],
                frameRate: 7,
                repeat: 0
            });
        }
        
        if(!scene.anims.get("triplepistol"))
        {
            scene.anims.create
            ({
                key: "triplepistol",
                frames: [
                            { key: "player", frame: 5 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 5 },
                            { key: "player", frame: 0 }
                        ],
                frameRate: 7,
                repeat: 0
            });
        }
        
        if(!scene.anims.get("quintuplepistol"))
        {
            scene.anims.create
            ({
                key: "quintuplepistol",
                frames: [
                            { key: "player", frame: 5 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 4 },
                            { key: "player", frame: 3 },
                            { key: "player", frame: 5 },
                            { key: "player", frame: 0 }
                        ],
                frameRate: 7,
                repeat: 0
            });
        }

        this.shellEmitter = this.scene.add.particles
        (
            0, 0, 
            "shell",
            {
                angle: 
                {
                    onEmit: () => 
                    {
                        if(this.flip === true)
                        {
                            return Phaser.Math.Between(-45, 45);
                        }
                        else
                        {
                            return  Phaser.Math.Between(135, 225);
                        }
                    }
                }, 
                speed: { min: 100, max: 200 },
                gravityY: 300,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 1 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.slugShellEmitter = this.scene.add.particles
        (
            0, 0, 
            "slugshell",
            {
                angle: 
                {
                    onEmit: () => 
                    {
                        if(this.flip === true)
                        {
                            return Phaser.Math.Between(-45, 45);
                        }
                        else
                        {
                            return  Phaser.Math.Between(135, 225);
                        }
                    }
                }, 
                speed: { min: 100, max: 200 },
                gravityY: 300,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 1 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.birdShotShellEmitter = this.scene.add.particles
        (
            0, 0, 
            "birdshotshell",
            {
                angle: 
                {
                    onEmit: () => 
                    {
                        if(this.flip === true)
                        {
                            return Phaser.Math.Between(-45, 45);
                        }
                        else
                        {
                            return  Phaser.Math.Between(135, 225);
                        }
                    }
                }, 
                speed: { min: 100, max: 200 },
                gravityY: 300,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 1 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.numfourbuckShotShellEmitter = this.scene.add.particles
        (
            0, 0, 
            "numfourbuckshotshell",
            {
                angle: 
                {
                    onEmit: () => 
                    {
                        if(this.flip === true)
                        {
                            return Phaser.Math.Between(-45, 45);
                        }
                        else
                        {
                            return  Phaser.Math.Between(135, 225);
                        }
                    }
                }, 
                speed: { min: 100, max: 200 },
                gravityY: 300,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 1 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.shotgunEmitters  = 
        {
            "red": this.shellEmitter,
            "green": this.slugShellEmitter,
            "blue": this.birdShotShellEmitter,
            "black": this.numfourbuckShotShellEmitter
            
        }

        this.orbDestory = this.scene.add.particles
        (
            0, 0, 
            "bulletcult",
            {
                angle: 
                {
                    onEmit: () => 
                    {
                        if(this.flip === true)
                        {
                            return Phaser.Math.Between(135, 225);
                        }
                        else
                        {
                            return Phaser.Math.Between(-45, 45);
                        }
                    }
                }, 
                speed: { min: 200, max: 200 },
                gravityY: 0,
                lifespan: { min: 1000, max: 1000 },
                quantity: 4,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 0 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.pistolCasing = this.scene.add.particles
        (
            0, 0, 
            "pistolcasing",
            {
                angle: 
                {
                    onEmit: () => 
                    {
                        if(this.flip === true)
                        {
                            return Phaser.Math.Between(-20, -45);
                        }
                        else
                        {
                            return  Phaser.Math.Between(200, 225);
                        }
                    }
                }, 
                speed: { min: 100, max: 200 },
                gravityY: 300,
                lifespan: { min: 1000, max: 1000 },
                quantity: 1,
                scale: { start: 1, end: 1 },
                alpha: { start: 1, end: 1 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        this.on(Phaser.GameObjects.Events.DESTROY, () => 
        {
            if(this.doubleFireTimer)
            {
                this.doubleFireTimer.remove();
            }
        });
        
        this.scene.anims.get("pump").frameRate = 6;
        
        this.pistolFrameUpdate = (anim, frame) => 
        {
            let animation = anim.key;
            let shootingFrames;

            if(animation === "pistolmove")
            {
                shootingFrames = this.pistolShootingFrames;
            }
            else if(animation === "triplepistol")
            {
                shootingFrames = this.triplePistolShootingFrames;
            }
            else if (animation === "quintuplepistol")
            {
                shootingFrames = this.quintuplePistolShootingFrames;
            }
            else
            {
                return;
            }
            
            if(this.anims.isPlaying && this.anims.currentAnim.key === animation && shootingFrames.includes(frame.index) && !this.playedPistolShootingSound) 
            {
                this.playedPistolShootingSound = true;
                this.scene.sound.play("pistolsound");

                const bullet = this.bullets.get(this.x, this.y, "slug");

                if(bullet)
                {
                    let pistolDamage = 7;


                    if(this.gameManager.pistolUpgrade)
                    {
                        pistolDamage = 14;
                    }
                    
                    if(this.gameManager.mousePistolUpgrade)
                    {
                        if(this.flip === false)
                        {
                          bullet.fire(this.x + (this.width / 2) + (this.width / 16), this.y - (this.height / 32) - (this.height / 16), this.aimAngle, pistolDamage, 400, 0, 0.5, "pistol");
                        }
                        else
                        {
                          bullet.fire(this.x - (this.width / 2) - (this.width / 16), this.y - (this.height / 32) - (this.height / 16), this.aimAngle, pistolDamage, 400, 0, 0.5, "pistol");
                        }
                    }
                    else
                    {
                        if(this.flip === false)
                        {
                          bullet.fire(this.x + (this.width / 2) + (this.width / 16), this.y - (this.height / 32) - (this.height / 16), Phaser.Math.DegToRad(0), pistolDamage, 400, 0, 0.5, "pistol");
                        }
                        else
                        {
                          bullet.fire(this.x - (this.width / 2) - (this.width / 16), this.y - (this.height / 32) - (this.height / 16), Phaser.Math.DegToRad(180), pistolDamage, 400, 0, 0.5, "pistol");
                        }
                    }
                    
                    this.pistolCasing.emitParticleAt(this.x, this.y);
                }  
            }
            else if(this.anims.isPlaying && anim.key === animation && !shootingFrames.includes(frame.index) && this.playedPistolShootingSound) 
            {
                this.playedPistolShootingSound = false;
            }
        };
        
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.pistolFrameUpdate, this);

        this.on(Phaser.GameObjects.Events.DESTROY, () => 
        {
            this.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.pistolFrameUpdate, this);
        }, this);
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        if(this.health < 1)
        {
            this.kill();
        }
        else
        {
            this.checkBlock(time);
            this.checkMovement(); 
            this.checkFireMode(time);
            this.checkShooting(time);
            this.checkPistolMove(time);
            this.scene.input.activePointer.updateWorldPoint(this.scene.cameras.main);
            this.checkFlip(this.scene.input.activePointer);
            this.updateAimAngle(this.scene.input.activePointer);
        } 
    }
    
    kill()
    {
        this.gameManager.score = 0;
        const HUD = this.scene.HUD;
        HUD.updateScore();
        this.killed = true;
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }
    
    checkPistolMove(time)
    {
        
        if(this.gameManager.triplePistolUpgrade)
        {
            this.pistolMoveFireRate = 2071;
        }
        else if(this.gameManager.quintuplePistolUpgrade)
        {
            this.pistolMoveFireRate = 2643;
        }
        else
        {
            this.pistolMoveFireRate = 1500;
        }
            
        if(this.gameActionActive("usePistol") && time > this.lastPistolMove + this.pistolMoveFireRate && this.settings.displayedSettings === false)
        {
            if(this.gameManager.triplePistolUpgrade)
            {
                this.shootPistol(time, "triplepistol");
            }
            else if(this.gameManager.quintuplePistolUpgrade)
            {
                this.shootPistol(time, "quintuplepistol");
            }
            else
            {
                this.shootPistol(time, "pistolmove");
            }
        }
    }
    
    shootPistol(time, animation)
    {
        this.play(animation, true);
        this.lastPistolMove = time;
        this.playedPistolShootingSound = false;
    }
    
    checkFireMode(time)
    {
                         
        if(this.gameManager.multiAmmoUpgrade)
        {
            if(time > this.lastShellCycle + 50)
            {
                let randomShell = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
                
                switch(randomShell)
                {
                    case 1:
                        this.fireMode = "buckshot";
                        break;
                        
                    case 2:
                        this.fireMode = "slug";
                        break;
                        
                    case 3:
                        this.fireMode = "birdshot";
                        break;
                        
                    case 4:
                        this.fireMode = "000buckshot";
                        break;
                        
                    case 5:
                        this.fireMode = "numfourbuckshot";
                        break;
                }
                
                this.lastShellCycle = time;
            }
        }  
    }
    
    checkShooting(time)
    {
        if(this.gameActionActive("useShotgun") && time > this.lastPlayerShot + this.fireRate && this.settings.displayedSettings === false)
        {
            this.mouseRef.mouse.disableContextMenu();

            if(this.canShoot && this.settings.displayedSettings === false)
            {
                this.shoot(time);
                this.lastPlayerShot = time;
                this.play("pump", false);
            }
        }
    }
    
    shoot()
    {
        const fireConfig = this.gameManager.fireModeConfig[this.fireMode];
        
        let offset = -(fireConfig.spread / 2);

        for (let i = 0; i < fireConfig.pelletCount; i++)
        {
            const pelletType = this.doubleFire ? fireConfig.doublePelletType : fireConfig.normalPelletType;
            
            const bullet = this.bullets.get(this.x, this.y, pelletType);

            if(bullet)
            {
                let currentPenetrations = fireConfig.penetrations;
                
                if(this.gameManager.highVelocityUpgrade)
                {
                    currentPenetrations += 1;
                }
                
                let currentPenetrationReduction = fireConfig.penetrationReduction;
                
                this.damagePerShot = this.baseDamage * fireConfig.damage;
                
                if(this.flip === false)
                {
                  bullet.fire(this.x + (this.width / 2) + (this.width / 16), this.y - (this.height / 32) - (this.height / 16), this.aimAngle + Phaser.Math.DegToRad(offset), this.damagePerShot, fireConfig.pelletVelocity, currentPenetrations, currentPenetrationReduction, this.doubleFire ? "doubleFire" : "shotgun");
                }
                else
                {
                  bullet.fire(this.x - (this.width / 2) - (this.width / 16), this.y - (this.height / 32) - (this.height / 16), this.aimAngle + Phaser.Math.DegToRad(offset), this.damagePerShot, fireConfig.pelletVelocity, currentPenetrations, currentPenetrationReduction, this.doubleFire ? "doubleFire" : "shotgun");
                }

                offset += fireConfig.spreadIncrement;
            }
        }
        
        this.scene.sound.play(fireConfig.sound);
        this.shotgunEmitters[fireConfig.shellEmitter].emitParticleAt(this.x, this.y);
    }
    
    gameActionActive(keyName)
    {
        return this.gameManager.isActionActive(keyName);
    }
    
    checkMovement()
    {
        if(this.canMove)
        {
            if(this.gameActionActive("walkLeft") && this.settings.displayedSettings === false)
            {
                this.setVelocityX(-120);
            }
            else if(this.gameActionActive("walkRight") && this.settings.displayedSettings === false)
            {
                this.setVelocityX(120);
            }
            else
            {
                this.setVelocityX(0);
            }

            if(this.gameActionActive("jump") && this.body.touching.down && this.settings.displayedSettings === false && this.gameManager.doubleFireUpgrade === false)
            {
                this.setVelocityY(-120);
            }
        }
    }
    
    defenceParticles()
    {
        if(this.flip === false)
        {
            this.orbDestory.emitParticleAt(this.x + 6, this.y);
        }
        else
        {
            this.orbDestory.emitParticleAt(this.x - 6, this.y);
        }
    }
    
    checkBlock(time)
    {
        const inputActive = this.gameActionActive("block") && this.settings.displayedSettings === false;
        const passedCooldown = time > this.lastPlayerBlock + this.blockRate;

        if(inputActive && !this.blockInputHeld && (passedCooldown || this.succesfulBlock))
        {
            this.play("block", false);
            this.blockInputHeld = true;

            if(this.succesfulBlock)
            {
                this.lastPlayerBlock = 0;
                this.succesfulBlock = false;
            }
            else
            {
                this.lastPlayerBlock = time;
            }
        }
        else if(!inputActive && this.blockInputHeld)
        {
            this.blockInputHeld = false;

            if(this.succesfulBlock)
            {
                this.succesfulBlock = false;
            }
        }
        
        let xOffset;
        
        if(this.anims.isPlaying && this.anims.currentAnim.key === "block" && this.anims.currentFrame.index === 1)
        {
            this.block = true;
            this.setSize(8, 16);
            if(this.flip === false)
            {
                xOffset = 6;
            }
            else
            {
                xOffset = 3;
            }
            
            this.body.setOffset(xOffset, 0);
        }
        else
        {
            this.block = false;
            this.setSize(6, 16);
            if(this.flip === false)
            {
                xOffset = 3;
            }
            else
            {
                xOffset = 8;
            }
            this.body.setOffset(xOffset, 0);
        }
    }

    checkFlip(pointer)
    {
        if(pointer.worldX < this.getCenter().x)
        {
            this.setFlipX(true);
            this.flip = true;
        }
        else
        {
            this.setFlipX(false);
            this.flip = false;
        }
    }

    updateAimAngle(pointer)
    {
        if(this.flip === false)
        {
            this.aimAngle = Phaser.Math.Angle.Between
            (
                this.x + (this.width / 2) + (this.width / 16),
                this.y - (this.height / 32) - (this.height / 16),
                pointer.worldX,
                pointer.worldY
            );
        }
        else
        {
            this.aimAngle = Phaser.Math.Angle.Between
            (
                this.x - (this.width / 2) - (this.width / 16),
                this.y - (this.height / 32) - (this.height / 16),
                pointer.worldX,
                pointer.worldY
            );
        }
    }
    
    activateDoubleFire()
    {
        this.doubleFire = true;
        
        if(this.doubleFire === true)
        {
            this.fireRate = 325;
            this.scene.anims.get("pump").frameRate = 12;
        }
        
        if(this.doubleFireTimer)
        {
            this.doubleFireTimer.remove();
        }
        
        this.doubleFireTimer = this.scene.time.delayedCall(this.doubleFireDuration, () => 
        {
            this.doubleFire = false;
            this.fireRate = this.baseFireRate;
            this.scene.anims.get("pump").frameRate = 6;
        });
    }
    
    buddha()
    {
        this.health = Number.MAX_SAFE_INTEGER;
    }
}

