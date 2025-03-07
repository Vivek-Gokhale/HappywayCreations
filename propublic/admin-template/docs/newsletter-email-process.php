<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

include 'connection.php';

if (isset($_GET['id'])) {
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

        // Get newsletter details
        $nl_id = $_GET['id'];
        $nsql = "SELECT * FROM newsletter WHERE nl_id = '{$nl_id}'";
        $nr = mysqli_query($conn, $nsql);
        $mail->isHTML(true);

        if ($newsletter = mysqli_fetch_array($nr)) {
            $mail->Subject = $newsletter['nl_subject'];
            $mail->Body = $newsletter['nl_content']; // Construct the HTML body as needed
            //$mail->AltBody = 'Newsletter content here'; // Plain text version
            $mail->addEmbeddedImage("../../admin-template/docs/newsletter-uploads/" . $newsletter['nl_image'], "NewsletterImage");

            // Get registered newsletter emails
            $sql = "SELECT email FROM registered_newsletter";
            $r = mysqli_query($conn, $sql);

            // Send to each recipient
            while ($row = mysqli_fetch_array($r)) {
                $recipientAddress = $row['email'];

                // Add recipient
                $mail->addAddress($recipientAddress);

                // Send the email
                if ($mail->send()) {
                    echo "Email sent to $recipientAddress<br>";
                } else {
                    echo "Error sending email to $recipientAddress: " . $mail->ErrorInfo . "<br>";
                }

                // Clear all recipients for the next iteration
                $mail->clearAddresses();
                //$mail->clearAttachments();
            }

            // Update newsletter status
            $update_sql = "UPDATE newsletter SET status = 'Sent' WHERE nl_id = '{$nl_id}'";
            $uid = mysqli_query($conn, $update_sql);
            if ($uid) {
                echo "<script>alert('Newsletter Sent to All');window.location='newsletter-table.php';</script>";
            }
        } else {
            throw new Exception('Newsletter not found.');
        }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
