<?php 

require_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';

function cv() {
    if (DISABLE_GLOBAL_CACHE)
        return 0;
    return time();
}

function get_contents($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    $output = curl_exec($ch);

    if ($output === false)
        return null;

    curl_close($ch);

    return $output;
}

function fetchRadioLink() {
    try {
        $contents = @get_contents(RADIO_STREAMING_WEBPAGE);
        
        if (!$contents)
            return null;

        $dom = new DOMDocument();
        @$dom->loadHTML($contents);
        
        $urlAddr = $dom->getElementById('urladdress');
    
        return trim($urlAddr->textContent);
    } catch (Exception $ex) {
        return null;
    }
}

function _or($a, $b) {
    return $a != null ? $a : $b;
}

$radioLink = _or(fetchRadioLink(), RADIO_STREAM_URL);