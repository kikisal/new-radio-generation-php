<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/controls/api/feeds-control.php';

define('ITEMS_PER_CHUNK', 40);

session_start();

if (!$db->connect())
    Utils\HTTPResponse::exitJson('SERVER_ERROR', SERVER_ERROR_CODE);

if (!isset($_SESSION['feed_timestamp']))
    Utils\HTTPResponse::exitJson('INVALID_REQUEST', BAD_REQ_CODE);


$type          = typeval(@$_GET['t']);
$chunk         = intval(@$_GET['chunk']);

$feedTimestamp = $_SESSION['feed_timestamp'];


$start         = $chunk *  ITEMS_PER_CHUNK;
$itemCount     = ITEMS_PER_CHUNK;


if (!$type)
    Utils\HTTPResponse::exitJson('INVALID_REQUEST', BAD_REQ_CODE);

$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("SELECT * FROM `feeds` WHERE `type` = ? AND `timestamp` < ? ORDER BY `timestamp` DESC LIMIT $start, $itemCount");
    $stmt->bindParam(1, $type, PDO::PARAM_STR);
    $stmt->bindParam(2, $feedTimestamp);
    $stmt->execute();
    $feeds = $stmt->fetchAll(PDO::FETCH_ASSOC);
    exit(json_encode($feeds));

} catch(PDOException $ex) {
    Utils\HTTPResponse::exitJson('SERVER_ERROR', SERVER_ERROR_CODE);
}


//echo     json_encode($feeds);