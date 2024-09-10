<?php

define('CLASS_PATH', $_SERVER['DOCUMENT_ROOT'] . '/src/');
define('PHP_EXTENSION', '.php');

spl_autoload_register(function($klass) {
    require_once CLASS_PATH . namespaceFormat($klass) . PHP_EXTENSION;
});

function namespaceFormat($ns) {
    return str_replace('\\', '/', $ns);
}