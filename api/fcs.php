<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/controls/api/fcs-control.php';

use Utils\HTTPResponse;

session_start();

$feedTimestamp = time();

// to fetch feeds from this timestamp and below.
$_SESSION['feed_timestamp'] = $feedTimestamp;

HTTPResponse::json([
    'status'    => 'CREATED',
    'timestamp' => $feedTimestamp
]);