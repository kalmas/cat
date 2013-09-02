(function(w, d){
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
		this.model.elements.forEach(function(elm){
			var graphic = graphics.createElement('span');
			graphic.textContent = 0;
			graphic.style.position = 'absolute';
			graphic.style.top = elm.y + 'px';
			graphic.style.left = elm.x + 'px';
			cat.appendChild(graphic);
		})
	};
	
	/**
	 * Model
	 */
	function Model(){
		this.direction = 'north';
		this.elements = [{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100},{x:100,y:100}];
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
			, headX = this.elements[0].x
			, headY = this.elements[0].y
			, newElm = {x:0,y:0};
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
		newElm.x = headX + adjX;
		newElm.y = headY + adjY;
		this.elements.unshift(newElm);
		this.elements.pop();
		
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
	}
		
	w.onload = function(){
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
	};
})(window, window.document);