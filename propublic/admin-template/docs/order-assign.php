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
$id = $_GET['oid'];
if (isset($_POST['submit'])) {
    $dp = $_POST['delivery_partner'];
    $sql = "insert into delivery_order (order_id,delivery_partner_id,status) values('$id','$dp','Accepted')";

    if (mysqli_query($conn, $sql)) {

        $q = "UPDATE `orders` SET `delivery_status`='Assigned' WHERE `order_id`='$id'";
        if (mysqli_query($conn, $q)) {
            echo "<script>alert('Order Assigned');window.location='orders-table.php';</script>";
        }
    } else {
        echo "Problem" . mysqli_error($conn);
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Assign Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Assign Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Assign Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">

                    <div class="form-group row">
                        <label class="control-label col-md-3">Assign to:</label>
                        <div class="col-md-8">
                            <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                            <select class="form-control col-md-15" name="delivery_partner">
                                <option value="" disabled selected>-------None-------</option>
                                <?php
                                include 'connection.php';
                                $q = mysqli_query($conn, "select * from delivery_partner");
                                while ($row = mysqli_fetch_array($q)) {
                                    //echo "<option value=".$row['sector_id'].">". $row['sector_name']." </option>";
                                    echo "<option value='{$row['delivery_partner_id']}'> {$row['dp_name']} </option>";
                                }
                                ?>
                            </select>
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