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

if (isset($_GET['did'])) {
    $id = $_GET['did'];
    $did = mysqli_query($conn, "delete from delivery_order where delivery_order_id ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='deli-order-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='deli-order-table.php';</script>";
    }
}

if (isset($_GET['set'])) {
    $q = "SELECT * FROM delivery_order";
}



//Category Search
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $status = isset($_POST['status']) ? $_POST['status'] : '';
    $dp = isset($_POST['delivery_partner']) ? $_POST['delivery_partner'] : '';

    // Initialize query
    $q = "SELECT * FROM delivery_order";

    // Array to hold conditions
    $conditions = array();

    // Add conditions based on provided POST data
    if (!empty($status)) {
        $conditions[] = "status='$status'";
    }
    if (!empty($dp)) {
        $conditions[] = "delivery_partner_id='$dp'";
    }

    // Append conditions to the query if any exist
    if (count($conditions) > 0) {
        $q .= " WHERE " . implode(" AND ", $conditions);
    }
} else {
    $q = "SELECT * FROM delivery_order";
}


$r = mysqli_query($conn, $q);
$i = 1;

?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Delivery Orders</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#">Delivery Orders</a></li>
        </ul>
    </div>

    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Filter</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data" action="deli-order-table.php">

                    <div class="form-group row">
                        <label class="control-label col-md-3">Status</label>
                        <div class="col-md-8">
                            <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                            <select class="form-control col-md-15" name="status">
                                <option value="" disabled selected>-------None-------</option>
                                <option value="0">All</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Delivery Partner</label>
                        <div class="col-md-8">
                            <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                            <select class="form-control col-md-15" name="delivery_partner">
                                <option value="" disabled selected>-------None-------</option>
                                <!-- <option value="0">All</option> -->
                                <?php
                                include 'connection.php';
                                $dq = mysqli_query($conn, "select * from delivery_partner");
                                while ($row = mysqli_fetch_array($dq)) {
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
                        <input type="submit" value="Submit" name="submit11" class="btn btn-primary" style="background-color: #164d19;border:2px solid #164d19">&nbsp;&nbsp;&nbsp;
                        <input type="submit" name="reset" value="Show All" class="btn btn-secondary" href='deli-order-table.php?set=0'>
                    </div>
                </div>
            </div>

            </form>
        </div>
    </div>

    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title">Delivery Orders</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>Delivery Partner ID</th>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['delivery_partner_id'] . "</td>";
                        echo "<td>" . $row['order_id'] . "</td>";
                        echo "<td>" . $row['status'] . "</td>";
                        //echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
                        echo "<td><a href='deli-order-table-process.php?did={$row['delivery_id']}'>Delete</a> </td>";
                        echo "</tr>";
                        $i++;
                    }
                    ?>
                </tbody>
            </table>
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