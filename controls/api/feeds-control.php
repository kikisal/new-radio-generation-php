<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/autoload.php';


define('BAD_REQ_CODE', 1);
define('SERVER_ERROR_CODE', 2);
define('FEED_NOT_FOUND', 3);


header('Content-type: application/json');

use Database\PDOConnConfig as PDOConfig;
use Database\MySQLPDODatabase as MysqlDatabase;

$db = new MysqlDatabase(
    PDOConfig::create()
    ->host(DB_HOST)
    ->db(DB_DATABASE)
    ->user(DB_USER)
    ->pass(DB_PASS)
    ->charset(DB_CHARSET)
    ->options([
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ])
);


$validFeedTypes = [
    'news',
    'podcast',
    'programs'
];

function typeval($t) {
    global $validFeedTypes;

    if (in_array($t, $validFeedTypes))
        return $t;

    return null;
}