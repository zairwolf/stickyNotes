<!--
/**
 *	StickyNotes v1.0 in PHP & jQuery & AngularJS by zairwolf
 * 
 *	Source: https://github.com/zairwolf/stickyNotes/blob/master/data.php
 *
 *	Author: Hai Zheng @ https://www.linkedin.com/in/zairwolf/
 *
 */
 -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-bootstrap/0.5pre/assets/css/bootstrap.min.css">
<script src="jquery.minicolors.js"></script>
<link rel="stylesheet" href="jquery.minicolors.css">
<link rel="stylesheet" href="jquery.postitall.css">
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
<script type="text/javascript">
	var _requestUrl = 'data.php?';
</script>
<script type="text/javascript" src="stickyNotes.app.js"></script>

<div ng-app='noteApp' ng-controller='noteCtrl'>
	<button class="btn btn-xs btn-primary" ng-click="add()">Add</button>
	<div ng-repeat="(key, note) in notes" class="block panel PIApostit ui-draggable ui-resizable" ng-style="{'left': note.left, 'top': note.top, 'width': note.width, 'height': note.height, 'color': note.color, 'background-color': note.bgColor, 'z-index' : note.zindex}" noteid="{{ note.id }}" draggable>
		<div class="front">
			<div class="PIAtoolbar" style="cursor: move;">
				<div class="PIAconfig PIAicon" config></div>
				<div class="PIAdelete PIAicon" delete></div>
				<div class="ui-widget float-left hide">
					<div class="PIAwarning">
						<a href="#" suredelete><span class="PIAdelyes PIAicon"></span></a>
						Sure?
						<a href="#" canceldelete><span class="PIAdelno PIAicon2 float-right"></span></a>
					</div>
				</div>
				<span class="date">
					{{ note.date }}
					{{ note.user }}
				</span>
			</div>
			<div id="noteCon{{ note.id }}" class="PIAeditable PIAcontent" contenteditable="true" ng-style="{'text-shadow': note.textShadow ? textShadow : ''}" ng-bind-html="note.content | html"></div>
		</div>
		<div class="back hide">
			<div class="PIAtoolbar">
				<div class="PIAclose PIAicon" style="cursor: move;" close></div>
			</div>
			<div class="PIAcontent">
				<label style="display:block;">Background-color:<br />
				<input class="minicolors" value="{{ note.bgColor }}" style="width: 75px;" bgColor></label>
				<label style="display:block;">Text color:<br />
				<input class="minicolors" value="{{ note.color }}" style="width: 75px;" color></label>
				<label style="display:block;">
					<input type="checkbox" value="1" checked="{{ note.textShadow=="1" }}" textshadow> Text shadow
				</label>
			</div>
		</div>
		<div class="status hide" status>Saving...</div>
		<div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div>
		<div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
		<div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div>
	</div>
</div>
