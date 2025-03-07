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

/* if (isset($_GET['did'])) {
    $id = $_GET['did'];
    $did = mysqli_query($conn, "delete from orders where order_id ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='orders-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='orders-table.php';</script>";
    }
} */
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Orders Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#"> Orders Table</a></li>
        </ul>
    </div>
    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title"> Orders Table</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>User Id</th>
                        <th>Products</th>
                        <th>Products Qty</th>
                        <th>Order Date</th>
                        <th>Order Option</th>
                        <th>Total amount</th>
                        <th>Coupon Code</th>
                        <th>Time Stamp</th>
                        <th>Delivery Status</th>
                        <!-- <th>Action</th> -->
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $q = "select * from orders";
                    $r = mysqli_query($conn, $q);
                    $i = 1;
                    $currentTime = new DateTime();
                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['user_id'] . "</td>";
                        echo "<td>" . $row['product_ids'] . "</td>";
                        echo "<td>" . $row['product_qtys'] . "</td>";
                        echo "<td>" . $row['order_date'] . "</td>";
                        echo "<td>" . $row['payment_option'] . "</td>";
                        echo "<td>" . $row['total_amount'] . "</td>";
                        echo "<td>" . $row['coupon_code'] . "</td>";
                        echo "<td>" . $row['timestamp'] . "</td>";
                        echo "<td>" . $row['delivery_status'] . "</td>";
                        //echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";

                        // Get the timestamp from the record
                        $recordTime = new DateTime($row["timestamp"]);

                        // Calculate the difference in minutes
                        $interval = $currentTime->diff($recordTime);
                        $minutesDiff = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i;

                        if ($minutesDiff > 30 && $row['delivery_status'] == 'Pending') {
                            echo "<td><a href='order-assign.php?oid={$row['order_id']}'>Assign</a></td>";
                        } else {
                            echo "<td></td>";
                        }

                        //echo "<td><a href='orders-table-process.php?did={$row['order_id']}'>Delete</a> </td>";
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