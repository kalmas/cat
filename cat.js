requirejs(['segChain'],
function(segChain) {

(function(w, d, segChain){
	/**
	 * View
	 */
	function View(){
		this.model;
	}
	View.prototype.addModel = function(model){
		model.addDataChangeListener(this);
		this.model = model;
	};
	View.prototype.dataChanged = function(){
		this.paint(d);	
	};
	View.prototype.paint = function(graphics){
		var cat = graphics.getElementById('cat');
		while (cat.firstChild) {
			cat.removeChild(cat.firstChild);
		}
		this.model.segments.getStack().forEach(function(elm){
			var graphic = graphics.createElement('span');
			graphic.textContent = elm.avatar.chr;
			graphic.style.position = 'absolute';
			graphic.style.top = elm.loc.y + 'px';
			graphic.style.left = elm.loc.x + 'px';
			cat.appendChild(graphic);
		})
	};
	
	/**
	 * Model
	 */
	function Model(){
		this.direction = 'north';
		this.segments = segChain.instance(
			{avatar:{chr:'k'},loc:{x:200,y:200}}
		);
		this.segments.eat(
			{avatar:{chr:'y'},loc:{x:300,y:300}}
		);
		this.segments.eat(
			{avatar:{chr:'l'},loc:{x:300,y:300}}
		);
		this.segments.eat(
			{avatar:{chr:'e'},loc:{x:300,y:300}}
		);
		this.listener;
	}
	Model.prototype.addDataChangeListener = function(listener){
		this.listener = listener;
	};
	Model.prototype.changeDirection = function(direction){
		this.direction = direction;
	};
	Model.prototype.move = function(){
		var adjX = 0
			, adjY = 0
			, segments = this.segments.getStack()
			, head = segments[0]
			, headX = head.loc.x
			, headY = head.loc.y
			, newPosition = {x:0,y:0};
		
		switch(this.direction){
			case 'north':
				if(headY > 5){
					adjY = -5;
				}
				break;
			case 'west':
				if(headX > 5){
					adjX = -5;
				}
				break;
			case 'south':
				if(headY < 395){
					adjY = 5;
				}
				break;
			case 'east':
				if(headX < 295){
					adjX = 5;
				}
				break;
		}
		newPosition.x = headX + adjX;
		newPosition.y = headY + adjY;
		this.segments.slide(newPosition);
		
		this.listener.dataChanged();
	};

	/**
	 * Controller
	 */
	function Controller(){
		this.model;
	}
	Controller.prototype.addModel = function(model){
		this.model = model;
	};
	Controller.prototype.translateInput = function(inputString){
		var validCommands = 'w,a,s,d'.split(','), lastKey;
		if(!inputString.length){
			return null;
		}
		lastKey = inputString[inputString.length - 1];
		switch(validCommands.indexOf(lastKey)){
			case 0:
				return 'north';
			case 1:
				return 'west';
			case 2:
				return 'south';
			case 3:
				return 'east';
			default:
				return null;
		}
	};
	Controller.prototype.processInput = function(input){
		var command = this.translateInput(input);
		if(command && command != this.model.direction){
			this.model.changeDirection(command);
		}
	};
	Controller.prototype.move = function(){
		this.model.move();
	};
		
	(function(){
		var field = d.getElementById('field'),
			term = d.getElementById('terminal'),
			step, repaint, command, translateCommand,
			model = new Model(),
			view = new View(),
			controller = new Controller();
			
		view.addModel(model);
		controller.addModel(model);

		field.onclick = function(){
			term.focus();
		};

		step = function(){
			var inputString = term.value;
			controller.processInput(inputString);
			term.value = '';
			controller.move();
			
			setTimeout(step, 150);
		};
		
		step();
	})();
})(window, window.document, segChain);

});