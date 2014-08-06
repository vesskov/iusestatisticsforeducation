var Color = {
	hexColor: ['#FFFFFF', '#000000'],
	rgbColor: [[255, 255, 20],  [10, 10, 255]],
	
	convertHexToRgb: function () {
		var self = this;
		var rgbColor = [];
		for ( var colorIndex in self.hexColor ) {
			rgbColor[colorIndex] = [];
			rgbColor[colorIndex].push(parseInt(self.hexColor[colorIndex].substring(1,3), 16));
			rgbColor[colorIndex].push(parseInt(self.hexColor[colorIndex].substring(3,5), 16));
			rgbColor[colorIndex].push(parseInt(self.hexColor[colorIndex].substring(5,7), 16));
		};
		self.rgbColor = rgbColor;
	},
	
	colorDifference: function(percent) {
		var self = this;
		var colors = [];
		colors['rgbColor'] = [];
		colors['hexColor'] = [];
		for (var i = 0; i<3 ; i++) {
			var calculated = parseInt(self.rgbColor[1][i] + (self.rgbColor[0][i] - self.rgbColor[1][i])*percent/100);
			colors['rgbColor'].push(calculated);
			if (calculated > 255)
				calculated = 255;
				
			if (calculated < 0)
				calculated = 0;
							
			var hex = calculated.toString(16);
			if (hex.length == 1) {
				hex = '0' + hex;
			}
			colors['hexColor'].push(hex);
			//console.log(self.rgbColor[0][i], self.rgbColor[1][i], i);
		}
		return colors;
	}
}
