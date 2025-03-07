<?php
session_start();
include 'db_connection.php';



use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if (isset($_GET['oid'])) {
    $id = $_GET['oid'];
    $dp_id = $_SESSION['delivery_partner_id'];

    $sql = "UPDATE `delivery_order` SET `status`='Completed' WHERE `order_id`='$id'";

    if (mysqli_query($conn, $sql)) {

        $q = "UPDATE `orders` SET `delivery_status`='Completed' WHERE `order_id`='$id'";
        if (mysqli_query($conn, $q)) {
            //echo "<script>alert('Order Completed');window.location='dashboard.php';</script>";
        }
    }

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Changed to recommended constant
        $mail->Port = 465;
        $mail->Username = 'spongeebob345@gmail.com';
        $mail->Password = 'iubvmfqoahewvkqk';
        $mail->setFrom('spongeebob345@gmail.com', 'Sponge Bob'); // Set a proper name

        // Get order details
        $nsql = "SELECT
                    orders.order_id, orders.user_id, 
                    user_register_details.user_id,user_register_details.user_email
                FROM 
                    orders
                INNER JOIN 
                    user_register_details ON orders.user_id = user_register_details.user_id
                WHERE order_id = '{$id}'";
        $or = mysqli_query($conn, $nsql);
        $result = mysqli_fetch_array($or);
        $mail->isHTML(true);

        $mail->Subject = "Order Delivered";
        $mail->Body = "Your order with ORDER ID " . $result['order_id'] . " has been Delivered."; // Construct the HTML body as needed
        //$mail->AltBody = 'Newsletter content here'; // Plain text version
        //$mail->addEmbeddedImage("../../admin-template/docs/newsletter-uploads/" . $newsletter['nl_image'], "NewsletterImage");


        // Add recipient
        $mail->addAddress($result['user_email']);

        // Send the email
        if ($mail->send()) {
            echo "Email sent<br>";
        } else {
            echo "Error sending email : " . $mail->ErrorInfo . "<br>";
        }

        echo "<script>alert('Order Delivered');window.location='dashboard.php';</script>";
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
