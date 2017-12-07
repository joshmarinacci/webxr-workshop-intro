# Part 2: Interaction

In this section we will add some interactivity to the scene.

Start with the webpage you created in Part 1, or use the provided page in `part2/start.html`.

# Load GLTF Model

In part 1 we used a cube as the central object of the application. In real world programs you
probably want a more detailed model created in a 3D modeling program such as Blender. In
this step we will use such a model.

GLTF stands for ??. It is a cross-platform and cross-vendor format for sharing 3D models. GLTF
files are essentially JSON files with a set of additional resources for textures, animations,
and 3D geometry. We have provided a robot head model in the `resources/Bot_Head_Mesh.glb` file.
A GLB file is the binary form of GLTF, which is optimized for loading over the internet.

To load a GLTF file we first need a place to load it into. Replace the `a-box` element from your
page with `a-entity` and set the id to `head`, the position to `0 1 -2`, and visibilty off.

```html
    <a-entity id="head"
              position="0 0 0"
              visible="false"
    ></a-entity>
```

You can think of a-entity as the generic version of a box. It is simply an object in 3D space which
can have any geometry, appearance, or behavior. By itself an entity has no appearance, so let's
give it one. Load the model by adding a `gltf-model` component which sets the src 
to `url(../resources/Bot_Head_mesh.glb)`

```html
    <a-entity id="head"
              gltf-model="src:url(../resources/Bot_Head_Mesh.glb)"
              position="0 0 0"
              visible="false"
     ></a-entity>
```

Also remember to update the event handler to look for `#head` instead of `#obj`. You should 
now be able to load this page and see the robot head in front of you.

# Auto Follow

Next we will make the robot turn to face you as you walk around it. This is pretty simple to
do. Underneath the hood, A-Frame is actually implemented with ThreeJS, which has great APIs
for working with 3D geometry.  Let's start by creating our own component called 'follow'.
Open up a new script tag with this content. Note that this should be in your page
after a-frame is loaded but before the a-scene is defined.

```html
<script>
AFRAME.registerComponent('follow', {
    schema:{
        target: {type:'selector'}
    },
    tick: function() {
        // do some stuff
    }
})
</script>
```

The code above registers a new component called `follow` and says it will have a single attribute
called `target`.  The `tick` function will be called every on every frame. This is where we
will put the logic which rotates the object to match the camera. Put the following code inside
the tick function.

```javascript
    // convert target to world
    var targetPos = this.data.target.object3D.getWorldPosition()
    // convert world to local
    var localPos = this.el.object3D.parent.worldToLocal(targetPos)
    // look at the target
    this.el.object3D.lookAt(localPos)
```

This code gets the position of the target object (the thing the main object will follow),
converts between coordinate systems, then points the main object at the target. Since
this function will be called on every frame the object will always turn to follow
the target.

Now we can use this new `follow` component by adding one more line to the entity definition.

```html
    <a-entity id="head"
              gltf-model="src:url(../resources/Bot_Head_Mesh.glb)"
              position="0 0 0"
              visible="false"
              follow="target:#mycamera"
    ></a-entity>
```


Since the component needs a target we must manually define a camera instead of using
the default one created by a-frame. (is there a way to avoid this?)

```html
    <a-entity id='mycamera'
              camera="userHeight:1.6"
              look-controls wasd-controls></a-entity>
```

# Particle Effect

Finally, lets make the robot launch a fountain of stars when you get close to it. To do
this we need a particle effect. Add the following line to the head of your page, after
the last script tag. This will import a particle system.

```html
    <script src="https://unpkg.com/aframe-particle-system-component@1.0.9/dist/aframe-particle-system-component.min.js"></script>
```

Now create a new particle system entity in the scene like this:

```html
<a-entity
            position="0 0 0"
            particle-system="maxAge:1; velocityValue: 0 10 0; duration: 0;"
    ></a-entity>
```

This will position the particle system at `0 0 0`, the same place as the
robot head. Feel free to tweak the parameters to adjust the effect to your liking. The
particle component docs have lots of options. *link*

Now we will use the `proximity` component to detect when the camera is close to the 
robot head. This component fires an event when a target object enters or leaves the range
of the main object. Import the provided `proximity.js` in the head of your page:

```html
    <script src="../resources/proximity.js"></script>
``` 

Add the `proximity` component to the robot head.

```html
    <a-entity id='head'
              gltf-model="src:url(../resources/Bot_Head_Mesh.glb)"
              position="0 1 -2"
              follow="target:#mycamera"
              proximity="target:#mycamera; distance:2"
              visible="false"
    ></a-entity>
```

Again the target is the `#mycamera`. Also note the distance is set to 2. You can adjust this value
to make the user have to get closer or further away to trigger the effect.

In a script tag at the bottom of your page, add two listeners for the `enter` and `exit` events. These
will turn the particle effect on and off. *this code will be cleaner when the patches are accepted*

```javascript
    function stopParticles() {
        const particleEntity = document.querySelector('[particle-system]');
        particleEntity.components['particle-system'].particleGroup.emitters[0].disable();
    }
    function startParticles() {
        const particleEntity = document.querySelector('[particle-system]');
        particleEntity.components['particle-system'].particleGroup.emitters[0].enable();
    }

    const head = document.querySelector('#head');
    head.addEventListener('enter',()=> startParticles());
    head.addEventListener('exit',()=> stopParticles());
    document.querySelector('a-scene').addEventListener('loaded', () =>  stopParticles())
```


Now if you run the program the robot head will turn to follow you and shoot stars when you get to close.

