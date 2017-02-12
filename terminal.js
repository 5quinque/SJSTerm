
$('.active').focus();

var active_line = 1;
var cursorPosition = 0;
var user = "ryan";
var hostname = "tim";

var filesystem = {
	"/" : {
		"etc" : {
			"hostname" : "www.ryanl.co.uk",
			"redhat-release" : "CentOS Linux release 7.3.1611 (Core)"
		},
		"home" : {
			"testfile" : "This is a test file",
			"ryan" : {
				"pgpkey" : "This is my PGP Key!"
			}
		},
		"root" : {
		}
	}
}

var users = {
	"ryan" : [ "/home/ryan" ],
	"root" : [ "/root" ],
}

var commands = ["help", "clear", "cat", "test", "hostname", "pwd"];

var cwd = users[user][0];

$(function(){
	$('.term').append('<div>['+user+'@'+hostname+' ~]# <span class="active_command"></span><span class="cursor">_</span></div>');

	$(document).on('click', function() {
		$('.active').focus();
	});

	$(document).keydown(function(event){
		//console.log("KeyCode", event.keyCode);

		switch (event.keyCode) {
			case 13:
				// Return
				$('.cursor').remove();
				$('.active_command').addClass('oldCommand');
				$('.active_command').removeClass('active_command');

				output = parseCommand($('.active').val());

				if (output) {
					$('.term').append('<div>'+output+'</div>');
				}

				if (cwd === users[user][0]) {
					pscwd = "~";
				}

				$('.term').append('<div>['+user+'@'+hostname+' ' +pscwd+ ']# <span class="active_command"></span><span class="cursor">_</span></div>');
				$('.term').scrollTop($('.term')[0].scrollHeight);

				$('.active').val('');
				break;
			case 37:
				console.log("Left arrow!");
				cursorMove(-1);
				break;
			case 39:
				console.log("Right arrow");
				cursorMove(1);
				break;
			case 46:
				setTimeout(function(){
					cursorMove(0);
				}, 1);
				break;
			case 8:
				// Backspace
				setTimeout(function(){
					cursorPosition--;
					cursorMove(0);
				}, 1);
				break;
			case 9:
				// Tab
				console.log("Tab!");
				tabComplete();
				break;
			default:
				if (event.keyCode === 0 || (event.keyCode >= 32 && event.keyCode <= 222)) {
					setTimeout(function(){
						cursorPosition++;
						cursorMove(0);
					}, 1);
				}
				break;
		}
	});

	$('.active').focusout(function() {
		setTimeout(function(){
			$('.active').focus();
		}, 1);
	});

});

function cursorMove(direction) {
	command = $('.active').val();
	//command = command.replace("<", "&lt;");
	//command = command.replace(">", "&gt;");
	length = command.length;

	cursorPosition = cursorPosition + direction;

	if (cursorPosition < 0) {
		cursorPosition = 0;
		return false;
	}

	if (cursorPosition > length) {
		cursorPosition = length;
		return false;
	}

	if (command.substr(cursorPosition, 1).length == 1) {
		$('.cursor').hide();
	} else {
		$('.cursor').show();
	}

	newHtml = command.substr(0, cursorPosition) + '<span class="onCursor">' + command.substr(cursorPosition, 1)+ '</span>' + command.substr(cursorPosition +1);

	$('.active_command').html(newHtml);
}


function parseCommand(command) {
	command = command.split(' ');
	switch (command[0]) {
		case "help":
			var helpText = "You want help? \
				<br> \
				<br> \
				help: list commands<br> \
				clear: clear the terminal screen<br> \
				cat: Concatenate FILE(s)<br> \
				hostname: display hostname or set hostname<br> \
				pwd: print name of current/working directory";

			return helpText;
			break;
		case "clear":
			$('.term').html('');
			break;
		case 'cat':
			fileContents = cat(command);
			return fileContents[1];
			break;
		case 'test':
			return readFile('pgpkey');
		case 'hostname':
			return execHostname(command[1]);
			break;
		case 'pwd':
			return cwd;
			break;
		case '':
			break;
		default:
			return "Command not found!";
	}
}

function readFile(file) {
	file = getFullFilePath(file);

	filePath = file.split('/');

	cfs = filesystem["/"];
	filePath.forEach(function(element, index) {
		if (index !== 0) {
			console.log(element);
			cfs = cfs[element];
		}
	});

	if (cfs !== undefined) {
		return [0, cfs];
	} else {
		return [1];
	}
}

function getFullFilePath(file) {
	if (!/^\.?\.?\//g.test(file)) {
		file = cwd + '/' + file;
	} else if (/^\.\//g.test(file)) {
		file = cwd + '/' + file.split('/').slice(1);
	} else if (/^\.\.\//g.test(file)) {
		file = cwd.split('/').splice(0, cwd.split('/').length-1).join('/') + '/' + file.split('/').slice(1);
	}

	return file;
}

function cat(args) {
	status = 0;
	output = "";

	args.forEach(function(element, index) {
		if (index !== 0) {
			file = readFile(element);
			if (file[0] === 0) {
				output += file[1];
			} else {
				output += "cat: " + element + ": No such file or directory";
				status = 1;
			}
		}
	});

	return [status, output];
}

function execHostname(arg) {
	if (arg !== undefined) {
		setHostname(arg);
	} else {
		return hostname;
	}
}

function setHostname(arg) {
	hostname = arg;
	//writeFile("/etc/hostname", arg);
}

function tabComplete() {
	command = $('.active').val();
	command = command.split(' ');

	if (command.length === 1) {
		console.log("Suggest a command");
		possibleCommands = [];
		commands.forEach(function(element) {
			if (element.indexOf(command[0]) === 0) {
				possibleCommands.push(element);
				console.log(element);
			}
		});


		if (possibleCommands.length === 1) {
			movement = possibleCommands[0].length - command[0].length;

			$('.active').val(possibleCommands[0]);
			cursorMove(movement);
		}
	}

	console.log(command);
}
