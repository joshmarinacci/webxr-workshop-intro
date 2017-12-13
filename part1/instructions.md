# Part 1: setting up WebXR with A-Frame

In part 1 of this workshop you will modify a standard A-Frame
scene to make it work in Augmented Reality.

## View an existing scene

Open this web page on your computer:

[https://webxr-workshop-test1.glitch.me/](https://webxr-workshop-test1.glitch.me/)

You will see a simple 3D scene containing a cube and a plane. 

Now open this webpage in a new tab to see the source. (you'll want to flip between the code and these instructions).

[https://glitch.com/edit/#!/webxr-workshop-test1?path=start.html](https://glitch.com/edit/#!/webxr-workshop-test1?path=start.html)


## Create initial scene

Edit the [glitch page](https://glitch.com/edit/#!/webxr-workshop-test1?path=start.html:4:7) directly. 
As soon as you try to modify the page Glitch will create a remix (fork) giving you your own copy to go through the workshop.

You should also have the [XRViewer](https://itunes.apple.com/us/app/webxr-viewer/id1295998056?ls=1&mt=8) iOS app 
or [WebAROnARCore](https://github.com/google-ar/WebARonARCore) Android app  
installed on your mobile device.  You could also edit everything locally by checking out this repo,
but I highly suggest you use glitch because you will
later need your content hosted on an https compatible webserver, otherwise the mobile apps will have problems.
 

Open the existing start.html file:

``` html
<html>
<head>
    <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
</head>
<body>
<a-scene>
    <a-box position="-1 0.5 -1" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
    <a-sky color="#ECECEC"></a-sky>
</a-scene>
</body>
</html>
```

After you make the changes press the 'show' button to see your application running.
Load this page in the viewer app on your mobile device.  You should see a
scene containing a box and a plane, with a nice background, just as you do on the desktop.  

## A short introduction to a-frame

Let's walk through the code. The above is a webpage which loads version 0.7.0 of 
the A-Frame library from aframe.io.  A-Frame uses special non-HTML elements that 
begin with `a-`, such as `a-scene` and `a-box`.  Each element creates something in the
scene. `a-box` creates a cube. `a-sky` creates the colored background. The color 
attribute accepts any valid css color such as `#ffffff` or `white` for white.

Elements have attributes called components. All objects have a position and 
rotation component. Some have components specific to that object. For example,
`a-plane` creates a plane with a width and height of 4. By default planes are 
vertically oriented. To make it horizontal the `rotation` attribute 
rotates the plane around the `x` axis by `-90` degrees.  

While elements have default components specified by the library, you can create and
add your own components which define new appearance or behavior. We will use
some custom components later on in this workshop.



## Add WebXR and Remove the Sky  

WebXR is a new (experimental) spec for Augmented Reality. We have created a special 
patch to A-Frame to support it.  Add the patch by replacing the `script` tag at the top
of your file with these: 

```html
    <script>window.debug = true;</script>
    <script src="https://rawgit.com/mozilla/aframe-xr/master/vendor/aframe-v0.7.1.js"></script>
    <script src="https://rawgit.com/mozilla/aframe-xr/master/dist/aframe-xr.js"></script>
```

Note that the patch will not work without the `window.debug` line placed *before* the 
code imports. This lets `aframe-xr.js` patch certain parts of A-Frame to enable WebXR. 
Eventually WebXR will be integrated directly into AFrame and these patches will no longer
be needed.

Since we want the camera view of reality to be visible, __remove the sky and 
plane elements from the scene__. This leaves only the cube.

## anchoring the cube

Typically in AR scenes we want some object to be anchored to the real world. Detecting 
the real world requires time and user interaction to pick where the anchor should be.
This is implemented by the hit-test component, which asks the user to tap where the
anchor should go.  

Import the `hit-test` component by including this script at the top (but after the other scripts).
Depending on where you are building this page, you may need to change the path to `hit-test.js`.

```html
    <script src="../resources/hit-test.js"></script>
```

Apply the `hit-test` component to the scene by changing `a-scene` to look like this:

```html
<a-scene hit-test>
```

At the bottom of the page, just before the `</body>` closing tag, add this inline
javascript:

```html
<script>
    const scene = AFRAME.scenes[0]
    
    scene.addEventListener('newAnchoredEntity', (e) => {
        const floor = e.detail
        const obj = document.querySelector('#obj')
        scene.removeChild(obj)
        floor.appendChild(obj)
        scene.appendChild(floor)
        scene.removeAttribute('hit-test')
    });
</script>
```

This adds an event handler to the scene. The hit-test component will fire
a `newAnchoredEntity` event once the user has chosen an anchor spot. This event handler
will listen for the event, remove the box from the scene, then insert the box
again as a child of the floor object, then add the floor to the scene. The code also
removes the hit-test component so that this anchor choosing procedure is only performed
once at application start.  

Note that this code uses the CSS selector `#obj` to find the box.  This selector
returns an element in the page with an id of obj.  Add `id="obj"` to the `a-box` so
that the code can find it.

Now the box should move to the floor once the user chooses an anchor.  This does work, but it has
a flaw. The box jumps from its default position to the floor, which is visually confusing.
To fix this, make the box start off invisible by adding the
attribute `visible="false"`.  Then make the box visible once the anchor has been found
in the event handler with `obj.setAttribute('visible','true')`.  The final
box code looks like this:

```html
    <a-box id="obj"
           position="0 0 0"
           rotation="0 0 0"
           width="0.2"
           height="0.2"
           depth="0.2"
           color="red"
           visible="false"
           ></a-box>
```

I reformatted the HTML to make it easier to see each component.  I also changed
the color of the box to red and changed the width, height, and depth to be smaller, and
reset the rotation to 0 0 0. I also moved the position to 0,0,0 since it will be inside 
of the floor object, thus making it look like it is really on the floor.

The final event handler looks like this:

```html
<script>
    const scene = AFRAME.scenes[0]
    
    scene.addEventListener('newAnchoredEntity', (e) => {
        const floor = e.detail
        const obj = document.querySelector('#obj')
        obj.setAttribute('visible','true')
        scene.removeChild(obj)
        floor.appendChild(obj)
        scene.appendChild(floor)
        scene.removeAttribute('hit-test')
    });
</script>
```

## adding custom lights

There is one final detail. To make the scene look nicer we can add some light
with shadows. First add an ambient light to brighten up the scene, then
add a directional light to cast a shadow

```html
    <a-light type="ambient" color="#445451"></a-light>
    <a-entity 
       light="type:directional; castShadow:true; intensity:0.4" 
       position="-10 10 4"
       ></a-entity>
```

Now the cube will be brighter on the left side than the right.

When you are done you can continue to [part 2](../part2/instructions.md)