<?php
include 'connection.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['category_name'];
    $sql = "insert into category (category_name) values('$name')";

    if (mysqli_query($conn, $sql)) {
        echo "<script>window.location='category-table.php';</script>";
    } else {
        echo "Problem" . mysqli_error($conn);
    }
}
