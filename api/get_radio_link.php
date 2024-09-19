<?php

require $_SERVER['DOCUMENT_ROOT'] . '/core.php';


try {
    $link = fetchRadioLink();
    
    echo json_encode([
        "state" => "success",
        "link"  => _or($link, RADIO_STREAM_URL)
    ]);
} catch(Exception $ex) {
    echo json_encode([
        "state" => "error"
    ]);
}