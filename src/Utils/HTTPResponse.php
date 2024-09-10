<?php

namespace Utils;

class HTTPResponse {
    public static function exitJson($message, $status): never {
        exit (json_encode([
            'status' => $status,
            'message' => $message
        ]));
    }

    public static function json($message): never {
        exit (json_encode($message));
    }
}