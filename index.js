RABKIN_TEST = [
	//1
	{ name: "96", type: "number"},
    { name: "коло трикутник", type: "shapes"},
    { name: "9", type: "number", protanopia: "5", deuteranopia: "5"},
    { name: "трикутник", type: "shapes", protanopia: "коло", deuteranopia: "коло"},
    { name: "13", type: "number", protanopia: "6", deuteranopia: "6"},

	//6
    { name: "коло трикутник", type: "shapes", protanopia: "-", deuteranopia: ""},
    { name: "96", type: "number", deuteranopia: "6"},
    { name: "5", type: "number"},
    { name: "9", type: "number", protanopia: "8;6", deuteranopia: "8;6"},
    { name: "136", type: "number", protanopia: "66;68;69", deuteranopia: "66;68;69"},

	//11
    { name: "коло трикутник", type: "shapes", protanopia: "трикутник", deuteranopia: "коло"},
    { name: "12", type: "number", protanopia: "-"},
    { name: "коло трикутник", type: "shapes", protanopia: "коло", deuteranopia: "трикутник"},
    { name: "30", type: "number", protanopia: "106", deuteranopia: "16"},
    { name: "коло трикутник", type: "shapes", protanopia: "трикутник трикутник sqr", deuteranopia: "трикутник квадрат"},
    
	//16
	{ name: "96", type: "number", protanopia: "9", deuteranopia: "6"},
    { name: "коло трикутник", type: "number", protanopia: "трикутник", deuteranopia: "коло"},
    { name: "=", type: "series", protanopia: "||", deuteranopia: "||"},
    { name: "95", type: "number", protanopia: "5", deuteranopia: "5"},
    { name: "коло трикутник", type: "shapes", protanopia: "-", deuteranopia: "-"},
    
	//21
	{ name: "||", type: "series", protanopia: "=", deuteranopia: "="},
    { name: "66", type: "number", protanopia: "6", deuteranopia: "6"},
    { name: "36", type: "number"},
    { name: "14", type: "number"},
    { name: "9", type: "number"},
    { name: "4", type: "number"},
    { name: "13", type: "number", protanopia: "-", deuteranopia: "-"},
]

function deepcopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

$(document).ready(function () {

	AppModel = function () {
		var self = this;

		self.adminMode = ko.observable(false);
		// self.adminMode = ko.observable(true);
		self.goAdminMode = function () {
			self.adminMode(true);
		}
		self.goPatientMode = function () {
			self.adminMode(false);
		}
		
		self.navbar = ko.observable('tests');
		
		self.sidebar = ko.observable('test'); 
	}
	app = new AppModel();
    ko.applyBindings(app, $('.navbar')[0]);
    // ko.applyBindings(app, $('.sidebar')[0]);


	// ==============================
	// Questions 
	// ==============================
	RabkinTestModel = function (answers) {
		// console.log("rabkin, self", self, answers);
		var self = JSON.parse(JSON.stringify(this));
		// console.log("rabkin, self", self, answers);

		self.add = function(row) {
			var v = JSON.parse(JSON.stringify(row));
			var item = v;
			$.extend(item, {
				id: self.questions().length + 1,
				// answer: ko.observable(v.answer),
				answer: ko.observable(false),
				user_input: ko.observable(''),
			});
			// console.log(item)
			self.questions.push(item);
        };

		// init with answers and ids  
        self.questions = ko.observableArray([]);
		$(answers).each(function (k,v) {
			// var ans = ko.observable(v.answer);
			self.add(v)
		});

		self.currentTest = ko.observable(0);
		
		self.test = ko.computed(function () {
			var j = self.currentTest();
			// console.log("ans j", self.answers())
			var id = self.questions()[j].id;
			var type = self.questions()[j].type;
			var user_input = self.questions()[j].user_input;

			var ans;
			var correct_answer =  self.questions()[j].name;
			if (user_input() == correct_answer) {
				ans = true;
			} else {
				ans = false;
			}
			self.questions()[j].answer(ans);
			console.log("test", user_input(), correct_answer, ans)
			return {
				'id': id,
				'image': "./img/demo.png",
				'type': type,
				'user_input': user_input,
				'answer': ans,
			}
		});
		
		self.next = function () {
			if (self.currentTest() < self.questions().length) {
				self.currentTest(self.currentTest() +1);
			}
		};
		self.prev = function () {
			if (self.currentTest() > 0) {
				self.currentTest(self.currentTest() -1);
			}
		};

		return self;
	}
    rabkinTestModel = new RabkinTestModel(RABKIN_TEST);
    ko.applyBindings(rabkinTestModel, $('.test.rabkin')[0]);
	// bindings
	$('.test.rabkin a img').click(function () {
		return false;
	});


	// ==============================
	// Report 
	// ==============================
    AnswerModel = function(answers) {
        var self = this; 
        self.answers = ko.observableArray([]);

		self.add = function(row) {
			var v = JSON.parse(JSON.stringify(row));
			var item = $.extend(v, {
				id: self.answers().length + 1,
				answer: ko.observable(v.answer),
				'user_input': ko.observable(''),
				'deuteranopia': v.deuteranopia ? v.deuteranopia : '',
				'protanopia': v.protanopia ? v.protanopia : '',
			});
			// console.log("add", v, item);
			self.answers.push(item);
			$(".text-popover").popover();
        };

		$(answers).each(function (k,v) {
			// var ans = ko.observable(v.answer);
			// console.log("ans", ans(), "v", v);
			self.add(v);
			// self.add(v)
		});

		self.load = function (answers_array) {
			console.log("load", answers_array)
			var v, item;
			for (var i=0; i < self.answers().length; i++) {
				//console.log("load", self.answers()[i], answers_array[i])
				v = deepcopy(answers_array[i]);
				// console.log("load for ", v, v.name, "'"+v.user_input+"'", v.answer);
				item = v
				$.extend(item, {
					'id': v.id,
					'answer': self.answers()[i].answer(v.answer),
					'user_input': self.answers()[i].user_input(v.user_input)
				});
				// console.log("load v", v, "item", item);
				$.extend( self.answers()[i], item );
			}
		};
		

        self.remove = function(answer) {
            self.answers.remove(answer);
        };
		
		self.toggle = function (answer) {
			answer.answer(answer.answer() ? false : true);
		};

        self.save = function(form) {
			var json = ko.utils.stringifyJson(self.answers);
            console.warn("Could now transmit to server: " + json);
			return json;
        };

		rabkinTestModel.test.subscribe(function (newValue) {
			var res = ko.toJS(rabkinTestModel.questions());
			self.load(res);
		})

		self.diagnosis = ko.computed(function () {
			var res = ko.toJS(rabkinTestModel.questions);

			var pluses = 0, protanopia = 0, deuteranopia = 0;
			for (var i = 0; i < self.answers().length; i++){
				if (self.answers()[i].answer()) pluses++;
				var item = self.answers()[i]

				var d = self.answers()[i].deuteranopia.split(";")
				$(d).each(function (k,v) {
					console.log("item", item.user_input(), "v", v)

					if ((item.user_input() != '') && 
						(item.user_input() == v)){
						console.log("d++")
						deuteranopia++;
					}
				});
				var p = self.answers()[i].protanopia.split(";")
				$(p).each(function (k,v) {
					if ((item.user_input() != '') && 
						(item.user_input() == v)){
						protanopia++;
					}
				});
			}
			console.log("diangnosis", pluses)

			return {
				'trichromacy': Math.round(pluses/27*10000)/100,
				'protanopia': Math.round(protanopia/8*10000)/100,
				'deuteranopia': Math.round(deuteranopia/9*10000)/100,
				'a_trichromacy': Math.round(pluses/2+deuteranopia+protanopia/27*10000)/100,
			}
			
			if (pluses == 0) {
				return "Монохромазия"
			} else if (pluses > 0 && pluses < 10) {
				return "Протанопия"
			} else if (pluses <= 10 && pluses < 15) {
				return "Дейтеранопия"
			} else if (pluses <= 15 && pluses < 20) {
				return "Аномальная трихромазия"
			} else {
				return "Нормальная трихромазия"
			}
		});

		//init
		var res = ko.toJS(rabkinTestModel.questions());
		self.load(res);
		
		return self;
    };
    viewModel = new AnswerModel(RABKIN_TEST);
    // ko.applyBindings(viewModel, $('.answers.rabkin')[0]);
    ko.applyBindings(viewModel, $('.answers.rabkin')[0]);
    
	$(".text-popover").popover({'title':'Изображение'});

});
