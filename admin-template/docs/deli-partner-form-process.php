<?php
include 'connection.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['dp_name'];
    $email = $_POST['dp_email'];
    $contact = $_POST['dp_contact_no'];
    $addr = mysqli_real_escape_string($conn, $_POST['dp_address']);
    $pass = $_POST['dp_password'];
    $conPass = $_POST['dp_confirm_password'];
    $image = $_FILES['identity_proof']['name'];
    $path = $_FILES['identity_proof']['tmp_name'];

    if ($pass == $conPass) {
        $sql = "insert into delivery_partner (dp_name,dp_email,dp_contact_no,dp_address,identity_proof,dp_password) values('$name','$email','$contact','$addr','$image','$pass')";
        if (mysqli_query($conn, $sql)) {
            echo "<script>window.location='delivery-partner-table.php';</script>";
            move_uploaded_file($path, "../../admin-template/docs/deli-partner-ID/" . $image);
        } else {
            echo "Problem" . mysqli_error($conn);
        }
    } else {
        echo "<script>alert('Password and confirm password do not match.');window.location='deli-partner-form.php';</script>";
    }
}
