class cultOrb extends Phaser.Physics.Arcade.Sprite
  {
    constructor(scene, x, y)
    {
      super(scene, x, y, "cultorb");
      this.speed = 200;
      this.setActive(false);
      this.setVisible(false);
    }

    fire(x, y, angle)
    {
      this.body.reset(x, y);
      this.setActive(true);
      this.setVisible(true);
      this.setRotation(angle);
      this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
      this.body.allowGravity = false;
      this.originX = x;
    }

    preUpdate(time, delta)
    {
      super.preUpdate(time, delta);

      if(this.y < 0 || this.y > this.scene.sys.game.config.height || this.x > this.originX + 1000 || this.x < this.originX - 1000)
      {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
      }
    }

    collided()
    {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }

function cultCreator(scene, cultPositions, gameManager)
  {
        scene.cultOrbHolder = scene.physics.add.group
        ({
          classType: cultOrb,
          maxSize: 30,
          runChildUpdate: true
        });
        
        scene.physics.add.overlap(scene.player, scene.cultOrbHolder, (player, orb) =>
        {
            orb.destroy();
            
            if(!player.block)
            {
                player.health -= 10;
            }
            else
            {
                scene.sound.play("block");
                player.defenceParticles();
                player.activateDoubleFire();
                player.play("block", false);
                player.succesfulBlock = true;
                player.lastPlayerBlock = 0;
                if(scene.gameManager.allowScreenShakeOnBlock)
                {
                    scene.cameras.main.shake(100, 0.005);
                }
            }
        });
        
        scene.cults = scene.physics.add.group();
        
        let cultId = 0;
        cultPositions.forEach(pos => 
        {
            cultId += 1;
            const cultInstance = new cult(scene, pos.x, pos.y, scene.player, scene.cultOrbHolder);
            cultInstance.id = cultId;
            scene.cults.add(cultInstance);
        });

        scene.physics.add.collider(scene.cults, scene.cults);
        scene.physics.add.overlap(scene.cults, scene.playerBulletsHolder, (cult, bullet) =>
        {
          bullet.destroy();
          cult.health -= bullet.damage;
          if(!cult.anims.isPlaying)
          {
            cult.play("cultOrbHurt", false);
          }
          cult.bloodEmitter.setQuantity(4);
          cult.bloodEmitter.emitParticleAt(cult.x, cult.y);
        });
        
        scene.time.addEvent
        ({
            delay: 1500,
            callback: () => cultSynchro(scene, scene.cults),
            callbackScope: this,
            loop: true
        });
  }

function cultSeparation(cults, player)
  {
    let cultsWithDistancesRight = [];
    let cultsWithDistancesLeft = [];

    cults.children.entries.forEach(cult =>
    {
      let distance = Phaser.Math.Distance.Between(player.x, player.y, cult.x, cult.y);

      if(player.x < cult.x)
      {
        cultsWithDistancesRight.push
        ({
            cult: cult,
            distance: distance
        });
      }
      else
      {
        cultsWithDistancesLeft.push
        ({
            cult: cult,
            distance: distance
        });
      }
    });

    cultsWithDistancesRight.sort((a, b) =>
    {
      return a.distance - b.distance;
    });

    cultsWithDistancesLeft.sort((a, b) =>
    {
      return a.distance - b.distance;
    });

    let newDistanceAdderRight = 0;
    cultsWithDistancesRight.forEach(item =>
    {
      item.cult.distancePref = item.cult.initalDistancePref + newDistanceAdderRight;
      newDistanceAdderRight += 16;
    });

    let newDistanceAdderLeft = 0;
    cultsWithDistancesLeft.forEach(item =>
    {
      item.cult.distancePref = item.cult.initalDistancePref + newDistanceAdderLeft;
      newDistanceAdderLeft += 16;
    });
  }
  
  function cultSynchro(scene, cults)
  {
        let cultSoundPlayed = false;
        
        cults.children.entries.forEach(cult => 
        {
            if(cult.alert && cult.visible) 
            {
                let cultSoundUpdate = (anim, frame) => 
                {
                    if(cult.anims.isPlaying && cult.anims.currentAnim.key === "orbThrow" && frame.index === 2 && !cultSoundPlayed)
                    {
                        cultSoundPlayed = true;
                        scene.sound.play("orbthrow");
                    }

                    if(cultSoundPlayed)
                    {
                        cult.off(Phaser.Animations.Events.ANIMATION_UPDATE, cultSoundUpdate);
                    }
                };

                cult.on(Phaser.Animations.Events.ANIMATION_UPDATE, cultSoundUpdate);
                cult.shoot();
            }
        });
    }

  class cult extends Phaser.Physics.Arcade.Sprite
  {
    constructor(scene, x, y, player, cultOrbHolder)
    {
        super(scene, x, y, "cult");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(true);
        this.setVisible(true);
        this.health = 15;
        this.initialHealth = this.health;
        this.setBounce(0);
        this.player = player;
        this.alert = false;
        this.orbs = cultOrbHolder;
        this.distancePref = 100;
        this.initalDistancePref = this.distancePref;
        this.distanceOffset = 1;
        this.flip = false;
        this.scene = scene;
        this.shotOnce = false;
      
        if(!scene.anims.get("orbThrow"))
        {
            scene.anims.create
            ({
              key: "orbThrow",
              frames: [
                     { key: "cult", frame: 1 },
                     { key: "cult", frame: 2 },
                     { key: "cult", frame: 1 },
                     { key: "cult", frame: 0 }
                 ],
              frameRate: 6,
              repeat: 0
            });
        }
        
        if(!scene.anims.get("cultOrbHurt"))
        {
            scene.anims.create
            ({
                key: "cultOrbHurt",
                frames: [
                     { key: "cult", frame: 3 },
                     { key: "cult", frame: 0 }
                 ],
                frameRate: 2,
                repeat: 0
            });
        }
        
        this.bloodEmitter = this.scene.add.particles
        (
            0, 0, 
            "blood",
            {
                angle: { min: 0, max: 360 },
                speed: { min: 100, max: 200 },
                gravityY: 500,
                lifespan: { min: 750, max: 750 },
                quantity: 100,
                scale: { start: 0.5, end: 0 },
                alpha: { start: 1, end: 0 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );


        this.orbFrameUpdate = (anim, frame) => 
        {
            if(this.anims.isPlaying && this.anims.currentAnim.key === "orbThrow" && frame.index === 2 && !this.shotOnce)
            {
                this.shotOnce = true;
                const orb = this.orbs.get(this.x, this.y, "cultorb");

                if(orb)
                {
                    if(this.flip === false)
                    {
                        orb.fire(this.x - (this.width / 2), this.y, Phaser.Math.DegToRad(180));
                    }
                    else
                    {
                        orb.fire(this.x + (this.width / 2), this.y, Phaser.Math.DegToRad(0));
                    }
                }
            }
            else if (this.anims.isPlaying && this.anims.currentAnim.key === "orbThrow" && frame.index !== 2 && this.shotOnce) 
            {
                 this.shotOnce = false;
            }
        };   
        
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.orbFrameUpdate, this);

        this.on(Phaser.GameObjects.Events.DESTROY, () => 
        {
            this.off(Phaser.Animations.Events.ANIMATION_UPDATE, this.orbFrameUpdate, this);
        }, this);
    }

    preUpdate(time, delta)
    {
      super.preUpdate(time, delta);

        if(this.health < 1)
        {
            this.scene.sound.play("hurt");
            if(this.scene.gameManager.allowScreenShakeOnKill)
            {
                this.scene.cameras.main.shake(50, 0.004);
            }
            this.kill();
        }
        else
        {
            this.checkInRange();

            if(this.alert === true || this.health < this.initialHealth)
            {
                if(this.player.x < this.x && Math.abs(this.player.x - this.x) >= this.distancePref + this.distanceOffset)
                {
                    this.setVelocityX(-110);
                }
                else if(this.player.x > this.x && Math.abs(this.player.x - this.x) >= this.distancePref + this.distanceOffset)
                {
                    this.setVelocityX(110);
                }
                else if(Math.abs(this.player.x - this.x) >= this.distancePref - this.distanceOffset && Math.abs(this.player.x - this.x) <= this.distancePref + this.distanceOffset)
                {
                    this.setVelocityX(0);
                }
                else
                {
                    if (this.player.x < this.x)
                    {
                        this.setVelocityX(110);
                    }
                    else
                    {
                        this.setVelocityX(-110);
                    }
                }

                if(this.x > this.player.x)
                {
                    this.flip = false;
                    this.setFlipX(false);
                }
                else
                {
                    this.flip = true;
                    this.setFlipX(true);
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
    
    shoot()
    {
        this.play("orbThrow", false); 
        
    }
    
    buddha()
    {
        this.health = Number.MAX_SAFE_INTEGER;
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
        gameManager.score += 35;
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
  
function activateCultGroups(scene, cultGroup)
{
    scene.cults.children.entries.forEach(cult =>
    {
        if(cult.alert)
        {
            if(cultGroup.has(cult.id))
            {
                cultGroup.forEach(cultId => 
                {
                    const cultInstance = scene.cults.children.entries.find(cult => cult.id === cultId);

                    if(cultInstance && !cultInstance.alet) 
                    {
                        cultInstance.alert = true;
                    }
                });
            }
        }
    });
}
