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
        if(!player.block)
        {
            player.health -= 10;
        }
        else
        {
            scene.sound.play('block');
            player.defenceParticles();
            player.activateDoubleFire();
            player.play("block", false);
            if(scene.gameManager.allowScreenShake)
            {
                scene.cameras.main.shake(100, 0.005);
            }

        }
        orb.destroy();
    });

    scene.eyes = scene.physics.add.group
    ({
        immovable: true,
        allowGravity: false
    });

    let eyeId = 0;
    eyePositions.forEach(pos =>
    {
        eyeId += 1;
        const eyeInstance = new eye(scene, pos.x, pos.y, scene.eyeOrbHolder);
        eyeInstance.id = eyeId;
        scene.eyes.add(eyeInstance);
    });

    if(scene.ground)
    {
        scene.physics.add.collider(scene.cultKnifes, scene.ground);
    }

    scene.physics.add.overlap(scene.eyes, scene.playerBulletsHolder, (eye, bullet) =>
    {
        eye.health -= bullet.damage;
        bullet.destroy();
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
        scene.sound.play('eyeorb');
    }
}
  
class eye extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, eyeOrbHolder)
    {
        super(scene, x, y, 'eye');

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

        this.explode = this.scene.add.particles
        (
            0, 0, 
            'eyechunk',
            {
                angle: { min: 0, max: 360 }, 
                speed: { min: 100, max: 200 },
                gravityY: 500,
                lifespan: { min: 750, max: 750 },
                quantity: 10,
                scale: { start: 0.5, end: 0 },
                alpha: { start: 1, end: 0 },
                blendMode: 'NORMAL',
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
            this.scene.sound.play('hurt');
            if(this.scene.gameManager.allowScreenShake)
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
        const orb = this.orbs.get(this.x, this.y, 'cultorb');

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
        this.explode.emitParticleAt(this.x, this.y);
        const gameManager = this.scene.gameManager;
        if(gameManager.doubleFireUpgrade && this.scene.player.active)
        {
            if(this.scene.player && this.scene.player.active)
            {
                this.scene.player.activateDoubleFire();
            } 
        }
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


