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
    $did = mysqli_query($conn, "delete from delivery_address where delivery_address_id ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='delivery-address-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='delivery-address-table.php';</script>";
    }
} */
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> User Address Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#">User Address Table</a></li>
        </ul>
    </div>
    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title">User Address Table</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Pincode</th>
                        <th>House Apartment</th>
                        <th>Area</th>
                        <th>Landmark</th>
                        <th>Town city</th>
                        <th>State</th>
                        <th>Is_default</th>
                        <!-- <th>Action</th> -->
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $q = "select * from user_addresses";
                    $r = mysqli_query($conn, $q);
                    $i = 1;
                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['user_id'] . "</td>";
                        echo "<td>" . $row['name'] . "</td>";
                        echo "<td>" . $row['phone_no'] . "</td>";
                        echo "<td>" . $row['pincode'] . "</td>";
                        echo "<td>" . $row['house_apartment'] . "</td>";
                        echo "<td>" . $row['area'] . "</td>";
                        echo "<td>" . $row['landmark'] . "</td>";
                        echo "<td>" . $row['town_city'] . "</td>";
                        echo "<td>" . $row['state'] . "</td>";
                        echo "<td>" . $row['is_default'] . "</td>";
                        //echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
                        //echo "<td><a href='deli-addr-table.php?did={$row['user_id']}'>Delete</a> </td>";
                        echo "</tr>";
                        $i++;
                    } ?>
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