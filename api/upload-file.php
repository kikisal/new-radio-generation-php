<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/controls/api/upload-file-control.php';

define('IMAGE_OUT_DIR', $_SERVER['DOCUMENT_ROOT'] . '/cdn/storage/image');
define('AUDIO_OUT_DIR', $_SERVER['DOCUMENT_ROOT'] . '/cdn/storage/audio');
define('FILES_OUT_DIR', $_SERVER['DOCUMENT_ROOT'] . '/cdn/storage/file');

define('READING_BUFF_SIZE', 4096);
define('MAX_FILESIZE_UPLOAD', 10 * 1024 * 1024 * 1024);


if (!$db->connect())
    exit('{"status": "server-error", "message": "internal_error"}');

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    exit('{"status": "server-error", "message": "invalid_request_0"}');

$action = @$_GET['action'];

if (empty($action) || !in_array($action, ['upload', 'create']))
    exit('{"status": "server-error", "message": "invalid_request_1"}');

if ($action == 'create') {
    if (!isset($_POST['filename']))
        exit('{"status": "server-error", "message": "invalid_request_3"}');

    $type        = @$_POST['type'];
    $reqFileName = @$_POST['filename'];
    $fileSize    = @$_POST['filesize'];
    
    if (empty($type) || !in_array($type, ['audio', 'file', 'image']))
        exit('{"status": "server-error", "message": "invalid_request_2"}');

    if (empty($reqFileName) || empty($fileSize))
        exit('{"status": "server-error", "message": "invalid_filename"}');

    $format = pathinfo($reqFileName, PATHINFO_EXTENSION);

    if (!formatAllowed($type, $format))
        exit('{"status": "server-error", "message": "invalid_format"}');

    $format = '.' . strtolower($format);
    
    $fileSize = intval($fileSize);
    if ($fileSize <= 0 || $fileSize > MAX_FILESIZE_UPLOAD)
        exit('{"status": "server-error", "message": "invalid_filesize"}');

    $resId = generateRandomResID($type, $format);
    $id = createCdnResource($resId, $format, $type, $reqFileName, $fileSize);
    if ($id < 0)
        exit('{"status": "server-error", "message": "internal_error"}');
    
    exit('{"status": "success", "res_id": "' . $id . '"}');
} else if ($action == 'upload') {
    $res_id = @$_GET['res_id'];

    if (empty($res_id))
        exit('{"status": "server-error", "message": "invalid_res_id"}');

    if (empty($_FILES))
        exit('{"status": "server-error", "message": "upload_invalid_request"}');

    $res_id   = intval($res_id);
    $resource = fetchResourceByID($res_id);
    if (!$resource)
        exit('{"status": "server-error", "message": "res_not_found"}');

    $type = $resource['type'];

    if (!formatAllowed($type, pathinfo($resource['original_file_name'], PATHINFO_EXTENSION)))
        exit('{"status": "server-error", "message": "invalid_format"}');

    $resFileName = $resource['res_id'] . $resource['format'];

    $targetDir = AUDIO_OUT_DIR;

    if ($type == 'image')
        $targetDir = IMAGE_OUT_DIR;
    else if ($type == 'file')
        $targetDir = FILES_OUT_DIR;
    
    $baseTargetDir = $targetDir;
    
    if (file_exists($baseTargetDir . DIRECTORY_SEPARATOR . $resFileName))
        exit('{"status": "server-error", "message": "res_already_uploaded"}');
    
    $file = $_FILES[$type];

    if ($file["error"] != 0) {
        // do some clean up
        die('{"status": "server-error", "message": "upload_error"}');
    }
    
    $targetDir .= '/tmp/';
    
    $filePath = $targetDir . DIRECTORY_SEPARATOR . $resFileName;
    $filePathFromBaseDir = $baseTargetDir . DIRECTORY_SEPARATOR;
    
    $chunk  = isset($_POST["chunk"])  ? intval($_POST["chunk"])   : 0;
    $chunks = isset($_POST["chunks"]) ? intval($_POST["chunks"])  : 0;
    
    $out = fopen($filePath . '.part', $chunks ? "ab" : "wb");

    if (!$out)
        die('{"status": "server-error", "message": "internal_error"}');

    $istream = null;

    $istream = @fopen($file["tmp_name"], "rb");
    
    if (!$istream)
        die('{"status": "server-error", "message": "opening_stream_failed"}');
     
    while ($buff = fread($istream, READING_BUFF_SIZE))
        fwrite($out, $buff);

    if (filesize($filePath . '.part') > $resource['size'])
    {
        @unlink($filePath . '.part');
        die('{"status": "server-error", "message": "file_too_big"}');
    }
    
    @fclose($out);
    @fclose($istream);

    if (!$chunks || $chunk == $chunks - 1) {
        @rename($filePath . ".part", $filePathFromBaseDir . $resFileName);

        $finalFormat = $resource['format'];

        if (!isset($_POST['no_compress'])) {
            if ($resource['type'] === 'image')
            {
                $newImageName = $filePathFromBaseDir . $resource['res_id'] . '.jpg';
                $oldImageName = $filePathFromBaseDir . $resFileName;
                @compress($oldImageName, $newImageName, 60);

                $finalFormat = '.jpg';
    
                if ($oldImageName !== $newImageName) {
                    @unlink($oldImageName);
                    updateCdnFormat($resource['id'], '.jpg');
                }
            }
        }
        $resUrl = CDN_ENDPOINT . $resource['type'] . '/' . $resource['res_id'] . $finalFormat;

        die('{"status": "success", "message": "upload_success", "resource_id": ' . $resource['id'] . ', "resource_url": "' . $resUrl .'"}');
    }

    die('{"status": "success", "message": "chunk_upload_success", "resource_id": ' . $resource['id'] . '}');
}


function createCdnResource($resId, $format, $type, $reqFileName, $fileSize) {
    global $db;
    
    $conn = $db->getConnection();

    $stmt = $conn->prepare("INSERT INTO `cdn_resources` (`res_id`, `format`, `type`, `original_file_name`, `size`) VALUES (?, ?, ?, ?, ?)");
    
    $stmt->bindParam(1, $resId, PDO::PARAM_STR);
    $stmt->bindParam(2, $format, PDO::PARAM_STR);
    $stmt->bindParam(3, $type, PDO::PARAM_STR);
    $stmt->bindParam(4, $reqFileName, PDO::PARAM_STR);
    $stmt->bindParam(5, $fileSize, PDO::PARAM_INT);
    $status = $stmt->execute();

    if ($status)
        return $conn->lastInsertId();
        
    return -1;
}

function fetchResourceByID($id) {
    global $db;
    $conn = $db->getConnection();

    $stmt = $conn->prepare("SELECT * FROM `cdn_resources` WHERE `id` = ?");
    $stmt->bindParam(1, $id, PDO::PARAM_INT);
    $stmt->execute();

    $res = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$res) 
        return null;

    return $res;
}

function updateCdnFormat($id, $format) {
    global $db;
    $conn = $db->getConnection();

    $stmt = $conn->prepare('UPDATE `cdn_resources` SET `format` = ? WHERE `id` = ?');

    $stmt->bindParam(1, $format);
    $stmt->bindParam(2, $id);    
    $stmt->execute();
}

function generateRandomResID($type, $format) {
    do {
        $resId = bin2hex(random_bytes(16));
    } while(resIdExists($resId, $type, $format));

    return $resId;
}

function resIdExists($resId, $type, $format) {
    
    $targetDir = AUDIO_OUT_DIR;

    if ($type == 'image')
        $targetDir = IMAGE_OUT_DIR;
    else if ($type == 'file')
        $targetDir = FILES_OUT_DIR;

    $resFileName = $resId . $format;

    
    if (file_exists($targetDir . DIRECTORY_SEPARATOR . $resFileName))
        return true;
    
    $targetDir .= '/tmp/';
    $resFileName = $resId . '.part.' . $format;
    
    if (file_exists($targetDir . DIRECTORY_SEPARATOR . $resFileName))
        return true;

    return false;
}

function formatAllowed($type, $format) {
    $format = strtolower($format);
    
    /*
    if (!in_array($format, [
        'rar', 'zip', 'png', 'jpg', 'jpeg', 'wav', 'ogg', 'mp3'
    ]))

        return false;
    */

    if ($type === 'audio')
        return in_array($format, ['wav', 'ogg', 'mp3']);
    else if ($type === 'file')
        return in_array($format, [
            "mp4",  
            "mkv",  
            "webm", 
            "ogv",  
            "mov",  
            "avi",  
            "wmv",  
            "mpeg", 
            "mpg",  
            "3gp",  
            "3g2",  
            "flv",  
            "m4v",  
            "f4v",  
            "asf",  
            "h264", 
            "rm",   
            "ogm",  
            "vob",  
            "m3u8", 
            "ts",   
            "mpd"   
        ]);    
    else if ($type === 'image')
        return in_array($format, ['png', 'jpg', 'jpeg']);    
    else
        return false;
}

function compress($source, $destination, $quality) {
    $info = getimagesize($source);

    if ($info['mime'] == 'image/jpeg') 
        $image = imagecreatefromjpeg($source);

    elseif ($info['mime'] == 'image/gif') 
        $image = imagecreatefromgif($source);

    elseif ($info['mime'] == 'image/png') 
        $image = imagecreatefrompng($source);

    imagejpeg($image, $destination, $quality);

    return $destination;
}