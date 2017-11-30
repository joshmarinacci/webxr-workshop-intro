/*

 */
AFRAME.registerComponent('mouse-click', {
    init: function () {
        if (!this.el.isScene) {
            console.warn('mouse click component can only be applied to <a-scene>');
            return;
        }
        this.mouse = {};
        this.scene = this.el.sceneEl;
        this.scene.addEventListener('mousedown', (event) => {
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
            this.el.emit('mouse-click',this.mouse);
        })
    }
})