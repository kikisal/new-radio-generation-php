<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';

$headers = [
    'X-Forwarded-For' => $_SERVER['REMOTE_ADDR']
];


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, OPEN_FIREWALL_SERVICE_LINK . '&HTTP_X_FORWARDED_FOR=' . $_SERVER['REMOTE_ADDR']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$output = curl_exec($ch);

if ($output === false) {
    echo 'error';
} else {
    echo $output;
}

curl_close($ch);

exit;