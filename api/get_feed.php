<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/controls/api/feeds-control.php';

if (!$db->connect())
    Utils\HTTPResponse::exitJson('SERVER_ERROR', SERVER_ERROR_CODE);

$type = typeval(@$_GET['t']);
$id   = intval(@$_GET['id']);

if (!$type)
    Utils\HTTPResponse::exitJson('INVALID_REQUEST', BAD_REQ_CODE);

$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("SELECT * FROM `feeds` WHERE `id` = ? AND `type` = ? LIMIT 1");
    $stmt->bindParam(1, $id, PDO::PARAM_STR);
    $stmt->bindParam(2, $type, PDO::PARAM_STR);
    $stmt->execute();

    $feed = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$feed)
        Utils\HTTPResponse::exitJson('FEED_NOT_FOUND', FEED_NOT_FOUND);

    exit(json_encode($feed));

} catch(PDOException $ex) {
    Utils\HTTPResponse::exitJson('SERVER_ERROR', SERVER_ERROR_CODE);
}
