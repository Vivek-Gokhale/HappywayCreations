<?php
session_start();
include 'db_connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// Check if the order ID is provided and session is valid
if (!isset($_SESSION['delivery_partner_id']) || !isset($_GET['oid'])) {
    echo "<script>alert('Unauthorized access or missing order ID.');window.location='dashboard.php';</script>";
    exit();
}

$dp_id = $_SESSION['delivery_partner_id'];
$order_id = mysqli_real_escape_string($conn, $_GET['oid']); // Sanitize the input

// Fetch the logged-in delivery partner's name
$partner_result = $conn->query("SELECT dp_name FROM delivery_partner WHERE delivery_partner_id = $dp_id");
$partner_data = $partner_result->fetch_assoc();
$partner_name = $partner_data['dp_name'];

// Insert into delivery_order table
$insert_order_sql = "INSERT INTO delivery_order (order_id, delivery_partner_id, status) VALUES ('$order_id', '$dp_id', 'Accepted')";
if (mysqli_query($conn, $insert_order_sql)) {
    // Update the orders table to mark the delivery status as 'Assigned' and store partner name
    $update_order_status = "
        UPDATE `orders`
        SET `delivery_status` = 'Assigned', 
            `assigned_partner_name` = '$partner_name'
        WHERE `order_id` = '$order_id'
    ";
    if (mysqli_query($conn, $update_order_status)) {
        // Fetch user email for sending notification
        $fetch_user_sql = "
            SELECT 
                orders.order_id, 
                user_register_details.user_email 
            FROM 
                orders
            INNER JOIN 
                user_register_details 
            ON 
                orders.user_id = user_register_details.user_id
            WHERE 
                orders.order_id = '$order_id'
        ";
        $user_result = mysqli_query($conn, $fetch_user_sql);

        if ($user_result && mysqli_num_rows($user_result) > 0) {
            $user_data = mysqli_fetch_assoc($user_result);
            $user_email = $user_data['user_email'];

            // Send email notification
            $mail = new PHPMailer(true);
            try {
                // PHPMailer server settings
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'spongeebob345@gmail.com'; // Your email address
                $mail->Password = 'agfutmaflsvixzmc'; // Your email password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port = 465;

                $mail->setFrom('spongeebob345@gmail.com', 'Delivery Service'); // Sender email and name
                $mail->addAddress($user_email); // Recipient email

                // Email content
                $mail->isHTML(true);
                $mail->Subject = "Order Shipped: #$order_id";
                $mail->Body = "
                    <h1>Order Shipped</h1>
                    <p>Your order with <strong>Order ID:</strong> <span style='color: green;'>#$order_id</span> has been shipped.</p>
                    <p>Thank you for choosing our service!</p>
                ";

                // Send the email
                if ($mail->send()) {
                    echo "<script>alert('Order accepted and email notification sent.');window.location='dashboard.php';</script>";
                } else {
                    echo "<script>alert('Order accepted, but failed to send email.');window.location='dashboard.php';</script>";
                }
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
        } else {
            echo "<script>alert('Order accepted, but failed to fetch user email.');window.location='dashboard.php';</script>";
        }
    } else {
        echo "<script>alert('Failed to update order status.');window.location='dashboard.php';</script>";
    }
} else {
    echo "<script>alert('Failed to assign order.');window.location='dashboard.php';</script>";
}
?>
