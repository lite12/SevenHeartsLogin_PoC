/*------------------------------------------------------------------------------------*/
// 1)
function isEmpty(obj) {
	if(obj == "" || obj == null) {
		return true;
	}
	return false;
}

/*------------------------------------------------------------------------------------*/
// 2) 
function isCnt(obj) {
	var str = obj;
	if(str.length == 0) {
		return false;
	}

	for(var i=0; i < str.length; i++) {
		if(!('0' <= str.charAt(i) && str.charAt(i) <= '9')) {
			return false;
		}
	}
	return true;
}

/*------------------------------------------------------------------------------------*/
// 3) 
function isEqual(obj1, obj2) {
	var str1 = obj1;
	var str2 = obj2;
	if(str1.length == 0 || str2.length == 0)
		return false;

	if(str1 == str2)
		return true;
	return false;
}

/*------------------------------------------------------------------------------------*/
// 4) 
function isLength(obj, len) {
	var str = obj;
	if(str.length < len) {
		return true;
	}
	return false;
}

/*------------------------------------------------------------------------------------*/
// 5) 
function isAlphabet(obj) {
	var str = obj;
	if(str.length == 0) {
		return false;
	}
	str = str.toUpperCase();
	for(var i=0; i < str.length; i++) {
		if(!('A' <= str.charAt(i) && str.charAt(i) <= 'Z')) {
			return false;
		}
	}
	return true;
}

/*------------------------------------------------------------------------------------*/
// 6) 
function isAlphaNumeric(obj) {
	var str = obj;
	if(str.length == 0) {
		return false;
	}

	str = str.toUpperCase();
	for(var i=0; i < str.length; i++) {
		if(!(('A' <= str.charAt(i) && str.charAt(i) <= 'Z') ||
			('0' <= str.charAt(i) && str.charAt(i) <= '9'))) {
			return false;
		}
	}
	return true;
}

/*------------------------------------------------------------------------------------*/
// 7) ID
function isUserID(data) {
	var str = data;
	if(str.length == 0) {
		return true;
	}		
	if(!('a' <= str.charAt(0) && str.charAt(0) <= 'z')) {
		return false;
	}		
	for(var i=1; i < str.length; i++) {
		if(!('a' <= str.charAt(i) && str.charAt(i) <= 'z') && !('0' <= str.charAt(i) && str.charAt(i) <= '9')) {
			return false;
		}		
	}
	return true;
}

/*------------------------------------------------------------------------------------*/
// 8) 
function isMail(data)
{
	var reg = /^[A-Za-z0-9_\-]+([.][A-Za-z0-9_\-]+)*[@][A-Za-z0-9_\-]+([.][A-Za-z0-9_\-]+)+$/;
	
	if ( reg.test(data) == false )
	{
		return false;
	}
	return true;
}

/*------------------------------------------------------------------------------------*/
// 9)
function fNumToStr(num) {
	var v = String(num);
	var l = v.length;
	var str = '';
	var c = 1;
	var tmp = new Array();
	var coma = ',';
	
	for (i=l;i>-1;i--) {
		c++;
		if ((c%3==0)&&(i!=l-1))
			tmp[i]=v.charAt(i) + coma;
		else
			tmp[i]=v.charAt(i);
	}
	str=tmp.join('');
	return str;
}

/*------------------------------------------------------------------------------------*/
// 10)
function isLarge(obj1, obj2) {
	var str1 = parseInt(obj1);
	var str2 = parseInt(obj2);
	if(str1 < str2 || str1 == str2) {
		return true;
	}
	return false;
}

/*------------------------------------------------------------------------------------*/
// 11)
function isNum_valid(data) {
	var strKey = "0123456789"
	for(var idx = 0; idx < data.length; idx++) {
		if(strKey.indexOf(data.charAt(idx),0) >= 0 ) {
			return true;
		}
	}
	return false;
}

/*------------------------------------------------------------------------------------*/
// 12)
function del_space(obj) {
	var strvalue = '';
	for (var i = 0 ;  obj.length > i ; i++) {
		if (obj.charAt(i) != ' ') 
			strvalue = strvalue + obj.charAt(i);
	}
	return strvalue;
}
/*------------------------------------------------------------------------------------*/
// 13)
function checkFgnNo(reg_no) {
    var sum = 0;
    var odd = 0;
    buf = new Array(13);
    for (i = 0; i < 13; i++) buf[i] = parseInt(reg_no.charAt(i));
    odd = buf[7]*10 + buf[8];
    if (odd%2 != 0) {
      return false;
    }
    if ((buf[11] != 6)&&(buf[11] != 7)&&(buf[11] != 8)&&(buf[11] != 9)) {
      return false;
    }
    multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
    for (i = 0, sum = 0; i < 12; i++) sum += (buf[i] *= multipliers[i]);
    sum=11-(sum%11);
    if (sum>=10) sum-=10;
    sum += 2;
    if (sum>=10) sum-=10;
    if ( sum != buf[12]) {
        return false;
    }
    else {
        return true;
    }
}

function check_length(obj)
{
	var i, len=0;
	for(i=0;i < obj.length; i++) 
	  ( obj.charCodeAt(i) > 255 ) ? len+=2 : len++;
	return len;	
}

function EMail_Chk(getmail){                                                  
	if (getmail == "9")	{
		document.form.mail_id2.readOnly=false;
		document.form.mail_id2.value = "";
	}
	else if (getmail == "0")	{
		document.form.mail_id2.readOnly=true;	
		document.form.mail_id2.value = "¥±ÅÃÇÏ¥¥¿ä";

	}
	else{
		document.form.mail_id2.readOnly=true;
		document.form.mail_id2.value = getmail;
	}	
} 

function do_submit()
{
	var account = document.form.account.value;
	var password = document.form.passwd1.value;
	var fname = document.form.fname.value;
	var mname = document.form.mname.value;
	var lname = document.form.lname.value;
	var bday = document.form.bday.value;
	var account_question = document.form.account_question.value;
	var email = document.form.email.value;
	var password1 = document.form.passwd2.value;
	
	/* 
	var check_mail = document.form.check_mail.value;	
	var check_account = document.form.check_account.value;
	if( check_account != "ok" ) { alert('Please check your ID'); return false; }
	if( check_mail != "ok" ) { alert('Please check your Email address'); return false; } 
	*/

	if(!(isUserID(account))) 
	{
		alert('The first letter of account ID has to be an alphabet(small) and the followings have to be combination os alphabets(small) and numbers.');
		document.form.account.focus();
		return false;
	}
	if( isLength(account,4) || !(isLength(account,17)) )
	{
		alert('Account ID must be minimum 4 letters to maximum 16 letters.');	
		document.form.account.focus();
		return false;
	}		
	if( isLength(password,4) || !(isLength(password,17)) )
	{
		alert('Password must be minimum 4 letters to maximum 16 letters.');
		document.form.passwd1.focus();
		return false;
	}
	if(!(isEqual(password,password1)))
	{
		alert('You have entered password incorrectly. Please try again.');
		document.form.passwd2.focus();
		return false;
	}
	if (isEmpty(account_question))
	{
		alert("Please enter your secret keyword.");
		document.form.account_question.focus();
		return false;
	}
	else
	{
		if (isLength(account_question,3) || !(isLength(account_question,16)) )
		{
			alert("Please enter your secret keyword properly.");
			document.form.account_question.focus();
			return false;
		}
	}		
	
	if(	account == password )
	{
		alert('ID and password matches. Please re-enter your password.');
		document.form.passwd1.value='';
		document.form.passwd2.value='';
		document.form.passwd1.focus();
		return false;
	}
	if(fname=='')
	{
		alert('Please enter a first name.');
		document.form.fname.focus();
		return false;
	}
	else
	{
		if(lname=='')	
		{
			alert('Please enter a last name.');
			document.form.lname.focus();
			return false;
		}
	}
	if( (isEmpty(bday)))
	{
		alert('Please enter your date of birth.');
		document.form.bday.focus();
		return false;
	}
	if (!isMail(email))
	 {
			alert('Please enter your E-mail correctly.');
			document.form.email.focus();
			return false;		
	}
	if (document.getElementById('check_mail') != null) {
		document.getElementById('check_mail').remove();
	}
	if (document.getElementById('check_account') != null) {
		document.getElementById('check_account').remove();
	}
	if (document.getElementById('allChars') != null) {
		document.getElementById('allChars').remove();
	}
	return true;
}

function do_reset() {
	document.form.reset();
}

function pop_account() {
	if(document.form.account.value == "") {
		alert ("Please enter your ID.");
		document.form.account.focus ();
		return;
	}

	if(document.form.account.value.length > 16 || document.form.account.value.length < 4) {
		alert ("Please enter your ID, at least 4 letters to a maximum 16 letters.");
		return;
	}
	
	var strID = document.form.account.value;
	for(i = 0; i < strID.length; i++) {
		if(strID.charAt (i) >= 'a' && strID.charAt (i) <= 'z') { continue; }
		if(strID.charAt (i) >= '0' && strID.charAt (i) <= '9') { continue; }
			alert('The first letter has to be an alphabet and the following have to be combination of alphabets and numbers.');
		return;
	}
	window.open('#'+document.form.account.value, 'account', 'width=400,height=350');
}

function pop_mail() {	
	var lentmp;
	var tmpvalue1;
	var tmpvalue2;	
	if(document.form.email.value=="") {
		alert("Please enter your Email address.");
		document.form.email.focus();
	}
	else 
	{
		tmpvalue1=document.form.email.value;		
		lentmp=Number(tmpvalue1.length);
		var strID = document.form.email.value;
		for(i = 0; i < strID.length; i++) 
		{
			if(strID.charAt (i) == '@' ) { strID = "-1" }
		}
		if (strID != '-1') {
			alert('The email address has to contain an @ symbol.');
			document.form.email.focus();
			return;
		}
		if(lentmp>31)
		{
			alert("Attention! E-mail address can not contain more than 30 letters, it might occur errors. Please check.");
			document.form.email.focus();
		}
		else {
			window.open("#"+document.form.email.value+"&mail_id2=-1", "mailchecheck","width=400,height=350");
		}
	}
}

function stop() {
	alert("Until @@:00__, the server will be under a scheduled maintenance period. Please try again later."); history.back();
}