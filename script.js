function set()
{
	btnInit();
	baseInit();
	dis.wriToScr();
}

function btnInit()
{
	var btnList = document.getElementsByTagName("button");
	for(i = 0;i <btnList.length;i++)
	{
		if(btnList[i].innerHTML == "")
			btnList[i].disabled = true;
		else
			btnList[i].addEventListener("click",btnClicked);
	}
	btnHandle.clickAc();
}

function btnClicked(event)
{
	btnHandle.btnClicked(event);
}

function baseInit()
{
	var baseList = document.getElementsByTagName("li");
	for(i = 0;i < baseList.length;i++)
		baseList[i].addEventListener("click",changeScreenBase);
}

function changeScreenBase(event)
{
	dis.changeBase(event);
	dis.wriToScr();
	btnHandle.clickAc();
}

window.addEventListener("load",set);

var currentNum = {
	num : "0",
	base : 10,
	
	illegal()
	{
		return this.num == "NaN";
	},
	
	clr()
	{
		this.num = "0";
	},
	
	setNum(num)
	{
		this.num = num.toUpperCase();
	},
	
	setBase(base)
	{
		var val;
		val = this.getVal();
		this.base = base;
		this.val = this.setVal(val);
	},
	
	getBase()
	{
		return this.base;
	},
	
	neg()
	{
		this.setVal(-1 * this.getVal());
	},
	
	isNeg()
	{
		return this.getVal() < 0;
	},
	
	backSpace()
	{
		this.num = this.num.substr(0,this.num.length - 1);
		if(this.num == "")
			this.num = "0";
	},
	
	addNum(d)
	{
		if(this.num == "0")
			this.num = "";
		this.num = this.num + d;
	},
	
	setVal(value)
	{
		this.num = convert(value, this.base);
	},
	
	getVal()
	{
		return parseInt(this.num, this.base);
	},
	
	getNum()
	{
		return this.num;
	},
}

function convert(val, base)
{
	if(isNaN(val))
	{
		console.log(val);
		return val;
	}
	else if(base == 10 || val == NaN)
		return val;
	else
		return (val>>>0).toString(base).toUpperCase();
}

var dis = {
	
	wriToScr()
	{
		var number = currentNum.getNum();
		var val = currentNum.getVal();
		document.getElementById("answer").innerHTML = number;
		document.getElementById("hex").innerHTML = convert(val, 16);
		document.getElementById("dec").innerHTML = convert(val, 10);
		document.getElementById("oct").innerHTML = convert(val, 8);
		document.getElementById("bin").innerHTML = convert(val, 2);
	},
	
	changeBase(event)
	{
		
		
		var base;
		switch(event.currentTarget.firstElementChild.lastElementChild.id)
		{
			case "hex":
				base = 16;
				break;
			case "dec":
				base = 10;
				break;
			case "oct":
				base = 8;
				break;
			case "bin":
				base = 2;
				break;
			default :
		}
		currentNum.setBase(base);
	},
	
	
}

var btnHandle = {
	
	clickAc()
	{
		var base = currentNum.getBase();
		var btnList = document.getElementsByClassName("num");
		for(i = 0;i < btnList.length;i++)
		{
			var number = btnList[i].innerHTML;
			if(base != 16 && isNaN(number))
				btnList[i].disabled = true;
			else if(!isNaN(number) && number >= base)
				btnList[i].disabled = true;
			else
				btnList[i].disabled = false;
		}
	},
	
	btnClicked(event)
	{
		if(currentNum.illegal())
			currentNum.clr();
		switch(event.target.className)
		{
			case "num":
				this.num(event);
				break;
			case "base":
				this.bs();
				break;
			case "op":
				this.op(event);
				break;
			case "neg":
				this.neg();
				break;
			case "c":
				this.cClicked();
				break;
			case "ce":
				this.ce();
				break;
			case "eval":
				this.evalu();
				break;
			case "bs":
				this.bs();
				break;
			default :
		}
	},
	
	num(event)
	{
		if(expHandle.isEval())
			currentNum.clr();
		currentNum.addNum(event.target.innerHTML);
		expHandle.setNum();
		expHandle.unEval();
		expHandle.addOp();
		dis.wriToScr();
	},
	
	neg()
	{
		currentNum.neg();
		dis.wriToScr();
	},
	
	bs()
	{
		if(expHandle.isEval())
			currentNum.clr();
		currentNum.backSpace();
		expHandle.unEval();
		dis.wriToScr();
	},
	
	ce()
	{
		expHandle.clr();
		currentNum.clr();
		dis.wriToScr();
	},
	
	cClicked()
	{
		currentNum.clr();
		expHandle.unEval();
		dis.wriToScr();
	},
	
	op(event)
	{
		expHandle.addNum();
		var op = event.target.innerHTML;
		switch(op)
		{
			case "x":
				op = "*";
				break;
			case "%":
				op = "/";
				break;
			case "Mod":
				op = "%";
				break;
			default:
		}
		expHandle.setOp(op);
		expHandle.unEval();
		currentNum.setNum("0");
	},
	
	evalu()
	{
		expHandle.addNum();
		expHandle.evaluate();
		dis.wriToScr();
		expHandle.clr();
		expHandle.setEval();
	}
}

var expHandle = {
	ex : "",
	lastOp : "",
	set : true,
	evaled : false,
	
	clr()
	{
		this.ex = "";
		this.lastOp = "";
		this.set = true;
		this.evaled = false;
	},
	
	setOp(op)
	{
		this.lastOp = op;
	},
	
	setNum()
	{
		this.set = true;
	},
	
	setEval()
	{
		this.evaled = true;
	},
	
	unEval()
	{
		this.evaled = false;
	},
	
	isEval()
	{
		return this.evaled;
	},
	
	addNum()
	{
		var num;
		if(currentNum.isNeg())
			num = `(${currentNum.getVal()})`;
		else
			num = `${currentNum.getVal()}`;
		if(this.set)
		{
			this.ex += num;
			this.set = false;
		}
	},
	
	addOp()
	{
		if(this.ex != "")
		{
			this.ex += this.lastOp;
			this.clrOp();
		}
		console.log(this.ex);
	},
	
	clrOp()
	{
		this.lastOp = "";
	},
	
	evaluate()
	{
		if(this.ex != "")
		{
			var ch = this.ex.slice(-1);
			if(ch == "+" || ch == "-" || ch == "/" || ch == "*" || ch == "%")
				this.ex = this.ex.slice(0,-1);
			console.log(this.ex);
			currentNum.setVal(`${parseInt(eval(this.ex))}`);
		}
	},
}
