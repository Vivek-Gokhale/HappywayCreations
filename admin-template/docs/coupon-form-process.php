<?php
include 'connection.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $code = $_POST['coupon_code'];
    $per = $_POST['coupon_percentage'];
    $sql = "insert into coupons (coupon_code,coupon_percentage) values('$code','$per')";

    if (mysqli_query($conn, $sql)) {
        echo "<script>window.location='coupon-table.php';</script>";
    } else {
        echo "Problem" . mysqli_error($conn);
    }
}
