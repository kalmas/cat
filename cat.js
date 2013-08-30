(function(w, d){
	w.onload = function(){
		var field = d.getElementById('field'),
			term = d.getElementById('terminal'),
			cat = d.getElementById('cat'),
			step, repaint, command, translateCommand,
			x=0, y=0;
			
		field.onclick = function(){
			term.focus();
		};
		
		repaint = function(){
			cat.style.top = y + 'px';
			cat.style.left = x + 'px';;
		};
		
		translateCommand = function(input){
			var validCommands = 'w,a,s,d'.split(',');
			switch(validCommands.indexOf(input)){
				case 0:
					return 'up';
				case 1:
					return 'left';
				case 2:
					return 'down';
				case 3:
					return 'right';
				default:
					return null;
			}
		};
		
		move = function(){
			switch(command){
				case 'up':
					if(y > 5){
						y = y - 5;
					} else {
						y = 0;
					}
					break;
				case 'left':
					if(x > 5){
						x = x - 5;
					} else {
						x = 0;
					}
					break;
				case 'down':
					if(y < 395){
						y = y + 5;
					} else {
						y = 400;
					}
					break;
				case 'right':
					if(x < 295){
						x = x + 5;
					} else {
						x = 300;
					}
					break;
			}
		}
		
		step = function(){
			var inputString = term.value;
			if(inputString.length){
				command = translateCommand(inputString[inputString.length - 1]);
				term.value = '';
			}
			
			move();
			repaint();
			setTimeout(step, 150);
		};
		
		step();
	};
})(window, window.document);