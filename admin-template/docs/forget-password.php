<!DOCTYPE html>
<?php
  session_start();
?>
<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;
  include 'connection.php';
  if(isset($_POST['submit']))
  {
    $email=$_POST['ngo_email'];
    $sql="select * from tbl_ngo_master where ngo_email='$email'";
    $result=mysqli_query($conn,$sql);
    $count=mysqli_num_rows($result);
    $row=mysqli_fetch_array($result);
    if($count>0)
    {
        //Import PHPMailer classes into the global namespace
        //These must be at the top of your script, not inside a function
        

        //Load Composer's autoloader
        require 'vendor/autoload.php';

        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Server settings
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'leviackreman847@gmail.com';                     //SMTP username
            $mail->Password   = 'aghxteflofulwptz';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom('leviackreman847@gmail.com', 'PhpMailer');
            $mail->addAddress($email, $email);     //Add a recipient
            

            

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = 'Forget Password';
            $mail->Body    = "Hi!! Your Password is {$row['ngo_password']} ";
            $mail->AltBody = "Hi!! Your Password is {$row['ngo_password']} ";

            $mail->send();
            echo "<script>alert('Your password has been sent on the given email')</script>";
        } 
        catch (Exception $e) 
        {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }
    else
    {
      echo "<script>alert('Given email is not registered.')</script>";
    }
  }
?>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Main CSS-->
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <!-- Font-icon css-->
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Login - Vali ngo</title>
  </head>
  <body>
    <section class="material-half-bg">
      <div class="cover"></div>
    </section>
    <section class="login-content ">
      <div class="logo">
        <h1>Vali</h1>
      </div>
      <div class="login-box col-md-4">
        <form class="login-form " method="post">
          <h3 class="login-head"><i class="fa fa-lg fa-fw fa-user"></i>FORGET PASSWORD</h3>
          <div class="form-group">
            <label class="control-label">ENTER YOUR E-MAIL</label>
            <input class="form-control" type="email" placeholder="Email" autofocus name="ngo_email" required>
          </div>
          <div class="form-group btn-container">
            <input type="submit" name="submit" value="Send" class="btn btn-primary btn-block ">
          </div> 
        </form>
      </div>
    </section>
    <!-- Essential javascripts for application to work-->
    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/main.js"></script>
    <!-- The javascript plugin to display page loading on top-->
    <script src="js/plugins/pace.min.js"></script>
    <script type="text/javascript">
      // Login Page Flipbox control
      $('.login-content [data-toggle="flip"]').click(function() {
      	$('.login-box').toggleClass('flipped');
      	return false;
      });
    </script>
  </body>
</html>