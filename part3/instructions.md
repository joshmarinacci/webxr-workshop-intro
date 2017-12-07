# Part 3: Phun with Physics

In this section we will add a physics engine to let the user add falling blocks to the scene.

One of the most fun things you can do in virtual environments is add objects
which fall down and behave like objects in the real world. We can do this with
a physics engine.

To start, let's import the [physics component](https://github.com/donmccurdy/aframe-physics-system) created 
by Don McCurdy which is a wrapper around [cannon.js](http://schteppe.github.io/cannon.js/), a popular 
open source physics engine. We will also need a component to detect mouse clicks and tap events.

```html
    <script src="//cdn.rawgit.com/donmccurdy/aframe-physics-system/v2.1.0/dist/aframe-physics-system.min.js"></script>
    <script src="../resources/tap-event.js"></script>
```

Now turn on physics for the whole scene with the following settings (and also add the tap-event component):

```html
<a-scene hit-test tap-event physics="restitution:5; friction: 1">
```

We want to create a new block every time the user taps on the screen. To do this
we need listen for the `tap` events on the scene. Add this to the Javascript
at the bottom of the page:

```html
  function handleTap(e) {
        const el = document.createElement('a-entity');
        el.setAttribute('geometry', {
            primitive: 'box',
            width: 0.2,
            height: 0.1,
            depth: 0.2
        });
        el.setAttribute('material', {
            shader: 'standard',
            color: '#ffcc00'
        });
        el.setAttribute('position', {
            x:e.detail.x,
            y:e.detail.y+1.5,
            z:0
        });

        // delay adding dynamic-body
        // due to bug #72 in the physics engine: https://github.com/donmccurdy/aframe-physics-system/issues/72
        setTimeout(() => el.setAttribute('dynamic-body', ''))
        robot.appendChild(el)
    }
```

This code will create a new entity in the scene, give it a box geometry, a standard material, and
a position based on where the user clicked. Then it adds the block to the scene.  The final
step is to add the dynamic body component to the entity. Because of a bug we do this part
inside of a `setTimeout()`.

Also add a line to the end of the `newAnchoredEntity` handler to start listening for tap events only once the 
AR setup is done.

```javascript
    scene.addEventListener('newAnchoredEntity', (e) => {
        ...
        scene.addEventListener('tap',handleTap)
    });

```

The physics engine works by giving every object a mass, velocity, and acceleration. By default
a new object has a mass of 5 with no velocity or acceleration other than gravity. On every
frame the engine will update the position of every object. For performance reasons the physics
will only be calculated on objects with the `dynamic-body` component, which is why we add it to
the newly created block.

If you load this in your browser you'll notice that the blocks are created and immediately start to fall
down due to gravity. However, they continue falling right through the floor!  We need another object
on the floor for them to hit. Add a floor plane to the scene like this:

```html
    <a-entity id="robot" 
        ...
        <a-plane position="0 0 -2" rotation="-90 0 0" width="4" height="4" static-body></a-plane>
```

Note that the plane has the `static-body` component instead of `dynamic-body`. This is because
we don't want the plane itself to be subjected to gravity, or else it would fall down into
infinity also. The plane is just there for the blocks to have something to bounce off of.

Also add static-body to the robot head. Notice that I set shape to box. The physics engine can autodetect
the shape of boxes and spheres and other primitives, but for more complex objects, like the 3D modeled robot head,
we need to tell it what shape to use.

```html
        <a-entity id="head"        
                  static-body="shape:box;"
                  ...
        <a-entity id="body"
                  static-body="shape:box;"
                  ...
```

Now load the page again. You should be able to add blocks by tapping and they will fall on the 
floor.

Congratulations. You have successfully built a pretty complicated WebXR application.




