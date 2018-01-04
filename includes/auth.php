<?
	require_once('./includes/db.php');

	$auth = $_POST;
	$auth['pass'] = md5($auth['pass'].md5($auth['account']));

	$retries = 5; // Resets every 15 mins.

	// Prepared statements as opposed to building raw SQL queries with URI - This method is not vulnerable to SQL injection.
	$q = "SELECT * FROM useraccount WHERE account = ? AND ( passhash = ? AND NOW() >= daterelease ) LIMIT 1";
	if ($s = $conn->prepare($q)) {
		$s->bind_param('ss', $auth['account'], $auth['pass']);
		$s->execute();
		for ($set = [], $r = $s->get_result(); $row = $r->fetch_assoc(); $set[] = $row);

		// If authenticated, populate session variables.
		if (count($set)) {
			$_SESSION['7h'] = $set[0];
			echo '<script>alert("Success! Welcome back, ' . $_SESSION['7h']['fname'] . '.\nAccount: ' . $_SESSION['7h']['account'] . '");</script>';
			// Update account statistics
			$q = "UPDATE useraccount SET last_active = NOW(), last_ip = ? WHERE uid = ? LIMIT 1";
			if ($s = $conn->prepare($q)) {
				$s->bind_param('si', $_SERVER['REMOTE_ADDR'], $_SESSION['7h']['uid']);
				$s->execute();
			}
		// ...Or...
		} else {
			// Clear out Session Variables 
			if (isset($_SESSION['7h'])) { unset($_SESSION['7h']); }

			// Brute-force-attempt handlers. 
			$q = "INSERT INTO userlogin_log (remote_ip, account) VALUES (?, ?)";
			if ($s = $conn->prepare($q)) {
				$s->bind_param('ss', $_SERVER['REMOTE_ADDR'], $auth['account']);
				$s->execute();
			}

			// On failed login: Check the login attempts for the account or the IP address within the last 15 minutes.
			$q = "SELECT * FROM userlogin_log WHERE (remote_ip = ? OR account = ?) AND TIMESTAMPDIFF(minute, datereg, NOW()) <= 15";
			if ($s = $conn->prepare($q)) {
				$s->bind_param('ss', $_SERVER['REMOTE_ADDR'], $auth['account']);
				$s->execute();
				for ($set = [], $r = $s->get_result(); $row = $r->fetch_assoc(); $set[] = $row);

				// Cool-down: 00h:15m:00s. Prevents brute-forcing attacks against web service. 
				if (count($set) > $retries) {
					$q = "UPDATE useraccount SET daterelease = date_add(now(), interval 15 minute) WHERE account = ? LIMIT 1";	
					if ($s = $conn->prepare($q)) { $s->bind_param('s', $auth['account']); $s->execute(); }
					echo "<script>alert('Too many failed login attempts! Please try again in 15 minutes.');</script>";
				}
				else 
					echo "<script>alert('User & password not found, please re-check your credentials and try again.');</script>";
			}
		}
		// Back to main.
		?><meta http-equiv="refresh" content="0;url=<?=$_SERVER['PHP_SELF']?>" /><?
	}
?>