define(['numberbox', 'canvasclippingnode'], function(NumberBox, CanvasClippingNode) {
	'use strict';

	var NumberPickerBox = cc.Node.extend({

		numberBoxes:[],
		boxesPastFirst:8,
		firstBoxShownIndex:null,
		scrolling:false,

		ctor:function() {
			this._super();

			var container = new cc.Sprite();
            container.initWithFile(s_number_picker_box);
            this.addChild(container);

            var numberPickerClipper = new CanvasClippingNode();
            numberPickerClipper.drawPathToClip = function() {
                this.ctx.rect(1, -203, 588, 203);
            },
            numberPickerClipper.setZOrder(-1);
            container.addChild(numberPickerClipper);

			this.slideNode = new cc.Node();
			this.slideNode.setPosition(70, 100);
			// container.addChild(this.slideNode);
			numberPickerClipper.addChild(this.slideNode);

            this.firstBoxShownIndex = 0;

            var decimalPoint = new cc.Sprite();
            decimalPoint.initWithFile(s_decimal_point);
            decimalPoint.setPosition(290, 0);
            this.slideNode.addChild(decimalPoint);

			for (var i = 0; i < 8; i++) {
				this.addBox();
				if (i > 6) {
					// this.numberBoxes[i].processVisible(false);
				};
			};

            var leftRightMenu = new cc.Menu.create();
            leftRightMenu.setPosition(0,0);
            this.addChild(leftRightMenu);

            var leftButton = cc.MenuItemImage.create(s_number_picker_left, s_number_picker_left, this.scrollLeft, this);
            leftButton.setPosition(-325, 0);
            leftRightMenu.addChild(leftButton);

            var rightButton = cc.MenuItemImage.create(s_number_picker_right, s_number_picker_right, this.scrollRight, this);
            rightButton.setPosition(327, 0);
            leftRightMenu.addChild(rightButton);

		},

		addBox:function() {
			var numberBox = new NumberBox();
			var boxIndex = this.numberBoxes.length;
			numberBox.power = 3 - boxIndex;
			var xPosition = 80 * boxIndex;
			xPosition += numberBox.power >= 0 ? 0 : 20;
			numberBox.setPosition(xPosition, 0);
			this.slideNode.addChild(numberBox);
			this.numberBoxes[boxIndex] = numberBox;
		},

		scrollLeft:function() {
			if (!this.scrolling) {
				if (this.firstBoxShownIndex !== 0) {
					this.scrolling = true;	
					this.firstBoxShownIndex--;
					this.scrollToFirstBoxShown();
				};
			};
		},

		scrollRight:function() {
			if (!this.scrolling) {
				this.scrolling = true;
				this.firstBoxShownIndex++;
				this.scrollToFirstBoxShown();
				if (this.firstBoxShownIndex + this.boxesPastFirst > this.numberBoxes.length) {
					this.addBox();
					// this.numberBoxes[this.numberBoxes.length - 1].processVisible(false);
				};
			};
		},

		scrollToFirstBoxShown:function() {
			var positionOfBox = this.numberBoxes[this.firstBoxShownIndex].getPosition();
			var newPosition = cc.p(-positionOfBox.x + 70, positionOfBox.y + 100);
			var scroll = cc.MoveTo.create(0.3, newPosition);
			var setScrollingFalse = cc.CallFunc.create(function() {this.scrolling = false}, this);
			this.setVisibleBoxesBeforeSlide();
			var setVisibleBoxes = cc.CallFunc.create(this.setVisibleBoxesAfterSlide, this);
			var scrollAndSet = cc.Sequence.create(scroll, setScrollingFalse, setVisibleBoxes);
			this.slideNode.runAction(scrollAndSet);
		},

		setVisibleBoxesBeforeSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i >= this.firstBoxShownIndex - 2 && i <= this.firstBoxShownIndex + 7) {
					this.numberBoxes[i].processVisible(true);
				} else {
					this.numberBoxes[i].processVisible(false);
				};
				this.numberBoxes[i]
			};
		},

		setVisibleBoxesAfterSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i > this.firstBoxShownIndex - 2 && i < this.firstBoxShownIndex + 7) {
					this.numberBoxes[i].processVisible(true);
				} else {
					this.numberBoxes[i].processVisible(false);
				};
			};
		},
	});

	return NumberPickerBox
})