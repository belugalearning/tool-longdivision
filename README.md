### Overview

This tool allows users to investigate dividing one integer into another by presenting them with a division question, then letting them experiment with changing digits to see how it affects the calculation, and getting closer and closer to the correct answer.


### Initilising

When first run, the tool sets up:

* A question box, displaying the question

* A number picker box. This holds digit labels and up/down arrows for each digit. It also has buttons to see further left/right down the digits. This is what the user interacts with to create the answer.

* A bars box. This is a box that represents a length of 0 to the dividend. This displays bars representing the sizes of each digit that the user enters, they add up to show the total of the user's answer multiplied by the divisor. When they fill the bars box exactly the user's answer is correct.

* A magnified bars box. This shows the far edge of the bars box, allowing the user a better look at how close they are to filling the box.

* A table. This shows the calculation of the total in numbers.

* A settings page. This controls the divisor, dividend, whether or not the table is displayed and what type of label to set up over the digits (either numbers, powers of ten or letters).


### Number picker box

The number picker box contains number boxes, each of which has a digit and up/down arrows. They are added to a canvas clipping node, which clips the context of the canvas for all its children, allowing you to mask nodes. When a user presses the left/right button the node containing the number boxes moves left/right, and the number boxes which are close to the canvas clipping nodes are made visible and enabled as appropriate. The change in visibility is because the layer will still try to draw sprites that are outside the bounds of the canvas clipping node, and setting these to be invisible will save that attempt when the box won't be drawn anyway. The enabling is because the up/down buttons are still active even when they are masked by the canvas clipping node, so we need to disable them when they are not visible. Holding down left or right will continue scrolling.


### Bars box

Every time a digit is changed, the bars box removes all the bars it contains and adds the bars as needed by the digits. A bar is formed of three sprites, a middle section that is scaled as necessary and two edge sections with rounded corners. If the bar is too short then it does not use rounded corners. When the bars become too small to see we stop adding them, as this could result in a lot of unnecessary sprites being added.
We also add tooltips to the bars when added to show the total length at each point, providing they do not overlap each other.


### Magnified bars box

To acheive the magnification effect, we cheat. The magnified bars box is the same as the bars box but with the dividend altered and the bars shifted left as necessary. This means that the bars will not be placed correctly on the left edge, but we hide that using a canvas clipping node on the right edge, bounded by the edge of the magnifying glass. If we want to change the way the magnifying glass displays, we may need to revisit this.


### Table

Similar to the bars box, whenever a digit changes this is recreated. The font size of the labels is automatically adjusted to fit inside the boxes.


### Working out the correct answer

The tool indicates when the user has gone over the top of the bars box by turnings the bars red. In order to determine when to do this it has to calculate the correct answer for the division problem. It cannot just divide since we want to go to arbitrary precision, but dividing will give rounding errors. In order to calculate this we go through an algorithm which takes the dividend and divisor as arguments and returns three arrays of integers, representing the digits before the decimal point, the non-recurring digits after the decimal point, and the recurring digits. This only works for integers dividing integers at the moment.

In order to make this tool divide rational numbers we may be able to still use this method, but choose the numbers we put in to still get the right answer. For example, if the question is a/b divided by c/d we can put in a * d for the dividend and b * c for the divisor to get the correct digits.


### Representing the state of the tool

The state here can be represented by the divisor and dividend. It should be easy to prepopulate the digits if needed.





