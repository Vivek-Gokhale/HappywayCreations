<!DOCTYPE html>
<?php
session_start();
include 'connection.php';
if (isset($_POST['submit'])) {
  $opass = $_POST['old_password'];
  $npass = $_POST['new_password'];
  $cpass = $_POST['con_password'];
  $admin_id = $_SESSION['admin_id'];
  $q = "select password from admin where admin_id='$admin_id'";
  $result = mysqli_query($conn, $q);
  $row = mysqli_fetch_array($result);
  if ($opass == $row['password']) {
    if ($npass == $cpass) {
      if ($opass == $npass) {
        echo "<script>alert('Old and new password must be different');window.location='change-password.php';</script>";
      } else {
        $sql = "update admin set password='$npass' where admin_id='$admin_id'";
        if (mysqli_query($conn, $sql)) {
          echo "<script>alert('Password Changed');window.location='page-login.php';</script>";
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
    <div class="cover" style="background-color: #28642b;"></div>
  </section>
  <section class="login-content">
    <div class="login-box col-md-4">
      <form class="login-form " method="post">
        <h3 class="login-head"><i class="fa fa-lg fa-fw fa-user"></i>CHANGE PASSWORD</h3>
        <div class="form-group">
          <label class="control-label">Enter Old Password</label>
          <input class="form-control" type="password" placeholder="Old Password" autofocus name="old_password" required>
        </div>
        <div class="form-group">
          <label class="control-label">Enter New Password</label>
          <input class="form-control" type="password" placeholder="New Password" name="new_password" required>
        </div>
        <div class="form-group">
          <label class="control-label">Enter Confirm Password</label>
          <input class="form-control" type="password" placeholder="Confirm Password" name="con_password" required>
        </div>
        <div class="form-group btn-container">
          <input type="submit" name="submit" value="Change Password" class="btn btn-primary btn-block" style="background-color: #28642b;border:2px solid #28642b">
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