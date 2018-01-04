<?
	require_once('./includes/db.php');

	if (!strlen($_POST['account'] ?? '') || !strlen($_POST['passwd1'] ?? '') || !strlen($_POST['passwd2'] ?? '')) {
		echo "<script>alert('Warning: No account information in post data.');</script>"; 
		?><meta http-equiv="refresh" content="0;url=<?=$_SERVER['PHP_SELF'].'?action=reg'?>" /><?
		exit();
	}
	if ($_POST['passwd1'] != $_POST['passwd2']) {
		echo "<script>alert('Warning: Passwords provided must match.');</script>"; 
		?><meta http-equiv="refresh" content="0;url=<?=$_SERVER['PHP_SELF'].'?action=reg'?>" /><?
		exit();
	}
	
	$regdata = @array_diff_assoc($_POST, array('passwd2'=>$_POST['passwd2']));
	$regdata['passwd1'] = md5($regdata['passwd1'].md5($regdata['account']));
	$regdata['remote_ip'] = $_SERVER['REMOTE_ADDR'];
	$regdata['mail_opt'] = ($regdata['mail_opt'] == 'Yes') ? '1' : '0';
	$regdata['bday'] = str_replace('.', '-', (str_replace('/', '-', $regdata['bday'])));

	// Prepared statements as opposed to building SQL queries directly with URI - This method isn't vulnerable to SQL injection.
	if ($s = $conn->prepare('SELECT uid FROM useraccount WHERE (account = ? OR email = ?) LIMIT 1')) {
		$s->bind_param('ss', $regdata['account'], $regdata['email']);
		$s->execute(); 
		$r = $s->get_result();
		for ($set = array(); $row = $r->fetch_assoc(); $set[] = $row);
		if (count($set)) {
			echo "<script>alert('Account name and email must be unique. Please try again.');</script>"; 
			?><meta http-equiv="refresh" content="0;url=<?=$_SERVER['PHP_SELF'].'?action=reg'?>" /><? 
			exit();
		}
	} 

	// Prepare insert:
	$types = implode('', array_fill(0, count($regdata), 's'));
	$params = implode(', ', array_fill(0, count($regdata), '?'));
	$q = "INSERT INTO useraccount (account, passhash, account_question, fname, mname, lname, bday, email, mail_opt, remote_ip) VALUES ( " . $params . " );";

	if ($s = $conn->prepare($q)) 
	{
		$vars = array_merge( array($types), array_values($regdata) );
		$r = $s->bind_param(...$vars);
		$s->execute();
	} 
	else { 
		exit("<pre> Error: conn->prepare()"."\n".$q."\n\n"); 
	}

	/* Successfuly Registered. */
	echo "<script>alert('Success! Please check your email for instructions.');</script>";
	?><meta http-equiv="refresh" content="0;url=<?=$_SERVER['PHP_SELF']?>" />