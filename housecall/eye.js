function eyeCreator(scene, eyePositions, gameManager)
{
    scene.eyeOrbHolder = scene.physics.add.group
    ({
        classType: cultOrb,
        maxSize: 30,
        runChildUpdate: true
    });
    
    scene.physics.add.overlap(scene.player, scene.eyeOrbHolder, (player, orb) =>
    {
        orb.destroy();
        
        if(!player.block)
        {
            if(scene.gameManager.alwaysBlock)
            {
                scene.sound.play("block");
                player.defenceParticles();
                player.activateDoubleFire();
                player.play("block", false);
                player.succesfulBlock = true;
                player.lastPlayerBlock = 0;
                if(scene.gameManager.screenShake)
                {
                    scene.cameras.main.shake(100, 0.005);
                }
            }
            else
            {
                player.health -= 10;
                scene.sound.play("playerhurt");
            }
        }
        else
        {
            scene.sound.play("block");
            player.defenceParticles();
            player.activateDoubleFire();
            player.play("block", false);
            player.succesfulBlock = true;
            player.lastPlayerBlock = 0;
            if(scene.gameManager.screenShake)
            {
                scene.cameras.main.shake(100, 0.005);
            }
        }
    });

    scene.eyes = scene.physics.add.group
    ({
        immovable: true,
        allowGravity: false
    });

    eyePositions.forEach(pos =>
    {
        const eyeInstance = new eye(scene, pos.x, pos.y, scene.eyeOrbHolder);
        scene.eyes.add(eyeInstance);
    });

    scene.physics.add.overlap(scene.eyes, scene.playerBulletsHolder, (eye, bullet) =>
    {
        if(!bullet.damagedList.includes(eye.id) && !bullet.penetrationsLeft >= 1)
        {
            bullet.damagedList.push(eye.id);
            bullet.destroy();
            eye.hitFrom = bullet.fromWhat;
            eye.health -= bullet.damage;
        }
        else
        {
            if(!bullet.damagedList.includes(eye.id))
            {
                bullet.damagedList.push(eye.id);
                bullet.penetrationsLeft -= 1;
                eye.hitFrom = bullet.fromWhat;
                eye.health -= bullet.damage;
                bullet.damage = bullet.damage * bullet.penetrationReduction;
            }
        }
        
    });

    scene.time.addEvent
    ({
        delay: 1500,
        callback: () => eyeSynchro(scene, scene.eyes),
        callbackScope: this,
        loop: true
    });
}
  
function eyeSeparation(eyes, player)
{
    let eyesWithDistancesRight = [];
    let eyesWithDistancesLeft = [];

    eyes.children.entries.forEach(eye =>
    {
        let distance = Phaser.Math.Distance.Between(player.x, player.y, eye.x, eye.y);

        if(player.x < eye.x)
        {
            eyesWithDistancesRight.push
            ({
                eye: eye,
                distance: distance
            });
        }
        else
        {
            eyesWithDistancesLeft.push
            ({
                eye: eye,
                distance: distance
            });
        }
    });

    eyesWithDistancesRight.sort((a, b) =>
    {
        return a.distance - b.distance;
    });

    eyesWithDistancesLeft.sort((a, b) =>
    {
        return a.distance - b.distance;
    });

    let newDistanceAdderRight = 0;
    eyesWithDistancesRight.forEach(item =>
    {
        item.eye.distancePref = item.eye.initalDistancePref + newDistanceAdderRight;
        newDistanceAdderRight += 32;
    });

    let newDistanceAdderLeft = 0;
    eyesWithDistancesLeft.forEach(item =>
    {
        item.eye.distancePref = item.eye.initalDistancePref + newDistanceAdderLeft;
        newDistanceAdderLeft += 32;
    });
}
  
function eyeSynchro(scene, eyes)
{
    let anEyeAcvite = false;

    eyes.children.entries.forEach(eye => 
    {
        if(eye.alert && (eye.visible))
        {
            eye.shoot();

            if(!anEyeAcvite)
            {
                anEyeAcvite = !anEyeAcvite;
            }
        }
    });

    if(anEyeAcvite)
    {
        scene.sound.play("eyeorb");
    }
}
  
class eye extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, eyeOrbHolder)
    {
        super(scene, x, y, "eye");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(true);
        this.setVisible(true);
        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.allowGravity = false;
        this.health = 4;
        this.initialHealth = this.health;
        this.alert = false;
        this.scene = scene;
        this.player = this.scene.player;
        this.distancePref = 100;
        this.initalDistancePref = this.distancePref;
        this.distanceOffset = 1;
        this.orbs = eyeOrbHolder;
        this.id = Phaser.Utils.String.UUID();
        //this.gameManager = game.scene.getScene("GameManager");
        
        /*this.bloodEmitter = this.scene.add.particles
        (
            0, 0, 
            "blood",
            {
                angle: { min: 0, max: 360 }, 
                speed: { min: 50, max: 200 },
                gravityY: 500,
                lifespan: { min: 500, max: 1000 },
                quantity: 15,
                scale: { start: 1, end: 1 },
                alpha: { start: 0.75, end: 0 },
                rotate: { min: -180, max: 180 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );*/
    
        this.explode = this.scene.add.particles
        (
            0, 0, 
            "eyechunk",
            {
                angle: { min: 0, max: 360 }, 
                speed: { min: 100, max: 200 },
                gravityY: 500,
                lifespan: { min: 1000, max: 1000 },
                quantity: 10,
                scale: { start: 0.5, end: 0 },
                alpha: { start: 1, end: 0 },
                blendMode: "NORMAL",
                frequency: -1
            }
        );

        if(scene.ground)
        {
            scene.physics.add.collider(this, scene.ground);
        }
    }
    
    preUpdate(time, delta)
    {
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
                }
                else
                {
                    this.flip = true;
                }
            }
        }
    }
    
    shoot()
    {
        const orb = this.orbs.get(this.x, this.y, "cultorb");

        if(orb)
        {
            orb.fire(this.x, this.y, Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y));
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
        /*if(this.gameManager.bloodType === "Type-B")
        {
            this.bloodEmitter.emitParticleAt(this.x, this.y);
        }*/
        this.explode.emitParticleAt(this.x, this.y);
        const gameManager = this.scene.gameManager;
        if(gameManager.doubleFireUpgrade && this.scene.player.active)
        {
            if(this.scene.player && this.scene.player.active)
            {
                this.scene.player.activateDoubleFire();
            } 
        }
        
        if(!gameManager.cheats)
        {
            let currentScore = 20;
            
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
  
function activateEyeGroups(scene, eyeGroup)
{
    scene.eyes.children.entries.forEach(eye =>
    {
        if(eye.alert)
        {
            if(eyeGroup.has(eye.id))
            {
                eyeGroup.forEach(eyeId => 
                {
                    const eyeInstance = scene.eyes.children.entries.find(eye => eye.id === eyeId);

                    if(eyeInstance && !eyeInstance.alet) 
                    {
                        eyeInstance.alert = true;
                    }
                });
            }
        }
    });
}


