<?php
/**
 *	StickyNotes v1.0 in PHP & jQuery & AngularJS by zairwolf
 * 
 *	Source: https://github.com/zairwolf/stickyNotes/blob/master/data.php
 *
 *	Author: Hai Zheng @ https://www.linkedin.com/in/zairwolf/
 *
 */

$action = $_REQUEST['action'];
define('TS', time());//take timestamp as id

//read notes from db or wherever you want
if($action == 'getNotes') {
	//use a md5 to check if need to return the notes list
	$md5 = file_get_contents('md5.txt');
	if(isset($_GET['md5']) && $_GET['md5'] == $md5) exit('[]');//notes no change

	$notes = unserialize(file_get_contents('data.txt'));
	$data = array(
		'md5'	=> $md5,
		'notes'	=> $notes,
	);
	exit(json_encode($data));
}

//save note
if($action == 'setNote'){
	$id = !empty($_POST['id']) ? $_POST['id'] : false;
	if(!$id) exit(json_encode(array('error'=>'no id')));
	$_fields = array('left', 'top', 'width', 'height', 'color', 'textShadow', 'bgColor', 'content');//'zindex' auto9999 and minus others
	$data = array();
	foreach ($_fields as $value) {
		if(isset($_POST[$value])) $data[$value] = $_POST[$value];
	}
	$data['zindex'] = 9999;
	//read data
	$notes = unserialize(file_get_contents('data.txt'));
	foreach ($notes as $key => $value) {
		if($value['zindex'] > 1) $notes[$key]['zindex']--;
	}
	//new note
	if($id == -1){
		//insert your data
		if(empty($data['content'])) exit(json_encode(array('error' => 'no content')));
		$data['id'] = TS;
		$notes[] = $data;
		//store data
		file_put_contents('data.txt', serialize($notes));

		//return id
		file_put_contents('md5.txt', TS);
		exit(json_encode(array('id' => TS)));
	}

	//update all the info (NOTE: if content exists, don't allow it to be empty)
	if(isset($_POST['content']) && empty($_POST['content'])) exit(json_encode(array('error' => 'no content')));
	//replace note
	foreach ($notes as $key => $value) {
		if($value['id'] != $id) continue;
		$notes[$key] = array_merge($value, $data);
	}
	//store data
	file_put_contents('data.txt', serialize($notes));

	//mark md5 and return
	file_put_contents('md5.txt', TS);
	exit(json_encode(array('id' => $id)));
}

//delete note
if($action == 'delNote'){
	$id = !empty($_GET['id']) ? $_GET['id'] : false;
	//read data
	$notes = unserialize(file_get_contents('data.txt'));
	//delete
	foreach ($notes as $key => $value) {
		if($value['id'] != $id) continue;
		unset($notes[$key]);
	}
	//store data
	file_put_contents('data.txt', serialize(array_values($notes)));

	//return
	file_put_contents('md5.txt', TS);
	exit(json_encode(array('id' => $id)));
}