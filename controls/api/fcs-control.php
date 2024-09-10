<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/autoload.php';

use Utils\HTTPResponse;

header('Content-type: application/json');

HTTPResponse::json([
    'status'    => 'CREATED',
    'timestamp' => time() 
]);