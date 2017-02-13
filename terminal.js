
$('.active').focus();

var cursorPosition = 0;
var user = "ryan";
var hostname = "tim";
var exitStatus = 0;

var filesystem = {
	"/" : {
		"etc" : {
			"hostname" : "www.ryanl.co.uk",
			"redhat-release" : "CentOS Linux release 7.3.1611 (Core)"
		},
		"home" : {
			"testfile" : "This is a test file",
			"ryan" : {
				"pgpkey" : "-----BEGIN PGP PUBLIC KEY BLOCK----- <br>\
xsBNBFiOLzMBCADOff8IZQx/SS4ASBTKOZBmfo8IScElprMC6BjFvVSKIG+J<br>\
pd4LlDPDXOtJ+8ZijqMqkyuuqURFwRbpDR1sBTUk3E7lKmLTiPZjubEoQPCO<br>\
UC6p3r0yl6Vf891o6yyAl0PZMT95cPiKEuHuBbAYN08qNmZ6JScsVvfSBraV<br>\
ZeJW2byTfnaKwe4CatnkfAbnSY6HaN0A7DRNny4uzTAETj18Ht2abBVuTVAC<br>\
2fBWmx8q4gS6ZsVc8q5eDhGdmHSAc5Vg5GkmdsolWMYWdc25b8fJPPJDcOUd<br>\
FdLwC3fdvez6RKUrrA04MsG54Bs+50CmgJRkVwSZWAbQ9f9hZK3jdHtPABEB<br>\
AAHNLWxpbm5pdEBwcm90b25tYWlsLmNvbSA8bGlubml0QHByb3Rvbm1haWwu<br>\
Y29tPsLAdQQQAQgAKQUCWI4vNAYLCQcIAwIJEE5R9o8K1Eq/BBUIAgoDFgIB<br>\
AhkBAhsDAh4BAABJ9Qf7BDn3MS4HR7esPEfiibGHjUFHpPa/lsa1+ZJaPKiu<br>\
6CNGN1OxIUMmEiOn8s8FDQplkgnMaqPOVkGFgffevjisiqDwUVBwF+LIkxev<br>\
ysr3XfysP30N3O143qfJBNmg4imY653hMi2tyrrB3NPlRfUa7Q0UHRtwhrcO<br>\
qpqn9bOa021SUnTLY4ILj+urMpEWL87ImeE4qCld1aay/SUQHTUkL7rtryuO<br>\
Nm6ZG1SRN2euJvX16s4XEVp52Hy7JPLzYOwQo4raW2VZyp+h5+7GVEkvydo7<br>\
FJfjSOGQl9mK9gFEaojrEERY69Hc4McXDg+DpLlpYa7kHaEOHkIDAwWYKqHj<br>\
DM7ATQRYji8zAQgAoScG4OwfEezF8llVju1zJwQNtN8umuH/4GqjQ/Z7buxh<br>\
swxdv5itVMVP4nkl+ukxdhK57VKySWtJ4Ut0ExNmtAzEhI1kg3j7U9/+vScJ<br>\
Gfx9ihkoDQLC97YEIQb5BwkhaEcuivPV+ywpD4hFc/nIAeqI+xuuudjguar7<br>\
r9s2WBhYTS9t1+SCdFEiIPLUAu24KdOcJrAfXiK0YeeoQ/cX/cMH/3tIpiks<br>\
Z0w0d4YebflGCB7V+epPeE+d0SdEnOON9XzgC5h0RIO4rAEpQGQZ/90bCuhG<br>\
jWfOhtzBPPSs+JU6UyzwIvIGGuGqXipeagDYKyQZfcAaw6oHEvnQyNSavQAR<br>\
AQABwsBfBBgBCAATBQJYji80CRBOUfaPCtRKvwIbDAAAGmEIAKCYMLyXO3HZ<br>\
wMuvyWXnZ4311eoqWOZvFmm05sFM2eitDvRFSF+T7RkxGHSf0bVvt5nhpizB<br>\
TYMft8h1Qb0vRtVU09pPsbIPeeKx0DQVmjqBCdsisSBdXD1Gxe++AvpIfMRm<br>\
nj+1osGXTrmNb6dqJPTnywfBsNrdI9hUp1yvxLgk+61vQDnKAqKnc8nvd4rr<br>\
5shrI/99IdF7ku8aFZNzZgfW8y2A/wA7slfUw8yuqbV++2rMXqxcK+2MhORX<br>\
DNapP3PG5FdhCkWrsIzpd/Q6HRbEC087cOZ/9igQOJdztstHjCbhlME6J1Gs<br>\
ivdE5tDRduEYPMjfK+p3VHoNivZS7XQ=<br>\
<br>\
=PL6b<br>\
<br>\
-----END PGP PUBLIC KEY BLOCK-----<br>\
"
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

var commands = {
	"help"		: "execHelp",
	"clear"		: "execClear",
	"cat"		: "execCat",
	"hostname"	: "execHostname",
	"history"	: "execHistory",
	"pwd"		: "execPwd",
};

var cwd = users[user][0];

var commandHistory = [];
var lineNumber = 0;

$(function(){
	$('.term').append('<div>['+user+'@'+hostname+' ~]# <span class="active_command"></span><span class="cursor">_</span></div>');

	$(document).on('click', function() {
		$('.active').focus();
	});

	$('.pgp').on('click', function() {
		$('.active').val("cat /home/ryan/pgpkey");
		cursorMove("cat /home/ryan/pgpkey".length);
	});

	$(document).keydown(function(event){
		console.log("KeyCode", event.keyCode);

		switch (event.keyCode) {
			case 13:
				// Return
				$('.cursor').remove();
				$('.active_command').addClass('oldCommand');
				$('.active_command').removeClass('active_command');

				if ($('.active').val().length !== 0) {
					output = parseCommand($('.active').val());
					commandHistory.push($('.active').val());
					lineNumber = commandHistory.length;
				
					if (output) {
						$('.term').append('<div>'+output+'</div>');
					}
				}

				if (cwd === users[user][0]) {
					pscwd = "~";
				}

				$('.term').append('<div>['+user+'@'+hostname+' ' +pscwd+ ']# <span class="active_command"></span><span class="cursor">_</span></div>');
				$('.term').scrollTop($('.term')[0].scrollHeight);

				$('.active').val('');
				break;
			case 37:
				// Left arrow
				cursorMove(-1);
				break;
			case 38:
				// Up arrow
			
				if (lineNumber > 0) {
					stuff = commandHistory[--lineNumber];
					console.log(stuff);
					//movement = stuff.length - $('.active').val().length;

					$('.active').val(stuff);

					//cursorMove(movement);
					cursorMove(0);
				}

				break;
			case 39:
				// Right arrow
				cursorMove(1);
				break;
			case 40:
				// Down arrow
				// ?
			case 46:
				// Delete
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
		setTimeout(function() {
			$('.active').focus();
		}, 1);
	});

});

function cursorMove(direction) {
	command = $('.active').val();

	//if (command == "") {
	//	setTimeout(function() {
	//		command = $('.active').val();
	//	}, 1000);
	//}

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
	if (typeof window[commands[command[0]]] === "function") {
		return window[commands[command[0]]](command);
	} else {
		return command[0] + " :command not found";
	}
}

function execHelp() {
	var helpText = "You want help? \
		<br> \
		<br> \
		help: list commands<br> \
		clear: clear the terminal screen<br> \
		cat: Concatenate FILE(s)<br> \
		history: display the command history list with line numbers<br> \
		hostname: display hostname or set hostname<br> \
		pwd: print name of current/working directory";

	exitStatus = 0;
	return helpText;
}

function execClear() {
	exitStatus = 0;
	$('.term').html('');
}

function execPwd(args) {
	exitStatus = 0;
	return cwd;
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

// [TODO] How..
function writeFile(file, data) {
	file = getFullFilePath(file);

	filePath = file.split('/');

	// ?
	for (i = 0; i <= filePath.length; i++) {
		console.log(filePath[i]);
	}

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

function execCat(args) {
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
	
	exitStatus = status;

	return output;
}

function execHistory(args) {
	historyOutput = "";

	commandHistory.forEach(function(element, index) {
		historyOutput += index + " : " + element + "<br>";
	});

	exitStatus = 0;
	return historyOutput;
}

function execHostname(args) {
	if (args[1] === undefined || args[1].length === 0) {
		exitStatus = 0;
		return hostname;
	} else if (/[\w\d\.-]+/g.test(args[1])) {
		setHostname(args[1]);
		exitStatus = 0;
	} else {
		exitStatus = 1;
		return "hostname: the specified hostname is invalid";
	}
}

function setHostname(arg) {
	hostname = arg;
	//writeFile("/etc/hostname", arg);
}

// [TODO] Finish this.. how?
function tabComplete() {
	command = $('.active').val();
	command = command.split(' ');

	if (command.length === 1) {
		console.log("Suggest a command");
		possibleCommands = [];
		Object.keys(commands).forEach(function(element) {
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
	} else {
		console.log("Suggest a file");
	}

	console.log(command);
}
