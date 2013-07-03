define([], function() {
	'use strict';

	var CanvasClippingNode = cc.Node.extend({

		ctx:null,

		drawPathToClip:function() {
			var winSize = cc.Director.getInstance().getWinSize();
			this.ctx.rect(0,-winSize.height,winSize.width,winSize.height);
		},

		visit:function() {
			this.ctx = cc.renderContext;
			this.ctx.save();
			this.ctx.beginPath();
			this.drawPathToClip();
			this.ctx.clip();
			this._super(this.ctx);
			this.ctx.restore();
		},
	});

	return CanvasClippingNode;
})