<?php
if (isset($_SESSION['admin_id'])) {
?>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta name="description" content="Vali is a responsive and free admin theme built with Bootstrap 4, SASS and PUG.js. It's fully customizable and modular.">
    <!-- Twitter meta-->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:site" content="@pratikborsadiya">
    <meta property="twitter:creator" content="@pratikborsadiya">
    <!-- Open Graph Meta-->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Vali Admin">
    <meta property="og:title" content="Vali - Free Bootstrap 4 admin theme">
    <meta property="og:url" content="http://pratikborsadiya.in/blog/vali-admin">
    <meta property="og:image" content="http://pratikborsadiya.in/blog/vali-admin/hero-social.png">
    <meta property="og:description" content="Vali is a responsive and free admin theme built with Bootstrap 4, SASS and PUG.js. It's fully customizable and modular.">
    <title>Product Portfolio</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Main CSS-->
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <!-- Font-icon css-->
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
      .wave {
        animation-name: wave-animation;
        /* Refers to the name of your @keyframes element below */
        animation-duration: 2.5s;
        /* Change to speed up or slow down */
        animation-iteration-count: infinite;
        /* Never stop waving :) */
        transform-origin: 70% 70%;
        /* Pivot around the bottom-left palm */
        display: inline-block;
        border-radius: 50%;
        max-width: 110px;
        margin-bottom: 20px;
        margin-top: 10px;
      }

      @keyframes wave-animation {
        0% {
          transform: rotate(0.0deg)
        }

        10% {
          transform: rotate(14.0deg)
        }

        /* The following five values can be played with to make the waving more or less extreme */
        20% {
          transform: rotate(-8.0deg)
        }

        30% {
          transform: rotate(14.0deg)
        }

        40% {
          transform: rotate(-4.0deg)
        }

        50% {
          transform: rotate(10.0deg)
        }

        60% {
          transform: rotate(0.0deg)
        }

        /* Reset for the last half to pause */
        100% {
          transform: rotate(0.0deg)
        }
      }

      /* .form-side {
        color: #fff;
      }

      .list-side {
        color: #fff;
        text-decoration: none;
      } */
    </style>
  </head>

  <body class="app sidebar-mini">
    <!-- Navbar-->
    <header class="app-header" style="background-color: #28642b;"><a class="app-header__logo" href="dashboard.php" style="background-color: #164d19;">Product Portfolio</a>
      <!-- Sidebar toggle button--><a class="app-sidebar__toggle" href="#" data-toggle="sidebar" aria-label="Hide Sidebar"></a>
      <!-- Navbar Right Menu-->
      <ul class="app-nav">
        <!--Notification Menu-->

        <!-- User Menu-->

        <li class="dropdown"><a class="app-nav__item" href="#" data-toggle="dropdown" aria-label="Open Profile Menu"><i class="fa fa-user fa-lg"></i></a>
          <ul class="dropdown-menu settings-menu dropdown-menu-right">
            <li><a class="dropdown-item" href="my-profile.php"><i class="fa fa-user fa-lg"></i> My Profile</a></li>
            <li><a class="dropdown-item" href="change-password.php"><i class="fa fa-lock"></i> Change Password</a></li>
            <li><a class="dropdown-item" href="logout.php"><i class="fa fa-sign-out fa-lg"></i> Logout</a></li>
          </ul>
        </li>
      </ul>
    </header>
  <?php
} else {
  echo "<script>alert('You will have to LogIn.');window.location='page-login.php';</script>";
}
  ?>