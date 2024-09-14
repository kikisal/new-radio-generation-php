<?php 

require_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';

function cv() {
    if (DISABLE_GLOBAL_CACHE)
        return 0;
    return time();
}