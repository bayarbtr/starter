var uiController = (function() {
    var DOMstrings = {
      inputType: ".add__type",
      inputDescription: ".add__description",
      inputValue: ".add__value",
      addBtn: ".add__btn",
      incList: ".income__list",
      extList: ".expenses__list",
      incHtml: '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
      extHtml: '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">$$$Per$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
      anhaar: "Ta utga oruulna uu ...",
      budgetVal: ".budget__value",
      budgetInc: ".budget__income--value",
      BudgetExp: ".budget__expenses--value",
      budExpPer: ".budget__expenses--percentage",
      containetDiv: ".container",
      expPercenteg: ".item__percentage",
      title: ".budget__title"
    };
  
    var nodelistForEach = function (list, callback) {
    for(var i=0; i<list.length; i++)  
      callback(list[i],i);
    };
    var formarDisplaye = function(too,type){
      too = ""+too;
      var x = too.split("").reverse().join("");
      var y = '';
      var count = 1;
      for(var i=0; i < x.length; i++)
      {
        y = y + x[i];
        if( count%3 === 0 ) y = y + ',';
        count ++;
      }
      var z = y.split("").reverse().join("");
      if(z[0] === ',') z = z.substr(1, z.length - 1);
      if (type === "inc") {z=" + " + z;}
      else {z=" - " + z;}
      return z;
    };
    return {
        changex: function(){
            var fields = document.querySelectorAll(DOMstrings.inputType+","+DOMstrings.inputDescription+","+DOMstrings.inputValue);
            nodelistForEach(fields,function(el){
            el.classList.toggle("red-focus");
            });
            document.querySelector(DOMstrings.addBtn).classList.toggle("red");
        },
        displayeDate: function(){
          var unudur = new Date();
          document.querySelector(DOMstrings.title).textContent = unudur.getFullYear() + " оны " + (unudur.getMonth()+1) + " сарын САНХҮҮ"; 
        },
            getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseInt(document.querySelector(DOMstrings.inputValue).value)
        };
      },
      anhaaruulga:function(){
        alert(DOMstrings.anhaar);
      },
      getDOMstrings: function() {
        return DOMstrings;
      },
      clearField: function(){
        var field = document.querySelectorAll(DOMstrings.inputDescription+ "," + DOMstrings.inputValue );
        var fieldArr = Array.prototype.slice.call(field);
        fieldArr.forEach(function(el) {
          el.value='';          
        });
        fieldArr[0].focus();
      },
      deleteListItem: function(id){
        var el = document.getElementById(id);
        el.parentNode.removeChild(el);
      },
      addListItem: function(item, type) {
        var html, list;
        if (type === "inc") {
          list = DOMstrings.incList;
          html =DOMstrings.incHtml;
        } else {
          list = DOMstrings.extList;
          html = DOMstrings.extHtml;
        }
        html = html.replace("%id%", item.id);
        html = html.replace("$$DESCRIPTION$$", item.description);
        html = html.replace("$$VALUE$$", formarDisplaye(item.value,type));
  
        document.querySelector(list).insertAdjacentHTML("beforeend", html);
      },
      addPercenteg: function(percenteg){
          
          var html = document.querySelectorAll(DOMstrings.expPercenteg);
          nodelistForEach(html, function(el, index){
            el.textContent = percenteg[index];
          });
      },

      tusuvHaruulah10: function(tusul){
        var type;
        if (tusul.tusuv>=0) type = "inc";
        else type = "exp";
        document.querySelector(DOMstrings.budgetVal).textContent = formarDisplaye(tusul.tusuv, type);
        document.querySelector(DOMstrings.budgetInc).textContent = formarDisplaye(tusul.totalInc,"inc");
        document.querySelector(DOMstrings.BudgetExp).textContent = formarDisplaye(tusul.totalExp,"exp");
        if (tusul.huvi === 0)
            document.querySelector(DOMstrings.budExpPer).textContent = tusul.huvi;
        else 
            document.querySelector(DOMstrings.budExpPer).textContent = tusul.huvi+"%";
      }
    };
  })();
  
var financeController = (function() {
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };
  
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
      if (totalIncome > 0)
        this.percentage = Math.round((this.value / totalIncome) * 100);
      else this.percentage = 0;
    };
  
    Expense.prototype.getPercentage = function() {
      return this.percentage;
    };

    var calculateTotal = function(type) {
      var sum = 0;
      data.items[type].forEach(function(el) {
        sum = sum + el.value;
      });
  
      data.totals[type] = sum;
    };
    var data = {
      items: {
        inc: [],
        exp: []
      },
  
      totals: {
        inc: 0,
        exp: 0
      },
      tusuv: 0,

      huvi: 0
    };
  
    return {
      tusuvTootsooloh: function() {
        calculateTotal("inc");
        calculateTotal("exp");
        data.tusuv = data.totals.inc - data.totals.exp;
        if (data.totals.inc>0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
        else data.huvi =0;
      },
      calculatePercentages: function() {
        data.items.exp.forEach(function(el) {
          el.calcPercentage(data.totals.inc);
        });
      },
  
      getPercentages: function() {
        var allPercentages = data.items.exp.map(function(el) {
          return el.getPercentage();
        });
  
        return allPercentages;
      },
      tusviigAvah: function() {
        return {
          tusuv: data.tusuv,
          huvi: data.huvi,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp
        };
      },

      addItem: function(type, desc, val) {
        var item, id;
  
        if (data.items[type].length === 0) id = 1;
        else {
          id = data.items[type][data.items[type].length - 1].id + 1;
        }
  
        if (type === "inc") {
          item = new Income(id, desc, val);
        } else {
          item = new Expense(id, desc, val);
        }
  
        data.items[type].push(item);
  
        return item;
      },
  
      seeData: function() {
        return data;
      },
      deleteItem: function(type, id){
        var ids = data.items[type].map(function(el){
            return el.id
        });
        var index = ids.indexOf(id);
        if (index !== -1) data.items[type].splice(index,1);
      }
    };
  })();
  
var appController = (function(uiController, financeController) {
    var ctrlAddItem = function() {
      var input = uiController.getInput();
        if (input.description!=="" && input.value!=="")
        {     
          var item = financeController.addItem(
          input.type,
          input.description,
          input.value
          )
          uiController.addListItem(item, input.type);
          uiController.clearField();
            updateTootsoo();
        }
        else uiController.anhaaruulga();
    };
  var updateTootsoo = function() {
    financeController.tusuvTootsooloh();
    var tusuv = financeController.tusviigAvah();
    uiController.tusuvHaruulah10(tusuv);
    financeController.calculatePercentages(); 
    var allPercentages = financeController.getPercentages();
    uiController.addPercenteg(allPercentages);

  };
    var setupEventListeners = function() {
      var DOM = uiController.getDOMstrings();
      document.querySelector(DOM.addBtn).addEventListener("click", function() {
        ctrlAddItem();
      });
      document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) ctrlAddItem();
      });
      document.querySelector(DOM.containetDiv).addEventListener("click", function(event){
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
        var arr = id.split("-");
        var type = arr[0];
        var itemId = parseInt (arr[1]);
        //console.log(type + "     -    " + itemId );
          financeController.deleteItem(type,itemId);
          uiController.deleteListItem(id);
          updateTootsoo();
        }

      });
      document.querySelector(DOM.inputType).addEventListener("change", uiController.changex);
    };
  
    return {
      init: function() {
        console.log("Application started...");
         uiController.displayeDate();
        uiController.tusuvHaruulah10({
          tusuv: 0,
          huvi: 0,
          totalInc: 0,
          totalExp: 0
        });
        setupEventListeners();
      }
    };
  })(uiController, financeController);
  
  appController.init();