<?php

$result = [
    'url' => '' //https://st.depositphotos.com/1787196/1330/i/450/depositphotos_13301967-stock-photo-furry-blue-monster.jpg
];

if (!empty($_FILES['file'])) {
    if (!isset($_FILES['file']['error']) || is_array($_FILES['file']['error'])) {
        throw new RuntimeException('Invalid parameters.');
    }

    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // You should also check filesize here.
    if ($_FILES['file']['size'] > 1000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }

    $fi = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
            $fi->file($_FILES['file']['tmp_name']),
            array(
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
            ),
            true
        )) {
        throw new RuntimeException('Invalid file format.');
    }

    $filename = "/_uploads/" . uniqid('file_', true) . '.' . $ext;

    if (!move_uploaded_file($_FILES['file']['tmp_name'], '.'.$filename)) {
        throw new RuntimeException('Failed to move uploaded file.');
    }

    $result['url'] = $filename;
}

header("Content-type:application/json");
echo json_encode($result);
