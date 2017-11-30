AFRAME.registerComponent('follow', {
    schema:{
        target: {type:'selector'}
    },
    tick: function() {
        // convert target to world
        var targetPos = this.data.target.object3D.getWorldPosition()
        // convert world to local
        var localPos = this.el.object3D.parent.worldToLocal(targetPos)
        // look at the target
        this.el.object3D.lookAt(localPos)
    }
})
