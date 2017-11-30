AFRAME.registerComponent('proximity', {
    schema:{
        target: {type:'selector'},
        distance: {type:'number'}
    },
    init: function() {
        this.inside = false
    },
    tick: function() {
        // convert target to world
        const targetPos = this.data.target.object3D.getWorldPosition()
        // convert world to local
        const localPos = this.el.object3D.parent.worldToLocal(targetPos)
        //calculate the distance
        const dist = localPos.distanceTo(this.el.object3D.position);
        //fire events when going inside or outside the radius
        if(dist < this.data.distance && !this.inside) {
            this.inside = true
            this.el.emit('enter',{},false)
        }
        if(dist > this.data.distance && this.inside) {
            this.inside = false
            this.el.emit('exit',{},false)
        }
    }
})
