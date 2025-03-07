<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
include 'connection.php';
if (isset($_POST["submit"])) {
    $username = $_POST['admin_username'];
    $password = $_POST['admin_password'];
    $name = $_POST['admin_name'];
    $sql = "insert into admin (admin_username,password,admin_name) values('$username','$password','$name')";

    if (mysqli_query($conn, $sql)) {
        echo "<script>window.location='admin-table.php';</script>";
    } else {
        echo "Problem" . mysqli_error($conn);
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Admin Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Admin Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Admin Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">Username (email Id)</label>
                        <div class="col-md-8">
                            <input class="form-control" type="email" placeholder="Enter your username" name="admin_username" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Full Name</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter your name" name="admin_name" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Password</label>
                        <div class="col-md-8">
                            <input class="form-control" type="password" placeholder="Enter password" name="admin_password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters" required>
                        </div>
                    </div>

            </div>
            <div class="tile-footer">
                <div class="row">
                    <div class="col-md-8 col-md-offset-3">
                        <input type="submit" value="Submit" name="submit" class="btn btn-primary" style="background-color: #164d19;border:2px solid #164d19">&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
                    </div>
                </div>
            </div>
            </form>
        </div>
    </div>
    </div>
</main>
<!-- Essential javascripts for application to work-->
<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/main.js"></script>
<!-- The javascript plugin to display page loading on top-->
<script src="js/plugins/pace.min.js"></script>
<!-- Page specific javascripts-->
<?php
include "script.php";
?>
</body>

</html>