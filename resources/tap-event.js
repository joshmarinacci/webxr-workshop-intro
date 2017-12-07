AFRAME.registerComponent('tap-event', {
    init: function () {
        if (!this.el.isScene) {
            console.warn('tap-event component can only be applied to <a-scene>');
            return;
        }
        this.location = {};
        this.scene = this.el.sceneEl;
        this.scene.addEventListener('mousedown', (event) => {
            this.location.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.location.y = -( event.clientY / window.innerHeight ) * 2 + 1;
            this.el.emit('tap',this.location);
        })
        window.addEventListener('touchstart',(ev) => {
            if (!ev.touches || ev.touches.length === 0) {
                console.error('No touches on touch event', ev);
                return
            }
            this.location.x = ev.touches[0].clientX / window.innerWidth
            this.location.y = ev.touches[0].clientY / window.innerHeight
            this.el.emit('tap',this.location);
        })
    }
})