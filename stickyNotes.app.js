/**
 *	StickyNotes v1.0 in PHP & jQuery & AngularJS by zairwolf
 * 
 *	Source: https://github.com/zairwolf/stickyNotes/blob/master/stickyNotes.app.js
 *
 *	Author: Hai Zheng @ https://www.linkedin.com/in/zairwolf/
 *
 */

var noteApp = angular.module('noteApp', []);

//filter is for content html show
noteApp.filter('html', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

noteApp.controller('noteCtrl', ['$scope', '$interval', 'stickyNotes', function($scope, $interval, stickyNotes) {
	$scope.textShadow = 'white 1px 1px 0px';
	$scope.notes = [];
	$scope.md5 = '';

	$scope.add = function(){
		$scope.notes.push(stickyNotes.add());
	}
	//interval read notes from json
	$interval(function(){
		stickyNotes.getNotes($scope.md5).then(function(data){
			if(data.md5){
				if($('[noteid=-1]').length) data.notes.push(stickyNotes.add());
				$scope.notes = data.notes;
				$scope.md5 = data.md5;
			}
		});
	}, 1000);

}]);

//config button
noteApp.directive('config', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind("click", function(e) {
				var thisNote = $(this).closest('.PIApostit');
				thisNote.children('.back').show();
				thisNote.addClass('flip', function() {
					$(this).children('.front').hide();
				});
				//minicolor
				thisNote.find('[bgColor]').minicolors({
					change: function(hex) {
						thisNote.css('background-color', hex);
					}
				});
				thisNote.find('[color]').minicolors({
					change: function(hex) {
						thisNote.css('color', hex);
					}
				});
			});
		}
	};
});

//delete button
noteApp.directive('delete', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind("click", function(e) {
				$(this).next().show();
			});
		}
	};
});

//cancel delete button
noteApp.directive('canceldelete', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind("click", function(e) {
				$(this).closest('.ui-widget').hide();
			});
		}
	};
});

//sure delete button
noteApp.directive('suredelete', ['stickyNotes', function(stickyNotes) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind("click", function(e) {
				var thisNote = element.closest('.PIApostit');
				var id = thisNote.attr('noteid');
				stickyNotes.delNote(id);
				if (id == -1) thisNote.remove();
			});
		}
	};
}]);


//close button
noteApp.directive('close', ['stickyNotes', function(stickyNotes) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind("click", function(e) {
				var thisNote = element.closest('.PIApostit');
				var id = thisNote.attr('noteid');
				//hide back
				$(this).closest('.PIApostit').children('.front').show();
				$(this).closest('.PIApostit').removeClass('flip', function() {
					$(this).children('.back').hide();
				});
				//save cfg
				if (id == -1) return; //new note save cfg when save content
				var data = {
					'id': id
				};
				data['bgColor'] = thisNote.find('[bgColor]').val();
				data['color'] = thisNote.find('[color]').val();
				data['textshadow'] = thisNote.find('[textshadow]').is(':checked') ? 1 : 0;
				stickyNotes.setNote(data);
			});
		}
	};
}]);


//content edit
noteApp.directive('contenteditable', ['stickyNotes', function(stickyNotes) { //NOTE: contenteditable is a HTML5 attribute
	return {
		restrict: 'A', // only activate on element attribute
		link: function(scope, element, attrs) {
			//auto resize
			element.on('keyup paste', function() {
				element.resizable({
					animate: false,
					helper: 'ui-resizable-helper',
					stop: function() {
						var thisNote = element.closest('.PIApostit');
						var posY = thisNote.css('left'),
							posX = thisNote.css('top'),
							divWidth = thisNote.width(),
							divHeight = thisNote.find('.PIAeditable').height();
						console.log(divHeight);
						//     minDivHeight = options.minHeight;
						// if (divHeight >= minDivHeight) {
						//     divHeight += 50;
						//     options.height = divHeight;
						//     element.css('height', divHeight);
						//     if ($.ui) {
						//         if (options.resizable) {
						//             element.resizable({
						//                 minHeight: divHeight
						//             });
						//         }
						//     }
						// } else if (divHeight < minDivHeight) {
						//     options.height = minDivHeight;
						//     minDivHeight += 50;
						//     element.css('height', minDivHeight);
						// }
					}
				});
			});

			// Listen for change events to enable binding
			element.on('blur', function() {
				scope.$evalAsync(read);
			});

			// Write data to the model
			function read() {
				var html = element.html();
				// When we clear the content editable the browser leaves a <br> behind
				// If strip-br attribute is provided then we strip this out
				if (attrs.stripBr && html == '<br>') {
					html = '';
				}
				if (html) {
					var thisNote = element.closest('.PIApostit');
					var id = thisNote.attr('noteid');
					var data = {
						'id': id
					};
					data['content'] = html;
					if (id == -1) {
						data['left'] = thisNote.css('left');
						data['top'] = thisNote.css('top');
						data['width'] = thisNote.css('width');
						data['height'] = thisNote.css('height');
						//add cfg for new note
						data['bgColor'] = thisNote.find('[bgColor]').val();
						data['color'] = thisNote.find('[color]').val();
						data['textshadow'] = thisNote.find('[textshadow]').is(':checked') ? 1 : 0;
					}
					var newId = stickyNotes.setNote(data);
					if (id == -1 && newId) thisNote.attr('noteid', newId); //change new note's id
				}
			}
		}
	};
}]);






//draggable attribute
noteApp.directive('draggable', ['stickyNotes', function(stickyNotes) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.draggable({
				handle: ".PIAtoolbar",
				scroll: false,
				start: function() {
					//all others notes go to back, this note goes to front
					$('.PIApostit').css('z-index', function() {
						return $(this).css('z-index') - 1;
					});
					element.css('z-index', 9999);
				},
				stop: function() {
					var id = element.closest('.PIApostit').attr('noteid');
					if (id == -1) return; //new note save cfg @saveCon
					//save position
					var data = {
						'id': id
					};
					data['left'] = element.css('left');
					data['top'] = element.css('top');
					stickyNotes.setNote(data);
				}
			});
		}
	};
}]);

//service
noteApp.factory('stickyNotes', function($http) {
	var hai = {};
	hai.add = function() {
		var noteNewElm = $('[noteid=-1]');
		if (!noteNewElm.length) return {
			'id': '-1',
			'left': '50px',
			'top': '50px',
			'width': '210px',
			'height': '220px',
			'color': '#333333',
			'zindex': '9999',
			'textShadow': '1',
			'bgColor': '#fffc7f',
			'user': '',
			'date': 'Now',
		};
		//return existing new notes
		var noteExisting = {
			'id': '-1',
			'left': noteNewElm.css('left'),
			'top': noteNewElm.css('top'),
			'width': noteNewElm.css('width'),
			'height': noteNewElm.css('height'),
			'color': noteNewElm.css('color'),
			'zindex': noteNewElm.css('z-index'),
			'textShadow': $('#noteCon-1').css('text-shadow') ? 1 : 0,
			'bgColor': noteNewElm.css('background-color'),
			'user': '',
			'date': 'Now',
			'content': $('#noteCon-1').html()
		};
		return noteExisting;
	};
	hai.loading = function(id) {
		$('[noteid=' + id + ']').find('[status]').show();
	};
	hai.loaded = function(id) {
		$('[noteid=' + id + ']').find('[status]').hide();
	};
	hai.getNotes = function(md5) {
		return $http.get(_requestUrl + 'action=getNotes&md5=' + md5).then(function(response) {
			return response.data;
		});
	};
	//save data to php
	hai.setNote = function(data) {
		var id = data.id;
		hai.loading(id);
		var q = $http({
			url: _requestUrl + 'action=setNote',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(data)
		});
		return q.then(function(response) {
			hai.loaded(id);
			if (response.data.error) alert(response.data.errorinfo);
			return response.data.id;
		}, function(response) {
			hai.loaded(id);
			alert('error');
			return false;
		});
	};
	//delete note
	hai.delNote = function(id) {
		return $http.get(_requestUrl + 'action=delNote&id=' + id).then(function(response) {
			return response.data;
		});
	}
	return hai;
});
