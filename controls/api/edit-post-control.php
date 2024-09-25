<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/autoload.php';

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


header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');
