<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/autoload.php';

header('Content-type: application/json');

use Core\Session\UserSession;
use Session\SessionKeys;
use Utils\HTTPResponse;

/*
$session = UserSession::instance();

$sessionTime = $session->value("session_timestamp");

if(empty($sessionTime))
    $session->store(SessionKeys::SESSION_TIMESTAMP, time());
*/

function sortByTimestamp($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
}
    