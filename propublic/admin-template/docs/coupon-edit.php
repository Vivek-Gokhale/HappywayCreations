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
$id = $_GET['cid'];
$sql = "select * from coupons where coupon_code='$id'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_array($result);
$pre_code = $row['coupon_code'];
$per = $row['coupon_percentage'];
?>
<!-- update -->
<?php
if ($_POST) {
    $code = $_POST['coupon_code'];
    $per = $_POST['coupon_percentage'];
    $sql = "UPDATE `coupons` SET `coupon_code`='$code',`coupon_percentage`='$per' WHERE `coupon_code`='$pre_code'";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        echo "<script>alert('Record Update');window.location = 'coupon-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Updated')</script>";
    }
}

?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Item Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Category Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Category Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <!-- <div class="form-group row">
                        <label class="control-label col-md-3">ID</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's name" name="catgory_id" value="<?php echo $id ?>" readonly>
                        </div>
                    </div> -->
                    <div class="form-group row">
                        <label class="control-label col-md-3">Code</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter coupon code" name="coupon_code" value="<?php echo $pre_code ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Percentage</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter percentage" name="coupon_percentage" value="<?php echo $per ?>" required>
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