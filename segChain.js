define({
	instance: function(segment){
		var instance = {}
			, stack = [];

		instance.eat = function(segment){
			stack.unshift(segment);
		}
		instance.slide = function(position){
			var head = stack[0]
				, newSeg = {avatar:{chr:head.avatar.chr}, 
						loc:{x:position.x, y:position.y}};
				
			stack.forEach(function(e, i){
				if(typeof stack[i + 1] !== 'undefined'){
					e.avatar.chr = stack[i + 1].avatar.chr;
				}
			});
			
			stack.pop();
			stack.unshift(newSeg);			
		}
		instance.getStack = function(){
			return stack;
		}
		
		instance.eat(segment);
		return instance;
	}
	
});