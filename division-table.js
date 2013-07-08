define(['canvasclippingnode'], function(CanvasClippingNode) {
	'use strict';

	var DivisionTable = cc.Sprite.extend({
		ctor:function(divisor) {
			this._super();
			this.initWithFile(bl.resources['images_long_division_table_sectionbox']);
			this.divisor = divisor;
			this.scrolling = false;
			var clippingNode = new CanvasClippingNode();
			clippingNode.drawPathToClip = function() {
				this.ctx.rect(0, -203, 600, 203);
			};
			this.addChild(clippingNode);
			this.slideNode = new cc.Node();
			clippingNode.addChild(this.slideNode);
			var upButtonFilename = bl.resources['images_long_division_table_up_arrow'];
			var upButton = new cc.MenuItemImage.create(upButtonFilename, upButtonFilename, this.scrollDown, this);
			upButton.setPosition(0, 55);
			var downButtonFilename = bl.resources['images_long_division_table_down_arrow'];
			var downButton = new cc.MenuItemImage.create(downButtonFilename, downButtonFilename, this.scrollUp, this);
			downButton.setPosition(0, -55);
			var upDownMenu = new cc.Menu.create(upButton, downButton);
			upDownMenu.setPosition(525, 90);
			this.addChild(upDownMenu);

			var answerBox = new cc.Sprite();
			answerBox.initWithFile(bl.resources['images_long_division_table_answerbox']);
			answerBox.setPosition(800, 100);
			this.addChild(answerBox);
			this.answerLabel = new cc.LabelTTF.create("", "mikadoBold", 34);
			this.answerLabel.setPosition(answerBox.getAnchorPointInPoints());
			answerBox.addChild(this.answerLabel);

		},

		clearSlideNode:function() {
			this.slideNode.removeAllChildren();
			this.slideNode.setPosition(0,0);
		},

		setupTable:function(digitValues) {
			this.clearSlideNode();
			this.yPosition = 165;
			var power = 3;
			this.total = 0;
			while (digitValues[power] !== undefined) {
				var digit = digitValues[power];
				if (digit !== 0) {
					this.setupTableRow(digit, power);
				};
				power--;
			};
			this.answerLabel.setString(this.total);
		},

		setupTableRow:function(digit, power) {
			var rowNode = new cc.Node();
			rowNode.setPosition(100,this.yPosition);
			this.slideNode.addChild(rowNode);

			var digitBox = new cc.Sprite();
			digitBox.initWithFile(bl.resources['images_long_division_table_box']);
			rowNode.addChild(digitBox);
			var digitLabel = new cc.LabelTTF.create(digit, "mikadoBold", "24");
			digitLabel.setPosition(digitBox.getAnchorPointInPoints());
			digitBox.addChild(digitLabel);

			var multiply = new cc.Sprite();
			multiply.initWithFile(bl.resources['images_long_division_table_x']);
			multiply.setPosition(75, 0);
			rowNode.addChild(multiply);

			var unitBox = new cc.Sprite();
			unitBox.initWithFile(bl.resources['images_long_division_table_box'])
			unitBox.setPosition(150, 0);
			rowNode.addChild(unitBox);
			var unit = this.divisor * Math.pow(10, power);
			var unitLabel = new cc.LabelTTF.create(unit, "mikadoBold", 24);
			unitLabel.setPosition(unitBox.getAnchorPointInPoints());
			unitBox.addChild(unitLabel);

			var equals = new cc.Sprite();
			equals.initWithFile(bl.resources['images_long_division_table_=']);
			equals.setPosition(225, 0);
			rowNode.addChild(equals);

			var resultBox = new cc.Sprite();
			resultBox.initWithFile(bl.resources['images_long_division_table_box']);
			resultBox.setPosition(300, 0);
			rowNode.addChild(resultBox);
			var result = unit * digit;
			var resultLabel = new cc.LabelTTF.create(result, "mikadoBold", 24);
			resultLabel.setPosition(resultBox.getAnchorPointInPoints());
			resultBox.addChild(resultLabel);
			this.total += result;

			this.yPosition -= 50;
		},

		scrollUp:function() {
			this.scroll(true);
		},

		scrollDown:function() {
			this.scroll(false);
		},

		scroll:function(up) {
			if (!this.scrolling) {
				this.scrolling = true;
				var yChange = up ? 50 : -50;
				var moveAction = cc.MoveBy.create(0.3, cc.p(0, yChange));
				var setScrollingFalse = cc.CallFunc.create(function() {this.scrolling = false}, this);
				var moveAndSet = cc.Sequence.create(moveAction, setScrollingFalse);
				this.slideNode.runAction(moveAndSet);
			};
		},
	});

	return DivisionTable;
})