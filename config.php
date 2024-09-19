<?php

define('DEBUG_MODE', true);
define('SITE_URL', "http://192.168.1.172"); // without slash at the end
define('DISABLE_GLOBAL_CACHE', false); // set true for production
define('RADIO_STREAM_URL', 'https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_7708_stream_69682424');
define('RADIO_STREAMING_WEBPAGE', 'https://radiogenerationtv.radio12345.com/');
define('ORIGINAL_RADIO_URL', 'https://radiogenerationtv.radio12345.com/');

define('RADIO_ID', 3379584);
define('OPEN_FIREWALL_SERVICE_LINK', 'https://radiogenerationtv.radio12345.com/openfire.ajax.php?radio_id=' . RADIO_ID);

define('RADIO_FETCH_LINK_API', SITE_URL . '/api/get_radio_link');
define('OPEN_FIREWALL_LINK', SITE_URL . '/api/openfirewall');

/* --- DATABASE --- */

define('DB_HOST', 'localhost');
define('DB_DATABASE', 'radiogeneration');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');