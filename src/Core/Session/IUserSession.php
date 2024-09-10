<?php

namespace Core\Session {
    interface IUserSession {
        
        public function value(string $key): ?string;
        public function store(string $key, string $value): void;
        public function delete(string $key): bool;
        public function has(string $key): bool;
    }
}