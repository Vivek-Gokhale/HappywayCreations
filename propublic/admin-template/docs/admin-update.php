<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
?>
<?php
include 'connection.php';
$id = $_GET['pid'];
$sql = "select * from admin where admin_id='$id'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_array($result);
$id = $row['admin_id'];
$name = $row['admin_name'];
$username = $row['admin_username'];
?>
<!-- update -->
<?php
if ($_POST) {
    $id = $_POST['admin_id'];
    $name = $_POST['admin_name'];
    $username = $_POST['admin_username'];
    $sql = "update admin set admin_name='$name', admin_username= '$username' where admin_id='$id'";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        echo "<script>alert('Profile Updated');window.location = 'my-profile.php';</script>";
    } else {
        echo "<script>alert('Profile Not Updated')</script>";
    }
}

?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Admin Update Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Admin Update Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Admin Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">ID</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter " name="admin_id" value="<?php echo $id ?>" readonly>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Name</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter admin name" name="admin_name" value="<?php echo $name ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Username</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter admin username" name="admin_username" value="<?php echo $username ?>" required>
                        </div>
                    </div>
            </div>
            <div class="tile-footer">
                <div class="row">
                    <div class="col-md-8 col-md-offset-3">
                        <input type="submit" value="Submit" name="submit11" class="btn btn-primary">&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
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