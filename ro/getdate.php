<?php
header('Content-Type: application/json');

if (date('w') == 4) {
    if (date('H') < 17) {
        $pickupDate = "/Date(".(strtotime("+1 day") * 1000).")/";
    } else {
        $pickupDate = "/Date(".(strtotime("+4 day") * 1000).")/";
    }
} else if (date('w' == 5)) {
    if (date('H') < 17) {
        $pickupDate = "/Date(".(strtotime("+3 day") * 1000).")/";
    } else {
        $pickupDate = "/Date(".(strtotime("+4 day") * 1000).")/";
    }
} else if (date('w' == 6)) {
    $pickupDate = "/Date(".(strtotime("+3 day") * 1000).")/";
} else if (date('w' == 7)) {
    $pickupDate = "/Date(".(strtotime("+2 day") * 1000).")/";
} else {
    $pickupDate = "/Date(".(strtotime("+1 day") * 1000).")/";
}

echo json_encode(array("message" => $pickupDate), JSON_UNESCAPED_SLASHES);