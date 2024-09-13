<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/controls/api/feeds-control.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define("TIMESTAMP_CACHE_PATH", __DIR__ . "/mockup/timestamps.json");
define('BAD_REQ_CODE', 1);


//if ($_SERVER['REQUEST_METHOD'] != 'POST')
//    exit_json("Invalid request", RequestStatus::BAD_REQUEST);

// echo mockup_data("");

$nameTable  = [
    "Morning Musings: Embracing the Day",
    "Everyday Adventures: Finding Beauty in the Ordinary",
    "Foodie Finds: Culinary Delights Await!",
    "Wanderlust Chronicles: Exploring New Horizons",
    "Wellness Wisdom: Nourishing Mind, Body, and Soul",
    "Cozy Corner: Snuggle Up with a Good Read",
    "Pet Pals: Furry Friends and Fun Times",
    "Creative Chronicles: Unleashing Imagination",
    "Throwback Tales: Memories Worth Sharing",
    "Nature's Palette: Colors of the Earth"
];

$descTable = [
    "A cozy café nestled in a corner, adorned with mismatched chairs and vintage artwork.",
    "A sprawling forest, where sunlight dances through the leaves, creating patterns on the forest floor.",
    "A bustling marketplace filled with the aroma of spices and the sound of vendors haggling.",
    "An old bookstore with shelves reaching to the ceiling, each book whispering stories of ages past.",
    "A quiet beach at dawn, the waves gently kissing the shore as seagulls call in the distance.",
    "A majestic mountain peak piercing the clouds, inviting adventurers to conquer its heights.",
    "A quaint cottage surrounded by wildflowers, its wooden door welcoming weary travelers.",
    "A vibrant cityscape at night, illuminated by neon lights and buzzing with life.",
    "A tranquil garden filled with blooming flowers and the soothing sound of trickling water.",
    "An ancient castle perched on a hill, its stone walls holding centuries of secrets.",
    "A colorful carnival, alive with the laughter of children and the scent of cotton candy.",
    "A mysterious cave hidden deep within a dense forest, echoing with whispers of the past.",
    "A picturesque vineyard, rows of grapevines stretching as far as the eye can see.",
    "A serene lakeside retreat, where the water reflects the colors of the sunset like a mirror.",
    "A whimsical treehouse nestled among the branches, a sanctuary for imagination to flourish.",
    "A bustling train station, where travelers come and go amidst the rhythmic clatter of trains.",
    "A snowy wilderness, silent and pristine, with only the crunch of footsteps breaking the stillness.",
    "A magical garden filled with fantastical creatures and plants that seem to shimmer with enchantment.",
    "A cozy cabin in the woods, its fireplace crackling with warmth on a chilly evening.",
    "A hidden waterfall cascading down moss-covered rocks, a hidden gem waiting to be discovered."
];

function sample_timestamps($count) {
    $result = [];

    $time = time();


    for ($i=0; $i < $count; $i++)
        $result[] = $time + $i * 60;

    return $result;
}

function load_timestamps(&$out) {
    $content = @file_get_contents(TIMESTAMP_CACHE_PATH);
    if (empty($content))
        return false;

    try {
        $data = json_decode($content);
        if (!is_array($data))
            return false;

        for ($i=0; $i < count($data); $i++) 
            array_push($out, $data[$i]);

    } catch (Exception $err) {
        return false;
    }

    return true;
}

function get_timestamps() {

    $timestamps = [];

    if (file_exists(TIMESTAMP_CACHE_PATH))
        load_timestamps($timestamps);
    
    if (count($timestamps) < 1) {
        $timestamps = sample_timestamps(500);
        json_dumb($timestamps, TIMESTAMP_CACHE_PATH);
    }

    return $timestamps;
}

function json_dumb($data, $path) {
    if (file_exists($path))
        @unlink($path);

    $serialized = @json_encode($data);

    @file_put_contents($path, $serialized);
    return true;
}



function genRandomFeeds($count, $nameTable, $descTable) {
    $timestamps = get_timestamps();

    $result = [];

    for ($i = 0; $i < $count; ++$i)
        $result[] = [
            "id"          => $i, 
            "name"        => $nameTable[rand(0, count($nameTable) - 1)],
            "description" => $descTable[rand(0, count($descTable) - 1)],
            "image_url"   => 'https://picsum.photos/300/300',
            "timestamp"   => $timestamps[rand(0, count($timestamps) - 1)],
        ];

    return $result;
}

function reqReadBody() {
    $input = @file_get_contents("php://input");
    if (!$input)
        return null;

    try {
        $result = json_decode($input);
        return $result;
    } catch(Exception $err) {
    
    }

    return null;
}

session_start();

if (!isset($_SESSION['feed_timestamp']))
    Utils\HTTPResponse::exitJson('INVALID_REQUEST', BAD_REQ_CODE);


$feeds = genRandomFeeds(40, $nameTable, $descTable);

usort($feeds, 'sortByTimestamp');

//sleep(2);

echo     json_encode($feeds);

// echo json_encode([]);

