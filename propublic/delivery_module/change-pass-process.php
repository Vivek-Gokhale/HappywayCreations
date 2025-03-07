<!DOCTYPE html>
<?php
session_start();
include 'db_connection.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $opass = $_POST['old-password'];
    $npass = $_POST['new-password'];
    $cpass = $_POST['con-password'];
    $delivery_partner_id = $_SESSION['delivery_partner_id'];
    $q = "select dp_password from delivery_partner where delivery_partner_id='$delivery_partner_id'";
    $result = mysqli_query($conn, $q);
    $row = mysqli_fetch_array($result);
    if ($opass == $row['dp_password']) {
        if ($npass == $cpass) {
            if ($opass == $npass) {
                echo "<script>alert('Old and new password must be different');window.location='change-password.php';</script>";
            } else {
                $sql = "UPDATE `delivery_partner` SET `dp_password`='$npass' WHERE `delivery_partner_id`='$delivery_partner_id'";
                if (mysqli_query($conn, $sql)) {
                    echo "<script>alert('Password Changed');</script>";
                    session_destroy();
                    header('Location: index.php');
                    exit();
                } else {
                    echo "<script>alert('Error Changing Password');window.location='change-password.php';</script>";
                }
            }
        } else {
            echo "<script>alert('New and Confirm Password Do Not Match');window.location='change-password.php';</script>";
        }
    } else {
        echo "<script>alert('Old Password not match');window.location='change-password.php';</script>";
    }
}
?>