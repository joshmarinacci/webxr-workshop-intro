# Part 2: Interaction

In this section we will add some interactivity to the scene.

Start with the webpage you created in Part 1, or use the provided page in `part2/start.html`.

# Load GLTF Model

In part 1 we used a cube as the central object of the application. In real world programs you
probably want a more detailed model created in a 3D modeling program such as Blender. In
this step we will use such a model.

GLTF stands for ??. It is a cross-platform and cross-vendor format for sharing 3D models. GLTF
files are essentially JSON files with a set of additional resources for textures, animations,
and 3D geometry. We have provided robot head and body models in the `resources` directory file.
(it's in the `assets` list in the Glitch)
A GLB file is the binary form of GLTF, which is optimized for loading over the internet.

To load a GLTF file we first need a place to load it into. Replace the `a-box` element from your
page with `a-entity` and set the id to `head`, the position to `0 0 0`, and visibility turned off.

```html
    <a-entity id="head"
              position="0 0 0"
              visible="false"
    ></a-entity>
```

You can think of `a-entity` as the generic version of a box. It is simply an object in 3D space which
can have any geometry, appearance, or behavior. By itself an entity has no appearance, so let's
give it one. Load the model by adding a `gltf-model` component which sets the src for a model
to load. In your glitch select the *assets* section, and click on the `Bot_Head_Mesh.glb` file. Glitch
will give you a long URL to the glitch.com CDN. This is the URL for the model that you should paste in below.
 

```html
    <a-entity id="head"
              gltf-model="src:url(*** your long glitch url here ***)"
              position="0 0 0"
              visible="false"
     ></a-entity>
```

Since we want both the head and body of the robot, create a robot entity to hold both parts. In the code below
I'm loading the bot parts from a glitch instead of the local repo.  I also adjusted the vertical position
of the head so it appears above the body, and the body floats above the ground.

```html
      <a-entity id="robot" 
                visible="false"
                >
        <a-entity id="head"
                  position="0 0.6 0.1"
                  scale="2 2 2"
                  gltf-model="src:url(https://cdn.glitch.com/a56922f6-eed8-463f-83ab-cbfbe3b35da3%2FBot_Head_Mesh.glb?1512588906577)"
                  ></a-entity>      
        
        <a-entity id="body"
                  position="0 0.3 0"
                  scale="2 2 2"
                  gltf-model="src:url(https://cdn.glitch.com/a56922f6-eed8-463f-83ab-cbfbe3b35da3%2FBot_Body_Mesh.glb?1512591235720)"
                  ></a-entity>      
     </a-entity>
```

Also remember to update the event handler to look for `#robot` instead of `#obj`. You should 
now be able to load this page and see the robot's head and body in front of you.

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

Now we can use this new `follow` component by adding one more line to the head definition.

```html
    <a-entity id="head"
              follow="target:#mycamera"
              ....
    ></a-entity>
```


Since the component needs a target we must manually define a camera instead of using
the default one created by a-frame. (is there a way to avoid this?)

```html
    <a-entity id="mycamera"
              camera="userHeight:1.6"
              look-controls wasd-controls></a-entity>
```

# Particle Effect

Finally, lets make the robot launch a fountain of stars when you get close to it. To do
this we need a particle effect. Add the following line to the head of your page, after
the last script tag. This will import a particle system.

```html
    <script src="https://unpkg.com/aframe-particle-system-component@1.0.11/dist/aframe-particle-system-component.min.js"></script>
```

Now create a new particle system entity inside the robot entity like this:

```html
      <a-entity id="robot" 
        ....
        <a-entity
                id="stars"
                position="0 0.7 0"
                particle-system="maxAge:1; velocityValue: 0 10 0; duration: 0; enabled:false;"
        ></a-entity>
      </a-entity>
```

This will position the particle system at `0 0.7 0`, which is the top of the robot head. 
Feel free to tweak the parameters to adjust the effect to your liking. The
particle component docs have [lots of options](https://github.com/IdeaSpaceVR/aframe-particle-system-component).

Now we will use the `proximity` component to detect when the camera is close to the 
robot head. This component fires an event when a target object enters or leaves the range
of the main object. Import the provided `proximity.js` in the head of your page:

```html
    <script src="../resources/proximity.js"></script>
``` 

Add the `proximity` component to the robot entity.

```html
      <a-entity id="robot" 
                visible="false"
                proximity="target:#mycamera; distance:1.5"
                >
          ....
```

Again the target is the `#mycamera`. Also note the distance is set to `1.5`. You can adjust this value
to make the user have to get closer or further away to trigger the effect.

In a script tag at the bottom of your page, add two listeners for the `enter` and `exit` events. These
will turn the particle effect on and off.

```javascript
    const robot = document.querySelector('#robot');
    const stars = document.querySelector('#stars');
    robot.addEventListener('enter',()=> stars.setAttribute("particle-system","enabled",true));
    robot.addEventListener('exit', ()=> stars.setAttribute("particle-system","enabled",false));
```


Now if you run the program the robot head will turn to follow you and shoot stars when you get too close.


After you are done with this section, you may continue to [section 3](../part3/instructions.md).

