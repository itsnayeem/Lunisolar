/**
 * KineticJS JavaScript Library v3.9.0
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Mar 25 2012
 *
 * Copyright (C) 2011 - 2012 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic = {};
Kinetic.GlobalObject = {stages:[], idCounter:0, frame:{time:0, timeDiff:0, lastTime:0}, drag:{moving:!1, node:undefined, offset:{x:0, y:0}}, extend:function (a, b) {
    for (var c in b.prototype)b.prototype.hasOwnProperty(c) && a.prototype[c] === undefined && (a.prototype[c] = b.prototype[c])
}, _isaCanvasAnimating:function () {
    for (var a = 0; a < this.stages.length; a++) {
        var b = this.stages[a];
        if (b.isAnimating)return!0;
        for (var c = 0; c < b.children.length; c++) {
            var d = b.children[c];
            if (d.transitions.length > 0)return!0
        }
    }
    return this.frame.lastTime = 0, !1
}, _endTransition:function () {
    var a = this.config;
    for (var b in a)if (a.hasOwnProperty(b))if (a[b].x !== undefined || a[b].y !== undefined) {
        var c = ["x", "y"];
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            a[b][e] !== undefined && (this.node[b][e] = a[b][e])
        }
    } else this.node[b] = a[b]
}, _transitionPow:function (a, b, c, d) {
    var e = d(), f = a.config, g = this.frame.timeDiff;
    if (c !== undefined) {
        var h = a.starts[b][c], i = f[b][c] - h, j = i / Math.pow(f.duration * 1e3, e);
        a.node[b][c] = j * Math.pow(a.time, e) + h
    } else {
        var h = a.starts[b], i = f[b] - h, j = i / Math.pow(f.duration * 1e3, e);
        a.node[b] = j * Math.pow(a.time, e) + h
    }
}, _chooseTransition:function (a, b, c) {
    var d = a.config, e = this;
    switch (d.easing) {
        case"ease-in":
            this._transitionPow(a, b, c, function () {
                return 2.5
            });
            break;
        case"ease-out":
            this._transitionPow(a, b, c, function () {
                return.4
            });
            break;
        case"ease-in-out":
            this._transitionPow(a, b, c, function () {
                var b = -2.1, c = b / (d.duration * 1e3);
                return 2.5 + c * a.time
            });
            break;
        default:
            this._transitionPow(a, b, c, function () {
                return 1
            })
    }
}, _runTransition:function (a) {
    var b = a.config;
    for (var c in b)if (b.hasOwnProperty(c) && c !== "duration" && c !== "easing" && c !== "callback")if (b[c].x !== undefined || b[c].y !== undefined) {
        var d = ["x", "y"];
        for (var e = 0; e < d.length; e++) {
            var f = d[e];
            b[c][f] !== undefined && this._chooseTransition(a, c, f)
        }
    } else this._chooseTransition(a, c)
}, _clearTransition:function (a) {
    var b = a.getLayer();
    for (var c = 0; c < b.transitions.length; c++)b.transitions[c].node.id === a.id && b.transitions.splice(c, 1)
}, _runFrames:function () {
    for (var a = 0; a < this.stages.length; a++) {
        var b = this.stages[a];
        b.isAnimating && b.onFrameFunc !== undefined && b.onFrameFunc(this.frame);
        var c = b.getChildren();
        for (var d = 0; d < c.length; d++) {
            var e = c[d], f = !1;
            for (var g = 0; g < e.transitions.length; g++) {
                f = !0;
                var h = e.transitions[g];
                h.time += this.frame.timeDiff, h.time >= h.config.duration * 1e3 ? (this._endTransition.apply(h), this._clearTransition(h.node), h.config.callback !== undefined && h.config.callback()) : this._runTransition(h)
            }
            f && e.draw()
        }
    }
}, _updateFrameObject:function () {
    var a = new Date, b = a.getTime();
    this.frame.lastTime === 0 ? this.frame.lastTime = b : (this.frame.timeDiff = b - this.frame.lastTime, this.frame.lastTime = b, this.frame.time += this.frame.timeDiff)
}, _animationLoop:function () {
    if (this._isaCanvasAnimating()) {
        this._updateFrameObject(), this._runFrames();
        var a = this;
        requestAnimFrame(function () {
            a._animationLoop()
        })
    }
}, _handleAnimation:function () {
    var a = this;
    this._isaCanvasAnimating() && a._animationLoop()
}}, window.requestAnimFrame = function (a) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
        window.setTimeout(a, 1e3 / 60)
    }
}(), Kinetic.Node = function (a) {
    this.visible = !0, this.isListening = !0, this.name = undefined, this.alpha = 1, this.x = 0, this.y = 0, this.scale = {x:1, y:1}, this.rotation = 0, this.centerOffset = {x:0, y:0}, this.eventListeners = {}, this.dragConstraint = "none", this.dragBounds = {}, this._draggable = !1;
    if (a)for (var b in a)switch (b) {
        case"draggable":
            this.draggable(a[b]);
            break;
        case"listen":
            this.listen(a[b]);
            break;
        case"rotationDeg":
            this.rotation = a[b] * Math.PI / 180;
            break;
        default:
            this[b] = a[b]
    }
    this.centerOffset.x === undefined && (this.centerOffset.x = 0), this.centerOffset.y === undefined && (this.centerOffset.y = 0)
}, Kinetic.Node.prototype = {on:function (a, b) {
    var c = a.split(" ");
    for (var d = 0; d < c.length; d++) {
        var e = c[d], f = e.indexOf("touch") === -1 ? "on" + e : e, g = f.split("."), h = g[0], i = g.length > 1 ? g[1] : "";
        this.eventListeners[h] || (this.eventListeners[h] = []), this.eventListeners[h].push({name:i, handler:b})
    }
}, off:function (a) {
    var b = a.split(" ");
    for (var c = 0; c < b.length; c++) {
        var d = b[c], e = d.indexOf("touch") === -1 ? "on" + d : d, f = e.split("."), g = f[0];
        if (this.eventListeners[g] && f.length > 1) {
            var h = f[1];
            for (var i = 0; i < this.eventListeners[g].length; i++)if (this.eventListeners[g][i].name === h) {
                this.eventListeners[g].splice(i, 1), this.eventListeners[g].length === 0 && (this.eventListeners[g] = undefined);
                break
            }
        } else this.eventListeners[g] = undefined
    }
}, show:function () {
    this.visible = !0
}, hide:function () {
    this.visible = !1
}, getZIndex:function () {
    return this.index
}, setScale:function (a, b) {
    b ? (this.scale.x = a, this.scale.y = b) : (this.scale.x = a, this.scale.y = a)
}, getScale:function () {
    return this.scale
}, setPosition:function (a, b) {
    this.x = a, this.y = b
}, getPosition:function () {
    return{x:this.x, y:this.y}
}, getAbsolutePosition:function () {
    return this.getAbsoluteTransform().getTranslation()
}, move:function (a, b) {
    this.x += a, this.y += b
}, setRotation:function (a) {
    this.rotation = a
}, setRotationDeg:function (a) {
    this.rotation = a * Math.PI / 180
}, getRotation:function () {
    return this.rotation
}, getRotationDeg:function () {
    return this.rotation * 180 / Math.PI
}, rotate:function (a) {
    this.rotation += a
}, rotateDeg:function (a) {
    this.rotation += a * Math.PI / 180
}, listen:function (a) {
    this.isListening = a
}, moveToTop:function () {
    var a = this.index;
    this.parent.children.splice(a, 1), this.parent.children.push(this), this.parent._setChildrenIndices()
}, moveUp:function () {
    var a = this.index;
    this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices()
}, moveDown:function () {
    var a = this.index;
    a > 0 && (this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices())
}, moveToBottom:function () {
    var a = this.index;
    this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices()
}, setZIndex:function (a) {
    var b = this.index;
    this.parent.children.splice(b, 1), this.parent.children.splice(a, 0, this), this.parent._setChildrenIndices()
}, setAlpha:function (a) {
    this.alpha = a
}, getAlpha:function () {
    return this.alpha
}, getAbsoluteAlpha:function () {
    var a = 1, b = this;
    while (b.className !== "Stage")a *= b.alpha, b = b.parent;
    return a
}, draggable:function (a) {
    this.draggable !== a && (a ? this._initDrag() : this._dragCleanup(), this._draggable = a)
}, isDragging:function () {
    var a = Kinetic.GlobalObject;
    return a.drag.node !== undefined && a.drag.node.id === this.id && a.drag.moving
}, moveTo:function (a) {
    var b = this.parent;
    b.children.splice(this.index, 1), b._setChildrenIndices(), a.children.push(this), this.index = a.children.length - 1, this.parent = a, a._setChildrenIndices(), this.name && (b.childrenNames[this.name] = undefined, a.childrenNames[this.name] = this)
}, getParent:function () {
    return this.parent
}, getLayer:function () {
    return this.className === "Layer" ? this : this.getParent().getLayer()
}, getStage:function () {
    return this.className === "Stage" ? this : this.getParent().getStage()
}, getName:function () {
    return this.name
}, setCenterOffset:function (a, b) {
    this.centerOffset.x = a, this.centerOffset.y = b
}, getCenterOffset:function () {
    return this.centerOffset
}, transitionTo:function (a) {
    var b = this.getLayer(), c = this, d = a.duration * 1e3, e = {};
    Kinetic.GlobalObject._clearTransition(this);
    for (var f in a)if (a.hasOwnProperty(f) && f !== "duration" && f !== "easing" && f !== "callback")if (a[f].x !== undefined || a[f].y !== undefined) {
        e[f] = {};
        var g = ["x", "y"];
        for (var h = 0; h < g.length; h++) {
            var i = g[h];
            a[f][i] !== undefined && (e[f][i] = this[f][i])
        }
    } else e[f] = this[f];
    b.transitions.push({id:b.transitionIdCounter++, time:0, config:a, node:this, starts:e}), Kinetic.GlobalObject._handleAnimation()
}, setDragConstraint:function (a) {
    this.dragConstraint = a
}, getDragConstraint:function () {
    return this.dragConstraint
}, setDragBounds:function (a) {
    this.dragBounds = a
}, getDragBounds:function () {
    return this.dragBounds
}, getAbsoluteTransform:function () {
    var a = new Kinetic.Transform, b = [], c = this.parent;
    b.unshift(this);
    while (c)b.unshift(c), c = c.parent;
    for (var d = 0; d < b.length; d++) {
        var e = b[d], f = e.getTransform();
        a.multiply(f)
    }
    return a
}, getTransform:function () {
    var a = new Kinetic.Transform;
    return(this.x !== 0 || this.y !== 0) && a.translate(this.x, this.y), this.rotation !== 0 && a.rotate(this.rotation), (this.scale.x !== 1 || this.scale.y !== 1) && a.scale(this.scale.x, this.scale.y), (this.centerOffset.x !== 0 || this.centerOffset.y !== 0) && a.translate(-1 * this.centerOffset.x, -1 * this.centerOffset.y), a
}, _initDrag:function () {
    var a = Kinetic.GlobalObject, b = this;
    this.on("mousedown.initdrag touchstart.initdrag", function (c) {
        var d = b.getStage(), e = d.getUserPosition();
        if (e) {
            var f = b.getTransform().getTranslation(), g = b.getAbsoluteTransform().getTranslation();
            a.drag.node = b, a.drag.offset.x = e.x - b.getAbsoluteTransform().getTranslation().x, a.drag.offset.y = e.y - b.getAbsoluteTransform().getTranslation().y
        }
    })
}, _dragCleanup:function () {
    this.off("mousedown.initdrag"), this.off("touchstart.initdrag")
}, _handleEvents:function (a, b) {
    this.className === "Shape" && (b.shape = this);
    var c = this.getStage();
    this._handleEvent(this, c.mouseoverShape, c.mouseoutShape, a, b)
}, _handleEvent:function (a, b, c, d, e) {
    var f = a.eventListeners, g = !0;
    d === "onmouseover" && c && c.id === a.id ? g = !1 : d === "onmouseout" && b && b.id === a.id && (g = !1);
    if (f[d] && g) {
        var h = f[d];
        for (var i = 0; i < h.length; i++)h[i].handler.apply(a, [e])
    }
    var j = b ? b.parent : undefined, k = c ? c.parent : undefined;
    !e.cancelBubble && a.parent.className !== "Stage" && this._handleEvent(a.parent, j, k, d, e)
}}, Kinetic.Container = function () {
    this.children = [], this.childrenNames = {}
}, Kinetic.Container.prototype = {getChildren:function () {
    return this.children
}, getChild:function (a) {
    return this.childrenNames[a]
}, removeChildren:function () {
    while (this.children.length > 0)this.remove(this.children[0])
}, _remove:function (a) {
    a.name !== undefined && (this.childrenNames[a.name] = undefined), this.children.splice(a.index, 1), this._setChildrenIndices(), a = undefined
}, _drawChildren:function () {
    var a = this.children;
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        c.className === "Shape" ? c._draw(c.getLayer()) : c._draw()
    }
}, _add:function (a) {
    a.name && (this.childrenNames[a.name] = a), a.id = Kinetic.GlobalObject.idCounter++, a.index = this.children.length, a.parent = this, this.children.push(a)
}, _setChildrenIndices:function () {
    if (this.className === "Stage") {
        var a = this.content.children, b = a[0], c = a[1];
        this.content.innerHTML = "", this.content.appendChild(b), this.content.appendChild(c)
    }
    for (var d = 0; d < this.children.length; d++)this.children[d].index = d, this.className === "Stage" && this.content.appendChild(this.children[d].canvas)
}}, Kinetic.Stage = function (a) {
    typeof a.container == "string" && (a.container = document.getElementById(a.container)), this.className = "Stage", this.container = a.container, this.content = document.createElement("div"), this.width = a.width, this.height = a.height, this.scale = {x:1, y:1}, this.dblClickWindow = 400, this.clickStart = !1, this.targetShape = undefined, this.targetFound = !1, this.mouseoverShape = undefined, this.mouseoutShape = undefined, this.mousePos = undefined, this.mouseDown = !1, this.mouseUp = !1, this.touchPos = undefined, this.touchStart = !1, this.touchEnd = !1, this.id = Kinetic.GlobalObject.idCounter++, this.isAnimating = !1, this.onFrameFunc = undefined, this._buildDOM(), this._listen(), this._prepareDrag(), Kinetic.GlobalObject.stages.push(this), Kinetic.Container.apply(this, []), Kinetic.Node.apply(this, [a])
}, Kinetic.Stage.prototype = {onFrame:function (a) {
    this.onFrameFunc = a
}, start:function () {
    this.isAnimating = !0, Kinetic.GlobalObject._handleAnimation()
}, stop:function () {
    this.isAnimating = !1, Kinetic.GlobalObject._handleAnimation()
}, draw:function () {
    this._drawChildren()
}, setSize:function (a, b) {
    var c = this.children;
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        e.getCanvas().width = a, e.getCanvas().height = b, e.draw()
    }
    this.width = a, this.height = b, this.bufferLayer.getCanvas().width = a, this.bufferLayer.getCanvas().height = b, this.backstageLayer.getCanvas().width = a, this.backstageLayer.getCanvas().height = b
}, clear:function () {
    var a = this.children;
    for (var b = 0; b < a.length; b++)a[b].clear()
}, toDataURL:function (a, b, c) {
    function g(h) {
        var i = f[h].getCanvas().toDataURL(), j = new Image;
        j.onload = function () {
            e.drawImage(this, 0, 0), h++, h < f.length ? g(h) : a(d.getCanvas().toDataURL(b, c))
        }, j.src = i
    }

    var d = this.bufferLayer, e = d.getContext(), f = this.children;
    d.clear(), g(0)
}, remove:function (a) {
    this.content.removeChild(a.canvas), this._remove(a)
}, onContainer:function (a, b) {
    var c = a.split(" ");
    for (var d = 0; d < c.length; d++) {
        var e = c[d];
        this.container.addEventListener(e, b, !1)
    }
}, add:function (a) {
    a.name && (this.childrenNames[a.name] = a), a.canvas.width = this.width, a.canvas.height = this.height, this._add(a), a.draw(), this.content.appendChild(a.canvas)
}, getMousePosition:function (a) {
    return this.mousePos
}, getTouchPosition:function (a) {
    return this.touchPos
}, getUserPosition:function (a) {
    return this.getTouchPosition() || this.getMousePosition()
}, getContainer:function () {
    return this.container
}, getStage:function () {
    return this
}, _detectEvent:function (a, b) {
    var c = Kinetic.GlobalObject.drag.moving, d = this.backstageLayer, e = d.getContext(), f = Kinetic.GlobalObject, g = this.getUserPosition(), h = a.eventListeners;
    a._draw(d), this.targetShape && a.id === this.targetShape.id && (this.targetFound = !0);
    if (a.visible && g !== undefined && e.isPointInPath(g.x, g.y)) {
        if (!c && this.mouseDown)return this.mouseDown = !1, this.clickStart = !0, a._handleEvents("onmousedown", b), !0;
        if (this.mouseUp)return this.mouseUp = !1, a._handleEvents("onmouseup", b), this.clickStart && (!f.drag.moving || !f.drag.node) && (a._handleEvents("onclick", b), a.inDoubleClickWindow && a._handleEvents("ondblclick", b), a.inDoubleClickWindow = !0, setTimeout(function () {
            a.inDoubleClickWindow = !1
        }, this.dblClickWindow)), !0;
        if (this.touchStart) {
            this.touchStart = !1, a._handleEvents("touchstart", b);
            if (h.ondbltap && a.inDoubleClickWindow) {
                var i = h.ondbltap;
                for (var j = 0; j < i.length; j++)i[j].handler.apply(a, [b])
            }
            return a.inDoubleClickWindow = !0, setTimeout(function () {
                a.inDoubleClickWindow = !1
            }, this.dblClickWindow), !0
        }
        if (this.touchEnd)return this.touchEnd = !1, a._handleEvents("touchend", b), !0;
        if (!c && this._isNewTarget(a, b))return this.mouseoutShape && (this.mouseoverShape = a, this.mouseoutShape._handleEvents("onmouseout", b), this.mouseoverShape = undefined), a._handleEvents("onmouseover", b), this._setTarget(a), !0;
        if (!c)return a._handleEvents("onmousemove", b), a._handleEvents("touchmove", b), !0
    } else if (!c && this.targetShape && this.targetShape.id === a.id)return this._setTarget(undefined), this.mouseoutShape = a, !0;
    return!1
}, _setTarget:function (a) {
    this.targetShape = a, this.targetFound = !0
}, _isNewTarget:function (a, b) {
    if (!this.targetShape || !this.targetFound && a.id !== this.targetShape.id) {
        if (this.targetShape) {
            var c = this.targetShape.eventListeners;
            c && (this.mouseoutShape = this.targetShape)
        }
        return!0
    }
    return!1
}, _traverseChildren:function (a, b) {
    var c = a.children;
    for (var d = c.length - 1; d >= 0; d--) {
        var e = c[d];
        if (e.isListening)if (e.className === "Shape") {
            var f = this._detectEvent(e, b);
            if (f)return!0
        } else {
            var f = this._traverseChildren(e, b);
            if (f)return!0
        }
    }
    return!1
}, _handleStageEvent:function (a) {
    var b = Kinetic.GlobalObject;
    a || (a = window.event), this._setMousePosition(a), this._setTouchPosition(a);
    var c = this.backstageLayer;
    c.clear(), this.targetFound = !1;
    var d = !1;
    for (var e = this.children.length - 1; e >= 0; e--) {
        var f = this.children[e];
        f.visible && e >= 0 && f.isListening && this._traverseChildren(f, a) && (e = -1, d = !0)
    }
    !d && this.mouseoutShape && (this.mouseoutShape._handleEvents("onmouseout", a), this.mouseoutShape = undefined)
}, _listen:function () {
    var a = this;
    this.container.addEventListener("mousedown", function (b) {
        a.mouseDown = !0, a._handleStageEvent(b)
    }, !1), this.container.addEventListener("mousemove", function (b) {
        a.mouseUp = !1, a.mouseDown = !1, a._handleStageEvent(b)
    }, !1), this.container.addEventListener("mouseup", function (b) {
        a.mouseUp = !0, a.mouseDown = !1, a._handleStageEvent(b), a.clickStart = !1
    }, !1), this.container.addEventListener("mouseover", function (b) {
        a._handleStageEvent(b)
    }, !1), this.container.addEventListener("mouseout", function (b) {
        a.mousePos = undefined
    }, !1), this.container.addEventListener("touchstart", function (b) {
        b.preventDefault(), a.touchStart = !0, a._handleStageEvent(b)
    }, !1), this.container.addEventListener("touchmove", function (b) {
        b.preventDefault(), a._handleStageEvent(b)
    }, !1), this.container.addEventListener("touchend", function (b) {
        b.preventDefault(), a.touchEnd = !0, a._handleStageEvent(b)
    }, !1)
}, _setMousePosition:function (a) {
    var b = a.offsetX || a.clientX - this._getContainerPosition().left + window.pageXOffset, c = a.offsetY || a.clientY - this._getContainerPosition().top + window.pageYOffset;
    this.mousePos = {x:b, y:c}
}, _setTouchPosition:function (a) {
    if (a.touches !== undefined && a.touches.length === 1) {
        var b = a.touches[0], c = b.clientX - this._getContainerPosition().left + window.pageXOffset, d = b.clientY - this._getContainerPosition().top + window.pageYOffset;
        this.touchPos = {x:c, y:d}
    }
}, _getContainerPosition:function () {
    var a = this.container, b = 0, c = 0;
    while (a && a.tagName !== "BODY")b += a.offsetTop - a.scrollTop, c += a.offsetLeft - a.scrollLeft, a = a.offsetParent;
    return{top:b, left:c}
}, _stripLayer:function (a) {
    a.context.stroke = function () {
    }, a.context.fill = function () {
    }, a.context.fillRect = function (b, c, d, e) {
        a.context.rect(b, c, d, e)
    }, a.context.strokeRect = function (b, c, d, e) {
        a.context.rect(b, c, d, e)
    }, a.context.drawImage = function () {
    }, a.context.fillText = function () {
    }, a.context.strokeText = function () {
    }
}, _endDrag:function (a) {
    var b = Kinetic.GlobalObject;
    b.drag.node && b.drag.moving && (b.drag.moving = !1, b.drag.node._handleEvents("ondragend", a)), b.drag.node = undefined
}, _prepareDrag:function () {
    var a = this;
    this.onContainer("mousemove touchmove", function (b) {
        var c = Kinetic.GlobalObject, d = c.drag.node;
        if (d) {
            var e = a.getUserPosition(), f = d.dragConstraint, g = d.dragBounds, h = {x:e.x - c.drag.offset.x, y:e.y - c.drag.offset.y};
            g.left !== undefined && h.x < g.left && (h.x = g.left), g.right !== undefined && h.x > g.right && (h.x = g.right), g.top !== undefined && h.y < g.top && (h.y = g.top), g.bottom !== undefined && h.y > g.bottom && (h.y = g.bottom), f === "horizontal" ? h.y = d.y : f === "vertical" && (h.x = d.x);
            var i = d.rotation, j = {x:d.scale.x, y:d.scale.y};
            d.rotation = 0, d.scale = {x:1, y:1};
            var k = d.getAbsoluteTransform();
            k.invert(), k.translate(h.x, h.y), d.x += k.getTranslation().x, d.y += k.getTranslation().y, d.rotate(i), d.scale = {x:j.x, y:j.y}, c.drag.node.getLayer().draw(), c.drag.moving || (c.drag.moving = !0, c.drag.node._handleEvents("ondragstart", b)), c.drag.node._handleEvents("ondragmove", b)
        }
    }, !1), this.onContainer("mouseup touchend mouseout", function (b) {
        a._endDrag(b)
    })
}, _buildDOM:function () {
    this.content.style.width = this.width + "px", this.content.style.height = this.height + "px", this.content.style.position = "relative", this.content.style.display = "inline-block", this.content.className = "kineticjs-content", this.container.appendChild(this.content), this.bufferLayer = new Kinetic.Layer, this.backstageLayer = new Kinetic.Layer, this.bufferLayer.parent = this, this.backstageLayer.parent = this, this._stripLayer(this.backstageLayer), this.bufferLayer.getCanvas().style.display = "none", this.backstageLayer.getCanvas().style.display = "none", this.bufferLayer.canvas.width = this.width, this.bufferLayer.canvas.height = this.height, this.content.appendChild(this.bufferLayer.canvas), this.backstageLayer.canvas.width = this.width, this.backstageLayer.canvas.height = this.height, this.content.appendChild(this.backstageLayer.canvas)
}}, Kinetic.GlobalObject.extend(Kinetic.Stage, Kinetic.Container), Kinetic.GlobalObject.extend(Kinetic.Stage, Kinetic.Node), Kinetic.Layer = function (a) {
    this.className = "Layer", this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.canvas.style.position = "absolute", this.transitions = [], this.transitionIdCounter = 0, Kinetic.Container.apply(this, []), Kinetic.Node.apply(this, [a])
}, Kinetic.Layer.prototype = {draw:function () {
    this._draw()
}, clear:function () {
    var a = this.getContext(), b = this.getCanvas();
    a.clearRect(0, 0, b.width, b.height)
}, getCanvas:function () {
    return this.canvas
}, getContext:function () {
    return this.context
}, add:function (a) {
    this._add(a)
}, remove:function (a) {
    this._remove(a)
}, _draw:function () {
    this.clear(), this.visible && this._drawChildren()
}}, Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Container), Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Node), Kinetic.Group = function (a) {
    this.className = "Group", Kinetic.Container.apply(this, []), Kinetic.Node.apply(this, [a])
}, Kinetic.Group.prototype = {add:function (a) {
    this._add(a)
}, remove:function (a) {
    this._remove(a)
}, _draw:function () {
    this.visible && this._drawChildren()
}}, Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Container), Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Node), Kinetic.Shape = function (a) {
    this.className = "Shape";
    if (a.stroke !== undefined || a.strokeWidth !== undefined)a.stroke === undefined ? a.stroke = "black" : a.strokeWidth === undefined && (a.strokeWidth = 2);
    this.drawFunc = a.drawFunc, Kinetic.Node.apply(this, [a])
}, Kinetic.Shape.prototype = {getContext:function () {
    return this.tempLayer.getContext()
}, getCanvas:function () {
    return this.tempLayer.getCanvas()
}, fillStroke:function () {
    var a = this.getContext();
    this.fill !== undefined && (a.fillStyle = this.fill, a.fill()), this.stroke !== undefined && (a.lineWidth = this.strokeWidth === undefined ? 1 : this.strokeWidth, a.strokeStyle = this.stroke, a.stroke())
}, setFill:function (a) {
    this.fill = a
}, getFill:function () {
    return this.fill
}, setStroke:function (a) {
    this.stroke = a
}, getStroke:function () {
    return this.stroke
}, setStrokeWidth:function (a) {
    this.strokeWidth = a
}, getStrokeWidth:function () {
    return this.strokeWidth
}, _draw:function (a) {
    if (this.visible) {
        var b = a.getStage(), c = a.getContext(), d = [], e = this.parent;
        d.unshift(this);
        while (e)d.unshift(e), e = e.parent;
        c.save();
        for (var f = 0; f < d.length; f++) {
            var g = d[f], h = g.getTransform().getMatrix();
            c.transform(h[0], h[1], h[2], h[3], h[4], h[5]), g.getAbsoluteAlpha() !== 1 && (c.globalAlpha = g.getAbsoluteAlpha())
        }
        this.tempLayer = a, this.drawFunc.call(this), c.restore()
    }
}}, Kinetic.GlobalObject.extend(Kinetic.Shape, Kinetic.Node), Kinetic.Rect = function (a) {
    a.drawFunc = function () {
        var a = this.getContext();
        a.beginPath(), a.rect(0, 0, this.width, this.height), a.closePath(), this.fillStroke()
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.Rect.prototype = {setWidth:function (a) {
    this.width = a
}, getWidth:function () {
    return this.width
}, setHeight:function (a) {
    this.height = a
}, getHeight:function () {
    return this.height
}, setSize:function (a, b) {
    this.width = a, this.height = b
}}, Kinetic.GlobalObject.extend(Kinetic.Rect, Kinetic.Shape), Kinetic.Circle = function (a) {
    a.drawFunc = function () {
        var a = this.getCanvas(), b = this.getContext();
        b.beginPath(), b.arc(0, 0, this.radius, 0, Math.PI * 2, !0), b.closePath(), this.fillStroke()
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.Circle.prototype = {setRadius:function (a) {
    this.radius = a
}, getRadius:function () {
    return this.radius
}}, Kinetic.GlobalObject.extend(Kinetic.Circle, Kinetic.Shape), Kinetic.Image = function (a) {
    a.width === undefined && (a.width = a.image.width), a.height === undefined && (a.height = a.image.height), a.drawFunc = function () {
        var a = this.getCanvas(), b = this.getContext();
        b.beginPath(), b.rect(0, 0, this.width, this.height), b.closePath(), this.fillStroke(), b.drawImage(this.image, 0, 0, this.width, this.height)
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.Image.prototype = {setImage:function (a) {
    this.image = a
}, getImage:function () {
    return this.image
}, setWidth:function (a) {
    this.width = a
}, getWidth:function () {
    return this.width
}, setHeight:function (a) {
    this.height = a
}, getHeight:function () {
    return this.height
}, setSize:function (a, b) {
    this.width = a, this.height = b
}}, Kinetic.GlobalObject.extend(Kinetic.Image, Kinetic.Shape), Kinetic.Polygon = function (a) {
    a.drawFunc = function () {
        var a = this.getContext();
        a.beginPath(), a.moveTo(this.points[0].x, this.points[0].y);
        for (var b = 1; b < this.points.length; b++)a.lineTo(this.points[b].x, this.points[b].y);
        a.closePath(), this.fillStroke()
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.Polygon.prototype = {setPoints:function (a) {
    this.points = a
}, getPoints:function () {
    return this.points
}}, Kinetic.GlobalObject.extend(Kinetic.Polygon, Kinetic.Shape), Kinetic.RegularPolygon = function (a) {
    a.drawFunc = function () {
        var a = this.getContext();
        a.beginPath(), a.moveTo(0, 0 - this.radius);
        for (var b = 1; b < this.sides; b++) {
            var c = this.radius * Math.sin(b * 2 * Math.PI / this.sides), d = -1 * this.radius * Math.cos(b * 2 * Math.PI / this.sides);
            a.lineTo(c, d)
        }
        a.closePath(), this.fillStroke()
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.RegularPolygon.prototype = {setPoints:function (a) {
    this.points = a
}, getPoints:function () {
    return this.points
}, setRadius:function (a) {
    this.radius = a
}, getRadius:function () {
    return this.radius
}, setSides:function (a) {
    this.sides = a
}, getSides:function () {
    return this.sides
}}, Kinetic.GlobalObject.extend(Kinetic.RegularPolygon, Kinetic.Shape), Kinetic.Star = function (a) {
    a.drawFunc = function () {
        var a = this.getContext();
        a.beginPath(), a.moveTo(0, 0 - this.outerRadius);
        for (var b = 1; b < this.points * 2; b++) {
            var c = b % 2 === 0 ? this.outerRadius : this.innerRadius, d = c * Math.sin(b * Math.PI / this.points), e = -1 * c * Math.cos(b * Math.PI / this.points);
            a.lineTo(d, e)
        }
        a.closePath(), this.fillStroke()
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.Star.prototype = {setPoints:function (a) {
    this.points = a
}, getPoints:function () {
    return this.points
}, setOuterRadius:function (a) {
    this.outerRadius = a
}, getOuterRadius:function () {
    return this.outerRadius
}, setInnerRadius:function (a) {
    this.innerRadius = a
}, getInnerRadius:function () {
    return this.innerRadius
}}, Kinetic.GlobalObject.extend(Kinetic.Star, Kinetic.Shape), Kinetic.Text = function (a) {
    if (a.textStroke !== undefined || a.textStrokeWidth !== undefined)a.textStroke === undefined ? a.textStroke = "black" : a.textStrokeWidth === undefined && (a.textStrokeWidth = 2);
    a.align === undefined && (a.align = "left"), a.verticalAlign === undefined && (a.verticalAlign = "top"), a.padding === undefined && (a.padding = 0), a.drawFunc = function () {
        var a = this.getContext();
        a.font = this.fontSize + "pt " + this.fontFamily, a.textBaseline = "middle";
        var b = a.measureText(this.text), c = c = parseInt(this.fontSize, 10), d = b.width, e = this.padding, f = 0, g = 0;
        switch (this.align) {
            case"center":
                f = d / -2 - e;
                break;
            case"right":
                f = -1 * d - e
        }
        switch (this.verticalAlign) {
            case"middle":
                g = c / -2 - e;
                break;
            case"bottom":
                g = -1 * c - e
        }
        a.save(), a.beginPath(), a.rect(f, g, d + e * 2, c + e * 2), a.closePath(), this.fillStroke(), a.restore();
        var h = e + f, i = c / 2 + e + g;
        this.textFill !== undefined && (a.fillStyle = this.textFill, a.fillText(this.text, h, i));
        if (this.textStroke !== undefined || this.textStrokeWidth !== undefined)this.textStroke === undefined ? this.textStroke = "black" : this.textStrokeWidth === undefined && (this.textStrokeWidth = 2), a.lineWidth = this.textStrokeWidth, a.strokeStyle = this.textStroke, a.strokeText(this.text, h, i)
    }, Kinetic.Shape.apply(this, [a])
}, Kinetic.Text.prototype = {setFontFamily:function (a) {
    this.fontFamily = a
}, getFontFamily:function () {
    return this.fontFamily
}, setFontSize:function (a) {
    this.fontSize = a
}, getFontSize:function () {
    return this.fontSize
}, setTextFill:function (a) {
    this.textFill = a
}, getTextFill:function () {
    return this.textFill
}, setTextStroke:function (a) {
    this.textStroke = a
}, getTextStroke:function () {
    return this.textStroke
}, setTextStrokeWidth:function (a) {
    this.textStrokeWidth = a
}, getTextStrokeWidth:function () {
    return this.textStrokeWidth
}, setPadding:function (a) {
    this.padding = a
}, getPadding:function () {
    return this.padding
}, setAlign:function (a) {
    this.align = a
}, getAlign:function () {
    return this.align
}, setVerticalAlign:function (a) {
    this.verticalAlign = a
}, getVerticalAlign:function () {
    return this.verticalAlign
}, setText:function (a) {
    this.text = a
}, getText:function () {
    return this.text
}}, Kinetic.GlobalObject.extend(Kinetic.Text, Kinetic.Shape), Kinetic.Transform = function () {
    this.m = [1, 0, 0, 1, 0, 0]
}, Kinetic.Transform.prototype = {translate:function (a, b) {
    this.m[4] += this.m[0] * a + this.m[2] * b, this.m[5] += this.m[1] * a + this.m[3] * b
}, scale:function (a, b) {
    this.m[0] *= a, this.m[1] *= a, this.m[2] *= b, this.m[3] *= b
}, rotate:function (a) {
    var b = Math.cos(a), c = Math.sin(a), d = this.m[0] * b + this.m[2] * c, e = this.m[1] * b + this.m[3] * c, f = this.m[0] * -c + this.m[2] * b, g = this.m[1] * -c + this.m[3] * b;
    this.m[0] = d, this.m[1] = e, this.m[2] = f, this.m[3] = g
}, getTranslation:function () {
    return{x:this.m[4], y:this.m[5]}
}, multiply:function (a) {
    var b = this.m[0] * a.m[0] + this.m[2] * a.m[1], c = this.m[1] * a.m[0] + this.m[3] * a.m[1], d = this.m[0] * a.m[2] + this.m[2] * a.m[3], e = this.m[1] * a.m[2] + this.m[3] * a.m[3], f = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4], g = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
    this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
}, invert:function () {
    var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), b = this.m[3] * a, c = -this.m[1] * a, d = -this.m[2] * a, e = this.m[0] * a, f = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), g = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
}, getMatrix:function () {
    return this.m
}};