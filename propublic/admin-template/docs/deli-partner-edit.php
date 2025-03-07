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
$id = $_GET['uid'];
$sql = "select * from delivery_partner where delivery_partner_id='$id'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_array($result);
$id = $row['delivery_partner_id'];
$name = $row['dp_name'];
$contact_no = $row['dp_contact_no'];
$email = $row['dp_email'];
$address = $row['dp_address'];
?>
<!-- update -->
<?php
if ($_POST) {
    $id = $_POST['delivery_partner_id'];
    $name = $_POST['dp_name'];
    $contact_no = $_POST['dp_contact_no'];
    $email = $_POST['dp_email'];
    $address = mysqli_real_escape_string($conn, $_POST['dp_address']);
    $sql = "update delivery_partner set dp_contact_no='$contact_no',dp_name='$name',dp_email='$email',dp_address='$address' where delivery_partner_id ='$id'";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        echo "<script>alert('Record Update');window.location = 'delivery-partner-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Updated')</script>";
    }
}

?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Delivery Partner Edit Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Delivery Partner Edit Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Delivery Partner Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">ID</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's name" name="delivery_partner_id" value="<?php echo $id ?>" readonly>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Name</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter your name" name="dp_name" value="<?php echo $name ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">E-mail</label>
                        <div class="col-md-8">
                            <input class="form-control" type="email" placeholder="Enter your email" name="dp_email" value="<?php echo $email ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Contact No.</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" title="Must be of length 10" placeholder="Enter your contact no" name="dp_contact_no" value="<?php echo $contact_no ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Address</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Address" rows="5" cols="40" name="dp_address"><?php echo $address ?></textarea>
                            <!-- <input class="form-control" type="text" placeholder="Enter your address" name="dp_address" required> -->
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