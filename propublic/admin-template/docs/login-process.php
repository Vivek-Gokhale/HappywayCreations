<?php
session_start();
include 'connection.php';
if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];


    $sql = "select * from admin where admin_username='$email'";
    $result = mysqli_query($conn, $sql);
    $count = mysqli_num_rows($result);
    if ($count > 0) {
        // Check if password matches
        $row = mysqli_fetch_array($result);
        $id = $row['admin_id'];
        $_SESSION['admin_id'] = $id;
        if ($password == $row['password']) {
            echo "<script>window.location='dashboard.php';</script>";
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No user found with this email.";
    }
}
