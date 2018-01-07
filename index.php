<?
/* Switch between hiding and showing errors quickly, to mimic differences in dev/prod environment. */
if (isset($_COOKIE['debug'])) {
	error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED); ini_set('display_errors', 1);
}

/* If 'action' has been specified, associate it with one of the pre-defined site areas from the array. If it's not a valid area, then load the default (main) page. */
$arr_actions = array( 'main', 'login', 'reg', 'regform', 'logout' );
$act = array_search(($_GET['action'] ?? 'main'), $arr_actions);

session_start();

switch (($act !== false) ? $arr_actions[$act] : $arr_actions[0])
{
    case 'main':
        	// Frontend -> Site News, Login.
		include_once('./themes/main.htm');
        break;
    case 'login':
        	// Login (Session Authenticate).
    		include_once('./includes/auth.php');
        break;
    case 'reg':
        	// Registration forms: Frontend -> HTML, CSS, JS.
		include_once('./themes/register.htm');
      	break;
    case 'regform':
        	// Account registration.
    		include_once('./includes/regform.php');
    	break;
	case 'logout':
        	// Logout.
		if (isset($_SESSION['7h'])) { unset($_SESSION['7h']); 
		?><meta http-equiv="refresh" content="0;url=<?=$_SERVER['PHP_SELF']?>" /><? 
		}
    	break;
}
?>
