<?php
session_start();
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare('SELECT * FROM delivery_partner WHERE dp_email = ? AND dp_password = ?');
    $stmt->bind_param('ss', $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $partner = $result->fetch_assoc();
        $_SESSION['delivery_partner_id'] = $partner['delivery_partner_id'];
        header('Location: dashboard.php');
    } else {
        echo 'Invalid email or password';
    }
}
?>
